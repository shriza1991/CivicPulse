"""
Unit tests for Phase 6 deterministic priority scoring engine.
"""
from app.services.priority_engine import compute_cluster_priority

def test_compute_cluster_priority_basic():
    # 5 reports, severity 4/5, trust 0.90, vulnerable ratio 0.40, poverty rate 0.30
    score = compute_cluster_priority(
        signal_count=5,
        avg_severity=4.0,
        avg_trust_score=0.90,
        vulnerable_ratio=0.40,
        poverty_rate=0.30,
        max_target_count=10
    )
    # Density score = (5/10)*100 = 50 -> 0.35 * 50 = 17.5
    # Vulnerability score = (0.4*0.6 + 0.3*0.4)*100 = 36 -> 0.25 * 36 = 9.0
    # Severity score = (4/5)*100 = 80 -> 0.20 * 80 = 16.0
    # Trust score = 0.90 * 100 = 90 -> 0.20 * 90 = 18.0
    # Expected total = 17.5 + 9.0 + 16.0 + 18.0 = 60.5
    assert score == 60.5

def test_compute_cluster_priority_caps():
    score = compute_cluster_priority(
        signal_count=20,  # exceeds target 10
        avg_severity=5.0,
        avg_trust_score=1.0,
        vulnerable_ratio=1.0,
        poverty_rate=1.0,
        max_target_count=10
    )
    assert score == 100.0
