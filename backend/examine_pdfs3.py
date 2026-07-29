"""Extract images from PDF first page and check for metadata."""
import sys, io, os, re, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import fitz
from PIL import Image

PDF_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "images")

pdfs = sorted(glob.glob(os.path.join(PDF_DIR, "*.pdf")))
for f in pdfs:
    base = os.path.basename(f)
    if not re.match(r'^\d{13}', base):
        continue
    try:
        doc = fitz.open(f)
        first = doc[0]
        # Get page as pixmap
        pix = first.get_pixmap(dpi=72)
        # Try to get images embedded in page
        images = first.get_images(full=True)
        doc.close()
        print(f"{base}: {len(doc)}p, pixmap={pix.width}x{pix.height}, embedded_images={len(images)}")
        if images:
            for xref, smask, w, h, bpc, colorspace, alt_ref, name, filter in images[:3]:
                print(f"  img: xref={xref}, size={w}x{h}, filter={filter}, name={name}")
    except Exception as e:
        print(f"{base}: ERROR {e}")
