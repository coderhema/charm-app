#!/usr/bin/env python
import json
import os
import sys

# Read files
with open('pally_write_module.js', 'r', encoding='utf-8') as f:
    module_content = f.read()
with open('pally_write_ui.js', 'r', encoding='utf-8') as f:
    ui_content = f.read()
    
payload = {
    'module': module_content,
    'ui': ui_content,
    'label': 'Pally-Write v2 - Voice & Text Notes'
}

os.environ['CHARM_TOKEN'] = 'chrm_user_iKsmpfknvBNu4rP859vMsBW4HXg0BsWaXHHxNVcp3zw'

import urllib.request
import urllib.error

data = json.dumps(payload).encode('utf-8')
headers = {
    'Authorization': 'Bearer ' + os.environ['CHARM_TOKEN'],
    'Content-Type': 'application/json'
}

req = urllib.request.Request('https://charm.ing/app', data=data, headers=headers, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode())
        print(json.dumps(result, indent=2))
except urllib.error.HTTPError as e:
    print('HTTP Error:', e.code)
    print('Response:', e.read().decode())
except Exception as e:
    print('Error:', str(e))
