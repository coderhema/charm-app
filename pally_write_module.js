export const manifest = {
  "$schema": "https://charm.ing/schema/app-manifest/2026-07-31.json",
  "id": "pally-write",
  "meta": {
    "name": "Pally-Write",
    "icon": { "emoji": "📝", "bg": "#512906" }
  },
  "capabilities": {
    "imports": ["charming:storage/kv@1.0", "charming:secrets/fetch@1.0", "charming:network/fetch@1.0", "charming:storage/blob@1.0", "charming:browser/storage@1.0"]
  },
  "permissions": {
    "server": {
      "fetch": ["https://api.deepgram.com", "https://api.cerebras.ai"]
    }
  }
};

const DEEPGRAM_URL = "https://api.deepgram.com/v1/listen";
const CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions";
const CEREBRAS_MODEL = "gpt-oss-120b";

const SUMMARY_PROMPT = [
  "Summarize the following transcript using Simplified Technical English (ASD-STE100).",
  "Rules:",
  "- Use only the approved vocabulary from ASD-STE100.",
  "- Keep sentences short and clear.",
  "- Use maximum 20 words per sentence.",
  "- Remove ambiguity and replace complex words with simple alternatives.",
  "- Output only the summarized text."
].join("\n");

function clean(s, max) {
  return String(s == null ? "" : s).replace(/\s+/g, " ").trim().slice(0, max);
}

async function readJson(res, label) {
  let body = null;
  try { body = await res.json(); } catch (e) { /* non-JSON body */ }
  if (!res.ok) {
    const detail = body && (body.error && (body.error.message || body.error.code || body.error) || body.message);
    throw new Error(label + " returned HTTP " + res.status + (detail ? ": " + clean(typeof detail === "string" ? detail : JSON.stringify(detail), 160) : ""));
  }
  return body;
}

async function transcribeWithDeepgram(env, audioBytes, enableDiarization = true) {
  try {
    // audioBytes is a Uint8Array from concatenated MediaRecorder chunks
    // Each chunk is a WebM fragment; we need to send as raw audio and let Deepgram detect format
    const blob = new Blob([audioBytes], { type: "audio/webm" });
    console.log("Deepgram: Received audio of", audioBytes.length, "bytes, blob size:", blob.size);
    
    // Check if audio has valid WebM header
    if (audioBytes.length > 4) {
      const header = new Uint8Array(audioBytes.slice(0, 4));
      const headerHex = Array.from(header).map(b => b.toString(16).padStart(2, '0')).join('');
      console.log("Audio file header:", headerHex, "(WebM starts with 1a45dfa3)");
    }
    
    // Build URL with diarization if enabled
    // Use nova-2-general model which is better for multi-speaker scenarios
    let url = DEEPGRAM_URL + "?model=nova-2-general&smart_format=true&punctuate=true&profanity_filter=false";
    if (enableDiarization) {
      // Enable diarization with higher sensitivity
      url += "&diarize=true&diarize_version=2023-12-06&utterances=true&detect_language=true";
    }
    
    const res = await env.fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Token {{secret:DEEPGRAM_KEY}}",
        "Content-Type": "audio/webm",
        "Accept": "application/json"
      },
      body: blob
    });
    
    const body = await readJson(res, "Deepgram");
    console.log("Deepgram full response:", JSON.stringify(body, null, 2));
    
    if (!body?.results?.channels?.[0]?.alternatives?.[0]) {
      console.log("Deepgram response format unexpected. Full response:", JSON.stringify(body));
      if (body?.results?.channels?.[0]) {
        console.log("Has channels but no alternatives. Alternatives:", body.results.channels[0].alternatives);
      }
      // Check if there's a top-level error
      if (body?.error) {
        console.log("Deepgram error:", body.error);
      }
      const fallbackTranscript = body?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "[No speech detected]";
      return { transcript: fallbackTranscript, speakers: [] };
    }
    
    const alternative = body.results.channels[0].alternatives[0];
    const transcript = alternative.transcript || "";
    const paragraphs = alternative.paragraphs;
    
    let speakers = [];
    let formattedTranscript = transcript;
    
    if (enableDiarization && paragraphs?.paragraphs && paragraphs.paragraphs.length > 0) {
      const speakerMap = {};
      const speakerColors = ['#2563eb', '#dc2626', '#059669', '#7c3aed', '#ea580c'];
      
      // Collect unique speakers from paragraphs
      paragraphs.paragraphs.forEach(para => {
        const speaker = para.speaker;
        if (speaker !== undefined && speaker !== null && !speakerMap[speaker]) {
          const speakerIndex = Object.keys(speakerMap).length;
          speakerMap[speaker] = {
            id: speaker,
            index: speakerIndex,
            color: speakerColors[speakerIndex % speakerColors.length]
          };
        }
      });
      
      speakers = Object.values(speakerMap).sort((a, b) => a.id - b.id);
      
      // Format transcript with speaker labels
      formattedTranscript = paragraphs.paragraphs.map(para => {
        const speakerId = para.speaker;
        if (speakerId === undefined || speakerId === null) {
          return para.sentences?.map(s => s.text).join(' ') || '';
        }
        const speakerNum = speakerId + 1;
        const text = para.sentences?.map(s => s.text).join(' ') || '';
        return text ? `[Speaker ${speakerNum}]: ${text}` : '';
      }).filter(line => line.length > 0).join('\n\n');
    } else if (enableDiarization) {
      console.log("Diarization enabled but no speaker data");
    }
    
    return { 
      transcript: formattedTranscript || transcript || "[No speech detected]", 
      speakers: speakers,
      rawTranscript: transcript
    };
  } catch (e) {
    console.log("Deepgram error:", e.message);
    // Return fallback instead of throwing
    return { transcript: `[Transcription failed: ${e.message.slice(0, 50)}]`, speakers: [] };
  }
}

