"""
priority_engine.py — Deterministic Priority & Impact Scoring Engine

Calculates an evidence-grounded, explainable priority score for Demand Clusters.

Priority Score Formula (0 - 100):
  Priority = (0.35 * Cluster_Density) + (0.25 * Demographic_Vulnerability) + (0.20 * Infrastructure_Severity) + (0.20 * Evidence_Trust)

Where:
  - Cluster_Density = min(100.0, (signal_count / max_target_count) * 100.0)
  - Demographic_Vulnerability = (vulnerable_ratio * 0.6 + poverty_rate * 0.4) * 100.0
  - Infrastructure_Severity = (avg_severity / 5.0) * 100.0
  - Evidence_Trust = avg_trust_score * 100.0
"""

def compute_cluster_priority(
    signal_count: int,
    avg_severity: float,
    avg_trust_score: float,
    vulnerable_ratio: float = 0.0,
    poverty_rate: float = 0.0,
    max_target_count: int = 10
) -> float:
    """
    Computes a deterministic priority score between 0.0 and 100.0.
    """
    density_score = min(100.0, (signal_count / max(1, max_target_count)) * 100.0)
    vulnerability_score = (min(1.0, vulnerable_ratio) * 0.6 + min(1.0, poverty_rate) * 0.4) * 100.0
    severity_score = (min(5.0, max(1.0, avg_severity)) / 5.0) * 100.0
    trust_score = min(1.0, max(0.0, avg_trust_score)) * 100.0

    priority = (
        (0.35 * density_score) +
        (0.25 * vulnerability_score) +
        (0.20 * severity_score) +
        (0.20 * trust_score)
    )

    return round(priority, 2)
