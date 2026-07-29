"""Text splitting service with multiple chunking strategies."""
from typing import Optional
import re
import structlog

logger = structlog.get_logger()


class TextSplitter:
    """Split text into chunks using various strategies."""

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
        strategy: str = "recursive",
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.strategy = strategy

    def split(self, documents: list[dict]) -> list[dict]:
        """Split documents into chunks."""
        strategies = {
            "recursive": self._recursive_split,
            "fixed": self._fixed_split,
            "sentence": self._sentence_split,
            "semantic": self._semantic_split,
        }

        splitter = strategies.get(self.strategy, self._recursive_split)
        all_chunks = []

        for doc in documents:
            chunks = splitter(doc["text"])
            for i, chunk_text in enumerate(chunks):
                all_chunks.append({
                    "text": chunk_text,
                    "metadata": {
                        **doc.get("metadata", {}),
                        "chunk_index": i,
                        "chunk_strategy": self.strategy,
                    },
                })

        logger.info(
            "Text split complete",
            input_docs=len(documents),
            output_chunks=len(all_chunks),
            strategy=self.strategy,
        )
        return all_chunks

    def _recursive_split(self, text: str) -> list[str]:
        """Recursively split by paragraphs, then sentences, then words."""
        separators = ["\n\n", "\n", ". ", " "]
        return self._recursive_split_helper(text, separators)

    def _recursive_split_helper(self, text: str, separators: list[str]) -> list[str]:
        """Helper for recursive splitting."""
        if len(text) <= self.chunk_size:
            return [text] if text.strip() else []

        if not separators:
            return [text[i:i+self.chunk_size] for i in range(0, len(text), self.chunk_size - self.chunk_overlap)]

        separator = separators[0]
        remaining_separators = separators[1:]

        splits = text.split(separator)
        chunks = []
        current_chunk = ""

        for split in splits:
            if len(current_chunk) + len(split) + len(separator) <= self.chunk_size:
                current_chunk += split + separator
            else:
                if current_chunk.strip():
                    chunks.append(current_chunk.strip())
                if len(split) > self.chunk_size:
                    chunks.extend(self._recursive_split_helper(split, remaining_separators))
                else:
                    current_chunk = split + separator

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return chunks

    def _fixed_split(self, text: str) -> list[str]:
        """Split by fixed character count with overlap."""
        chunks = []
        start = 0
        while start < len(text):
            end = start + self.chunk_size
            chunks.append(text[start:end])
            start = end - self.chunk_overlap
        return chunks

    def _sentence_split(self, text: str) -> list[str]:
        """Split by sentences, grouping them into chunks."""
        sentences = re.split(r'(?<=[.!?])\s+', text)
        chunks = []
        current_chunk = ""

        for sentence in sentences:
            if len(current_chunk) + len(sentence) <= self.chunk_size:
                current_chunk += sentence + " "
            else:
                if current_chunk.strip():
                    chunks.append(current_chunk.strip())
                current_chunk = sentence + " "

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return chunks

    def _semantic_split(self, text: str) -> list[str]:
        """Split at semantic boundaries (paragraphs, sections)."""
        sections = re.split(r'\n#{1,3}\s+|\n\n', text)
        chunks = []
        current_chunk = ""

        for section in sections:
            if len(current_chunk) + len(section) <= self.chunk_size:
                current_chunk += section + "\n\n"
            else:
                if current_chunk.strip():
                    chunks.append(current_chunk.strip())
                if len(section) > self.chunk_size:
                    chunks.extend(self._recursive_split(section))
                else:
                    current_chunk = section + "\n\n"

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return chunks

    def split_text(self, text: str) -> list[str]:
        """Split a single text string."""
        strategy = self.strategy
        if strategy == "recursive":
            return self._recursive_split(text)
        elif strategy == "fixed":
            return self._fixed_split(text)
        elif strategy == "sentence":
            return self._sentence_split(text)
        elif strategy == "semantic":
            return self._semantic_split(text)
        else:
            return self._recursive_split(text)
