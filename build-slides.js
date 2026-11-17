/* Build the two slide decks as plain web pages for GitHub Pages:
     slides-src/<deck>/  (deck.json, deck.css, slides/<id>.html, img/<asset id>.<ext>)  ->  slides/<deck>/index.html + slides/<deck>/img/
   The sources are copies of the claude.ai Slides decks (each slide is one <section>, 1920x1080, with speaker notes in <aside>).
   Run: node build-slides.js
   The pages load nothing from any other server: fonts are embedded (src/fonts.css for the briefing, slides-src/fonts-lesson.css for the mini lesson). */
const fs = require("fs"), path = require("path");
const DECKS = [
  { id: "briefing", fonts: ["src/fonts.css"], bg: "#0A0D0E" },
  { id: "mini-lesson", fonts: ["slides-src/fonts-lesson.css"], bg: "#1E2A38" }
];
const r = (p) => fs.readFileSync(path.join(__dirname, p), "utf8");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* The page's own rules: the stage, the controls and the few slide elements a browser doesn't draw by itself (x-shape). */
const VIEWER_CSS = `
html, body { margin: 0; height: 100%; background: var(--viewer-bg); overflow: hidden; }
#stage { position: absolute; left: 50%; top: 50%; width: 1920px; height: 1080px; transform-origin: 0 0; }
#stage > section { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; box-sizing: border-box; overflow: hidden; }
#stage > section:not(.on) { display: none !important; }
/* Slides paints children in source order, so a pinned backdrop or tint that comes first stays behind the text after it.
   A browser paints positioned boxes over plain ones, so give every child a (zero-specificity) stacking position. */
:where(#stage > section > *) { position: relative; }
#stage *, #stage *::before, #stage *::after { box-sizing: border-box; }
#stage section p, #stage section h1, #stage section h2, #stage section h3, #stage section figure { margin: 0; }
#stage section ul, #stage section ol { margin: 0; padding-left: 1.15em; }
#stage section hr { margin: 0; border: 0; height: 0; }
#stage section img { display: block; }
#stage section aside { display: none; }
#stage table { border-collapse: collapse; width: 100%; }
#stage th, #stage td { text-align: left; padding: 10px 14px; border-bottom: 2px solid rgba(128,128,128,.35); vertical-align: top; }
x-shape { display: block; flex: none; }
x-shape[kind="arrow-right"] { clip-path: polygon(0 32%, 58% 32%, 58% 0, 100% 50%, 58% 100%, 58% 68%, 0 68%); }
x-shape[kind="arrow-left"] { clip-path: polygon(100% 32%, 42% 32%, 42% 0, 0 50%, 42% 100%, 42% 68%, 100% 68%); }
x-shape[kind="ellipse"] { border-radius: 50%; } x-shape[kind="rounded"] { border-radius: 16px; }
/* controls */
#bar { position: fixed; left: 50%; bottom: 14px; transform: translateX(-50%); display: flex; gap: 6px; align-items: center; background: rgba(10,13,14,.88); border: 1px solid #46555b; border-radius: 8px; padding: 6px 8px; font: 15px/1.2 system-ui, -apple-system, "Segoe UI", sans-serif; color: #e6e3d6; transition: opacity .3s; z-index: 10; }
#bar.idle { opacity: 0; }
#bar button, #bar a { background: transparent; color: #e6e3d6; border: 1px solid #46555b; border-radius: 6px; padding: 7px 11px; font: inherit; cursor: pointer; text-decoration: none; }
#bar button:hover, #bar a:hover { border-color: #f0b93a; color: #f0b93a; }
#bar button:focus-visible, #bar a:focus-visible { outline: 3px solid #8ab4f8; outline-offset: 1px; }
#count { min-width: 70px; text-align: center; font-variant-numeric: tabular-nums; }
#notes { position: fixed; left: 0; right: 0; bottom: 0; max-height: 38vh; overflow-y: auto; background: #10161a; color: #e6e3d6; border-top: 3px solid #f0b93a; padding: 16px 20px 72px; font: 18px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; z-index: 9; }
#notes[hidden] { display: none; }
#notes b { color: #f0b93a; font-size: 13px; letter-spacing: .12em; display: block; margin-bottom: 4px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
@media print { #bar, #notes { display: none !important; } }
`;

