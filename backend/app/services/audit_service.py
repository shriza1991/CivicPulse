"""
Global Audit Search & Multi-Format Export Service (CSV & JSON).
"""
import csv
import io
import json
from typing import Optional, List, Dict, Any
from sqlmodel import Session as DBSession, select, or_

from app.models.case import CaseTransition
from app.models.user import LoginHistory
from app.models.sync import OfflineSyncJob

class AuditService:

    @staticmethod
    def search_audit_log(
        db: DBSession,
        query_str: Optional[str] = None,
        issue_id: Optional[str] = None,
        actor_id: Optional[str] = None,
        action: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Search global audit transitions across cases."""
        stmt = select(CaseTransition)
        if issue_id:
            stmt = stmt.where(CaseTransition.issue_id == issue_id)
        if actor_id:
            stmt = stmt.where(CaseTransition.actor_id == actor_id)
        if action:
            stmt = stmt.where(CaseTransition.action == action)
        if query_str:
            stmt = stmt.where(
                or_(
                    CaseTransition.reason.contains(query_str),
                    CaseTransition.action.contains(query_str),
                    CaseTransition.issue_id.contains(query_str)
                )
            )

        stmt = stmt.order_by(CaseTransition.created_at.desc()).limit(limit)
        transitions = db.exec(stmt).all()

        results = []
        for t in transitions:
            results.append({
                "audit_id": t.id,
                "issue_id": t.issue_id,
                "actor_id": t.actor_id,
                "actor_role": t.actor_role,
                "actor_department": t.actor_department,
                "action": t.action,
                "previous_state": t.previous_state,
                "new_state": t.new_state,
                "reason": t.reason,
                "timestamp": t.created_at.isoformat()
            })
        return results

    @staticmethod
    def export_audit_csv(db: DBSession, issue_id: Optional[str] = None) -> str:
        """Generate CSV string of audit log records."""
        records = AuditService.search_audit_log(db, issue_id=issue_id, limit=500)
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["audit_id", "issue_id", "actor_id", "actor_role", "action", "previous_state", "new_state", "reason", "timestamp"])

        for r in records:
            writer.writerow([
                r["audit_id"],
                r["issue_id"],
                r["actor_id"] or "",
                r["actor_role"],
                r["action"],
                r["previous_state"],
                r["new_state"],
                r["reason"] or "",
                r["timestamp"]
            ])
        return output.getvalue()

    @staticmethod
    def export_audit_json(db: DBSession, issue_id: Optional[str] = None) -> str:
        """Generate formatted JSON string of audit log records."""
        records = AuditService.search_audit_log(db, issue_id=issue_id, limit=500)
        return json.dumps(records, indent=2)
