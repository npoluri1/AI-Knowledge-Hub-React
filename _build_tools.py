"""Parse AI_TOOLS_CATALOG.txt into structured JS data module"""
import json

with open('D:/WorkSpace/Claude_Code/AI_Stuff_Data/AI_TOOLS_CATALOG.txt', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

lines = content.split('\n')

sections = []
current_section = None
current_tools = []

for i, line in enumerate(lines):
    stripped = line.strip()
    
    # Detect section headers (line starts with 'SECTION')
    if stripped.startswith('SECTION') and ':' in stripped:
        if current_section and current_tools:
            sections.append({'heading': current_section, 'tools': current_tools})
        current_section = stripped
        current_tools = []
        continue
    
    # Skip separator lines (all =, -, etc)
    if current_section and stripped and all(c in '=-_| ' for c in stripped):
        continue
    
    # Parse numbered entries
    if current_section and stripped:
        # Check if line starts with a number
        parts = stripped.split(None, 2)  # Split by whitespace, max 3 parts
        if len(parts) >= 2 and parts[0].isdigit():
            num = parts[0]
            name = parts[1] if len(parts) > 1 else ''
            desc = parts[2] if len(parts) > 2 else ''
            # Filter out header row
            if name not in ['Tool/Agent', ''] and not name.startswith('---'):
                current_tools.append({
                    'name': name[:100],
                    'description': desc[:300]
                })

if current_section and current_tools:
    sections.append({'heading': current_section, 'tools': current_tools})

total_tools = sum(len(s['tools']) for s in sections)
print(f"Found {len(sections)} sections, {total_tools} total tools")

for s in sections:
    print(f"  {s['heading'][:70]}: {len(s['tools'])} tools")

# Generate JS module
js_lines = []
js_lines.append("// AI Tools & Agents Catalog - 119 tools from AI_TOOLS_CATALOG.txt")
js_lines.append("")
js_lines.append("export const TOOLS_CATALOG = [")

for s in sections:
    heading_clean = s['heading'].replace("'", "\\'")
    js_lines.append(f"  {{")
    js_lines.append(f"    heading: '{heading_clean}',")
    js_lines.append(f"    tools: [")
    for t in s['tools']:
        name = t['name'].replace("'", "\\'").replace('"', '\\"')
        desc = t['description'].replace("'", "\\'").replace('"', '\\"').replace('\n', ' ').strip()
        js_lines.append(f"      {{ name: '{name}', description: \"{desc}\" }},")
    js_lines.append(f"    ]")
    js_lines.append(f"  }},")

js_lines.append("]")
js_lines.append("")

output = '\n'.join(js_lines)
with open('frontend/src/data/toolsCatalog.js', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"\nSaved {len(output):,} chars to frontend/src/data/toolsCatalog.js")
