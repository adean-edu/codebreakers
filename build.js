const fs = require("fs"); const r = (f) => fs.readFileSync(__dirname + "/src/" + f, "utf8");
const js = ["data.js", "logic.js", "art.js", "typesound.js", "dialsound.js", "recimages.js", "recmaps.js", "app.js"].map(r).join("\n");
const html = `<title>Codebreakers: The Silent Service</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Silkscreen:wght@400;700&family=VT323&display=swap">
<style>
${r("style.css")}
</style>
<div id="app"></div>
<script>
${js}
</script>
`;
const head = `<title>Codebreakers: The Silent Service</title>\n<meta name="claude:viewport-fit-sides" content="cover">`;
fs.mkdirSync(__dirname + "/dist", { recursive: true }); fs.writeFileSync(__dirname + "/dist/index.html", html);
const fonts = html.match(/<link rel="preconnect"[^]*?display=swap">/)[0];
const css = html.match(/<style>[^]*?<\/style>/)[0];
const body = html.slice(html.indexOf('<div id="app">'));
fs.writeFileSync(__dirname + "/dist/test.html", `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Codebreakers: The Silent Service</title>${fonts}<style>body{margin:0}[hidden]{display:none!important}</style>${css}</head><body>${body}</body></html>`);
const sjs = ["data.js", "art.js", "recimages.js", "recmaps.js", "studio.js"].map(r).join("\n");
const studio = `<title>Codebreakers Asset Studio</title>
<style>
${r("studio.css")}
</style>
<main class="wrap"><h1>CODEBREAKERS · ASSET STUDIO</h1>
<p class="lead">Every picture and animation in the game, with the file name to use if you want to replace one. Prompts are written to match the existing style, so new pictures fit in.</p>
<section class="how"><div><h3>Swap it yourself (no Claude needed)</h3><ol><li>Make or find the new picture. Use the copied prompt for a matching style.</li><li>Rename the file to the name shown on its card, for example <code>r3-fa.png</code>.</li><li>In your GitHub repo, create a folder called <code>images</code> (once) and upload the file into it.</li><li>Refresh the game. The new picture replaces the built-in one. Delete the file to go back.</li></ol></div>
<div><h3>Or send it to Claude</h3><ol><li>Attach the picture in the chat.</li><li>Say which slot it is for, for example <i>"this is for r3-fa"</i>.</li><li>Claude builds it into the game file, so it works everywhere, including inside Claude.</li><li>To change an animation, describe what you want, or send a GIF for that slot.</li></ol></div></section>
<input id="q" type="search" placeholder="Filter by round, role or title" aria-label="Filter slots">
<label class="sizer">Preview size <input id="sz" type="range" min="200" max="900" step="20" value="300"></label>
<h2>REAL HISTORY IMAGES</h2><div class="grid" id="imgs"></div>
<h2>ANIMATIONS</h2><p class="lead">Animations are pixel art drawn by code. A GIF in <code>images/scene-SLOT.gif</code> replaces one.</p><div class="grid" id="scenes"></div></main>
<script>
${sjs}
</script>
`;
fs.writeFileSync(__dirname + "/dist/studio.html", studio);
fs.writeFileSync(__dirname + "/dist/studio-test.html", `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${studio}</body></html>`);
/* Teacher checking page: dist/check.html (copy to check.html at the repo root to deploy). */
const cjs = ["data.js", "logic.js", "checker.js"].map(r).join("\n");
fs.writeFileSync(__dirname + "/dist/check.html", `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Codebreakers Teacher Check</title>${fonts}<style>
${r("checker.css")}
</style></head><body><main class="wrap"><h1>CODEBREAKERS · TEACHER CHECK</h1>
<p class="lead">Check students' private submissions. Every Signal ID is tested, so you can see who really decoded classmates from all five roles. Nothing you paste here is saved or sent anywhere.</p>
<section class="how"><ol><li>Copy one or more submissions (each starts with <b>MISSION COMPLETE</b>) and paste them all into the box. They can be one after another.</li><li>Press <b>Check</b>. Each student gets a row: their own Signal ID, which roles they decoded, whether the six messages are right, and anything to look at.</li><li>Use <b>Copy results for a spreadsheet</b> to paste the table into your gradebook sheet.</li></ol></section>
<h2>SUBMISSIONS</h2><label class="small" for="subs">Paste submissions here</label><textarea id="subs" spellcheck="false" placeholder="MISSION COMPLETE · ..."></textarea>
<div class="row"><button class="btn" id="go">Check</button><button class="btn ghost" id="clear">Clear</button></div><div id="out" aria-live="polite"></div>
<h2>LOOK UP ONE SIGNAL ID</h2><p class="small">See the role, ending and all six choices behind any Signal ID, for example one on a Padlet card.</p>
<div class="row"><label class="small" for="one">Signal ID</label><input id="one" placeholder="BP-ACBACB-FD" autocomplete="off" spellcheck="false" maxlength="16"><button class="btn" id="onego">Look up</button></div><div id="oneout" aria-live="polite"></div></main>
<script>
${cjs}
</script></body></html>`);
console.log("built", (html.length / 1024).toFixed(0) + " KB");
