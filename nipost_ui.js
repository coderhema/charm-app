const api = window.charming.api("nigeria-postcode");
const app = document.getElementById("app");

const EXAMPLES = [
  "NTA road back of Fabian Hotel Ado Ekiti",
  "Yellow house opposite mosque in Wuse 2",
  "Mile 1 Market Port Harcourt",
  "Lagos Ikeja GRA"
];

// Design: Customer.io style. Dark spruce hero + cream content band, Saans-like
// medium-light weight (475) via Inter, 2px radii, 1px hairlines, pill buttons only,
// 4px glow rings for focus instead of drop shadows.
const CSS = `
:root{
  --spruce-abyss:#00191c;--spruce-900:#032125;--spruce-700:#0b363b;--spruce-500:#437278;--spruce-200:#a1c2c6;--spruce-mist:#354d51;
  --hair:#ebebeb;--mist:#fafafa;--cream:#fffcf6;--white:#fff;
  --verdant:#abffae;--verdant-whisper:#eafde8;
  --wave-700:#123a88;--wave-frost:#e2f4ff;
  --zest-700:#863d1c;--zest-blush:#fdf0e9;
  --mustard-700:#83611c;
  --font:"Saans","Inter","Helvetica Neue",Arial,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
*{box-sizing:border-box}
html,body{margin:0;background:var(--cream)}
.np{font-family:var(--font);font-weight:475;color:var(--spruce-900);min-height:100vh;min-height:100dvh;
  -webkit-text-size-adjust:100%;line-height:1.38;letter-spacing:.01em;display:flex;flex-direction:column}
.np-wrap{width:100%;max-width:960px;margin:0 auto;padding:0 max(16px,env(safe-area-inset-right)) 0 max(16px,env(safe-area-inset-left))}

/* Dark hero */
.np-top{background:var(--spruce-900);color:var(--white);padding-top:max(24px,env(safe-area-inset-top));padding-bottom:40px}
.np-badge{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:500;color:var(--spruce-200);letter-spacing:.017em}
.np-dot{width:8px;height:8px;border-radius:2px;background:var(--verdant)}
.np-title{margin:20px 0 12px;font-size:clamp(36px,9vw,72px);line-height:1;font-weight:475;letter-spacing:.004em;color:var(--white)}
.np-sub{margin:0 0 28px;max-width:44ch;color:var(--spruce-200);font-size:clamp(16px,4vw,20px);line-height:1.38}

/* Search bar: the Search button lives inside the bar */
.np-bar{display:flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--hair);border-radius:2px;
  padding:6px 6px 6px 14px;transition:box-shadow .15s,border-color .15s}
.np-bar:focus-within{box-shadow:0 0 0 4px var(--verdant);border-color:var(--verdant)}
.np-bar svg{flex:none;color:var(--spruce-500)}
.np-input{flex:1;min-width:0;border:0;outline:0;background:transparent;font:inherit;font-weight:475;font-size:16px;color:var(--spruce-900);padding:10px 0}
.np-input::placeholder{color:#7a8f92}
.np-btn{flex:none;border:0;border-radius:9999px;background:var(--verdant);color:var(--spruce-900);font:inherit;font-weight:475;font-size:16px;
  min-height:44px;padding:8px 22px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:box-shadow .15s}
.np-btn:hover,.np-btn:focus-visible{outline:0;box-shadow:0 0 0 4px rgba(171,255,174,.35)}
.np-btn:active{opacity:.9}
.np-btn[disabled]{opacity:.6;cursor:default}

.np-label{margin:28px 0 12px;font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--spruce-200)}
.np-chips{display:flex;flex-wrap:wrap;gap:8px}
.np-chip{border:1px solid var(--spruce-500);background:transparent;color:var(--white);border-radius:9999px;font:inherit;font-weight:475;font-size:14px;
  min-height:44px;padding:8px 16px;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:box-shadow .15s,border-color .15s}
.np-chip:hover{border-color:var(--verdant)}
.np-chip:focus-visible{outline:0;box-shadow:0 0 0 4px var(--spruce-700);border-color:var(--verdant)}

/* Cream results band */
.np-main{flex:1;background:var(--cream);padding:32px 0 48px}
#np-results:empty{display:none}
.np-note{text-align:center;color:var(--spruce-mist);font-size:14px;padding:12px 0}
.np-spin{width:28px;height:28px;margin:8px auto;border-radius:50%;border:2px solid var(--hair);border-top-color:var(--spruce-900);animation:np-rot .8s linear infinite}
@keyframes np-rot{to{transform:rotate(360deg)}}

.np-banner{border:1px solid var(--hair);border-radius:2px;padding:16px;margin-bottom:16px;font-size:14px;line-height:1.38;word-break:break-word}
.np-banner b{display:block;font-size:16px;font-weight:600;margin-bottom:2px}
.np-ok{background:var(--verdant-whisper);border-color:var(--verdant-whisper);color:var(--spruce-900)}
.np-info{background:var(--wave-frost);border-color:var(--wave-frost);color:var(--wave-700)}
.np-warn{background:var(--white);border-color:var(--hair);color:var(--mustard-700)}
.np-err{background:var(--zest-blush);border-color:var(--zest-blush);color:var(--zest-700)}
.np-demo{background:var(--zest-blush);border-color:var(--zest-blush);color:var(--zest-700)}
.np-small{display:block;margin-top:4px;font-size:13px;opacity:.9}

.np-grid{display:grid;grid-template-columns:1fr;gap:16px}
.np-card{background:var(--white);border:1px solid var(--hair);border-radius:2px;padding:24px}
.np-card-sample{border-style:dashed;border-color:var(--zest-700);background:var(--white)}
.np-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.np-pill{background:var(--verdant-whisper);color:var(--spruce-900);border-radius:2px;font-size:12px;font-weight:500;letter-spacing:.017em;padding:4px 8px}
.np-pill-sample{background:var(--zest-blush);color:var(--zest-700)}
.np-code{margin-top:16px;font-size:clamp(24px,7vw,30px);line-height:1.13;font-weight:475;letter-spacing:.02em;color:var(--spruce-900)}
.np-lga{margin:8px 0 0;color:var(--spruce-mist);font-size:15px}
.np-dist{color:var(--spruce-mist);font-size:13px}
.np-copy{margin-top:20px;width:100%;min-height:44px;border:1px solid var(--spruce-700);background:transparent;color:var(--spruce-900);border-radius:9999px;
  font:inherit;font-weight:475;font-size:16px;padding:8px 20px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:box-shadow .15s}
.np-copy:hover,.np-copy:focus-visible{outline:0;box-shadow:0 0 0 4px var(--mist)}

/* Footer */
.np-foot{background:var(--spruce-abyss);color:var(--spruce-200);font-size:14px;line-height:1.5;
  padding:32px 0 max(32px,env(safe-area-inset-bottom))}

@media (min-width:560px){
  .np-grid{grid-template-columns:1fr 1fr}
  .np-top{padding-bottom:56px}
}
@media (min-width:900px){
  .np-grid{grid-template-columns:1fr 1fr 1fr}
  .np-main{padding:48px 0 72px}
}
@media (prefers-reduced-motion:reduce){.np-spin{animation:none}.np *{transition:none!important}}
`;

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function injectAssets() {
  const meta = document.querySelector('meta[name="viewport"]') || document.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width, initial-scale=1, viewport-fit=cover";
  if (!meta.parentNode) document.head.appendChild(meta);

  const font = document.createElement("link");
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap";
  document.head.appendChild(font);

  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);
}

