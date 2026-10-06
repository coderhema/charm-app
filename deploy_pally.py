#!/usr/bin/env python3
"""Deploy Pally-Write app to Charming."""

import os
import json
import urllib.request
import urllib.error

CHARM_TOKEN = os.environ.get("CHARM_TOKEN")
if not CHARM_TOKEN:
    print("❌ Error: CHARM_TOKEN environment variable not set")
    print("Run: source ~/.secrets/charm.env")
    exit(1)

API_URL = "https://charm.ing/app"

# Read module
with open("pally_write_module.js", encoding="utf-8") as f:
    module_js = f.read()

# Read UI
with open("pally_write_ui.js", encoding="utf-8") as f:
    ui_js = f.read()

def update_app(app_id, module, ui, etag=None):
    """Update existing app."""
    update_url = f"{API_URL}/{app_id}"
    
    payload = {
        "module": module,
        "ui": ui,
        "label": "Pally-Write - Voice notes with Deepgram transcription and Cerebras ASD-STE100 summarization"
    }
    
    data = json.dumps(payload).encode('utf-8')
    
    headers = {
        "Authorization": f"Bearer {CHARM_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "curl/8.0"
    }
    if etag:
        headers["If-Match"] = etag
    
    req = urllib.request.Request(
        update_url,
        data=data,
        headers=headers,
        method='PUT'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            return json.loads(error_body)
        except:
            return {"ok": False, "error": {"message": error_body}}

def create_app(module, ui):
    """Create new app."""
    payload = {
        "module": module,
        "ui": ui,
        "label": "Pally-Write - Voice notes with Deepgram transcription and Cerebras ASD-STE100 summarization"
    }
    
    data = json.dumps(payload).encode('utf-8')
    
    headers = {
        "Authorization": f"Bearer {CHARM_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "curl/8.0"
    }
    
    req = urllib.request.Request(
        API_URL,
        data=data,
        headers=headers,
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            return json.loads(error_body)
        except:
            return {"ok": False, "error": {"message": error_body}}

def get_app_info(app_id):
    """Get app info including etag."""
    url = f"{API_URL}/{app_id}"
    
    headers = {
        "Authorization": f"Bearer {CHARM_TOKEN}",
        "Accept": "application/json",
        "User-Agent": "curl/8.0"
    }
    
    req = urllib.request.Request(
        url,
        headers=headers,
        method='GET'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            return json.loads(error_body)
        except:
            return {"ok": False, "error": {"message": error_body}}

# Main deployment logic
print("=" * 60)
print("📝 PALLY-WRITE DEPLOYMENT")
print("=" * 60)

APP_ID = "pally-write"

# Check if app exists
print(f"\nChecking for existing app '{APP_ID}'...")
app_info = get_app_info(APP_ID)

if app_info.get("ok"):
    etag = app_info.get("app", {}).get("etag")
    print(f"Found existing app with etag: {etag}")
    print("\n🔄 Updating app...")
    result = update_app(APP_ID, module_js, ui_js, etag)
else:
    print(f"App not found or error: {app_info.get('error', {}).get('message', 'unknown')}")
    print("\n🆕 Creating new app...")
    result = create_app(module_js, ui_js)

if result.get("ok"):
    app_id = result.get("app", {}).get("id") or result.get("appId")
    url = result.get("app", {}).get("url") or result.get("url")
    
    print("\n" + "=" * 60)
    print("✅ SUCCESS!")
    print("=" * 60)
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
    print("\n❌ DEPLOYMENT FAILED")
    print(f"Error: {result.get('error', {})}")
    exit(1)
