#!/usr/bin/env python3
import json
import os
import urllib.request

# Read files
with open('pally_write_module.js', 'r', encoding='utf-8') as f:
    module_content = f.read()
with open('pally_write_ui.js', 'r', encoding='utf-8') as f:
    ui_content = f.read()
    
# Create payload
payload = {
    'module': module_content,
    'ui': ui_content,
    'label': 'Pally-Write - Voice notes with Deepgram transcription and Cerebras ASD-STE100 summarization'
}

# Get token
CHARM_TOKEN = os.environ.get('CHARM_TOKEN')
if not CHARM_TOKEN:
    print("❌ Error: CHARM_TOKEN environment variable not set")
    print("Run: source ~/.secrets/charm.env")
    exit(1)

print("📝 PALLY-WRITE DEPLOYMENT")
print("=" * 60)

# Make request
data = json.dumps(payload).encode('utf-8')
headers = {
    'Authorization': f'Bearer {CHARM_TOKEN}',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'curl/8.0'
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
        
        if result.get('ok'):
            app_id = result.get('appId') or 'pally-write'
            url = result.get('url') or 'unknown'
            
            print(f"\n✅ App created successfully!")
            print(f"📝 App ID: {app_id}")
            print(f"🔗 URL: {url}")
            
            print("\n📍 FEATURES:")
            print("  • Record voice notes with live waveform")
            print("  • Deepgram transcription (Nova-2)")
            print("  • Cerebras summarization with ASD-STE100")
            print("  • Notes feed with waveform thumbnails")
            print("  • Air Notes library")
            
            print("\n⚠️  IMPORTANT:")
            print("  Set these secrets in App Settings:")
            print("    • DEEPGRAM_KEY")
            print("    • CEREBRAS_KEY")
            
            print(f"\n🚀 Open: {url}")
        else:
            print(f"\n❌ Failed: {result.get('error', {})}")
            exit(1)
            
except Exception as e:
    print(f"\n❌ Error: {e}")
    exit(1)
