#!/bin/bash

export CHARM_TOKEN='chrm_user_iKsmpfknvBNu4rP859vMsBW4HXg0BsWaXHHxNVcp3zw'

echo "📝 PALLY-WRITE DEPLOYMENT"
echo "=========================="

# Read files
MODULE=$(cat pally_write_module.js | sed 's/"/\\"/g')
UI=$(cat pally_write_ui.js | sed 's/"/\\"/g' | sed 's/\n/\\n/g')

# Create payload
echo "{\"module\": \"$MODULE\", \"ui\": \"$UI\", \"label\": \"Pally-Write - Voice notes\"}" > /tmp/payload.json

curl -s -X POST https://charm.ing/app \
  -H "Authorization: Bearer $CHARM_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/payload.json

echo ""
