#!/usr/bin/env python3
"""Create Nigeria Natural Language → Postcode Tool."""

import os
import json
import urllib.request

CHARM_TOKEN = os.environ["CHARM_TOKEN"]
APP_ID = "9ae85b3c-97bb-4557-8128-fb08bfcff07c"
URL = f"https://charm.ing/app/{APP_ID}"

# Backend module lives in nipost_module.js (Cerebras NLP -> NIPOST lookup, keys stay in Charm secrets)
with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "nipost_module.js"), encoding="utf-8") as f:
    module_js = f.read()

# UI lives in nipost_ui.js (mobile-first, search button inside the search bar)
with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "nipost_ui.js"), encoding="utf-8") as f:
    ui_js = f.read()

payload = {
    "module": module_js,
    "ui": ui_js
}

print("="*60)
print("🇳🇬 NIGERIA POSTCODE NLP TOOL")
print("="*60)

req = urllib.request.Request(URL,
    data=json.dumps(payload).encode('utf-8'),
    headers={
        "Authorization": f"Bearer {CHARM_TOKEN}",
        "Content-Type": "application/json"
    },
    method='PUT')

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print("✅ App updated successfully!")
        print(f"🔗 URL: {result.get('url', 'Check dashboard')}")
        print("\n📍 FEATURES:")
        print("  • Natural language search (e.g., 'NTA road Fabian Hotel Ado Ekiti')")
        print("  • Sample database with major cities")
        print("  • Ready for NIPOST API integration")
        print("\n💡 HOW TO TEST:")
        print("  1. Open the app URL")
        print("  2. Click any example OR type your own")
        print("  3. Click 'Search Postcode'")
        print("\n🚀 EXAMPLE INPUTS:")
        print('  • "NTA road back of Fabian Hotel Ado Ekiti" → 360001')
        print('  • "yellow house opposite mosque in Wuse 2" → 900211')
        print('  • "Mile 1 Market Port Harcourt" → 500001')
        print('  • "Lagos Ikeja GRA" → 23401')  
except Exception as e:
    print(f"❌ Error: {e}")
