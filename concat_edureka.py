"""Concatenate all Edureka source files into one combined output file."""
import os

BASE_DIR = r"D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React"
SUB_DIR = os.path.join(BASE_DIR, "Edurekha_docs")

FILES_IN_ORDER = [
    "edureka_supplementary.md",
    "edureka_generative_ai_masters_program.md",
    "edureka_enhance_c1.md",
    "edureka_enhance_c2.md",
    "edureka_enhance_c3.md",
    "edureka_enhance_c4.md",
    "edureka_enhance_c5.md",
    "edureka_global_projects.md",
    "edureka_phase_1_3.md",
    "edureka_phase_4_5.md",
    "edureka_phase_6_specialized.md",
    "edureka_system_prompt.md",
    "edureka_resource_map.md",
    "edureka_resource_map_supplement.md",
    "edureka_reference_library.md",
    "edureka_ai_career_survival_plan.md",
    "edureka_ai_tools_catalog.md",
]

OUTPUT_PATH = os.path.join(BASE_DIR, "edureka_generative_ai_masters_program_final.md")
SEPARATOR = "\n\n---\n\n\n"

parts = []
for fname in FILES_IN_ORDER:
    # Check main dir first, then Edurekha_docs subfolder
    fpath = os.path.join(BASE_DIR, fname)
    if not os.path.exists(fpath):
        fpath = os.path.join(SUB_DIR, fname)
    print(f"Reading: {fname} ...")
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    parts.append(content)
    print(f"  -> {len(content):,} chars, {content.count(chr(10)):,} lines")

combined = SEPARATOR.join(parts)
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(combined)

total_lines = combined.count("\n") + 1
print(f"\nDone! Output written to:\n  {OUTPUT_PATH}")
print(f"  Total size: {len(combined):,} chars, {total_lines:,} lines")
