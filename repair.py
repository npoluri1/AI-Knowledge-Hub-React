#!/usr/bin/env python3
"""
Smart repair for corrupted HTML where </div></div>\n sequences were removed.
Uses HTML structural cues to determine where closing divs should be re-inserted.
"""

import re
import sys

path = r'C:\Users\Legion\Desktop\AI_Engineer_Jobs_Global.html'

def count_opens(line):
    clean = re.sub(r'<!--.*?-->', '', line)
    return len(re.findall(r'<div[\s>]', clean, re.IGNORECASE))

def count_closes(line):
    clean = re.sub(r'<!--.*?-->', '', line)
    return len(re.findall(r'</div>', clean, re.IGNORECASE))

print(f'Reading {path}...')
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Current: {len(lines)} lines')

# Calculate depth at each line
depths = []
d = 0
for line in lines:
    depths.append(d)
    d += count_opens(line) - count_closes(line)

print(f'Current depth: {d}')
print(f'Need to insert ~{d} closing </div> tags')

# STRATEGY: 
# The removed patterns were </div></div>\n which means 2 closing divs on one line.
# These were removed from places where the HTML had nested divs closing.
# 
# We can find likely insertion points by looking at structural patterns:
# 1. After </table> tags - tables are often inside divs that need closing
# 2. After summary/info boxes
# 3. At section boundaries (<!-- ========= comments)
# 4. Before </body>
#
# But the most reliable approach: We know each removal created a deficit of 2.
# We can find places where depth is unexpectedly high (compared to surrounding context)
# and insert closing divs to normalize.

# First, let's identify key structural markers and their expected depth context
# by looking at the file's major section structure

# Find all section comment lines (<!-- =========) and their depths
section_comments = []
for i, line in enumerate(lines):
    if '<!-- ==' in line and '==>' in line:
        section_comments.append((i, depths[i], line.strip()[:80]))

print(f'\nFound {len(section_comments)} section comments')
for idx, (line_no, depth, text) in enumerate(section_comments[:5]):
    print(f'  Line {line_no+1}: depth={depth}: {text}')
print(f'  ...')
for idx, (line_no, depth, text) in enumerate(section_comments[-5:]):
    print(f'  Line {line_no+1}: depth={depth}: {text}')

# The approach: We'll walk through the file and at certain structural boundaries,
# insert </div> tags to bring depth back to where it "should" be.
#
# Expected depth at section comments: these are typically at depth 0 or 1
# Expected depth inside <table> rows: should be depth 3-5 typically
# Expected depth after </table>: should drop back to where <table> was opened + 1

# Let's use a reference-based approach:
# We know that in the original file, section comments were at depth 0 or 1.
# If a section comment shows depth > 1, we need to insert closing divs before it.

# First, let's determine the "expected" depth at each section boundary
# by looking at the FIRST few section comments which are most likely correct
# (since corruption accumulates from the point of removal)

# Check the first section comment depth
if section_comments:
    first_depth = section_comments[0][1]
    print(f'\nFirst section comment depth: {first_depth}')
    # If first section is at depth 0, great. If at depth > 0, we need early fixes.

# Better approach: 
# Walk through line by line. Track depth. At key structural points,
# if depth is significantly higher than expected, insert </div> tags.

# Expected depth rules:
# - Top level (before any section): depth 0
# - Inside a <div class="country-section">: depth 1
# - Inside <div class="country-header">: depth 2  
# - Inside <table>: depth 2
# - Inside <tr>: depth 3
# - Inside <td>: depth 4
# - After </table>: depth 1 (back to country-section level)
# - After country-section </div>: depth 0

# Actually, let me try the simplest reliable approach:
# Find ALL places where depth increases by looking at <div> opens
# and match them with </div> closes. When we find mismatches,
# insert the missing closings.

# Walk through, tracking depth, and insert </div> when we see structural
# cues that suggest a div should close.

result = []
depth = 0
insertions = 0

# First pass: find all <table> positions and their depths
table_positions = []
for i, line in enumerate(lines):
    if '<table' in line.lower() and '</table' not in line.lower():
        table_positions.append((i, depths[i]))

# For each table, find its matching </table>
table_pairs = []
for tidx, (table_line, table_depth) in enumerate(table_positions):
    # Find matching </table>
    td = 0
    for j in range(table_line, len(lines)):
        td += count_opens(lines[j]) - count_closes(lines[j])
        if '</table>' in lines[j].lower():
            table_pairs.append((table_line, j, table_depth))
            break

print(f'\nFound {len(table_pairs)} table pairs')

# Now the key insight:
# After each </table>, the depth should return to (table_depth + some_offset)
# The typical pattern is:
# <div class="country-section"> (depth goes to 1)
#   <div class="country-header"> (depth goes to 2)
#   </div> (depth back to 1)
#   <table> (depth goes to 2)
#     <tr> (depth goes to 3) 
#       <td> (depth goes to 4)
#       </td> (depth back to 3)
#     </tr> (depth back to 2)
#   </table> (depth back to 1)
#   optional <div>...</div> (depth 2 -> 1)
# </div> (depth back to 0)

# So after </table>, expected depth = 1 (inside country-section)
# If depth is higher, we need to insert closings.

# But this is too simplistic for the complex sections.
# Let me try a different approach entirely.

# APPROACH: Count total deficit and distribute closings at known boundaries.
# We know the deficit is 'd' (current final depth).
# We need to insert d closing </div> tags.
# The best places: just before each <!-- ======== comment (section boundary).
# At section boundaries, depth should be 0.

print(f'\nInserting closing divs at section boundaries...')

# Calculate how many closing divs we need before each section boundary
# by checking what depth is at each boundary vs what it should be (0)

# Build the result with insertions
result = []
depth = 0
total_inserted = 0

for i, line in enumerate(lines):
    # Check if this is a section comment boundary
    if '<!-- ==' in line and '==>' in line:
        # At section boundaries, depth should be 0
        # If it's higher, insert closing divs
        while depth > 0:
            result.append('</div>\n')
            depth -= 1
            total_inserted += 1
    
    # Also check for ETL Global Guide div (no comment)
    if 'class="etl-global-guide"' in line and 'id="etl-global-guide"' in line:
        while depth > 0:
            result.append('</div>\n')
            depth -= 1
            total_inserted += 1
    
    result.append(line)
    depth += count_opens(line) - count_closes(line)

# Close any remaining open divs at end
while depth > 0:
    result.append('</div>\n')
    depth -= 1
    total_inserted += 1

print(f'Inserted {total_inserted} closing </div> tags')

# Verify
final_depth = 0
for line in result:
    final_depth += count_opens(line) - count_closes(line)
print(f'Final depth: {final_depth}')

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(result)

print(f'Written {len(result)} lines')
print(f'Original was: 80027 lines')
print(f'Difference: {len(result) - 80027} lines')
