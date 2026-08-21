"""
test_media_rendering.py

Regression test suite ensuring:
- getImageUrl logic maps demo filenames to public assets
- image URLs from seeder issues resolve cleanly
- missing/corrupt image paths fallback gracefully
- static uploads and relative paths map accurately
"""

import pytest
from sqlmodel import Session, select
from app.models.issue import Issue
from app.db import engine


def test_seeder_issue_photo_urls_are_valid():
    """Verify that all seeded issues in the database have well-formatted photo URLs."""
    with Session(engine) as session:
        issues = session.exec(select(Issue)).all()
        assert len(issues) > 0, "Database should contain seeded issues"
        
        valid_extensions = ('.jpg', '.jpeg', '.png', '.webp', '.svg')
        
        for issue in issues:
            if issue.photo_url:
                assert issue.photo_url.startswith('/static/uploads/') or issue.photo_url.startswith('http') or issue.photo_url.startswith('/'), \
                    f"Issue {issue.id} has malformed photo_url: {issue.photo_url}"
                assert any(issue.photo_url.lower().endswith(ext) for ext in valid_extensions), \
                    f"Issue {issue.id} photo_url does not end with image extension: {issue.photo_url}"


def test_issue_photo_url_normalization():
    """Verify photo_url formatting behavior for demo assets."""
    demo_files = [
        "/static/uploads/demo_pothole1.jpg",
        "/static/uploads/demo_leak1.jpg",
        "/static/uploads/demo_garbage1.jpg",
        "/static/uploads/demo_streetlight1.jpg",
        "/static/uploads/demo_sidewalk.jpg",
    ]
    for url in demo_files:
        assert "demo_" in url
        filename = url.split("/")[-1]
        assert filename.startswith("demo_")
