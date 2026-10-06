export const manifest = {
  "$schema": "https://charm.ing/schema/app-manifest/2026-07-31.json",
  "id": "nigeria-postcode",
  "meta": {
    "name": "Nigeria Postcode (NLP)",
    "icon": { "emoji": "📍", "bg": "#1d4ed8" }
  },
  "capabilities": {
    "imports": ["charming:storage/kv@1.0", "charming:secrets/fetch@1.0"]
  },
  "permissions": {
    "server": {
      "fetch": ["https://api.cerebras.ai", "https://api.postcode.gov.ng"]
    }
  }
};

const CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions";
const NIPOST_BASE = "https://api.postcode.gov.ng";
const MODEL = "gpt-oss-120b";

// Compact NDAPS postcode, e.g. EK01A03FK01 or EK-01-A03-FK-01
const POSTCODE_RE = /\b([A-Z]{2})[\s-]?(\d{2})[\s-]?([A-Z0-9]{3})[\s-]?([A-Z]{2})[\s-]?(\d{2})\b/i;

const RADIUS_BY_PRECISION = { building: 100, landmark: 250, street: 400, area: 800, city: 1500 };

const SYSTEM_PROMPT = [
  "You turn a free-text description of a place in Nigeria into structured JSON for a postcode lookup.",
  "Reply with ONE JSON object only, no prose, with these keys:",
  "state (string|null), lga (string|null), area (string|null), landmark (string|null),",
  "place (string: a clean, well-formed address like 'Fabian Hotel, NTA Road, Ado Ekiti, Ekiti State, Nigeria'),",
  "lat (number|null), lng (number|null): your best estimate of the coordinates of the most specific place named,",
  "precision ('building'|'landmark'|'street'|'area'|'city'): how specific the description is,",
  "confidence (number 0..1): how sure you are about the coordinates,",
  "note (string|null): one short sentence if the description is ambiguous or you had to guess.",
  "Rules: Fix spelling and expand abbreviations (PH = Port Harcourt, FCT = Abuja). Never invent coordinates for",
  "a place you do not recognise: set lat and lng to null and explain in note. If only a town or city is given,",
  "use precision 'city'. Coordinates must be inside Nigeria."
].join(" ");

function clean(s, max) {
  return String(s == null ? "" : s).replace(/\s+/g, " ").trim().slice(0, max);
}

function isNum(n) {
  return typeof n === "number" && isFinite(n);
}

function inNigeria(lat, lng) {
  return isNum(lat) && isNum(lng) && lat >= 4 && lat <= 14 && lng >= 2.6 && lng <= 14.8;
}

function toCompact(code) {
  return String(code || "").replace(/[\s-]/g, "").toUpperCase();
}

function pretty(code) {
  const c = toCompact(code);
  if (c.length !== 11 && c.length !== 12) return String(code || "");
  // AA 99 H77 BB 55
  return c.slice(0, 2) + "-" + c.slice(2, 4) + "-" + c.slice(4, 7) + "-" + c.slice(7, 9) + "-" + c.slice(9);
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

async function parseWithCerebras(env, text) {
  let res;
  try {
    res = await env.fetch(CEREBRAS_URL, {
      method: "POST",
      headers: {
        "Authorization": "Bearer {{secret:CEREBRAS_KEY}}",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text }
        ],
        temperature: 0,
        reasoning_effort: "low",
        max_completion_tokens: 1200,
        response_format: { type: "json_object" }
      })
    });
  } catch (e) {
    throw new Error("Could not reach the AI service (is the CEREBRAS_KEY secret set?)");
  }
  const body = await readJson(res, "AI service");
  const content = body && body.choices && body.choices[0] && body.choices[0].message && body.choices[0].message.content;
  if (!content) throw new Error("The AI service returned an empty answer");
  let parsed;
  try {
    const m = String(content).match(/\{[\s\S]*\}/);
    parsed = JSON.parse(m ? m[0] : content);
  } catch (e) {
    throw new Error("The AI service returned an unreadable answer");
  }
  return {
    state: parsed.state || null,
    lga: parsed.lga || null,
    area: parsed.area || null,
    landmark: parsed.landmark || null,
    place: clean(parsed.place, 200) || null,
    lat: isNum(parsed.lat) ? parsed.lat : null,
    lng: isNum(parsed.lng) ? parsed.lng : null,
    precision: RADIUS_BY_PRECISION[parsed.precision] ? parsed.precision : "area",
    confidence: isNum(parsed.confidence) ? Math.max(0, Math.min(1, parsed.confidence)) : 0.5,
    note: clean(parsed.note, 200) || null
  };
}

