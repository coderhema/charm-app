#!/usr/bin/env python3
import os
import json
import urllib.request
import urllib.error

CHARM_TOKEN = os.environ["CHARM_TOKEN"]
APP_ID = "9ae85b3c-97bb-4557-8128-fb08bfcff07c"
URL = f"https://charm.ing/app/{APP_ID}"

# Minimal working module
module_js = """export const manifest = {
    \"$schema\": \"https://charm.ing/schema/app-manifest/2026-07-31.json\",
    \"id\": \"nigeria-postcode\",
    \"meta\": { \"name\": \"Nigeria Postcode NLP\", \"icon\": { \"emoji\": \"📍\", \"bg\": \"#1d4ed8\" } },
    \"capabilities\": { \"imports\": [\"charming:storage/kv@1.0\"] }
};

export const routes = [
    { \"op\": \"search\", \"method\": \"GET\", \"handler\": async () => ({ results: [\"23401\", \"900001\", \"500001\"] }) }
];"""

# Brex-styled UI with Ember (#ff5900) accent
ui_js = """const api = window.charming.api(\"nigeria-postcode\");
const app = document.getElementById(\"app\");

payload = {"module": module_js, "ui": ui_js}

print("Sending update...")
req = urllib.request.Request(URL,
    data=json.dumps(payload).encode('utf-8'),
    headers={"Authorization": f"Bearer {CHARM_TOKEN}", "Content-Type": "application/json"},
    method='PUT')

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print("SUCCESS!")
        print(f"URL: {result.get('url', 'N/A')}")
        print(f"ID: {result.get('id', APP_ID)}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Body: {e.read().decode('utf-8')[:500]}")