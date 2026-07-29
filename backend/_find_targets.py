import sys
sys.path.insert(0, 'D:\\WorkSpace\\Claude_Code\\AI_Stuff_Data\\AI_Knowledge_Hub_React\\backend')
if 'chapters_data' in sys.modules:
    del sys.modules['chapters_data']
from chapters_data import chapters

targets = ['llm-models', 'ai-agents', 'grc-compliance', 'system-design', 'project-ideas', 'python-for-ai']
for ch in chapters:
    cid = ch['id']
    if cid in targets:
        secs = ch['sections']
        last = secs[-1] if secs else {'heading': '(none)'}
        print(f'{cid}: sections={len(secs)}, last heading={last.get("heading","?")[:60]}')
