#!/usr/bin/env python3
"""
add_collapsible.py - Adds collapsible/expandable functionality to AI_Engineer_Jobs_Global.html

This script:
1. Adds CSS for collapsible sections before </style>
2. Adds JavaScript toggle functions before </body>
3. Adds Expand All / Collapse All buttons after the summary box
4. Wraps each major section in a collapsible container

Usage: python add_collapsible.py
"""

import re
import sys
import os

HTML_PATH = r'C:\Users\Legion\Desktop\AI_Engineer_Jobs_Global.html'

COLLAPSIBLE_CSS = """/* ===== COLLAPSIBLE SECTIONS ===== */
.collapse-btn {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 25px;
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  transition: background 0.2s;
}
.collapse-btn:hover { background: rgba(255,255,255,0.05); }
.collapse-btn .arrow {
  display: inline-block;
  transition: transform 0.3s;
  font-size: 0.8em;
  color: #888;
}
.collapse-btn.active .arrow { transform: rotate(90deg); }
.collapse-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}
.collapse-content.open { max-height: none; overflow: visible; }
.collapse-wrapper {
  margin-bottom: 0;
}
"""

COLLAPSIBLE_JS = """<script>
function toggleSection(btn) {
  btn.classList.toggle('active');
  var content = btn.nextElementSibling;
  content.classList.toggle('open');
  if (content.classList.contains('open')) {
    content.style.maxHeight = content.scrollHeight + 'px';
    setTimeout(function(){ content.style.maxHeight = 'none'; }, 400);
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    requestAnimationFrame(function(){ content.style.maxHeight = '0'; });
  }
}
function expandAll() {
  document.querySelectorAll('.collapse-btn').forEach(function(btn) {
    btn.classList.add('active');
    var c = btn.nextElementSibling;
    c.classList.add('open');
    c.style.maxHeight = 'none';
  });
}
function collapseAll() {
  document.querySelectorAll('.collapse-btn').forEach(function(btn) {
    btn.classList.remove('active');
    var c = btn.nextElementSibling;
    c.style.maxHeight = '0';
    c.classList.remove('open');
  });
}
</script>"""

CONTROL_BUTTONS = """<div style="text-align:center; margin-bottom:20px;">
  <button onclick="expandAll()" style="background:#00ff88;color:#000;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:bold;margin:0 5px;">Expand All Sections</button>
  <button onclick="collapseAll()" style="background:#ff4444;color:#fff;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:bold;margin:0 5px;">Collapse All Sections</button>
</div>"""


def count_div_opens(line):
    clean = re.sub(r'<!--.*?-->', '', line)
    return len(re.findall(r'<div[\s>]', clean, re.IGNORECASE))


def count_div_closes(line):
    clean = re.sub(r'<!--.*?-->', '', line)
    return len(re.findall(r'</div>', clean, re.IGNORECASE))


def find_section_end(lines, start_idx):
    """Find the closing </div> for a section whose opening <div> is at start_idx.
    Tracks div nesting depth."""
    depth = 0
    for i in range(start_idx, len(lines)):
        depth += count_div_opens(lines[i]) - count_div_closes(lines[i])
        if depth <= 0:
            return i
    return len(lines) - 1


def find_all_occurrences(lines, pattern):
    """Find all line indices where pattern appears."""
    return [i for i, line in enumerate(lines) if pattern in line]


