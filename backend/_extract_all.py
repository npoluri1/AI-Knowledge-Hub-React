"""Extract content from all source files and map to chapters."""
import os, json, glob, csv, sys
from pathlib import Path

SRC = Path(r"D:\WorkSpace\Claude_Code\AI_Stuff_Data")
IMG = Path(r"D:\WorkSpace\LinkedIn_AI_TechStack_Images")
OUT = Path(r"D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React\backend")
sys.path.insert(0, str(OUT))

# ============================================================
# FILE TYPE DETECTION & CONTENT EXTRACTION
# ============================================================
def read_file(path):
    ext = path.suffix.lower()
    content = ""
    try:
        if ext in ('.txt', '.md', '.html', '.json', '.csv'):
            for enc in ['utf-8', 'cp1252', 'latin-1']:
                try:
                    with open(path, 'r', encoding=enc) as f:
                        content = f.read()
                    break
                except:
                    continue
        elif ext == '.pdf':
            try:
                import fitz
                doc = fitz.open(str(path))
                content = "\n".join([page.get_text() for page in doc])
                doc.close()
            except:
                content = f"[PDF could not be parsed: {path.name}]"
        elif ext == '.docx':
            try:
                from docx import Document
                doc = Document(str(path))
                content = "\n".join([p.text for p in doc.paragraphs])
            except:
                content = f"[DOCX could not be parsed: {path.name}]"
        elif ext == '.xlsx':
            try:
                import openpyxl
                wb = openpyxl.load_workbook(str(path), read_only=True, data_only=True)
                rows = []
                for ws in wb.worksheets:
                    for row in ws.iter_rows(values_only=True):
                        vals = [str(c) if c is not None else '' for c in row]
                        rows.append('\t'.join(vals))
                content = '\n'.join(rows)
                wb.close()
            except:
                content = f"[XLSX could not be parsed: {path.name}]"
    except Exception as e:
        content = f"[Error reading {path.name}: {e}]"
    return content.strip()

# ============================================================
# CHAPTER MAPPING - Each source file maps to a chapter
# ============================================================
CHAPTER_MAP = {
    # LLM Models & Providers chapter
    'Ollama models.txt': 'llm-models',
    'Notepad_LLM_Runners.txt': 'llm-models',
    # RAG Pipeline chapter  
    'RAG_Production_Pipeline_Notes.html': 'rag-pipeline',
    'RAG_NotepadPP_Table.html': 'rag-pipeline',
    'RAG_Production_Pipeline_Dashboard.html': 'rag-pipeline',
    # Vector DBs chapter
    'Vector_Databases_and_Semantic_Search.docx': 'vector-databases',
    'Vector_Databases_and_Semantic_Search_1.docx': 'vector-databases',
    'Vector_Databases_and_Semantic_Search_2.docx': 'vector-databases',
    'Vector_Databases_and_Semantic_Search_3.docx': 'vector-databases',
    'Vector_Databases_and_Semantic_Search_4.docx': 'vector-databases',
    'Vector_Databases_and_Semantic_Search_5.docx': 'vector-databases',
    'Vector_Databases_and_Semantic_Search_6.docx': 'vector-databases',
    # Tools Catalog
    'AI_TOOLS_CATALOG.txt': 'tools-catalog',
    'free_build_deploy_tools.txt': 'tools-catalog',
    # Agents
    'Agent_System_Prompts_All8.txt': 'ai-agents',
    # GRC Compliance
    'Global_GRC_Country_Matrix.txt': 'grc-compliance',
    'GRC_Frameworks_By_Country.txt': 'grc-compliance',
    # Career Resources
    'AI_Career_Survival_Plan.txt': 'career-resources',
    'AI_Complete_Career_Guide_v3.docx': 'career-resources',
    'AI_Career_Survival_Plan_Complete.docx': 'career-resources',
    'Java_Backend_Interview_Prep.txt': 'career-resources',
    # System Design
    'AI_SystemDesign_Resources.txt': 'system-design',
    # Project Ideas
    'AI_Projects_Complete_Prompts.xlsx': 'project-ideas',
    '500_AI_Project_Ideas.xlsx': 'project-ideas',
    'Expanded_AI_Project_Ideas.xlsx': 'project-ideas',
    # AI News & Market Intel
    'AI-News-Sources-Master.md': 'ai-news-market',
    'ai-tech-daily-2026-05-18.md': 'ai-news-market',
    'techpulse-daily-2026-05-20.md': 'ai-news-market',
    # Prompt Engineering
    'CONSOLIDATED_PROMPT.md': 'prompt-engineering',
    # Comprehensive Reference
    'AI_COMPREHENSIVE_GUIDE.txt': 'comprehensive-guide',
    'AI_COMPREHENSIVE_GUIDE.md': 'comprehensive-guide',
    'AI_KNOWLEDGE_TABLE.txt': 'comprehensive-guide',
    'AI_Data_File.txt': 'comprehensive-guide',
    'AI_TechStack_Halisnations.txt': 'comprehensive-guide',
    'AI_TheDailyEssential.txt': 'comprehensive-guide',
    'DataCentric_Multimodal_AI_Reference.docx': 'comprehensive-guide',
    # Enterprise Integration
    'enterprise-report-healthcare.json': 'enterprise-integration',
    # Books
    'Must_Read_Books_Curated_List.xlsx': 'tools-catalog',
    'World_Books_Massive_10K_per_Category.xlsx': 'tools-catalog',
    # RAG Deep Dive
    'GraphRAG_Research_Implementation_Guide.docx': 'rag-pipeline',
    # Python / FastAPI
    'integration_test.py': 'python-for-ai',
    'test_integration.py': 'python-for-ai',
    'dashboard_plugin.py': 'python-for-ai',
    'project-dashboards.py': 'python-for-ai',
}

# ============================================================
# EXTRACT ALL CONTENT
# ============================================================
extracted = {}
for f in sorted(SRC.iterdir()):
    if f.is_file() and f.name not in ('DumpStack.log', 'README.md'):
        cid = None
        for k, v in CHAPTER_MAP.items():
            if k in f.name or f.name.startswith(k):
                cid = v
                break
        content = read_file(f)
        extracted[f.name] = {
            'chapter_id': cid or 'unmapped',
            'path': str(f),
            'size': f.stat().st_size,
            'content_len': len(content),
            'content': content[:5000],  # Store first 5000 chars for summary
            'ext': f.suffix.lower()
        }

# Print summary
print(f"=== EXTRACTED {len(extracted)} FILES ===")
chapters_used = {}
for name, info in sorted(extracted.items()):
    cid = info['chapter_id']
    chapters_used.setdefault(cid, 0)
    chapters_used[cid] += 1
    print(f"  [{cid:25s}] {name:45s} {info['size']:>8,} bytes -> {info['content_len']:>8,} chars extracted")

print(f"\n=== FILES PER CHAPTER ===")
for cid, count in sorted(chapters_used.items()):
    print(f"  {cid:25s}: {count} files")

# Save extracted data
output = OUT / '_extracted_content.json'
with open(output, 'w', encoding='utf-8') as f:
    json.dump(extracted, f, ensure_ascii=False, indent=2)
print(f"\nSaved to {output}")
