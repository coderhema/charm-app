#!/usr/bin/env python
import json
import sys

# Read the module and UI files
with open('pally_write_module.js', 'r', encoding='utf-8') as f:
    module_content = f.read()

with open('pally_write_ui.js', 'r', encoding='utf-8') as f:
    ui_content = f.read()

# Create the payload
payload = {
    'module': module_content,
    'ui': ui_content
}

# Print as JSON for curl to consume
print(json.dumps(payload))
