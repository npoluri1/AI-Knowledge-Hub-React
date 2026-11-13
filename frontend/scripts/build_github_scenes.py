import json
import os

# Load the JSON data
with open('src/data/app_github_urls.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Build GITHUB_SCENES from the map values
map_obj = data.get('map', {})
scenes = []
for key, entry in map_obj.items():
    repo = entry.get('github') or key
    title = entry.get('github') or key
    tagline = entry.get('channel') or entry.get('no') or ''
    scenes.append({
        'to': repo,
        'icon': '🐙',
        'key': repo,
        'title': title,
        'tagline': tagline,
        'sourceRow': entry.get('no') or '',
        'caption': title + ' · ' + repo,
        'badge': 'share',
        'source': 'src/data/github_url_map.json',
    })

# Generate JS array content
lines = ['const GITHUB_SCENES = [']
for s in scenes:
    lines.append('  {')
    lines.append('    to: ' + json.dumps(s['to']) + ',')
    lines.append('    icon: ' + json.dumps(s['icon']) + ',')
    lines.append('    key: ' + json.dumps(s['key']) + ',')
    lines.append('    title: ' + json.dumps(s['title']) + ',')
    lines.append('    tagline: ' + json.dumps(s['tagline']) + ',')
    lines.append('    sourceRow: ' + json.dumps(s['sourceRow']) + ',')
    lines.append('    caption: ' + json.dumps(s['caption']) + ',')
    lines.append('    badge: ' + json.dumps(s['badge']) + ',')
    lines.append('    source: ' + json.dumps(s['source']) + ',')
    lines.append('  }')
lines.append('];')
new_block = '\n'.join(lines)

# Verify the new block is valid JS by checking with node
print('=== NEW BLOCK ===')
print(new_block)
print('=== END NEW BLOCK ===')
print('Length:', len(new_block))
print('Number of scenes:', len(scenes))

# Write the new block to a temp file for inspection
with open('/tmp/new_github_scenes_block.js', 'w', encoding='utf-8') as f:
    f.write(new_block)