function renderHome() {
  const chips = EXAMPLES.map(function (t) {
    return '<button type="button" class="np-chip" data-q="' + esc(t) + '">' + esc(t) + "</button>";
  }).join("");

  app.innerHTML = `
    <div class="np">
      <header class="np-top"><div class="np-wrap">
        <span class="np-badge"><span class="np-dot"></span>NIPOST postcode lookup</span>
        <h1 class="np-title">Nigeria Postcode</h1>
        <p class="np-sub">Describe any place in plain English and get its postcode.</p>

        <form id="np-form" class="np-bar" role="search" autocomplete="off">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle><path d="M17 17L21 21"></path>
          </svg>
          <input id="np-q" class="np-input" type="text" name="q" enterkeyhint="search"
            autocapitalize="sentences" autocorrect="off" spellcheck="false"
            placeholder="Describe a place in Nigeria" aria-label="Describe a place in Nigeria">
          <button id="np-search" class="np-btn" type="submit">Search</button>
        </form>

        <div class="np-label">Try an example</div>
        <div class="np-chips">${chips}</div>
      </div></header>

      <main class="np-main"><div class="np-wrap">
        <div id="np-results" aria-live="polite"></div>
      </div></main>

      <footer class="np-foot"><div class="np-wrap">
        AI reads your description, then NIPOST (postcode.gov.ng) finds the nearest postcodes. Always confirm the building.
      </div></footer>
    </div>`;

  document.getElementById("np-form").addEventListener("submit", function (e) {
    e.preventDefault();
    doSearch(document.getElementById("np-q").value);
  });
  app.querySelectorAll(".np-chip").forEach(function (b) {
    b.addEventListener("click", function () {
      const q = b.getAttribute("data-q");
      document.getElementById("np-q").value = q;
      doSearch(q);
    });
  });
}

