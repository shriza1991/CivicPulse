def build_community_summary_document(
    cluster_size: int,
    location: str,
    issue: str,
    citizen_impact: str,
    risk: str,
    department: str,
    escalation_status: str = "Ready for Review"
) -> str:
    return f"""- Cluster Size: {cluster_size} reports
- Location: {location}
- Issue: {issue}
- Citizens Impacted: {citizen_impact}
- Risk: {risk.capitalize()}
- Recommended Department: {department}
- Escalation Status: {escalation_status}"""
