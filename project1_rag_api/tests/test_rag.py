"""RAG pipeline tests."""
import pytest
from app.services.text_splitter import TextSplitter
from app.services.document_loader import DocumentLoader


class TestTextSplitter:
    """Test text splitting strategies."""

    def test_recursive_split(self):
        splitter = TextSplitter(chunk_size=100, chunk_overlap=20, strategy="recursive")
        text = "This is a test sentence. " * 20
        chunks = splitter.split_text(text)
        assert len(chunks) > 0
        for chunk in chunks:
            assert len(chunk) <= 150  # Allow some overflow

    def test_fixed_split(self):
        splitter = TextSplitter(chunk_size=100, chunk_overlap=20, strategy="fixed")
        text = "A" * 250
        chunks = splitter.split_text(text)
        assert len(chunks) >= 3

    def test_sentence_split(self):
        splitter = TextSplitter(chunk_size=100, chunk_overlap=20, strategy="sentence")
        text = "First sentence. Second sentence. Third sentence. Fourth sentence."
        chunks = splitter.split_text(text)
        assert len(chunks) >= 2

    def test_empty_text(self):
        splitter = TextSplitter(chunk_size=100, chunk_overlap=20)
        chunks = splitter.split_text("")
        assert len(chunks) == 0


class TestDocumentLoader:
    """Test document loading."""

    def test_load_text(self):
        loader = DocumentLoader()
        content = b"Hello, this is a test document."
        docs = loader.load(content, ".txt")
        assert len(docs) == 1
        assert docs[0]["text"] == "Hello, this is a test document."

    def test_load_markdown(self):
        loader = DocumentLoader()
        content = b"# Title\n\nThis is content."
        docs = loader.load(content, ".md")
        assert len(docs) == 1

    def test_unsupported_format(self):
        loader = DocumentLoader()
        with pytest.raises(ValueError):
            loader.load(b"content", ".xyz")
