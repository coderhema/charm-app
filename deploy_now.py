#!/usr/bin/env python3
import json
import urllib.request
import os

print("Creating payload...")

with open('pally_write_module.js', 'r', encoding='utf-8') as f:
    module_content = f.read()
    
with open('pally_write_ui.js', 'r', encoding='utf-8') as f:
    ui_content = f.read()

payload = {
    'module': module_content,
    'ui': ui_content,
    'label': 'Pally-Write - Voice notes with Deepgram transcription and Cerebras ASD-STE100 summarization'
}

print(f"Module: {len(module_content)} chars")
print(f"UI: {len(ui_content)} chars")

CHARM_TOKEN = os.environ.get('CHARM_TOKEN')
if not CHARM_TOKEN:
    print("❌ Error: CHARM_TOKEN environment variable not set")
    exit(1)

print("\nDeploying...")
data = json.dumps(payload).encode('utf-8')
headers = {
    'Authorization': f'Bearer {CHARM_TOKEN}',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

req = urllib.request.Request(
    'https://charm.ing/app',
    data=data,
    headers=headers,
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        if 'url' in result:
            print(f"\n✅ Deployed successfully!")
            print(f"🔗 URL: {result.get('url')}")
            print(f"📝 Revision: {result.get('revision', 'unknown')}")
        else:
            print(f"\n✅ Response: {json.dumps(result, indent=2)[:200]}")
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("But payload.json was created - try manual curl:")
    print(f'curl -X POST "https://charm.ing/app" \\')
    print(f'  -H "Authorization: Bearer $CHARM_TOKEN" \\')
    print(f'  -H "Content-Type: application/json" \\')
    print(f'  -d @payload.json')

# Save payload for manual deployment
with open('payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)
print("\n📁 Also saved to payload.json")