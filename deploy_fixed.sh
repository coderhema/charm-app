#!/bin/bash
set -e

if [ -z "$CHARM_TOKEN" ]; then
    echo "❌ Error: CHARM_TOKEN environment variable not set"
    echo "Run: source ~/.secrets/charm.env"
    exit 1
fi

API_URL="https://charm.ing/app"

# Read files
MODULE=$(cat pally_write_module.js | jq -Rs .)
UI=$(cat pally_write_ui.js | jq -Rs .)

# Create JSON payload
PAYLOAD=$(jq -n \
  --arg module "$(cat pally_write_module.js)" \
  --arg ui "$(cat pally_write_ui.js)" \
  '{
    "module": $module,
    "ui": $ui,
    "label": "Pally-Write - Voice notes with Deepgram transcription and Cerebras ASD-STE100 summarization"
  }')

echo "📝 PALLY-WRITE DEPLOYMENT"
echo "=========================="

# First check if app exists
echo "Checking for existing app 'pally-write'..."
RESPONSE=$(curl -s -H "Authorization: Bearer $CHARM_TOKEN" "https://charm.ing/app/pally-write" 2>&1 || true)

# If app exists (404 means not found, anything else might be existing)
if [[ "$RESPONSE" == *"Not found"* ]] || [[ "$RESPONSE" == *"error code: 1010"* ]] || [[ "$RESPONSE" == *"Couldn't open"* ]]; then
    echo "App not found. Creating new app..."
    
    RESPONSE=$(curl -s -X POST "https://charm.ing/app" \
      -H "Authorization: Bearer $CHARM_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$PAYLOAD" 2>&1)
    
    if [[ "$RESPONSE" == *"\"ok\":true"* ]]; then
        APP_ID=$(echo "$RESPONSE" | jq -r '.appId // .app.id // "pally-write"')
        URL=$(echo "$RESPONSE" | jq -r '.url // .app.url // "unknown"')
        
        echo ""
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
    else
        echo ""
        echo "❌ Create failed: $RESPONSE"
        exit 1
    fi
else
    echo "App exists. Extracting etag for update..."
    # For now, let's just create a new app if update fails
    echo "Creating new app..."
    
    RESPONSE=$(curl -s -X POST "https://charm.ing/app" \
      -H "Authorization: Bearer $CHARM_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$PAYLOAD" 2>&1)
    
    if [[ "$RESPONSE" == *"\"ok\":true"* ]]; then
        APP_ID=$(echo "$RESPONSE" | jq -r '.appId // .app.id // "pally-write"')
        URL=$(echo "$RESPONSE" | jq -r '.url // .app.url // "unknown"')
        
        echo ""
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
        echo "🚀 Open: $URL"
    else
        echo ""
        echo "❌ Create failed: $RESPONSE"
        exit 1
    fi
fi
