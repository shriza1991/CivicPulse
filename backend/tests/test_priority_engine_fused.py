"""
test_priority_engine_fused.py — Unit tests for Phase 6 Deterministic Priority Engine.
"""
import pytest
from sqlmodel import Session
from app.models.cluster import Cluster
from app.services.data_fusion_service import FusedClusterContext, get_fused_cluster_context
from app.services.priority_engine import (
    compute_cluster_priority_breakdown,
    compute_cluster_priority,
    PriorityBreakdown
)

def test_deterministic_reproducibility():
    fused = FusedClusterContext(
        cluster_id="c_test_01",
        country_code="IND",
        ward_id="WARD_MUM_M_EAST",
        ward_name="Kurla Ward M-East",
        population_density=38500.0,
        vulnerable_ratio=0.48,
        poverty_rate=0.35,
        infrastructure_assets=[{"condition_rating": "poor"}],
        public_investments=[],
        is_demo=True,
        provenance="Test Provenance"
    )

    res1 = compute_cluster_priority_breakdown(
        signal_count=8,
        avg_severity=4.0,
        avg_trust_score=0.90,
        fused_context=fused
    )

    res2 = compute_cluster_priority_breakdown(
        signal_count=8,
        avg_severity=4.0,
        avg_trust_score=0.90,
        fused_context=fused
    )

    assert res1.total_score == res2.total_score
    assert res1.density_score == res2.density_score
    assert res1.vulnerability_score == res2.vulnerability_score
    assert res1.infrastructure_deficit_score == res2.infrastructure_deficit_score

def test_factor_sensitivity():
    # Low vulnerability vs High vulnerability
    low_vuln = FusedClusterContext(
        cluster_id="c_low",
        country_code="IND",
        ward_id="WARD_MUM_K_WEST",
        ward_name="Andheri Ward",
        population_density=10000.0,
        vulnerable_ratio=0.10,
        poverty_rate=0.05,
        infrastructure_assets=[{"condition_rating": "good"}],
        public_investments=[],
        is_demo=True,
        provenance="Test"
    )

    high_vuln = FusedClusterContext(
        cluster_id="c_high",
        country_code="IND",
        ward_id="WARD_MUM_M_EAST",
        ward_name="Dharavi Ward",
        population_density=38500.0,
        vulnerable_ratio=0.60,
        poverty_rate=0.50,
        infrastructure_assets=[{"condition_rating": "critical"}],
        public_investments=[],
        is_demo=True,
        provenance="Test"
    )

    score_low = compute_cluster_priority_breakdown(5, 3.0, 0.80, fused_context=low_vuln)
    score_high = compute_cluster_priority_breakdown(5, 3.0, 0.80, fused_context=high_vuln)

    assert score_high.total_score > score_low.total_score
    assert score_high.vulnerability_score > score_low.vulnerability_score
    assert score_high.infrastructure_deficit_score > score_low.infrastructure_deficit_score
    assert "Critical condition infrastructure asset identified in ward." in score_high.explainable_factors

def test_backward_compatibility_wrapper():
    score = compute_cluster_priority(
        signal_count=10,
        avg_severity=4.5,
        avg_trust_score=0.88,
        vulnerable_ratio=0.30,
        poverty_rate=0.20
    )
    assert isinstance(score, float)
    assert 0.0 <= score <= 100.0
