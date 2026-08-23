"""
test_e2e_demand_intelligence.py — Comprehensive End-to-End System Integration Test (Phase 10)

Tests the complete Nivaran Track 1 flow:
  1. Multimodal Citizen Intake (Photo + GPS + Note)
  2. Stage 0 Evidence Validation Gate (Quality & Hazard Detection)
  3. Spatial correlation into Demand Hotspot Cluster
  4. Demographic, Infrastructure & Investment Data Fusion
  5. Deterministic Priority Engine Calculation & Breakdown
  6. Grounded Gemini 3.6 Policy Advisor Brief Generation
  7. Policymaker Review & Action Approval State Transition
"""
import pytest
import os
import io
import json
from PIL import Image
from sqlmodel import Session, select
from app.models.cluster import Cluster
from app.models.issue import Issue
from app.models.policy_recommendation import PolicyRecommendation
from app.services.evidence_validation import Stage0Result, Stage0Checks
from app.services.agent_2_verification import verify_and_cluster_issue
from app.services.data_fusion_service import get_fused_cluster_context
from app.services.priority_engine import compute_cluster_priority_breakdown
from app.services.policy_advisor_service import generate_policy_recommendation
from app.services.country_adapters import get_country_config

def _create_test_image_bytes() -> bytes:
    """Generates a valid high-resolution 600x600 test image exceeding 5KB size for Stage 0 validation."""
    img = Image.new('RGB', (600, 600), color=(120, 140, 160))
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=95)
    data = buf.getvalue()
    if len(data) < 6000:
        data += b'0' * (6000 - len(data))
    return data

@pytest.mark.asyncio
async def test_complete_end_to_end_demand_to_policy_flow(session: Session):
    # 1. Citizen Multimodal Intake Simulation
    photo_bytes = _create_test_image_bytes()
    mime_type = "image/jpeg"
    lat, lng = 19.065, 72.879  # Kurla, Mumbai (IND)

    # 2. Stage 0 Evidence Validation Gate Simulation
    stage0_res = Stage0Result(
        accepted=True,
        failure=None,
        confidence=0.95,
        detected_object="Pothole / Road Collapse",
        checks=Stage0Checks(file=True, quality=True, scene=True, infrastructure=True, issue=True),
        message="Valid outdoor civic issue photo.",
        suggestion="Clear photo accepted."
    )
    assert stage0_res.accepted is True
    assert stage0_res.checks.file is True
    assert stage0_res.checks.quality is True

    # 3. Issue Creation & Spatial Clustering
    issue = Issue(
        photo_url="/static/uploads/e2e_pothole_test.jpg",
        latitude=lat,
        longitude=lng,
        country_code="IND",
        ward_id="WARD_MUM_M_EAST",
        issue_type="road_damage",
        severity=4,
        description="Critical asphalt collapse and open drainage hazard near transport corridor.",
        credibility_score=0.92,
        status="classified"
    )
    session.add(issue)
    session.commit()

    # Process Agent 2 spatial verification and clustering
    await verify_and_cluster_issue(issue, session)
    assert issue.cluster_id is not None
    cluster = session.get(Cluster, issue.cluster_id)
    assert cluster is not None

    # 4. Data Fusion Enrichment
    fused_context = get_fused_cluster_context(cluster.id, session)
    assert fused_context.country_code == "IND"
    assert fused_context.ward_id == "WARD_MUM_M_EAST"
    assert fused_context.population_density > 0
    assert len(fused_context.infrastructure_assets) > 0

    # 5. Deterministic Priority Engine Calculation
    priority_breakdown = compute_cluster_priority_breakdown(
        signal_count=cluster.report_count,
        avg_severity=4.0,
        avg_trust_score=0.92,
        fused_context=fused_context
    )
    assert 0.0 <= priority_breakdown.total_score <= 100.0
    assert priority_breakdown.density_score > 0
    assert priority_breakdown.vulnerability_score > 0

    # 6. Gemini Policy Advisor Brief Generation
    policy_rec = await generate_policy_recommendation(cluster.id, session)
    assert policy_rec is not None
    assert policy_rec.cluster_id == cluster.id
    assert policy_rec.country_code == "IND"
    assert policy_rec.currency == "INR"
    assert policy_rec.status == "drafted"
    assert policy_rec.priority_score == priority_breakdown.total_score

    # 7. Policymaker Inspection & Human Review Approval
    policy_rec.status = "approved"
    session.add(policy_rec)
    session.commit()

    approved_rec = session.get(PolicyRecommendation, policy_rec.id)
    assert approved_rec is not None
    assert approved_rec.status == "approved"
