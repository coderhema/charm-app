#!/usr/bin/env python3
import json
import os

print("Creating full payload.json from actual files...")

with open('pally_write_module.js', 'r', encoding='utf-8') as f:
    module_content = f.read()
    
with open('pally_write_ui.js', 'r', encoding='utf-8') as f:
    ui_content = f.read()

payload = {
    "module": module_content,
    "ui": ui_content,
    "label": "Pally-Write - Voice notes with Deepgram transcription and Cerebras ASD-STE100 summarization"
}

with open('full_payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

print("✅ Created full_payload.json")
print(f"Module size: {len(module_content)} chars")
print(f"UI size: {len(ui_content)} chars")