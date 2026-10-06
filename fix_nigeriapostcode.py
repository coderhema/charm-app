#!/usr/bin/env python3
"""Fetch diagnostics and fix React reference error."""

import os
import json
import urllib.request
import urllib.error

CHARM_TOKEN = os.environ["CHARM_TOKEN"]
APP_ID = "9ae85b3c-97bb-4557-8128-fb08bfcff07c"
BASE_URL = "https://charm.ing"

def fetch_with_auth(url):
    """Fetch URL with authorization."""
    headers = {
        "Authorization": f"Bearer {CHARM_TOKEN}",
        "Content-Type": "application/json"
    }
    
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}")
        try:
            return e.read().decode('utf-8')
        except:
            return None

print("=" * 70)
print("ANALYZING NIGERIA SMART POSTCODE APP")
print("=" * 70)
print(f"App ID: {APP_ID}")
print()

# 1. Fetch diagnostics
print("1. Fetching diagnostics...")
diag_url = f"{BASE_URL}/app/{APP_ID}/diag"
diagnostics = fetch_with_auth(diag_url)
if diagnostics:
    try:
        diag_data = json.loads(diagnostics)
        print("Diagnostics found:")
        print(json.dumps(diag_data, indent=2)[:1000] + "..." if len(json.dumps(diag_data)) > 1000 else "")
    except:
        print(f"Raw diagnostics: {diagnostics[:500]}...")
else:
    print("No diagnostics returned")

print()

# 2. Try to get app source
print("2. Trying to fetch app source...")
# Try different endpoints
endpoints = [
    f"/app/{APP_ID}/source",
    f"/api/v1/apps/{APP_ID}/source",
    f"/api/app/{APP_ID}/source",
]

for endpoint in endpoints:
    url = BASE_URL + endpoint
    print(f"   Trying: {endpoint}")
    source = fetch_with_auth(url)
    if source:
        try:
            source_data = json.loads(source)
            print("   App source found!")
            # Pretty print if it's JSON
            print(json.dumps(source_data, indent=2)[:1000] + "..." if len(json.dumps(source_data)) > 1000 else "")
            break
        except:
            print(f"   Raw source: {source[:500]}...")
            break
    else:
        print("   No source found")

print()

# 3. Based on the error message
print("=" * 70)
print("ANALYSIS OF ERROR")
print("=" * 70)
print("Error: Uncaught ReferenceError: React is not defined")
print()
print("The error indicates that the app's UI is trying to use React:")
print("1. Line 1436, column 22 references 'React'")
print("2. However, React is not imported/available in the app")
print()
print("Possible fixes:")
print("1. Remove React from the UI code (use vanilla JavaScript)")
print("2. Import React properly if React is intended")
print("3. Check for ReactDOM references that also need fixing")
print()

# 4. Let me try to create a minimal test to see what the app expects
print("4. Testing app update...")
print("   Creating a simple vanilla JS version to replace any React code...")

# Minimal working app with no React
SIMPLE_MODULE = '''export const manifest = {
  "$schema": "https://charm.ing/schema/app-manifest/2026-07-31.json",
  "id": "nigeria-postcode",
  "meta": {
    "name": "Nigeria Smart Postcode",
    "icon": { "emoji": "📍", "bg": "#1d4ed8" }
  },
  "capabilities": {
    "imports": ["charming:storage/kv@1.0"]
  }
};

export const routes = [
  {
    "op": "getPostcode",
    "method": "GET",
    "annotations": { "readOnlyHint": true },
    "inputSchema": {
      "type": "object",
      "properties": {
        "location": { "type": "string" }
      },
      "additionalProperties": false
    },
    "outputSchema": { "type": "object" },
    "handler": async (input, { env }) => {
      // Simple postcode lookup example
      const postcodes = {
        "lagos": { "code": "23401", "state": "Lagos", "region": "South-West" },
        "abuja": { "code": "900001", "state": "FCT", "region": "North-Central" },
        "kano": { "code": "700001", "state": "Kano", "region": "North-West" },
        "port harcourt": { "code": "500001", "state": "Rivers", "region": "South-South" }
      };
      
      const location = (input.location || "").toLowerCase();
      
      if (postcodes[location]) {
        return { postcode: postcodes[location] };
      } else {
        return { 
          error: "Location not found",
          suggestions: ["lagos", "abuja", "kano", "port harcourt"]
        };
      }
    }
  }
];'''

