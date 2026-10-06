#!/bin/bash

: "${CHARM_TOKEN:?Set CHARM_TOKEN environment variable first}"
API_URL="https://charm.ing"

echo "=== Charm App Deletion Script ==="
echo "Using token: ${CHARM_TOKEN:0:20}..."

# First, let's try to get user info to verify token
echo -e "\n1. Testing authentication..."
USER_INFO=$(curl -s -H "Authorization: Bearer $CHARM_TOKEN" \
     -H "Content-Type: application/json" \
     "$API_URL/api/me" 2>/dev/null)
     
if [ $? -eq 0 ] && [ -n "$USER_INFO" ]; then
    echo "✓ Authentication successful"
    echo "User info: $USER_INFO"
else
    echo "⚠ Could not get user info (might be normal)"
fi

# Try to list apps - check the OpenAPI spec pattern
echo -e "\n2. Listing apps (if any exist)..."
# Based on OpenAPI, try common patterns
APPS_LIST=$(curl -s -H "Authorization: Bearer $CHARM_TOKEN" \
     -H "Content-Type: application/json" \
     "$API_URL/api/apps" 2>/dev/null)
     
if [ $? -eq 0 ] && [ -n "$APPS_LIST" ]; then
    echo "Apps found:"
    echo "$APPS_LIST" | jq '.' 2>/dev/null || echo "$APPS_LIST"
    
    # If we can parse JSON and find app IDs, we could delete them
    APP_IDS=$(echo "$APPS_LIST" | jq -r '.apps[].id // .[].id // empty' 2>/dev/null)
    
    if [ -n "$APP_IDS" ]; then
        echo -e "\n3. Found app IDs:"
        echo "$APP_IDS"
        
        echo -e "\n4. Deleting apps..."
        for APP_ID in $APP_IDS; do
            echo "Deleting app: $APP_ID"
            DELETE_RESPONSE=$(curl -s -X DELETE -H "Authorization: Bearer $CHARM_TOKEN" \
                 -H "Content-Type: application/json" \
                 "$API_URL/api/app/$APP_ID" 2>/dev/null)
            echo "Response: $DELETE_RESPONSE"
        done
    else
        echo "No app IDs found in response"
    fi
else
    echo "No apps found or endpoint not accessible"
fi

echo -e "\n5. Alternative: Try to fetch recent activity to find apps..."
ACTIVITY=$(curl -s -H "Authorization: Bearer $CHARM_TOKEN" \
     -H "Content-Type: application/json" \
     "$API_URL/api/activity" 2>/dev/null)
     
if [ $? -eq 0 ] && [ -n "$ACTIVITY" ]; then
    echo "Activity found (might contain app references):"
    echo "$ACTIVITY" | jq '.' 2>/dev/null || echo "$ACTIVITY"
else
    echo "No recent activity found"
fi

echo -e "\n=== Script complete ==="
echo "Note: If no apps were deleted, you may need to:"
echo "1. Log into https://charm.ing"
echo "2. Manually delete apps from the dashboard"
echo "3. Or use the Charm CLI if available"

