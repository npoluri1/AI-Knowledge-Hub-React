"""Generate frontend/src/data/jobs.js from superaidevs_jobs.json"""
import json
import os
import re

SRC = os.environ.get(
    'JOBS_SRC',
    'D:/WorkSpace/Claude_Code/AI_Stuff_Data/superaidevs_jobs.json'
)

with open(SRC, 'r', encoding='utf-8', errors='replace') as f:
    jobs = json.load(f)

# Get all unique techs
techs = set()
for j in jobs:
    for t in j.get('techs', []):
        if t: techs.add(t)
all_techs = sorted(techs)

# Generate JS
lines = []
lines.append("// AI Engineering Jobs - All 996 from superaidevs_jobs.json")
lines.append("")
lines.append("export const AI_JOBS = [")

def esc(s):
    return (s or '').replace('\\', '\\\\').replace("'", "\\'").replace('"', '\\"')

# Strip leftover HTML-comment fragments like "<!-- -->" that showed up in
# scraped company/title fields. Robust to whitespace variations so it
# also catches "<!--  -->" / "<!---->" etc., and matches the JS regex used
# by buildSourceUrl() as a defensive fallback.
_HTML_COMMENT_RE = re.compile(r'<!--\s*-->')
def clean(s):
    return _HTML_COMMENT_RE.sub('', s or '').strip()

for i, j in enumerate(jobs):
    title = esc(clean(j.get('title', '')))
    company = esc(clean(j.get('company', '')))
    location = esc(j.get('location', 'Remote'))
    salary = esc(j.get('salary', ''))
    desc_raw = (j.get('desc', '') or '').replace('\n', ' ').strip()[:300]
    desc = esc(desc_raw).replace('`', '\\`').replace('${', '\\${')
    techs_list = j.get('techs', [])
    techs_json = json.dumps(techs_list)
    use_cases = j.get('use_cases', []) or []
    uc_json = json.dumps(use_cases)
    url = esc(j.get('url', '') or '')

    lines.append(f"  {{")
    lines.append(f"    title: '{title}',")
    lines.append(f"    company: '{company}',")
    lines.append(f"    location: '{location}',")
    lines.append(f"    salary: '{salary}',")
    lines.append(f"    techs: {techs_json},")
    lines.append(f"    desc: '{desc}',")
    lines.append(f"    use_cases: {uc_json},")
    lines.append(f"    url: '{url}'")
    lines.append(f"  }},")

lines.append("]")
lines.append("")
lines.append(f"export const JOB_TECHS = {json.dumps(all_techs)}")
lines.append("export const JOB_LOCATIONS = [...new Set(AI_JOBS.map(j => j.location))].sort()")
lines.append("")

output = '\n'.join(lines)
print(f"Generated {len(jobs)} jobs, {len(all_techs)} unique techs, {len(output):,} chars")

with open('frontend/src/data/jobs.js', 'w', encoding='utf-8') as f:
    f.write(output)
print("Saved to frontend/src/data/jobs.js")
