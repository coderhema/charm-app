#!/usr/bin/env python3
"""Delete Nigeria Smart Postcode app from Charming."""

import os
import json
import urllib.request
import urllib.error

CHARM_TOKEN = os.environ["CHARM_TOKEN"]
API_URL = "https://charm.ing"

# The app ID from the user
APP_ID = "9ae85b3c-97bb-4557-8128-bf08bfcff07c"

def make_request(endpoint, method='DELETE', data=None):
    """Make an HTTP request to Charming API."""
    url = f"{API_URL}{endpoint}"
    
    headers = {
        "Authorization": f"Bearer {CHARM_TOKEN}",
        "Content-Type": "application/json"
    }
    
    req_data = json.dumps(data).encode('utf-8') if data else None
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            return json.loads(error_body)
        except:
            return {"ok": False, "error": {"message": error_body}}

print("=" * 60)
print("DELETING NIGERIA SMART POSTCODE APP")
print("=" * 60)
print(f"App ID: {APP_ID}")
print()

result = make_request(f"/app/{APP_ID}", method='DELETE')
print("Response:")
print(json.dumps(result, indent=2))
print()

if result.get("ok"):
    print("✅ Successfully deleted Nigeria Smart Postcode app!")
else:
    print(f"❌ Failed to delete app")
    print(f"   Error: {result.get('error', {})}")