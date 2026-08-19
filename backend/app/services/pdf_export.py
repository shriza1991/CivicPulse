import os
import logging
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

logger = logging.getLogger("nivaran")

def render_draft_to_pdf(content: str, output_path: str) -> None:
    """
    Renders draft text content to a PDF file at output_path using ReportLab.
    Creates clean line wrapping and paragraph separations.
    """
    try:
        # Ensure parent directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        doc = SimpleDocTemplate(
            output_path, 
            pagesize=letter,
            rightMargin=54, 
            leftMargin=54,
            topMargin=54, 
            bottomMargin=54
        )
        
        styles = getSampleStyleSheet()
        
        body_style = ParagraphStyle(
            'DraftBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            spaceAfter=10
        )
        
        title_style = ParagraphStyle(
            'DraftTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=16,
            leading=20,
            spaceAfter=20
        )
        
        story = []
        story.append(Paragraph("nivaran Escalation Package", title_style))
        story.append(Spacer(1, 10))
        
        # Split text by newlines and add as paragraphs
        lines = content.split('\n')
        for line in lines:
            clean_line = line.strip()
            if clean_line:
                story.append(Paragraph(clean_line, body_style))
            else:
                story.append(Spacer(1, 6))
                
        doc.build(story)
        logger.info(f"pdf_generated_successfully | path={output_path}")
    except Exception as e:
        logger.error(f"pdf_generation_failed | path={output_path} | error={str(e)}")
        raise e
