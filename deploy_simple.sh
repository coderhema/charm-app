#!/bin/bash
set -e

if [ -z "$CHARM_TOKEN" ]; then
    echo "❌ Error: CHARM_TOKEN environment variable not set"
    echo "Run: source ~/.secrets/charm.env"
    exit 1
fi

echo "📝 PALLY-WRITE DEPLOYMENT"
echo "=========================="

# Read files and base64 encode for JSON
MODULE=$(cat pally_write_module.js)
UI=$(cat pally_write_ui.js)

# Create payload using Python (available on most systems)
PAYLOAD=$(python3 -c "
import json
import sys

with open('pally_write_module.js', 'r', encoding='utf-8') as f:
    module_content = f.read()
with open('pally_write_ui.js', 'r', encoding='utf-8') as f:
    ui_content = f.read()

payload = {
    'module': module_content,
    'ui': ui_content,
    'label': 'Pally-Write - Voice notes with Deepgram transcription and Cerebras ASD-STE100 summarization'
}

print(json.dumps(payload))
" 2>/dev/null || python -c "
import json
import sys

module_content = '''$MODULE'''
ui_content = '''$UI'''

payload = {
    'module': module_content,
    'ui': ui_content,
    'label': 'Pally-Write - Voice notes with Deepgram transcription and Cerebras ASD-STE100 summarization'
}

print(json.dumps(payload))
")

echo "Creating new app..."
echo ""

RESPONSE=$(curl -s -X POST "https://charm.ing/app" \
  -H "Authorization: Bearer $CHARM_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" 2>&1)

# Check for success
if [[ "$RESPONSE" == *'"ok":true'* ]]; then
    # Extract URL - simple string extraction
    URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -z "$URL" ]; then
        URL=$(echo "$RESPONSE" | grep -o '"app":{[^}]*}' | grep -o '"url":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
    fi
    
    APP_ID=$(echo "$RESPONSE" | grep -o '"appId":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -z "$APP_ID" ]; then
        APP_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "pally-write")
    fi
    
    echo "✅ App created successfully!"
    echo "📝 App ID: $APP_ID"
    echo "🔗 URL: $URL"
    echo ""
    echo "📍 FEATURES:"
    echo "  • Record voice notes with live waveform"
    echo "  • Deepgram transcription (Nova-2)"
    echo "  • Cerebras summarization with ASD-STE100"
    echo "  • Notes feed with waveform thumbnails"
    echo "  • Air Notes library"
    echo ""
    echo "⚠️  IMPORTANT:"
    echo "  Set these secrets in App Settings:"
    echo "    • DEEPGRAM_KEY"
    echo "    • CEREBRAS_KEY"
    echo ""
    echo "🚀 Open: $URL"
    echo ""
else
    echo "❌ Create failed:"
    echo "$RESPONSE" | head -10
    exit 1
fi
