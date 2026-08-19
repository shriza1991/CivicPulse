import httpx
import logging
from app.config import settings

logger = logging.getLogger("nivaran")

async def send_email(to_email: str, subject: str, content: str) -> str:
    """
    Sends an email using the SendGrid HTTP API.
    Raises exceptions on failures, returns provider response on success.
    """
    if not settings.SENDGRID_API_KEY:
        raise ValueError("SENDGRID_API_KEY is not configured")

    url = "https://api.sendgrid.com/v3/mail/send"
    headers = {
        "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "personalizations": [
            {
                "to": [{"email": to_email}]
            }
        ],
        "from": {"email": settings.SENDGRID_FROM_EMAIL},
        "subject": subject,
        "content": [
            {
                "type": "text/plain",
                "value": content
            }
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload, timeout=10.0)
        
        # SendGrid returns 202 Accepted on success
        if response.status_code == 202:
            logger.info(f"email_sent_successfully | to={to_email} | status_code=202")
            return "202 Accepted"
        else:
            error_detail = response.text or f"HTTP status {response.status_code}"
            logger.error(f"email_send_failed | status_code={response.status_code} | response={error_detail}")
            raise Exception(f"SendGrid API returned status code {response.status_code}: {error_detail}")