async function summarizeWithCerebras(env, text) {
  const res = await env.fetch(CEREBRAS_URL, {
    method: "POST",
    headers: {
      "Authorization": "Bearer {{secret:CEREBRAS_KEY}}",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: CEREBRAS_MODEL,
      messages: [
        { role: "system", content: SUMMARY_PROMPT },
        { role: "user", content: text }
      ],
      temperature: 0.2,
      max_completion_tokens: 800
    })
  });
  const body = await readJson(res, "Cerebras");
  return body?.choices?.[0]?.message?.content || "";
}

export const routes = [
  {
    "op": "listNotes",
    "method": "GET",
    "annotations": { "readOnlyHint": true },
    "outputSchema": { "type": "array" },
    "handler": async (_input, { env }) => (await env.storage.get("notes")) ?? []
  },
  {
    "op": "getNote",
    "method": "GET",
    "inputSchema": {
      "type": "object",
      "required": ["id"],
      "properties": { "id": { "type": "string" } },
      "additionalProperties": false
    },
    "annotations": { "readOnlyHint": true },
    "handler": async (input, { env }) => {
      const notes = (await env.storage.get("notes")) ?? [];
      return notes.find(n => n.id === input.id) || null;
    }
  },
  {
    "op": "createNote",
    "method": "POST",
    "inputSchema": {
      "type": "object",
      "required": ["title"],
      "properties": {
        "title": { "type": "string" },
        "content": { "type": "string" },
        "hasAudio": { "type": "boolean" },
        "audioKey": { "oneOf": [{"type": "string"}, {"type": "null"}] },
        "duration": { "type": "number" },
        "starred": { "type": "boolean" }
      },
      "additionalProperties": false
    },
    "handler": async (input, { env }) => {
      const notes = (await env.storage.get("notes")) ?? [];
      const note = {
        id: crypto.randomUUID(),
        title: clean(input.title, 200),
        content: clean(input.content || "", 10000),
        hasAudio: !!input.hasAudio,
        audioKey: input.audioKey || "",
        duration: input.duration || 0,
        starred: !!input.starred,
        createdAt: new Date().toISOString()
      };
      notes.unshift(note);
      await env.storage.put("notes", notes);
      return note;
    }
  },
  {
    "op": "updateNote",
    "method": "POST",
    "inputSchema": {
      "type": "object",
      "required": ["id"],
      "properties": {
        "id": { "type": "string" },
        "title": { "type": "string" },
        "content": { "type": "string" },
        "hasAudio": { "type": "boolean" },
        "audioKey": { "oneOf": [{"type": "string"}, {"type": "null"}] },
        "duration": { "type": "number" },
        "starred": { "type": "boolean" }
      },
      "additionalProperties": false
    },
    "handler": async (input, { env }) => {
      const notes = (await env.storage.get("notes")) ?? [];
      const idx = notes.findIndex(n => n.id === input.id);
      if (idx === -1) throw new Error("Note not found");
      const existing = notes[idx];
      const updated = {
        ...existing,
        title: input.title !== undefined ? clean(input.title, 200) : existing.title,
        content: input.content !== undefined ? clean(input.content, 10000) : existing.content,
        hasAudio: input.hasAudio !== undefined ? !!input.hasAudio : existing.hasAudio,
        audioKey: input.audioKey !== undefined ? (input.audioKey || "") : existing.audioKey,
        duration: input.duration !== undefined ? input.duration : existing.duration,
        starred: input.starred !== undefined ? !!input.starred : existing.starred
      };
      notes[idx] = updated;
      await env.storage.put("notes", notes);
      return updated;
    }
  },
  {
    "op": "deleteNote",
    "method": "POST",
    "inputSchema": {
      "type": "object",
      "required": ["id"],
      "properties": { "id": { "type": "string" } },
      "additionalProperties": false
    },
    "handler": async (input, { env }) => {
      const notes = (await env.storage.get("notes")) ?? [];
      const idx = notes.findIndex(n => n.id === input.id);
      if (idx === -1) throw new Error("Note not found");
      const removed = notes.splice(idx, 1)[0];
      if (removed.audioKey) {
        try { await env.assets.delete(removed.audioKey); } catch (e) { /* ignore */ }
      }
      await env.storage.put("notes", notes);
      return { deleted: true, id: input.id };
    }
  },
  {
    "op": "transcribe",
    "method": "POST",
    "inputSchema": {
      "type": "object",
      "required": ["audioBase64"],
      "properties": { 
        "audioBase64": { "type": "string" },
        "diarize": { "type": "boolean" }
      },
      "additionalProperties": false
    },
    "handler": async (input, { env }) => {
      const binary = Uint8Array.from(atob(input.audioBase64), c => c.charCodeAt(0));
      const result = await transcribeWithDeepgram(env, binary, input.diarize !== false);
      const { transcript, speakers, rawTranscript } = result;
      return { 
        transcript,
        speakers,
        rawTranscript,
        success: !transcript.startsWith('[Transcription failed') && !transcript.startsWith('[No speech')
      };
    }
  },
  {
    "op": "summarize",
    "method": "POST",
    "inputSchema": {
      "type": "object",
      "required": ["text"],
      "properties": { "text": { "type": "string" } },
      "additionalProperties": false
    },
    "handler": async (input, { env }) => {
      const summary = await summarizeWithCerebras(env, clean(input.text, 15000));
      return { summary };
    }
  },
  {
    "op": "uploadAudio",
    "method": "POST",
    "inputSchema": {
      "type": "object",
      "required": ["audioBase64", "key"],
      "properties": {
        "audioBase64": { "type": "string" },
        "key": { "type": "string" }
      },
      "additionalProperties": false
    },
    "handler": async (input, { env }) => {
      try {
        const binary = Uint8Array.from(atob(input.audioBase64), c => c.charCodeAt(0));
        
        // Validate audio data
        if (binary.length === 0) {
          throw new Error("No audio data provided");
        }
        
        // Store a placeholder text file with metadata instead of binary
        const metadata = {
          key: input.key,
          size: binary.length,
          timestamp: new Date().toISOString(),
          note: "Audio stored in browser, not in server"
        };
        
        // Create a text file instead of audio
        const metadataText = JSON.stringify(metadata);
        await env.assets.put(input.key, metadataText, { contentType: "application/json" });
        const url = env.assets.url(input.key);
        
        return { 
          key: input.key, 
          url, 
          success: true,
          size: binary.length,
          storedAsJson: true
        };
      } catch (e) {
        console.log("Audio upload failed in handler:", e.message);
        // Fallback: return fake URL
        return { 
          key: input.key, 
          url: `https://example.com/audio/${input.key}`, 
          success: false,
          error: e.message,
          fallback: true
        };
      }
    }
  },
  {
    "op": "getAudioUrl",
    "method": "GET",
    "inputSchema": {
      "type": "object",
      "required": ["key"],
      "properties": { "key": { "type": "string" } },
      "additionalProperties": false
    },
    "annotations": { "readOnlyHint": true },
    "handler": async (input, { env }) => {
      const url = env.assets.url(input.key);
      return { key: input.key, url };
    }
  }
];

const capabilities = {
  ambient: false,
  stream: false,
  realtime: false
};

export default { manifest, routes, capabilities };
