#!/bin/bash

export CHARM_TOKEN='chrm_user_iKsmpfknvBNu4rP859vMsBW4HXg0BsWaXHHxNVcp3zw'

echo "🚀 PALLY-WRITE DEPLOYMENT TO CHARMING"
echo "======================================"

# Build payload using Node.js (which should be available)
PAYLOAD=$(node -e "
const fs = require('fs');
const module_content = fs.readFileSync('pally_write_module.js', 'utf-8');
const ui_content = fs.readFileSync('pally_write_ui.js', 'utf-8');
console.log(JSON.stringify({
  module: module_content,
  ui: ui_content
}));
")

if [ -z "$PAYLOAD" ]; then
  echo "❌ Failed to generate payload"
  exit 1
fi

echo "📤 Sending deployment request..."

RESPONSE=$(curl -s -X POST https://charm.ing/app \
  -H "Authorization: Bearer $CHARM_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

echo "✅ Response:"
echo "$RESPONSE"

# Check if successful
if echo "$RESPONSE" | grep -q '"ok":true'; then
  echo ""
  echo "✨ Deployment successful! Pally-Write is now live on charming!"
else
  echo ""
  echo "⚠️ Deployment response received (check above for details)"
fi
