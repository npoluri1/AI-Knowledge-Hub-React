"""Extract ALL chapter data from backend chapters_data.py and save as complete JavaScript module.
Handles Python dict syntax with double quotes (JSON-like but with Python constructs)."""

import re
import json
import ast

with open('backend/chapters_data.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find chapters list
idx = content.find('chapters = [')
if idx < 0:
    print("Could not find chapters = [")
    exit(1)

chapters_text = content[idx + 11:]

# Parse chapters by finding top-level brace pairs
chapter_blocks = []
brace_count = 0
start = None

for i, ch in enumerate(chapters_text):
    if ch == '{':
        if brace_count == 0:
            start = i
        brace_count += 1
    elif ch == '}':
        brace_count -= 1
        if brace_count == 0 and start is not None:
            chapter_blocks.append(chapters_text[start:i+1])
            start = None
    elif ch == ']' and brace_count == 0:
        break

def extract_string_value(text, key):
    """Extract a string value for a given key from a Python dict text."""
    m = re.search(r'"' + re.escape(key) + r'"\s*:\s*"((?:[^"\\]|\\.)*)"', text)
    if m:
        return m.group(1).replace('\\"', '"').replace('\\n', '\n')
    return None

def extract_list_value(text, key):
    """Extract a list value for a given key from a Python dict text."""
    m = re.search(r'"' + re.escape(key) + r'"\s*:\s*\[', text)
    if not m:
        return None
    pos = m.end()
    depth = 1
    while depth > 0 and pos < len(text):
        if text[pos] == '[': depth += 1
        elif text[pos] == ']': depth -= 1
        pos += 1
    return text[m.start():pos]

def extract_sections(text):
    """Extract sections array from chapter text."""
    m = re.search(r'"sections"\s*:\s*\[', text)
    if not m:
        return []
    
    pos = m.end()
    depth = 1
    start = m.start()
    while depth > 0 and pos < len(text):
        if text[pos] == '[':
            depth += 1
        elif text[pos] == ']':
            depth -= 1
        pos += 1
    
    sections_text = text[m.start():pos]
    
    # Now parse individual section objects
    sections = []
    brace_count = 0
    sec_start = None
    
    for i, ch in enumerate(sections_text):
        if ch == '{':
            if brace_count == 0:
                sec_start = i
            brace_count += 1
        elif ch == '}':
            brace_count -= 1
            if brace_count == 0 and sec_start is not None:
                sec_text = sections_text[sec_start:i+1]
                section = parse_section(sec_text)
                if section:
                    sections.append(section)
                sec_start = None
    
    return sections

def parse_section(sec_text):
    """Parse a single section dict from text."""
    section = {}
    
    # Extract heading
    heading = extract_string_value(sec_text, 'heading')
    if heading:
        section['heading'] = heading
    
    # Extract text
    text = extract_string_value(sec_text, 'text')
    if text:
        section['text'] = text
    
    # Extract scenario
    scenario = extract_string_value(sec_text, 'scenario')
    if scenario:
        section['scenario'] = scenario
    
    # Extract insight
    insight = extract_string_value(sec_text, 'insight')
    if insight:
        section['insight'] = insight
    
    # Extract concept
    concept = extract_string_value(sec_text, 'concept')
    if concept:
        section['concept'] = concept
    
    # Extract warning
    warning = extract_string_value(sec_text, 'warning')
    if warning:
        section['warning'] = warning
    
    # Extract code block
    code_match = re.search(r'"code"\s*:\s*\{', sec_text)
    if code_match:
        code_pos = code_match.end()
        code_depth = 1
        while code_depth > 0 and code_pos < len(sec_text):
            if sec_text[code_pos] == '{': code_depth += 1
            elif sec_text[code_pos] == '}': code_depth -= 1
            code_pos += 1
        code_text = sec_text[code_match.start():code_pos]
        code_title = extract_string_value(code_text, 'title')
        code_content = extract_string_value(code_text, 'content')
        if code_title or code_content:
            code_obj = {}
            if code_title: code_obj['title'] = code_title
            if code_content: code_obj['content'] = code_content
            section['code'] = code_obj
    
    # Extract table
    table_match = re.search(r'"table"\s*:\s*\{', sec_text)
    if table_match:
        table_pos = table_match.end()
        table_depth = 1
        while table_depth > 0 and table_pos < len(sec_text):
            if sec_text[table_pos] == '{': table_depth += 1
            elif sec_text[table_pos] == '}': table_depth -= 1
            table_pos += 1
        table_text = sec_text[table_match.start():table_pos]
        try:
            table_data = ast.literal_eval(table_text.replace('"table"', '"x"'))
            section['table'] = table_data
        except:
            # Fall back to simple extraction
            headers_text = extract_list_value(table_text, 'headers')
            rows_text = extract_list_value(table_text, 'rows')
            if headers_text or rows_text:
                table_obj = {}
                if headers_text:
                    try:
                        table_obj['headers'] = ast.literal_eval(headers_text)
                    except:
                        table_obj['headers'] = []
                if rows_text:
                    try:
                        table_obj['rows'] = ast.literal_eval(rows_text)
                    except:
                        table_obj['rows'] = []
                if table_obj:
                    section['table'] = table_obj
    
    # Extract comparison
    comp_match = re.search(r'"comparison"\s*:\s*\{', sec_text)
    if comp_match:
        comp_pos = comp_match.end()
        comp_depth = 1
        while comp_depth > 0 and comp_pos < len(sec_text):
            if sec_text[comp_pos] == '{': comp_depth += 1
            elif sec_text[comp_pos] == '}': comp_depth -= 1
            comp_pos += 1
        comp_text = sec_text[comp_match.start():comp_pos]
        try:
            comp_data = ast.literal_eval(comp_text.replace('"comparison"', '"x"'))
            section['comparison'] = comp_data
        except:
            pass
    
    # Extract card_grid
    card_match = re.search(r'"card_grid"\s*:\s*\[', sec_text)
    if card_match:
        card_pos = card_match.end()
        card_depth = 1
        while card_depth > 0 and card_pos < len(sec_text):
            if sec_text[card_pos] == '[': card_depth += 1
            elif sec_text[card_pos] == ']': card_depth -= 1
            card_pos += 1
        card_text = sec_text[card_match.start():card_pos]
        try:
            card_data = ast.literal_eval(card_text.replace('"card_grid"', '"x"'))
            section['card_grid'] = card_data
        except:
            pass
    
    # Extract keyPoints
    kp_match = re.search(r'"keyPoints"\s*:\s*\[', sec_text)
    if kp_match:
        kp_pos = kp_match.end()
        kp_depth = 1
        while kp_depth > 0 and kp_pos < len(sec_text):
            if sec_text[kp_pos] == '[': kp_depth += 1
            elif sec_text[kp_pos] == ']': kp_depth -= 1
            kp_pos += 1
        kp_text = sec_text[kp_match.start():kp_pos]
        try:
            kp_data = ast.literal_eval(kp_text.replace('"keyPoints"', '"x"'))
            section['keyPoints'] = kp_data
        except:
            pass
    
    # Extract imageDesc
    img_match = re.search(r'"imageDesc"\s*:\s*\{', sec_text)
    if img_match:
        img_pos = img_match.end()
        img_depth = 1
        while img_depth > 0 and img_pos < len(sec_text):
            if sec_text[img_pos] == '{': img_depth += 1
            elif sec_text[img_pos] == '}': img_depth -= 1
            img_pos += 1
        img_text = sec_text[img_match.start():img_pos]
        try:
            img_data = ast.literal_eval(img_text.replace('"imageDesc"', '"x"'))
            section['imageDesc'] = img_data
        except:
            pass
    
    return section if section else None

# Process each chapter
js_lines = []
js_lines.append("// Auto-generated chapter data from backend/chapters_data.py")
js_lines.append("export const CHAPTER_SECTIONS = {")

total_sections = 0
for i, block in enumerate(chapter_blocks):
    ch_id = extract_string_value(block, 'id')
    if not ch_id:
        continue
    
    sections = extract_sections(block)
    total_sections += len(sections)
    
    sections_json = json.dumps(sections, indent=2, ensure_ascii=False)
    # Indent properly for JS
    indented = sections_json.replace('\n', '\n    ')
    js_lines.append(f'  "{ch_id}": {{')
    js_lines.append(f'    "sections": {indented}')
    js_lines.append('  },')
    print(f"  {ch_id}: {len(sections)} sections")

js_lines.append("}")
js_lines.append("")

with open('frontend/src/data/chapterSections.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(js_lines))

print(f"\nSaved to frontend/src/data/chapterSections.js")
print(f"Total chapters: {len(chapter_blocks)}, Total sections: {total_sections}")
