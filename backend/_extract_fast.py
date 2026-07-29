"""Fast extract content from all source files."""
import os, json, sys
from pathlib import Path

SRC = Path(r"D:\WorkSpace\Claude_Code\AI_Stuff_Data")
OUT = Path(r"D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React\backend")

# Files to skip (too large or binary)
SKIP_FILES = {
    'DumpStack.log', 'README.md', 
    'World_Books_Massive_10K_per_Category.xlsx',
    'Must_Read_Books_Curated_List.xlsx',
    'Must_Read_Books_Expanded_IT_CEOs_Quantum.xlsx',
    'Books_25_Categories_5000each.xlsx',
    'Books_By_Category.xlsx',
    'Self_Improvement_Books_500_Library.xlsx',
    'Zero_to_AI_Integration_Engineer_Book_1.docx',
    'Zero_to_AI_Integration_Engineer_Book.docx',
    'Zero_to_AI_Integration_Engineer_Book1.docx',
    'Zero_to_AI_Integration_Engineer_Book2.docx',
}

CHAPTER_MAP = {
    'Ollama models.txt': 'llm-models',
    'Notepad_LLM_Runners.txt': 'llm-models',
    'RAG_Production_Pipeline_Notes.html': 'rag-pipeline',
    'RAG_NotepadPP_Table.html': 'rag-pipeline',
    'RAG_Production_Pipeline_Dashboard.html': 'rag-pipeline',
    'Vector_Databases_and_Semantic_Search': 'vector-databases',
    'AI_TOOLS_CATALOG.txt': 'tools-catalog',
    'free_build_deploy_tools.txt': 'tools-catalog',
    'Agent_System_Prompts_All8.txt': 'ai-agents',
    'Global_GRC_Country_Matrix.txt': 'grc-compliance',
    'GRC_Frameworks_By_Country.txt': 'grc-compliance',
    'AI_Career_Survival_Plan.txt': 'career-resources',
    'AI_Complete_Career_Guide_v3.docx': 'career-resources',
    'AI_Career_Survival_Plan_Complete.docx': 'career-resources',
    'Java_Backend_Interview_Prep.txt': 'career-resources',
    'AI_SystemDesign_Resources.txt': 'system-design',
    'AI_Projects_Complete_Prompts.xlsx': 'project-ideas',
    '500_AI_Project_Ideas.xlsx': 'project-ideas',
    'Expanded_AI_Project_Ideas.xlsx': 'project-ideas',
    'AI-News-Sources-Master.md': 'ai-news-market',
    'ai-tech-daily-2026-05-18.md': 'ai-news-market',
    'techpulse-daily-2026-05-20.md': 'ai-news-market',
    'CONSOLIDATED_PROMPT.md': 'prompt-engineering',
    'AI_COMPREHENSIVE_GUIDE.txt': 'comprehensive-guide',
    'AI_COMPREHENSIVE_GUIDE.md': 'comprehensive-guide',
    'AI_KNOWLEDGE_TABLE.txt': 'comprehensive-guide',
    'AI_Data_File.txt': 'comprehensive-guide',
    'AI_TechStack_Halisnations.txt': 'comprehensive-guide',
    'AI_TheDailyEssential.txt': 'comprehensive-guide',
    'DataCentric_Multimodal_AI_Reference.docx': 'comprehensive-guide',
    'enterprise-report-healthcare.json': 'enterprise-integration',
    'GraphRAG_Research_Implementation_Guide.docx': 'rag-pipeline',
    'integration_test.py': 'python-for-ai',
    'test_integration.py': 'python-for-ai',
    'dashboard_plugin.py': 'python-for-ai',
    'project-dashboards.py': 'python-for-ai',
    'Multimodal_AI_Systems.docx': 'comprehensive-guide',
    'Data-Centric_vs_Model-Centric_AI.docx': 'comprehensive-guide',
    'LinledInPosts_Data.txt': 'ai-news-market',
    'projects_export.json': 'project-ideas',
    'ideas_export.json': 'project-ideas',
}

def fast_read(path):
    ext = path.suffix.lower()
    try:
        if ext in ('.txt', '.md', '.html', '.json', '.csv', '.py'):
            for enc in ['utf-8', 'cp1252']:
                try:
                    with open(path, 'r', encoding=enc) as f:
                        return f.read(50000)
                except:
                    continue
        elif ext == '.docx':
            try:
                from docx import Document
                doc = Document(str(path))
                return '\n'.join([p.text for p in doc.paragraphs[:200]])
            except:
                pass
        elif ext == '.xlsx':
            try:
                import openpyxl
                wb = openpyxl.load_workbook(str(path), read_only=True, data_only=True)
                rows = []
                for ws in wb.worksheets:
                    for i, row in enumerate(ws.iter_rows(values_only=True)):
                        if i > 100: break
                        vals = [str(c) if c is not None else '' for c in row]
                        rows.append('\t'.join(vals))
                wb.close()
                return '\n'.join(rows)
            except:
                pass
        elif ext == '.json':
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return json.dumps(data, indent=2, ensure_ascii=False)[:50000]
    except:
        pass
    return ''

results = []
for f in sorted(SRC.iterdir()):
    if f.is_file() and f.name not in SKIP_FILES:
        cid = 'unmapped'
        for k, v in CHAPTER_MAP.items():
            if k in f.name:
                cid = v
                break
        content = fast_read(f)
        results.append({
            'file': f.name,
            'chapter': cid,
            'size': f.stat().st_size,
            'content_len': len(content),
            'preview': content[:300],
            'ext': f.suffix.lower()
        })
        print(f"[{cid:25s}] {f.name:45s} {len(content):>6,} chars")

print(f"\n=== SUMMARY ===")
from collections import Counter
c = Counter(r['chapter'] for r in results)
for k, v in sorted(c.items()):
    print(f"  {k:25s}: {v} files")
print(f"\nTotal: {len(results)} files processed")
