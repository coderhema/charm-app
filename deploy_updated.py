#!/usr/bin/env python3
import json
import os

with open('pally_write_module.js', 'r', encoding='utf-8') as f:
    module_content = f.read()
    
with open('pally_write_ui.js', 'r', encoding='utf-8') as f:
    ui_content = f.read()

payload = {
    "module": module_content,
    "ui": ui_content,
    "label": "Pally-Write - Voice notes with Deepgram transcription and Cerebras ASD-STE100 summarization"
}

with open('updated_payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

print(f"Created updated_payload.json")
print(f"Module: {len(module_content)} chars")
print(f"UI: {len(ui_content)} chars")

# Quick test with minimal payload
test_payload = {
    "module": "export const manifest = {\"$schema\": \"https://charm.ing/schema/app-manifest/2026-07-31.json\", \"id\": \"pally-write\", \"meta\": {\"name\": \"Pally-Write\"}}; export const routes = [];",
    "ui": "console.log('test')",
    "label": "Test"
}

with open('test_payload.json', 'w', encoding='utf-8') as f:
    json.dump(test_payload, f)

print("\nAlso created test_payload.json for testing")