async function nipostGet(env, path) {
  let res;
  try {
    res = await env.fetch(NIPOST_BASE + path, { headers: { "X-API-Key": "{{secret:NIPOST_KEY}}" } });
  } catch (e) {
    throw new Error("Could not reach NIPOST (is the NIPOST_KEY secret set?)");
  }
  return readJson(res, "NIPOST");
}

function listFrom(body) {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== "object") return [];
  const d = body.data !== undefined ? body.data : body;
  if (Array.isArray(d)) return d;
  for (const k of ["results", "units", "items", "nearby"]) {
    if (Array.isArray(d[k])) return d[k];
  }
  return [];
}

// Demo fallback: used ONLY when NIPOST answers with an empty result.
// Codes come from NIPOST's own docs (docs.postcode.gov.ng). They are examples, not live lookups,
// and every result built from them is flagged sample:true so the UI can label it.
const DEMO_FALLBACK = true;
const SAMPLE_PLACES = [
  {
    name: "Ado Ekiti", lat: 7.6210, lng: 5.2214, radius_km: 25,
    units: [{ code: "EK-01-A03-FK-01", display: "NTA Road, back of Fabian Hotel, Ado Ekiti (NIPOST docs example)" }]
  },
  {
    name: "Abuja (FCT)", lat: 9.0765, lng: 7.3986, radius_km: 40,
    units: [
      { code: "FC-01-A01-KP-27", display: "Public building, FCT (NIPOST sandbox example)" },
      { code: "FC-01-A01-LR-01", display: "Public building, FCT (NIPOST sandbox example)" },
      { code: "FC-01-A01-MH-01", display: "Public building, FCT (NIPOST sandbox example)" }
    ]
  }
];

function distanceKm(lat1, lng1, lat2, lng2) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sampleUnits(units, placeName) {
  return units.map(function (u) {
    return { postcode: pretty(u.code), compact: toCompact(u.code), display: u.display, distance_m: null, sample: true, sample_place: placeName };
  });
}

function sampleNear(lat, lng) {
  if (!DEMO_FALLBACK) return null;
  for (let i = 0; i < SAMPLE_PLACES.length; i++) {
    const p = SAMPLE_PLACES[i];
    if (distanceKm(lat, lng, p.lat, p.lng) <= p.radius_km) return { place: p.name, results: sampleUnits(p.units, p.name) };
  }
  return null;
}

function sampleByCode(code) {
  if (!DEMO_FALLBACK) return null;
  const c = toCompact(code);
  for (let i = 0; i < SAMPLE_PLACES.length; i++) {
    const p = SAMPLE_PLACES[i];
    for (let j = 0; j < p.units.length; j++) {
      if (toCompact(p.units[j].code) === c) return { place: p.name, results: sampleUnits([p.units[j]], p.name) };
    }
  }
  return null;
}

const DEMO_NOTE = "Demo mode: NIPOST returned no data for this key, so this is sample data from NIPOST's documentation, not a live lookup.";

function shapeUnit(u) {
  const code = u.postcode || u.code || (u.unit && u.unit.postcode) || "";
  return {
    postcode: pretty(code),
    compact: toCompact(code),
    display: clean(u.display || (u.unit && u.unit.display) || "", 160) || null,
    distance_m: isNum(u.distance_m) ? Math.round(u.distance_m) : (isNum(u.distance) ? Math.round(u.distance) : null)
  };
}

export const routes = [
  {
    "op": "search",
    "method": "GET",
    "annotations": { "readOnlyHint": true },
    "inputSchema": {
      "type": "object",
      "properties": { "q": { "type": "string" } },
      "additionalProperties": false
    },
    "handler": async (input, ctx) => {
      try {
        return await runSearch(input, ctx);
      } catch (e) {
        // Charm hides thrown messages, so return failures as readable values instead.
        return { query: clean(input && input.q, 300), results: [], count: 0, error: true, message: clean(e && e.message, 240) || "Something went wrong." };
      }
    }
  },
  {
    "op": "getStats",
    "method": "GET",
    "annotations": { "readOnlyHint": true },
    "handler": async () => ({
      app: "Nigeria Postcode NLP",
      apis: ["NIPOST (api.postcode.gov.ng)", "Cerebras (gpt-oss-120b)"],
      flow: "Describe a place -> Cerebras structures it and estimates coordinates -> NIPOST returns the nearest postcodes"
    })
  }
];

