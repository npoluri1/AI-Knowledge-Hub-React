import os

base = r"D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React"

files = [
    "edureka_supplementary.md",
    "edureka_generative_ai_masters_program.md",
    "edureka_enhance_c1.md",
    "edureka_enhance_c2.md",
    "edureka_enhance_c3.md",
    "edureka_enhance_c4.md",
    "edureka_enhance_c5.md",
    "edureka_global_projects.md",
]

output = os.path.join(base, "Edurekha_docs/edureka_generative_ai_masters_program_final.md")

combined = []
for f in files:
    path = os.path.join(base, f)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as fh:
            combined.append(fh.read())
        combined.append("\n\n---\n\n")
        print(f"Added: {f} ({os.path.getsize(path)} bytes)")
    else:
        print(f"MISSING: {f}")

with open(output, "w", encoding="utf-8") as fh:
    fh.write("\n".join(combined))

total_size = os.path.getsize(output)
with open(output, "r", encoding="utf-8") as fh:
    lines = len(fh.readlines())

print(f"\nOutput: {output}")
print(f"Size: {total_size:,} bytes ({total_size/1024/1024:.1f} MB)")
print(f"Lines: {lines:,}")
