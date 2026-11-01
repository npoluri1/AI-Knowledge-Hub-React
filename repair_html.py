#!/usr/bin/env python3
"""
repair_html.py - Repair corrupted HTML where </div></div>\n sequences were removed.
Uses depth analysis at section boundaries to insert missing closing </div> tags.
"""

import re

path = r'C:\Users\Legion\Desktop\AI_Engineer_Jobs_Global.html'

def div_opens(line):
    clean = re.sub(r'<!--.*?-->', '', line)
    return len(re.findall(r'<div[\s>]', clean, re.IGNORECASE))

def div_closes(line):
    clean = re.sub(r'<!--.*?-->', '', line)
    return len(re.findall(r'</div>', clean, re.IGNORECASE))

print(f'Reading {path}...')
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
print(f'Current: {len(lines)} lines')

# The top-level section comments should be at depth 0.
# They're all at depth 8, meaning 8 closing divs are missing before each one.
# Since they're CONSISTENTLY at depth 8, the missing closings are in the
# content BEFORE the first section comment (the summary box area).
#
# Strategy: Insert 8 closing </div> tags before the first section comment
# to bring depth from 8 to 0.

# Find first section comment
first_section_idx = None
for i, line in enumerate(lines):
    if '<!-- =====================' in line:
        first_section_idx = i
        break

if first_section_idx is None:
    print('ERROR: No section comments found')
    exit(1)

print(f'First section comment at line {first_section_idx + 1}')

# Calculate current depth at that point
depth_at_first = 0
for i in range(first_section_idx):
    depth_at_first += div_opens(lines[i]) - div_closes(lines[i])

print(f'Depth at first section comment: {depth_at_first}')
print(f'Need to insert {depth_at_first} closing </div> tags before it')

# But wait - we also need to fix the summary box structure.
# The summary box has lost its closing </div> tags.
# Let's insert them at the right places within the summary box.

# Find the summary box
summary_start = None
summary_end = None
for i, line in enumerate(lines):
    if 'class="summary-box"' in line:
        summary_start = i
    if summary_start and i > summary_start and '</div>' in line and 'summary' not in line.lower():
        # This might be the closing of summary-grid or summary-box
        pass

# Actually, let's take a simpler approach:
# The depth before the first section comment is 8.
# We need to bring it to 0.
# We'll insert 8 closing </div> tags right before the first section comment.
# These should close the summary-grid and summary-box divs.

result = []
inserted = 0

for i, line in enumerate(lines):
    if i == first_section_idx:
        # Insert closing divs to bring depth to 0
        for _ in range(depth_at_first):
            result.append('</div>\n')
            inserted += 1
    result.append(line)

print(f'Inserted {inserted} closing </div> tags before first section')

# Now check: after the first section comment, what's the depth pattern?
# Country sections should be at depth 0 at their comment lines.
# Let's verify and fix any remaining issues.

# Recalculate depths
depths = []
d = 0
for line in result:
    depths.append(d)
    d += div_opens(line) - div_closes(line)

# Check section comment depths
issues = 0
for i, line in enumerate(result):
    if '<!-- =====================' in line and depths[i] != 0:
        issues += 1
        if issues <= 5:
            print(f'  WARNING: Line {i+1}: depth={depths[i]} at section comment')

if issues > 5:
    print(f'  ... and {issues - 5} more issues')
elif issues == 0:
    print('All section comments at depth 0 - OK!')

# Check final depth
print(f'Final depth: {d}')

# Also check the ETL Global Guide
for i, line in enumerate(result):
    if 'etl-global-guide' in line and 'id=' in line:
        print(f'ETL Global Guide at line {i+1}: depth={depths[i]}')

# Check Knowledge Hub
for i, line in enumerate(result):
    if 'KNOWLEDGE HUB JOBS' in line and '<!--' in line:
        print(f'Knowledge Hub Jobs at line {i+1}: depth={depths[i]}')
    if 'KNOWLEDGE HUB JD CARDS' in line and '<!--' in line:
        print(f'Knowledge Hub JD Cards at line {i+1}: depth={depths[i]}')

# Fix remaining depth issues at section boundaries
# Walk through and insert closings where needed
final = []
d = 0
total_fixes = 0

# Find all top-level section comment positions
section_positions = []
for i, line in enumerate(result):
    if '<!-- =====================' in line:
        section_positions.append(i)

for idx, pos in enumerate(section_positions):
    # Before this section, ensure depth is 0
    # (skip if it's the first section, already handled)
    if idx == 0:
        # Just process normally
        for i in range(pos if idx == 0 else section_positions[idx-1], pos):
            final.append(result[i])
            d += div_opens(result[i]) - div_closes(result[i])
    else:
        prev_pos = section_positions[idx-1]
        for i in range(prev_pos, pos):
            final.append(result[i])
            d += div_opens(result[i]) - div_closes(result[i])
        
        # Check depth - should be 0 at section comment
        if d > 0:
            for _ in range(d):
                final.append('</div>\n')
                total_fixes += 1
            d = 0

# Process remaining lines after last section comment
last_section = section_positions[-1] if section_positions else 0
for i in range(last_section, len(result)):
    final.append(result[i])
    d += div_opens(result[i]) - div_closes(result[i])

# Close any remaining
while d > 0:
    final.append('</div>\n')
    total_fixes += 1
    d -= 1

print(f'\nTotal structural fixes: {total_fixes}')

# Final verification
fd = 0
for line in final:
    fd += div_opens(line) - div_closes(line)
print(f'Final depth: {fd}')
print(f'Final line count: {len(final)}')

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(final)

print(f'Written to {path}')