async function runSearch(input, { env }) {
      const q = clean(input && input.q, 300);
      if (!q) {
        return { query: "", results: [], count: 0, message: "Describe a place to search." };
      }

      // 1) The user typed a postcode: just check it with NIPOST.
      const typed = q.match(POSTCODE_RE);
      if (typed) {
        const code = typed[1] + "-" + typed[2] + "-" + typed[3] + "-" + typed[4] + "-" + typed[5];
        const body = await nipostGet(env, "/v1/lookup?code=" + encodeURIComponent(code.toUpperCase()) + "&level=1");
        const d = (body && body.data) || body || {};
        const status = d.status || (d.valid ? "valid" : "not_found");
        if (status === "valid" || d.valid === true) {
          return {
            query: q, mode: "postcode", count: 1,
            results: [{ postcode: pretty(code), compact: toCompact(code), display: null, distance_m: null }],
            message: "This postcode is assigned."
          };
        }
        const demoCode = sampleByCode(code);
        if (demoCode) {
          return { query: q, mode: "postcode", demo: true, results: demoCode.results, count: demoCode.results.length, message: DEMO_NOTE };
        }
        return { query: q, mode: "postcode", results: [], count: 0, message: "That postcode is not assigned (" + status + ")." };
      }

      // 2) Cerebras (gpt-oss-120b) understands the description.
      const parsed = await parseWithCerebras(env, q);
      const interpretation = {
        place: parsed.place, state: parsed.state, lga: parsed.lga, area: parsed.area,
        landmark: parsed.landmark, precision: parsed.precision, confidence: parsed.confidence, note: parsed.note
      };

      if (!inNigeria(parsed.lat, parsed.lng)) {
        return {
          query: q, interpretation, results: [], count: 0,
          message: parsed.note || "I could not pin down that place. Add a landmark, street or town."
        };
      }

      // 3) NIPOST finds the postcodes of buildings around that point.
      // The model's coordinates are an estimate, so widen the search in steps until NIPOST finds buildings.
      const base = RADIUS_BY_PRECISION[parsed.precision];
      const steps = [base, base * 3, 1000, 2000].filter(function (r, i, a) { return r <= 2000 && a.indexOf(r) === i; });
      let radius = base;
      let results = [];
      for (let s = 0; s < steps.length; s++) {
        radius = steps[s];
        const path = "/v1/search/nearby?lat=" + parsed.lat.toFixed(6) + "&lng=" + parsed.lng.toFixed(6) + "&radius=" + radius;
        const body = await nipostGet(env, path);
        results = listFrom(body).map(shapeUnit).filter(function (r) { return r.postcode; }).slice(0, 5);
        if (results.length) break;
      }
      interpretation.lat = parsed.lat;
      interpretation.lng = parsed.lng;

      if (results.length === 0) {
        const demo = sampleNear(parsed.lat, parsed.lng);
        if (demo) {
          return {
            query: q, mode: "nlp", demo: true, interpretation, radius_m: radius,
            results: demo.results, count: demo.results.length,
            message: DEMO_NOTE + " Nearest sample area: " + demo.place + "."
          };
        }
      }

      let message;
      if (results.length === 0) {
        message = "NIPOST returned no postcodes within " + radius + " m of this place, and there is no sample data for this area yet. Try a nearby landmark or street, or check that your NIPOST key has data access.";
      } else if (radius > base) {
        message = "No exact match, so these are the nearest postcodes within " + radius + " m. Confirm the building before relying on one.";
      } else if (parsed.precision === "city" || parsed.precision === "area") {
        message = "Your description is broad, so these are the nearest postcodes to the centre of the area. Add a landmark or street for a closer match.";
      } else {
        message = "Nearest postcodes to the place described. Confirm the building before relying on it.";
      }
      return { query: q, mode: "nlp", interpretation, radius_m: radius, results, count: results.length, message };
}
