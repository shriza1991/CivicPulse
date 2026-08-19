"""
Issue Analysis Service using Gemini AI.
Performs civic grievance classification, translation, severity scoring, and department recommendation.
Reuses existing GeminiClient infrastructure.
"""
import logging
from typing import Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from app.services.gemini_client import GeminiClient

logger = logging.getLogger("nivaran")

SYSTEM_PROMPT = """You are an expert civic grievance classification system.
Analyze the citizen complaint and return ONLY valid JSON.

Determine:
- detected_language
- english_translation
- issue_category
- issue_subcategory
- severity
- department
- priority_score
- summary

Severity values:
LOW
MEDIUM
HIGH
CRITICAL

Priority score:
0-100

Valid categories:
Road Infrastructure
Water Supply
Drainage
Garbage Management
Street Lighting
Public Safety
Traffic
Environment
Other

Return JSON only."""


class IssueAnalysis(BaseModel):
    detected_language: str = Field(..., description="Detected language of the complaint")
    english_translation: str = Field(..., description="English translation of the complaint")
    issue_category: Literal[
        "Road Infrastructure",
        "Water Supply",
        "Drainage",
        "Garbage Management",
        "Street Lighting",
        "Public Safety",
        "Traffic",
        "Environment",
        "Other"
    ] = Field(..., description="Primary civic issue category")
    issue_subcategory: str = Field(..., description="Subcategory of the civic issue")
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"] = Field(..., description="Severity assessment")
    department: str = Field(..., description="Recommended responsible government department")
    priority_score: int = Field(..., ge=0, le=100, description="Priority score between 0 and 100")
    summary: str = Field(..., description="Concise summary of the issue")


class IssueAnalysisService:

    @staticmethod
    async def analyze_transcript(
        transcript: str,
        gemini_client: Optional[GeminiClient] = None
    ) -> Dict[str, Any]:
        """
        Analyzes a voice transcript using Gemini AI structured output.

        Input:
            transcript: Text string transcribed from user's voice report

        Returns:
            Dict matching IssueAnalysis schema
        """
        if not transcript or not transcript.strip():
            logger.warning("issue_analysis_service | Empty or whitespace transcript received")
            raise ValueError("Transcript text cannot be empty.")

        if gemini_client is None:
            gemini_client = GeminiClient()

        prompt = f"Analyze the following citizen complaint transcript:\n\n{transcript.strip()}"

        logger.info("issue_analysis_service | Sending transcript to Gemini for analysis")

        try:
            analysis_result: IssueAnalysis = await gemini_client.generate_structured_output(
                prompt=prompt,
                response_schema=IssueAnalysis,
                system_instruction=SYSTEM_PROMPT,
                timeout=20.0
            )
            logger.info("issue_analysis_service | Gemini analysis completed successfully")
            return analysis_result.model_dump()
        except Exception as exc:
            logger.exception("issue_analysis_service | Gemini issue analysis failed")
            raise
