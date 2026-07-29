"""Try alternative text extraction methods on image-only PDFs."""
import sys, io, os, re, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import fitz

PDF_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "images")

def extract_any_text(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        meta = doc.metadata.get("title", "").strip()
        if meta:
            doc.close()
            return meta

        # Try all text extraction modes
        first = doc[0]

        # Try dict mode for embedded text
        blocks = first.get_text("dict")
        text_parts = []
        for block in blocks.get("blocks", []):
            if block["type"] == 0:  # text block
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        t = span.get("text", "").strip()
                        if t:
                            text_parts.append(t)
            elif block["type"] == 1:  # image block
                pass

        if text_parts:
            doc.close()
            return " ".join(text_parts)

        # Try html mode
        html_text = first.get_text("html")
        import html as html_mod
        soup_text = html_mod.unescape(re.sub(r'<[^>]+>', ' ', html_text))
        soup_text = re.sub(r'\s+', ' ', soup_text).strip()
        if len(soup_text) > 20:
            doc.close()
            return soup_text

        # Try raw dict
        raw = first.get_text("rawdict")
        raw_parts = []
        for block in raw.get("blocks", []):
            if block["type"] == 0:
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        t = span.get("text", "").strip()
                        if t:
                            raw_parts.append(t)
        if raw_parts:
            doc.close()
            return " ".join(raw_parts)

        # Try words extraction
        words = first.get_text("words")
        if words:
            doc.close()
            return " ".join(w[4] for w in words[:50])

        doc.close()
        return ""
    except Exception as e:
        return ""

pdfs = sorted(glob.glob(os.path.join(PDF_DIR, "*.pdf")))
for f in pdfs:
    base = os.path.basename(f)
    if re.match(r'^\d{13}', base):
        text = extract_any_text(f)
        preview = text[:100] if text else "(no text)"
        print(f"{base}: {preview}")
