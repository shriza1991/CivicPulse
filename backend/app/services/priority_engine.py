"""
priority_engine.py — Deterministic Priority & Impact Scoring Engine (Phase 6)

Calculates an evidence-grounded, explainable priority score for Demand Clusters using fused data:
1. Demand Signal Density (Weight: 35%)
2. Demographic Vulnerability & Poverty Index (Weight: 25%)
3. Infrastructure Deficit & Asset Condition (Weight: 20%)
4. Issue Severity & Public Risk (Weight: 10%)
5. Evidence Trust & Verification Score (Weight: 10%)

Priority Score Formula (0 - 100):
  Priority = (0.35 * Density) + (0.25 * Vulnerability) + (0.20 * Infra_Deficit) + (0.10 * Severity) + (0.10 * Trust)
  Note: When fused_context is not provided, Infra_Deficit defaults to combined Severity (0.10) & Trust (0.10), preserving exact legacy weights (Density 0.35, Vulnerability 0.25, Severity 0.20, Trust 0.20).
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.services.data_fusion_service import FusedClusterContext

class PriorityBreakdown(BaseModel):
    total_score: float
    density_score: float
    vulnerability_score: float
    infrastructure_deficit_score: float
    severity_score: float
    trust_score: float
    explainable_factors: List[str]

def compute_cluster_priority_breakdown(
    signal_count: int,
    avg_severity: float,
    avg_trust_score: float,
    fused_context: Optional[FusedClusterContext] = None,
    vulnerable_ratio: float = 0.0,
    poverty_rate: float = 0.0,
    max_target_count: int = 10
) -> PriorityBreakdown:
    """
    Computes a deterministic priority breakdown between 0.0 and 100.0 based on fused data.
    """
    # 1. Density Score (0 - 100)
    density_score = min(100.0, (signal_count / max(1, max_target_count)) * 100.0)

    # 2. Vulnerability Score (0 - 100)
    if fused_context:
        v_ratio = fused_context.vulnerable_ratio
        p_rate = fused_context.poverty_rate
    else:
        v_ratio = vulnerable_ratio
        p_rate = poverty_rate
    vulnerability_score = (min(1.0, max(0.0, v_ratio)) * 0.6 + min(1.0, max(0.0, p_rate)) * 0.4) * 100.0

    # 3. Severity & Trust Scores (0 - 100)
    severity_score = (min(5.0, max(1.0, avg_severity)) / 5.0) * 100.0
    trust_score = min(1.0, max(0.0, avg_trust_score)) * 100.0

    # 4. Infrastructure Deficit Score (0 - 100)
    explainable_factors = []

    if fused_context and fused_context.infrastructure_assets:
        ratings = [asset.get("condition_rating", "fair") for asset in fused_context.infrastructure_assets]
        if "critical" in ratings:
            infra_deficit_score = 95.0
            explainable_factors.append("Critical condition infrastructure asset identified in ward.")
        elif "poor" in ratings:
            infra_deficit_score = 80.0
            explainable_factors.append("Poor condition infrastructure asset nearing capacity limit.")
        elif "fair" in ratings:
            infra_deficit_score = 50.0
        else:
            infra_deficit_score = 30.0

        # Fused Formula weights: 0.35 Density + 0.25 Vuln + 0.20 Infra + 0.10 Severity + 0.10 Trust
        total_score = (
            (0.35 * density_score) +
            (0.25 * vulnerability_score) +
            (0.20 * infra_deficit_score) +
            (0.10 * severity_score) +
            (0.10 * trust_score)
        )
    else:
        # Legacy/Unfused Formula weights: 0.35 Density + 0.25 Vuln + 0.20 Severity + 0.20 Trust
        infra_deficit_score = (severity_score + trust_score) / 2.0
        explainable_factors.append("Standard infrastructure baseline applied.")
        total_score = (
            (0.35 * density_score) +
            (0.25 * vulnerability_score) +
            (0.20 * severity_score) +
            (0.20 * trust_score)
        )

    total_score = round(min(100.0, max(0.0, total_score)), 2)

    # Factor explanations
    if density_score >= 70.0:
        explainable_factors.append(f"High citizen report concentration ({signal_count} signals).")
    if vulnerability_score >= 60.0:
        explainable_factors.append(f"High demographic vulnerability index ({vulnerability_score:.1f}%).")
    if severity_score >= 80.0:
        explainable_factors.append(f"High physical hazard severity rating ({avg_severity:.1f}/5.0).")
    if trust_score >= 85.0:
        explainable_factors.append(f"Strong evidence verification score ({trust_score:.1f}%).")

    return PriorityBreakdown(
        total_score=total_score,
        density_score=round(density_score, 2),
        vulnerability_score=round(vulnerability_score, 2),
        infrastructure_deficit_score=round(infra_deficit_score, 2),
        severity_score=round(severity_score, 2),
        trust_score=round(trust_score, 2),
        explainable_factors=explainable_factors
    )

def compute_cluster_priority(
    signal_count: int,
    avg_severity: float,
    avg_trust_score: float,
    vulnerable_ratio: float = 0.0,
    poverty_rate: float = 0.0,
    max_target_count: int = 10
) -> float:
    """
    Backward-compatible deterministic priority score calculator.
    """
    breakdown = compute_cluster_priority_breakdown(
        signal_count=signal_count,
        avg_severity=avg_severity,
        avg_trust_score=avg_trust_score,
        vulnerable_ratio=vulnerable_ratio,
        poverty_rate=poverty_rate,
        max_target_count=max_target_count
    )
    return breakdown.total_score
