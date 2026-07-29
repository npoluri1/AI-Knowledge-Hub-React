"""Guardrails service for input/output safety."""
from typing import Optional
import re
import structlog

logger = structlog.get_logger()

# PII patterns
PII_PATTERNS = {
    "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    "phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
    "nric": r'\b[A-Z]\d{7}[A-Z]\b',  # Singapore NRIC
    "credit_card": r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
    "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
}

# Prompt injection patterns
INJECTION_PATTERNS = [
    r'ignore (?:all |any )?(?:previous |prior |above )?instructions',
    r'you are now (?:a |an )?',
    r'act as (?:a |an )?',
    r'pretend (?:you are|to be)',
    r'disregard (?:all |any )?(?:previous |prior )?',
    r'override (?:your |the )?(?:rules|instructions)',
    r'jailbreak',
    r'dan mode',
    r'ignore safety',
    r'ignore guidelines',
    r'bypass (?:your |the )?(?:rules|filters|restrictions)',
]


class GuardrailsService:
    """Input/output guardrails for safety."""

    def __init__(self):
        self.enabled = True

    async def check_input(self, text: str) -> dict:
        """Check input for safety issues."""
        if not self.enabled:
            return {"safe": True, "issues": []}

        issues = []

        # Check for prompt injection
        injection_check = self._check_injection(text)
        if injection_check["detected"]:
            issues.append(injection_check)

        # Check for PII
        pii_check = self._check_pii(text)
        if pii_check["found"]:
            issues.append(pii_check)

        # Check for harmful content
        harmful_check = self._check_harmful(text)
        if harmful_check["detected"]:
            issues.append(harmful_check)

        # Check length
        if len(text) > 10000:
            issues.append({"type": "length", "message": "Input exceeds maximum length"})

        return {
            "safe": len(issues) == 0,
            "issues": issues,
            "masked_text": self._mask_pii(text) if pii_check["found"] else text,
        }

    async def check_output(self, text: str) -> dict:
        """Check output for safety issues."""
        if not self.enabled:
            return {"safe": True, "issues": []}

        issues = []

        # Check for PII in output
        pii_check = self._check_pii(text)
        if pii_check["found"]:
            issues.append(pii_check)

        # Check for harmful content
        harmful_check = self._check_harmful(text)
        if harmful_check["detected"]:
            issues.append(harmful_check)

        return {
            "safe": len(issues) == 0,
            "issues": issues,
            "masked_text": self._mask_pii(text) if pii_check["found"] else text,
        }

    def _check_injection(self, text: str) -> dict:
        """Check for prompt injection attempts."""
        text_lower = text.lower()
        for pattern in INJECTION_PATTERNS:
            if re.search(pattern, text_lower):
                logger.warning("Prompt injection detected", pattern=pattern)
                return {
                    "type": "injection",
                    "detected": True,
                    "message": "Potential prompt injection detected",
                    "pattern": pattern,
                }
        return {"type": "injection", "detected": False}

    def _check_pii(self, text: str) -> dict:
        """Check for PII in text."""
        found_pii = {}
        for pii_type, pattern in PII_PATTERNS.items():
            matches = re.findall(pattern, text)
            if matches:
                found_pii[pii_type] = len(matches)

        if found_pii:
            logger.warning("PII detected", pii_types=list(found_pii.keys()))
            return {
                "type": "pii",
                "found": True,
                "message": f"PII detected: {', '.join(found_pii.keys())}",
                "counts": found_pii,
            }
        return {"type": "pii", "found": False}

    def _check_harmful(self, text: str) -> dict:
        """Check for harmful content."""
        harmful_keywords = [
            "bomb", "weapon", "kill", "murder", "harm",
            "exploit", "hack", "malware", "virus",
        ]
        text_lower = text.lower()
        found = [kw for kw in harmful_keywords if kw in text_lower]

        if found:
            return {
                "type": "harmful",
                "detected": True,
                "message": f"Potentially harmful content detected: {', '.join(found)}",
                "keywords": found,
            }
        return {"type": "harmful", "detected": False}

    def _mask_pii(self, text: str) -> str:
        """Mask PII in text."""
        masked = text
        for pii_type, pattern in PII_PATTERNS.items():
            masked = re.sub(pattern, f"[REDACTED_{pii_type.upper()}]", masked)
        return masked
