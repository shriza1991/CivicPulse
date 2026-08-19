from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
from app.models.cluster import Cluster
from app.models.issue import Issue
from app.db import get_session
from app.services.data_fusion_service import get_fused_cluster_context, FusedClusterContext
from app.services.priority_engine import compute_cluster_priority_breakdown, PriorityBreakdown
from sqlmodel import Session, select

router = APIRouter(prefix="/clusters", tags=["clusters"])

class ClusterDetailResponse(BaseModel):
    cluster: Cluster
    issues: List[Issue]

@router.get("/{id}", response_model=ClusterDetailResponse)
async def get_cluster(
    id: str,
    session: Session = Depends(get_session)
):
    cluster = session.get(Cluster, id)
    if not cluster:
        raise HTTPException(status_code=404, detail="Cluster not found")
    
    # Get all member issues
    issues = session.exec(select(Issue).where(Issue.cluster_id == id)).all()
    return ClusterDetailResponse(cluster=cluster, issues=list(issues))

@router.get("/{id}/fusion-summary", response_model=FusedClusterContext)
async def get_cluster_fusion_summary(
    id: str,
    session: Session = Depends(get_session)
):
    cluster = session.get(Cluster, id)
    if not cluster:
        raise HTTPException(status_code=404, detail="Cluster not found")
    
    fused_context = get_fused_cluster_context(id, session)
    return fused_context

@router.get("/{id}/priority-breakdown", response_model=PriorityBreakdown)
async def get_cluster_priority_breakdown(
    id: str,
    session: Session = Depends(get_session)
):
    cluster = session.get(Cluster, id)
    if not cluster:
        raise HTTPException(status_code=404, detail="Cluster not found")
    
    issues = session.exec(select(Issue).where(Issue.cluster_id == id)).all()
    signal_count = len(issues) if issues else cluster.report_count
    avg_severity = (sum(i.severity for i in issues) / max(1, len(issues))) if issues else 3.0
    avg_trust = (sum(getattr(i, "credibility_score", 0.85) for i in issues) / max(1, len(issues))) if issues else 0.85

    fused_context = get_fused_cluster_context(id, session)
    breakdown = compute_cluster_priority_breakdown(
        signal_count=signal_count,
        avg_severity=avg_severity,
        avg_trust_score=avg_trust,
        fused_context=fused_context
    )
    return breakdown

@router.post("/{id}/recalculate-priority", response_model=Cluster)
async def recalculate_cluster_priority(
    id: str,
    session: Session = Depends(get_session)
):
    cluster = session.get(Cluster, id)
    if not cluster:
        raise HTTPException(status_code=404, detail="Cluster not found")

    issues = session.exec(select(Issue).where(Issue.cluster_id == id)).all()
    signal_count = len(issues) if issues else cluster.report_count
    avg_severity = (sum(i.severity for i in issues) / max(1, len(issues))) if issues else 3.0
    avg_trust = (sum(getattr(i, "credibility_score", 0.85) for i in issues) / max(1, len(issues))) if issues else 0.85

    fused_context = get_fused_cluster_context(id, session)
    breakdown = compute_cluster_priority_breakdown(
        signal_count=signal_count,
        avg_severity=avg_severity,
        avg_trust_score=avg_trust,
        fused_context=fused_context
    )

    cluster.priority_score = breakdown.total_score
    cluster.demographic_impact_score = breakdown.vulnerability_score
    session.add(cluster)
    session.commit()
    session.refresh(cluster)

    return cluster