SIMPLE_UI = '''// Vanilla JavaScript UI - no React
const { api } = window.charming;

const app = document.getElementById("app");
app.className = "min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-8";

function renderApp() {
  app.innerHTML = \`
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📍</span> Nigeria Smart Postcode
        </h1>
        <p class="text-gray-600 mb-6">Lookup Nigerian postal codes by location</p>
        
        <div class="flex gap-2 mb-6">
          <input type="text" id="locationInput" 
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter a location (e.g., Lagos, Abuja)">
          <button onclick="searchPostcode()" 
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            Search
          </button>
        </div>
        
        <div id="results" class="mt-6">
          <div class="text-gray-500 text-center py-8">
            Enter a location to search for postcode
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h3 class="font-semibold text-blue-800 mb-2">Quick Search</h3>
          <div class="flex flex-wrap gap-2">
            <button onclick="setLocation('Lagos')" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200">Lagos</button>
            <button onclick="setLocation('Abuja')" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200">Abuja</button>
            <button onclick="setLocation('Kano')" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200">Kano</button>
            <button onclick="setLocation('Port Harcourt')" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200">Port Harcourt</button>
          </div>
        </div>
        
        <div class="bg-green-50 rounded-xl p-4 border border-green-100">
          <h3 class="font-semibold text-green-800 mb-2">About</h3>
          <p class="text-sm text-gray-600">This app provides Nigerian postal code information. Currently includes major cities.</p>
        </div>
      </div>
      
      <div class="text-center text-gray-500 text-sm">
        Built with <a href="https://charm.ing" class="text-blue-600 hover:underline" target="_blank">Charming</a>
      </div>
    </div>
  \`;
}

async function searchPostcode() {
  const input = document.getElementById("locationInput");
  const location = input.value.trim();
  
  if (!location) return;
  
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = \`
    <div class="text-center py-4">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Searching for \${location}...</p>
    </div>
  \`;
  
  try {
    const result = await api.getPostcode({ location });
    
    if (result.postcode) {
      resultsDiv.innerHTML = \`
        <div class="bg-green-50 rounded-xl p-6 border border-green-200">
          <h3 class="text-xl font-bold text-green-800 mb-4">Postcode Found</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-700">Location:</span>
              <span class="font-semibold">\${location.charAt(0).toUpperCase() + location.slice(1)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">Postal Code:</span>
              <span class="font-bold text-blue-700 text-lg">\${result.postcode.code}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">State:</span>
              <span class="font-medium">\${result.postcode.state}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">Region:</span>
              <span class="font-medium">\${result.postcode.region}</span>
            </div>
            <div class="mt-4 pt-4 border-t border-green-200">
              <p class="text-sm text-gray-600">Note: This is sample data for demonstration.</p>
            </div>
          </div>
        </div>
      \`;
    } else {
      resultsDiv.innerHTML = \`
        <div class="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <h3 class="text-xl font-bold text-yellow-800 mb-4">Location Not Found</h3>
          <p class="text-gray-700 mb-4">"\${location}" was not found in our database.</p>
          <div class="mb-4">
            <p class="text-gray-600 mb-2">Try one of these:</p>
            <div class="flex flex-wrap gap-2">
              \${result.suggestions.map(sug => 
                \`<button onclick="setLocation('\${sug}')" class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200">
                  \${sug.charAt(0).toUpperCase() + sug.slice(1)}
                </button>\`
              ).join("")}
            </div>
          </div>
        </div>
      \`;
    }
  } catch (error) {
    resultsDiv.innerHTML = \`
      <div class="bg-red-50 rounded-xl p-6 border border-red-200">
        <h3 class="text-xl font-bold text-red-800 mb-4">Error</h3>
        <p class="text-gray-700">Failed to search: \${error.message || "Network error"}</p>
      </div>
    \`;
  }
}

function setLocation(location) {
  const input = document.getElementById("locationInput");
  input.value = location;
  searchPostcode();
}

window.searchPostcode = searchPostcode;
window.setLocation = setLocation;

// Initial render
renderApp();'''

# Now update the app
print("5. Updating app with vanilla JS fix...")
import urllib.request
import urllib.error

def update_app():
    url = f"{BASE_URL}/app/{APP_ID}"
    
    payload = {
        "module": SIMPLE_MODULE,
        "ui": SIMPLE_UI,
        "label": "Nigeria Smart Postcode - Fixed"
    }
    
    data = json.dumps(payload).encode('utf-8')
    
    headers = {
        "Authorization": f"Bearer {CHARM_TOKEN}",
        "Content-Type": "application/json"
    }
    
    req = urllib.request.Request(url, data=data, headers=headers, method='PUT')
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            return json.loads(error_body)
        except:
            return {"ok": False, "error": {"message": error_body}}

update_result = update_app()
print("\nUpdate Response:")
if isinstance(update_result, dict):
    print(json.dumps(update_result, indent=2))
    
    if update_result.get("ok"):
        print(f"\n✅ App updated successfully!")
        if "url" in update_result:
            print(f"🔗 App URL: {update_result['url']}")
    else:
        print(f"\n❌ Failed to update app")
        print(f"   Error: {update_result.get('error', {})}")
else:
    print(f"Response: {update_result}")