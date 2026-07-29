"""Document loading service supporting multiple file formats."""
from typing import Optional
import structlog

logger = structlog.get_logger()


class DocumentLoader:
    """Load and extract text from various document formats."""

    def load(self, content: bytes, file_ext: str) -> list[dict]:
        """Load document and return extracted text chunks."""
        loaders = {
            ".pdf": self._load_pdf,
            ".txt": self._load_text,
            ".md": self._load_text,
            ".docx": self._load_docx,
            ".csv": self._load_csv,
        }

        loader = loaders.get(file_ext)
        if not loader:
            raise ValueError(f"Unsupported file type: {file_ext}")

        return loader(content)

    def _load_pdf(self, content: bytes) -> list[dict]:
        """Extract text from PDF."""
        from pypdf import PdfReader
        import io

        reader = PdfReader(io.BytesIO(content))
        documents = []

        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text and text.strip():
                documents.append({
                    "text": text.strip(),
                    "metadata": {"page": i + 1, "source": "pdf"},
                })

        logger.info("PDF loaded", pages=len(documents))
        return documents

    def _load_text(self, content: bytes) -> list[dict]:
        """Load plain text or markdown."""
        text = content.decode("utf-8")
        return [{"text": text, "metadata": {"source": "text"}}]

    def _load_docx(self, content: bytes) -> list[dict]:
        """Extract text from DOCX."""
        from docx import Document
        import io

        doc = Document(io.BytesIO(content))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]

        return [{
            "text": "\n".join(paragraphs),
            "metadata": {"source": "docx", "paragraphs": len(paragraphs)},
        }]

    def _load_csv(self, content: bytes) -> list[dict]:
        """Load CSV as text."""
        import csv
        import io

        text = content.decode("utf-8")
        reader = csv.reader(io.StringIO(text))
        rows = list(reader)

        if not rows:
            return []

        headers = rows[0]
        documents = []

        for i, row in enumerate(rows[1:], 1):
            row_text = ", ".join(f"{h}: {v}" for h, v in zip(headers, row))
            documents.append({
                "text": row_text,
                "metadata": {"source": "csv", "row": i},
            })

        return documents

    def load_from_url(self, url: str) -> list[dict]:
        """Load document from URL."""
        import httpx

        response = httpx.get(url, follow_redirects=True)
        response.raise_for_status()

        content_type = response.headers.get("content-type", "")
        if "pdf" in content_type:
            return self._load_pdf(response.content)
        else:
            return self._load_text(response.content)
