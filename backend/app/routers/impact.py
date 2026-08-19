from fastapi import APIRouter, Depends, HTTPException, status
from app.models.impact_summary import ImpactSummary
from app.models.cluster import Cluster
from app.db import get_session
from app.services.agent_3_impact import analyze_cluster_impact
from sqlmodel import Session
import logging

logger = logging.getLogger("nivaran")

router = APIRouter(prefix="/clusters/{id}/impact", tags=["impact"])

@router.post("", response_model=ImpactSummary, status_code=status.HTTP_200_OK)
async def trigger_impact(
    id: str,
    session: Session = Depends(get_session)
):
    # Check if cluster exists
    cluster = session.get(Cluster, id)
    if not cluster:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cluster not found"
        )
    
    try:
        summary = await analyze_cluster_impact(cluster_id=id, session=session, force_regenerate=True)
        return summary
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"manual_trigger_impact_failed | cluster_id={id} | error={str(e)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={"error": "ai_unavailable", "retryable": True}
        )

