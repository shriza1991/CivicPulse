from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
from app.models.cluster import Cluster
from app.models.issue import Issue
from app.db import get_session
from app.services.data_fusion_service import get_fused_cluster_context, FusedClusterContext
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
