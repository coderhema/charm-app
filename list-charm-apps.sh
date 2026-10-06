#!/bin/bash

: "${CHARM_TOKEN:?Set CHARM_TOKEN environment variable first}"
API_URL="https://charm.ing/api"

echo "Attempting to list Charm apps..."
echo "Using token: ${CHARM_TOKEN:0:20}..."

# Try to list apps via HTTP API
curl -s -H "Authorization: Bearer $CHARM_TOKEN" \
     -H "Content-Type: application/json" \
     "$API_URL/apps" 2>/dev/null || echo "Failed to list apps"

