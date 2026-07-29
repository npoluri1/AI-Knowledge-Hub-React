import sys, io, os, re, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import fitz

PDF_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "images")

def examine(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        print(f"\n=== {os.path.basename(pdf_path)} ===")
        print(f"  pages: {len(doc)}, meta: {doc.metadata}")
        first = doc[0]
        text = first.get_text("text").strip()
        print(f"  text length: {len(text)}")
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        for i, line in enumerate(lines[:15]):
            print(f"  line {i}: {line[:120]!r}")
        doc.close()
    except Exception as e:
        print(f"  ERROR: {e}")

pdfs = sorted(glob.glob(os.path.join(PDF_DIR, "*.pdf")))
for f in pdfs:
    base = os.path.basename(f)
    if re.match(r'^\d{13}', base):
        examine(f)
