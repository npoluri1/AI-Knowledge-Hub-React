"""Utility functions."""
import hashlib
import time
from typing import Optional


def generate_id(prefix: str = "") -> str:
    """Generate a unique ID."""
    timestamp = str(time.time()).encode()
    hash_str = hashlib.md5(timestamp).hexdigest()[:12]
    return f"{prefix}_{hash_str}" if prefix else hash_str


def truncate_text(text: str, max_length: int = 200) -> str:
    """Truncate text with ellipsis."""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."


def format_latency(ms: float) -> str:
    """Format latency in human-readable format."""
    if ms < 1000:
        return f"{ms:.1f}ms"
    else:
        return f"{ms/1000:.2f}s"


def safe_filename(filename: str) -> str:
    """Sanitize filename for safe storage."""
    import re
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    filename = re.sub(r'\s+', '_', filename)
    return filename[:255]
