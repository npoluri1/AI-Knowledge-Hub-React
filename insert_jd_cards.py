"""Insert generated JD cards into HTML file"""
import re

# Read the current HTML file
with open(r'C:\Users\Legion\Desktop\AI_Engineer_Jobs_Global.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Read the generated JD cards
with open('generated_jd_cards.html', 'r', encoding='utf-8') as f:
    new_jd_cards = f.read()

# Find the Knowledge Hub JD cards section
# Pattern: from the start comment to the end of the div
pattern = r'<!-- ===================== KNOWLEDGE HUB JD CARDS \(100 with Design Patterns\) ===================== -->.*?</div>\s*\n\s*\n\s*<div class="note"'

match = re.search(pattern, html, re.DOTALL)
if match:
    start_pos = match.start()
    end_pos = match.end()
    
    # Create the replacement with new header
    new_section = f'''<!-- ===================== KNOWLEDGE HUB JD CARDS (2385 with Design Patterns) ===================== -->
<div class="country-section">
  <div class="country-header" style="background: linear-gradient(90deg, #7b2ff7, #00d4ff);">&#129504; KNOWLEDGE HUB - ALL 2385 AI JOBS with Design Patterns &amp; Architecture</div>

{new_jd_cards}

</div>'''
    
    # Replace the section
    html = html[:start_pos] + new_section + html[end_pos:]
    
    # Write the updated HTML file
    with open(r'C:\Users\Legion\Desktop\AI_Engineer_Jobs_Global.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Successfully replaced Knowledge Hub JD cards section")
    print(f"New section size: {len(new_section)} characters")
else:
    print("Could not find the Knowledge Hub JD cards section")
    # Try to find it manually
    marker = '<!-- ===================== KNOWLEDGE HUB JD CARDS'
    idx = html.find(marker)
    if idx >= 0:
        print(f"Found marker at position {idx}")
        # Find the end - look for the note div
        note_marker = '<div class="note" style="margin-top: 30px;">'
        end_idx = html.find(note_marker, idx)
        if end_idx >= 0:
            print(f"Found note div at position {end_idx}")
            # Replace from marker to just before the note div
            new_section = f'''<!-- ===================== KNOWLEDGE HUB JD CARDS (2385 with Design Patterns) ===================== -->
<div class="country-section">
  <div class="country-header" style="background: linear-gradient(90deg, #7b2ff7, #00d4ff);">&#129504; KNOWLEDGE HUB - ALL 2385 AI JOBS with Design Patterns &amp; Architecture</div>

{new_jd_cards}

</div>

'''
            html = html[:idx] + new_section + html[end_idx:]
            
            with open(r'C:\Users\Legion\Desktop\AI_Engineer_Jobs_Global.html', 'w', encoding='utf-8') as f:
                f.write(html)
            
            print(f"Successfully replaced using manual search")
        else:
            print("Could not find note div")
    else:
        print("Could not find marker")