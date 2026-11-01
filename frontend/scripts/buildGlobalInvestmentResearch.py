# -*- coding: utf-8 -*-
"""Convert Global_Investment_Research_Starter.xlsx into a JS data module
consumed by the Trading Guides page (GlobalInvestingResearch section)."""
import json
import re
import openpyxl

SRC = r'D:\WorkSpace\Investments\Global_Investment_Research_Starter.xlsx'
OUT = r'D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React\frontend\src\data\globalInvestmentResearch.js'

GUIDE_RE = re.compile(r'^\d{2}\b')

def clean(v):
    if v is None:
        return ''
    return str(v).replace('\r\n', '\n').replace('\r', '\n').strip()

def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def main():
    wb = openpyxl.load_workbook(SRC, data_only=True)
    sheets = []
    meta = {'title': 'Global Investment Research Workbook',
            'subtitle': 'Research tracker and starter universe for India, USA and Singapore.',
            'readme': []}

    for ws in wb.worksheets:
        name = ws.title
        grid = []
        for r in ws.iter_rows(values_only=True):
            vals = [clean(c) for c in r]
            while vals and vals[-1] == '':
                vals.pop()
            grid.append(vals)

        # header row = first row with >= 2 non-empty cells
        header_idx = None
        for i, row in enumerate(grid):
            if sum(1 for c in row if c) >= 2:
                header_idx = i
                break
        if header_idx is None:
            header_idx = 0

        preface = [r[0] for r in grid[:header_idx] if r and r[0]]
        columns = grid[header_idx] if header_idx < len(grid) else []
        ncol = max(len(columns), 1)
        rows = []
        for r in grid[header_idx + 1:]:
            if not any(r):
                continue
            r = (r + [''] * ncol)[:ncol]
            rows.append(r)

        title = preface[0] if preface else name
        subtitle = preface[1] if len(preface) > 1 else ''

        if name.strip().lower() == 'read me':
            meta['readme'] = [[r[0], r[1] if len(r) > 1 else ''] for r in grid if any(r)]
            continue

        group = 'Beginner Guide 01-26' if GUIDE_RE.match(name) else 'Research Data & Templates'
        sheets.append({
            'id': slugify(name),
            'tab': name,
            'title': columns and (preface[0] if preface else name) or name,
            'preface': preface,
            'columns': columns,
            'rows': rows,
            'group': group,
        })

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('/* eslint-disable */\n')
        f.write('// Auto-generated from Global_Investment_Research_Starter.xlsx — do not edit by hand.\n')
        f.write('// Regenerate with scripts/buildGlobalInvestmentResearch.py\n\n')
        f.write('export const WORKBOOK_META = ' + json.dumps(meta, ensure_ascii=False, indent=2) + ';\n\n')
        f.write('export const SHEETS = ' + json.dumps(sheets, ensure_ascii=False, indent=2) + ';\n\n')
        f.write('export default SHEETS;\n')
    print('wrote', OUT)
    print('sheets:', len(sheets), 'total rows:', sum(len(s['rows']) for s in sheets))
    print('size(KB):', round(len(open(OUT, encoding='utf-8').read()) / 1024, 1))

if __name__ == '__main__':
    main()