const VIEWER_JS = `
(function () {
  var stage = document.getElementById("stage"), slides = [].slice.call(stage.children), n = slides.length, i = 0;
  var count = document.getElementById("count"), notes = document.getElementById("notes"), noteText = document.getElementById("notetext"), bar = document.getElementById("bar"), live = document.getElementById("live");
  function fit() { var s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = "scale(" + s + ") translate(-50%, -50%)"; }
  function frags(k) { return [].slice.call(slides[k].querySelectorAll(".fragment")); }
  function show(k, allFrags) {
    i = Math.max(0, Math.min(n - 1, k));
    slides.forEach(function (s, j) { s.classList.toggle("on", j === i); });
    frags(i).forEach(function (f) { f.classList.toggle("visible", !!allFrags); f.classList.remove("current-fragment"); });
    count.textContent = (i + 1) + " / " + n;
    var a = slides[i].querySelector("aside"); noteText.textContent = a ? a.textContent.trim() : "No notes for this slide.";
    var h = slides[i].querySelector("h1, h2"); live.textContent = "Slide " + (i + 1) + " of " + n + (h ? ": " + h.textContent.trim() : "");
    try { history.replaceState(null, "", "#" + (i + 1)); } catch (e) { }
  }
  function next() { var f = frags(i).filter(function (x) { return !x.classList.contains("visible"); }); if (f.length) { frags(i).forEach(function (x) { x.classList.remove("current-fragment"); }); f[0].classList.add("visible", "current-fragment"); return; } if (i < n - 1) show(i + 1); }
  function prev() { var f = frags(i).filter(function (x) { return x.classList.contains("visible"); }); if (f.length) { f[f.length - 1].classList.remove("visible", "current-fragment"); return; } if (i > 0) show(i - 1, true); }
  function toggleNotes() { notes.hidden = !notes.hidden; document.getElementById("nbtn").setAttribute("aria-pressed", String(!notes.hidden)); }
  function full() { if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); }
  document.getElementById("prev").onclick = prev; document.getElementById("next").onclick = next; document.getElementById("nbtn").onclick = toggleNotes; document.getElementById("fbtn").onclick = full;
  addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown" || k === " " || k === "Enter") { if (k === "Enter" && e.target.tagName === "BUTTON") return; e.preventDefault(); next(); }
    else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp" || k === "Backspace") { e.preventDefault(); prev(); }
    else if (k === "Home") show(0); else if (k === "End") show(n - 1, true);
    else if (k === "n" || k === "N") toggleNotes(); else if (k === "f" || k === "F") full();
    wake();
  });
  stage.addEventListener("click", function (e) { if (e.target.closest("a")) return; (e.clientX < innerWidth / 3 ? prev : next)(); });
  var tx = null; addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  addEventListener("touchend", function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) (dx < 0 ? next : prev)(); tx = null; });
  var idle; function wake() { bar.classList.remove("idle"); clearTimeout(idle); idle = setTimeout(function () { if (!bar.matches(":hover, :focus-within")) bar.classList.add("idle"); }, 2500); }
  addEventListener("mousemove", wake); addEventListener("resize", fit);
  fit(); var start = parseInt(location.hash.slice(1), 10); show(isNaN(start) ? 0 : start - 1); wake();
})();
`;

for (const d of DECKS) {
  const src = path.join(__dirname, "slides-src", d.id), out = path.join(__dirname, "slides", d.id);
  const deck = JSON.parse(r(`slides-src/${d.id}/deck.json`));
  fs.rmSync(path.join(out, "img"), { recursive: true, force: true }); fs.mkdirSync(path.join(out, "img"), { recursive: true });
  const imgs = fs.readdirSync(path.join(src, "img")), used = new Set();
  const slides = deck.order.map((id) => {
    let h = r(`slides-src/${d.id}/slides/${id}.html`).trim();
    h = h.replace(/\/_blob\/([0-9a-f]{32})/g, (m, a) => { const f = imgs.find((x) => x.startsWith(a + ".")); if (!f) throw new Error(`${d.id}/${id}: image ${a} missing from slides-src/${d.id}/img`); used.add(f); return "img/" + f; });
    if (!new RegExp(`^<section id="${id}"`).test(h)) throw new Error(`${d.id}/${id}: slide must start with its <section>`);
    return h;
  });
  used.forEach((f) => fs.copyFileSync(path.join(src, "img", f), path.join(out, "img", f)));
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(deck.title)}</title>
<style>
${d.fonts.map(r).join("\n")}
:root { --viewer-bg: ${d.bg}; }
${r(`slides-src/${d.id}/deck.css`)}
${VIEWER_CSS}
</style></head><body>
<main id="stage" aria-label="${esc(deck.title)}">
${slides.join("\n")}
</main>
<div id="notes" hidden role="region" aria-label="Speaker notes"><b>SPEAKER NOTES</b><span id="notetext"></span></div>
<nav id="bar" aria-label="Slide controls"><button id="prev" type="button" aria-label="Previous slide">&#8592;</button><span id="count" aria-hidden="true"></span><button id="next" type="button" aria-label="Next slide">&#8594;</button><button id="nbtn" type="button" aria-pressed="false" title="Speaker notes (N)">Notes</button><button id="fbtn" type="button" title="Full screen (F)">Full screen</button><a href="../../teachers.html" title="Back to the teacher page">Teacher page</a></nav>
<p id="live" class="sr" aria-live="polite"></p>
<script>${VIEWER_JS}</script>
</body></html>`;
  fs.writeFileSync(path.join(out, "index.html"), html);
  console.log(`slides/${d.id}/index.html: ${slides.length} slides, ${used.size} images, ${(html.length / 1024).toFixed(0)} KB`);
}
