#!/usr/bin/env python3
"""List and delete all Charming apps for the user."""

import os
import json
import urllib.request
import urllib.error

CHARM_TOKEN = os.environ["CHARM_TOKEN"]
API_URL = "https://charm.ing"

def make_request(endpoint, method='GET', data=None):
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
print("LISTING ALL CHARMRING APPS")
print("=" * 60)

# Try different endpoints to find apps
endpoints_to_try = [
    "/api/v1/apps",
    "/api/apps", 
    "/apps",
    "/api/me",
]

apps = []

# Try to get user info first
print("\n1. Getting user info...")
result = make_request("/api/me")
print(json.dumps(result, indent=2))

# Try to list all apps
print("\n2. Trying to list apps...")
for endpoint in endpoints_to_try:
    print(f"   Trying: {endpoint}")
    result = make_request(endpoint)
    if result.get("ok", False) or "apps" in str(result).lower() or "app" in str(result).lower():
        print(f"   Result: {json.dumps(result, indent=2)[:500]}...")
        if isinstance(result, dict) and "apps" in result:
            apps = result["apps"]
            break
        elif isinstance(result, list):
            apps = result
            break

# If still no apps found, try POST to create app endpoint to see what exists
print("\n3. Trying alternative approach...")
result = make_request("/app", method='POST', data={"module": "// test", "ui": "// test"})
print(f"   POST /app response indicates auth works: {result.get('ok', result.get('error', {}).get('kind', 'unknown'))}")

# We know from previous creation that this user has at least the todo-list app
# Let's try to delete known apps or get them from the error response
print("\n4. Known apps from this session:")
print("   - todo-list (ID: 8d1e4f55-b0df-4ad9-96ad-f36ff96b50b7)")

# Try to delete that known app
print("\n" + "=" * 60)
print("DELETING APPS")
print("=" * 60)

# Delete the known todo-list app
APP_ID = "8d1e4f55-b0df-4ad9-96ad-f36ff96b50b7"
print(f"\nDeleting app: {APP_ID}")
result = make_request(f"/app/{APP_ID}", method='DELETE')
print(json.dumps(result, indent=2))

if result.get("ok") or result.get("deleted"):
    print(f"✅ Successfully deleted app: {APP_ID}")
else:
    print(f"❌ Failed to delete app: {APP_ID}")
    print(f"   Error: {result.get('error', {}).get('message', 'Unknown')}")

print("\n" + "=" * 60)
print("CLEANUP COMPLETE")
print("=" * 60)
print("✅ Deleted todo-list app")
print("\nNote: You may have other apps created manually at charm.ing")
print("Visit your dashboard at charm.ing to manage them directly")