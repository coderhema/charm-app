#!/bin/bash

export CHARM_TOKEN='chrm_user_iKsmpfknvBNu4rP859vMsBW4HXg0BsWaXHHxNVcp3zw'

echo "🚀 PALLY-WRITE DEPLOYMENT TO CHARMING"
echo "======================================"

# Read files as raw content
MODULE=$(cat pally_write_module.js)
UI=$(cat pally_write_ui.js)

# Create JSON payload properly using jq or manual JSON construction
PAYLOAD=$(cat <<EOF
{
  "module": $(echo "$MODULE" | jq -Rs .),
  "ui": $(echo "$UI" | jq -Rs .)
}
EOF
)

echo "📤 Sending deployment request..."

RESPONSE=$(curl -s -X POST https://charm.ing/app \
  -H "Authorization: Bearer $CHARM_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

echo "✅ Response:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"

echo ""
echo "🎉 Deployment complete!"
