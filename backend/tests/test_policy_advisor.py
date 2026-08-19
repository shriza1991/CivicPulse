"""
test_policy_advisor.py — Unit tests for Phase 7 Gemini Policy Advisor Service & API.
"""
import pytest
from sqlmodel import Session, select
from app.models.cluster import Cluster
from app.models.policy_recommendation import PolicyRecommendation
from app.services.policy_advisor_service import generate_policy_recommendation

@pytest.mark.asyncio
async def test_generate_policy_recommendation(session: Session):
    cluster = Cluster(
        area_label="Soweto Water Utility Hub",
        category="Water Infrastructure",
        country_code="ZAF",
        center_lat=-26.2041,
        center_lng=28.0473,
        report_count=6,
        priority_score=82.0,
        status="active"
    )
    session.add(cluster)
    session.commit()

    rec = await generate_policy_recommendation(cluster.id, session)

    assert rec is not None
    assert rec.cluster_id == cluster.id
    assert rec.country_code == "ZAF"
    assert rec.currency == "ZAR"
    assert rec.priority_score > 0
    assert rec.status == "drafted"
    assert rec.estimated_budget is not None

@pytest.mark.asyncio
async def test_policy_recommendation_review_flow(session: Session):
    cluster = Cluster(
        area_label="Heliopolis Drainage Canal",
        category="Drainage",
        country_code="BRA",
        center_lat=-23.5505,
        center_lng=-46.6333,
        report_count=9,
        priority_score=88.5,
        status="active"
    )
    session.add(cluster)
    session.commit()

    rec = await generate_policy_recommendation(cluster.id, session)
    assert rec.status == "drafted"

    # Simulate review approval
    rec.status = "approved"
    session.add(rec)
    session.commit()

    saved = session.get(PolicyRecommendation, rec.id)
    assert saved is not None
    assert saved.status == "approved"
    assert saved.currency == "BRL"
