"""
Opaque Base64 Cursor Pagination Engine for High-Performance Queries.
"""
import base64
import json
from typing import Generic, TypeVar, List, Optional, Dict, Any
from pydantic import BaseModel

T = TypeVar("T")

class CursorPage(BaseModel, Generic[T]):
    items: List[T]
    limit: int
    has_next: bool
    next_cursor: Optional[str] = None
    total_count: Optional[int] = None

def encode_cursor(created_at_iso: str, item_id: str) -> str:
    """Encode timestamp and item ID into an opaque Base64 cursor token."""
    payload = f"{created_at_iso}|{item_id}"
    return base64.b64encode(payload.encode("utf-8")).decode("utf-8")

def decode_cursor(cursor_str: str) -> Optional[tuple[str, str]]:
    """Decode opaque Base64 cursor token into (created_at_iso, item_id)."""
    if not cursor_str:
        return None
    try:
        decoded = base64.b64decode(cursor_str.encode("utf-8")).decode("utf-8")
        parts = decoded.split("|")
        if len(parts) == 2:
            return parts[0], parts[1]
    except Exception:
        return None
    return None