def main():
    if not os.path.exists(HTML_PATH):
        print(f'ERROR: File not found: {HTML_PATH}')
        sys.exit(1)

    print(f'Reading {HTML_PATH}...')
    with open(HTML_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    original_count = len(lines)
    print(f'Original line count: {original_count}')

    # Verify the file has expected structure
    has_style = any('</style>' in l for l in lines)
    has_body = any('</body>' in l for l in lines)
    has_summary = any('class="summary-box"' in l for l in lines)

    if not has_style:
        print('ERROR: No </style> tag found')
        sys.exit(1)
    if not has_body:
        print('ERROR: No </body> tag found')
        sys.exit(1)
    if not has_summary:
        print('ERROR: No summary-box found')
        sys.exit(1)

    # =====================================================
    # STEP 1: Insert CSS before </style>
    # =====================================================
    print('\nStep 1: Inserting collapsible CSS...')
    for i, line in enumerate(lines):
        if '</style>' in line:
            lines.insert(i, COLLAPSIBLE_CSS + '\n')
            print(f'  Inserted CSS before </style> at line {i + 1}')
            break

    # =====================================================
    # STEP 2: Insert JavaScript before </body>
    # =====================================================
    print('Step 2: Inserting JavaScript...')
    for i in range(len(lines) - 1, -1, -1):
        if '</body>' in lines[i]:
            lines.insert(i, COLLAPSIBLE_JS + '\n')
            print(f'  Inserted JS before </body> at line {i + 1}')
            break

    # =====================================================
    # STEP 3: Insert expand/collapse buttons after summary box
    # =====================================================
    print('Step 3: Inserting control buttons...')
    in_summary = False
    for i, line in enumerate(lines):
        if 'class="summary-box"' in line:
            in_summary = True
        if in_summary and '</div>' in line and i > 80:
            lines.insert(i + 1, CONTROL_BUTTONS + '\n')
            print(f'  Inserted buttons after summary box at line {i + 2}')
            break

    # =====================================================
    # STEP 4: Define all sections to wrap
    # Each section is identified by a unique comment or div marker.
    # For sections with duplicate names (JAPAN, SOUTH KOREA),
    # we use occurrence tracking.
    # =====================================================
    print('\nStep 4: Wrapping sections in collapsible containers...')

    # Build list of sections with their markers and expected position
    # Format: (search_marker, title, search_type)
    # search_type: 'comment' = find <!-- marker, 'div' = find <div marker
    sections_to_wrap = [
        # Country sections (single occurrence of each comment)
        ('SINGAPORE (87+ JOBS)', 'Singapore AI Engineer Jobs (87+)', 'comment'),
        ('<!-- ===================== USA ===================== -->', 'USA AI Engineer Jobs', 'comment'),
        ('<!-- ===================== UK ===================== -->', 'UK AI Engineer Jobs', 'comment'),
        ('<!-- ===================== AUSTRALIA ===================== -->', 'Australia AI Engineer Jobs', 'comment'),
        ('<!-- ===================== CANADA ===================== -->', 'Canada AI Engineer Jobs', 'comment'),
        ('<!-- ===================== NEW ZEALAND ===================== -->', 'New Zealand AI Engineer Jobs', 'comment'),
        # Japan has 2 occurrences - use specific markers
        ('<!-- ===================== JAPAN ===================== -->', 'Japan AI Engineer Jobs', 'comment'),
        ('<!-- ===================== JAPAN ===================== -->', 'Japan AI Engineer Jobs (Additional)', 'comment'),
        # South Korea has 2 occurrences - use specific markers
        ('<!-- ===================== SOUTH KOREA ===================== -->', 'South Korea AI Engineer Jobs', 'comment'),
        ('<!-- ===================== SOUTH KOREA ===================== -->', 'South Korea AI Engineer Jobs (Additional)', 'comment'),
        # India (first occurrence - the one before ETL)
        ('<!-- ===================== INDIA ===================== -->', 'India AI Engineer Jobs', 'comment'),
        # ETL Tech Stack Master Guide
        ('ETL TECH STACK: MASTER GUIDE 2026', 'ETL Tech Stack Master Guide 2026 (Parts 1-13)', 'comment'),
        # ETL Global Guide (by div id)
        ('id="etl-global-guide"', 'ETL Tools & Data Engineering Complete Global Guide 2026 (7 Sections)', 'div'),
        # Knowledge Hub Jobs
        ('KNOWLEDGE HUB JOBS (2385 TOTAL)', 'Knowledge Hub Jobs by Country (2,385 Total)', 'comment'),
        # Knowledge Hub JD Cards
        ('KNOWLEDGE HUB JD CARDS (2385 with Design Patterns)', 'Knowledge Hub Complete JD Cards with Design Patterns (2,385)', 'comment'),
    ]

    # Find all positions, handling duplicates by tracking occurrence counts
    occurrence_tracker = {}  # marker -> count of times we've seen it
    section_positions = []  # (line_idx, title, end_idx)

    for marker, title, search_type in sections_to_wrap:
        if search_type == 'comment':
            # Count occurrences to handle duplicates
            key = marker
            occ = occurrence_tracker.get(key, 0)
            occurrence_tracker[key] = occ + 1

            # Find the Nth occurrence
            found_count = 0
            found_idx = None
            for i, line in enumerate(lines):
                if marker in line and '<!--' in line:
                    found_count += 1
                    if found_count == occ + 1:
                        found_idx = i
                        break

            if found_idx is None:
                print(f'  WARNING: Could not find occurrence {occ + 1} of: {marker}')
                continue

            # Find the section end
            # Look for <div class="country-section"> or <div class="etl-master-guide" after comment
            div_start = None
            for j in range(found_idx, min(found_idx + 5, len(lines))):
                if '<div class="country-section">' in lines[j] or '<div class="etl-master-guide"' in lines[j]:
                    div_start = j
                    break

            if div_start is not None:
                end_idx = find_section_end(lines, div_start)
            else:
                # Knowledge Hub Jobs has no container div - find end by next section
                if 'KNOWLEDGE HUB JOBS' in marker:
                    end_idx = None
                    for j in range(found_idx + 1, len(lines)):
                        if 'KNOWLEDGE HUB JD CARDS' in lines[j]:
                            end_idx = j - 1
                            break
                    if end_idx is None:
                        end_idx = len(lines) - 1
                else:
                    print(f'  WARNING: Could not find section div after: {marker}')
                    continue

            section_positions.append((found_idx, title, end_idx))
            print(f'  Found: "{title}" at lines {found_idx + 1}-{end_idx + 1}')

        elif search_type == 'div':
            # Find by div class/id
            for i, line in enumerate(lines):
                if marker in line:
                    end_idx = find_section_end(lines, i)
                    section_positions.append((i, title, end_idx))
                    print(f'  Found: "{title}" at lines {i + 1}-{end_idx + 1}')
                    break
            else:
                print(f'  WARNING: Could not find: {marker}')

    # Sort by line index DESCENDING so we insert from bottom to top
    section_positions.sort(key=lambda x: x[0], reverse=True)

    # Apply wrappers from bottom to top (to preserve line numbers)
    total_wrappers = 0
    for line_idx, title, end_idx in section_positions:
        # Opening wrapper: <div class="collapse-wrapper"><button>...</button><div class="collapse-content">
        open_html = f'<div class="collapse-wrapper"><button class="collapse-btn" onclick="toggleSection(this)">{title} <span class="arrow">&#9654;</span></button><div class="collapse-content">\n'
        # Closing wrapper: </div></div>
        close_html = '</div></div>\n'

        # Insert closing after end_idx
        lines.insert(end_idx + 1, close_html)
        # Insert opening before line_idx
        lines.insert(line_idx, open_html)
        total_wrappers += 1
        print(f'  Wrapped: "{title}" (lines {line_idx + 1}-{end_idx + 1})')

    # =====================================================
    # STEP 5: Write the modified file
    # =====================================================
    print(f'\nStep 5: Writing modified file...')
    with open(HTML_PATH, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    final_count = len(lines)
    print(f'\n{"="*60}')
    print(f'DONE!')
    print(f'Original line count: {original_count}')
    print(f'Final line count: {final_count}')
    print(f'Lines added: {final_count - original_count}')
    print(f'Sections wrapped: {total_wrappers}')
    print(f'File: {HTML_PATH}')
    print(f'{"="*60}')


if __name__ == '__main__':
    main()