function showResults(html) {
  const box = document.getElementById("np-results");
  box.innerHTML = html;
  if (box.scrollIntoView) box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function doSearch(raw) {
  const query = String(raw || "").trim();
  const btn = document.getElementById("np-search");
  if (!query) {
    showResults('<div class="np-note">Type a place above, then tap Search.</div>');
    return;
  }

  btn.disabled = true;
  showResults('<div class="np-spin" role="status" aria-label="Searching"></div>');
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();

  try {
    const data = await api.search({ q: query });

    if (!data || !data.count) {
      const it0 = data && data.interpretation;
      showResults(
        (it0 && it0.place ? '<div class="np-banner np-info"><b>Understood as</b>' + esc(it0.place) + "</div>" : "") +
        '<div class="np-banner np-warn"><b>No postcode found</b>' +
        esc((data && data.message) || "Try a nearby town or landmark.") + "</div>"
      );
      return;
    }

    const demo = !!data.demo;
    const cards = data.results.map(function (r, i) {
      const sample = demo || r.sample;
      return (
        '<div class="np-card' + (sample ? " np-card-sample" : "") + '">' +
          '<div class="np-row">' +
          (sample
            ? '<span class="np-pill np-pill-sample">Sample data</span>'
            : '<span class="np-pill">' + (i === 0 ? "Closest" : "Nearby") + "</span>") +
          (r.distance_m != null ? '<span class="np-dist">' + esc(r.distance_m) + " m away</span>" : "") + "</div>" +
          '<div class="np-code">' + esc(r.postcode) + "</div>" +
          (r.display ? '<p class="np-lga">' + esc(r.display) + "</p>" : "") +
          (sample ? "" : '<button type="button" class="np-copy" data-code="' + esc(r.postcode) + '">Copy postcode</button>') +
        "</div>"
      );
    }).join("");

    const it = data.interpretation;
    const understood = it && it.place
      ? '<div class="np-banner np-info"><b>Understood as</b>' + esc(it.place) +
        (it.note ? '<span class="np-small">' + esc(it.note) + "</span>" : "") + "</div>"
      : "";

    showResults(
      understood +
      (demo
        ? '<div class="np-banner np-demo"><b>Demo mode: sample data</b>' + esc(data.message || "") + "</div>"
        : '<div class="np-banner np-ok"><b>Found ' + esc(data.count) + (data.count === 1 ? " postcode" : " postcodes") +
          "</b>" + esc(data.message || "") + "</div>") +
      '<div class="np-grid">' + cards + "</div>"
    );
    document.querySelectorAll(".np-copy").forEach(function (b) {
      b.addEventListener("click", function () {
        const code = b.getAttribute("data-code");
        const done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy postcode"; }, 1500); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, function () {});
        else done();
      });
    });
  } catch (error) {
    showResults(
      '<div class="np-banner np-err"><b>Something went wrong</b>' +
      esc((error && error.message) || "Network error. Please try again.") + "</div>"
    );
  } finally {
    btn.disabled = false;
  }
}

injectAssets();
renderHome();
