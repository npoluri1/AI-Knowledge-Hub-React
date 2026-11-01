#!/usr/bin/env python3
"""Cleanup the modified HTML file to restore original state"""
import re

path = r'C:\Users\Legion\Desktop\AI_Engineer_Jobs_Global.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

original_len = len(content.split('\n'))
print(f'Current lines: {original_len}')

# 1. Remove the collapsible CSS block
css_marker = '/* ===== COLLAPSIBLE SECTIONS ===== */'
css_end = '</style>'
start = content.find(css_marker)
end = content.find(css_end, start)
if start >= 0 and end >= 0:
    content = content[:start] + content[end:]
    print('Removed CSS block')

# 2. Remove the JS block  
js_marker = '<script>\nfunction toggleSection'
js_end = '</script>\n'
start = content.find(js_marker)
end = content.find(js_end, start) + len(js_end)
if start >= 0 and end > start:
    content = content[:start] + content[end:]
    print('Removed JS block')

# 3. Remove the buttons div
btn_marker = 'text-align:center; margin-bottom:20px;'
btn_start = content.find(btn_marker)
if btn_start >= 0:
    # Go back to find <div
    btn_start = content.rfind('<div', 0, btn_start)
    btn_end_str = 'Collapse All Sections</button>'
    btn_end = content.find(btn_end_str, btn_start)
    if btn_end >= 0:
        # Find closing </div> after this
        btn_end = content.find('</div>', btn_end) + len('</div>\n')
        content = content[:btn_start] + content[btn_end:]
        print('Removed buttons block')

# 4. Remove all collapse wrapper opening tags
pattern = r'<div class="collapse-wrapper"><button class="collapse-btn" onclick="toggleSection\(this\)">[^<]* <span class="arrow">&#9654;</span></button><div class="collapse-content">\n?'
content = re.sub(pattern, '', content)
print('Removed collapse wrapper opening tags')

# 5. Remove all collapse wrapper closing tags (</div></div>\n)
content = content.replace('</div></div>\n', '')
print('Removed collapse wrapper closing tags')

# Also clean up any extra blank lines that might have been introduced
# Remove consecutive blank lines (more than 2)
content = re.sub(r'\n{3,}', '\n\n', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
print(f'After cleanup: {len(lines)} lines')
print(f'Original was: 80027 lines')
