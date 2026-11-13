/* Asset Studio: every image and animation slot in the game, with a live preview, the file name to use and a style-matched prompt. */
(function () {
  const D = DATA, $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const IMG_STYLE = "A vintage WWII intelligence map in the style of a 1940s briefing chart: aged cream paper border, muted teal-grey sea with fine hand-drawn wave lines, tan land with dark ink coastlines, navy-blue typewriter-style capital labels, red accent arrows, dots and labels, a title box in the top-left corner (title in navy capitals, date in red italics underneath), a small compass arrow marked N in the top-right corner, and a footer bar along the bottom reading \"FROM THE RECORD · {label}\". Flat printed illustration, no photographs, no modern elements, historically accurate place names. Landscape 3:2, 1536 x 1024 pixels.";
  const SCENE_STYLE = "Pixel art scene, 160 x 70 pixels scaled up 4x to 640 x 280, limited 16-colour palette of near-black blues and slate greys with small amber, red, tan and muted green highlights, hard square pixels with no anti-aliasing, blur or smoothing, moody night lighting (unless stated), side-on view like a 1990s point-and-click adventure game. A gentle seamless loop of 2 to 6 frames, for example flickering lights, moving water or drifting rain. Export as an animated GIF, 640 x 280 pixels.";
  const IMG = {
    r1: "Map of Poland in July 1939 showing Warsaw and the Pyry Forest just south of it, Germany to the west, with the meeting site marked by a red star.",
    r2: "Map of the North Atlantic in 1941 showing convoy routes from North America to Britain, U-boat wolf pack positions, and the spot south of Iceland where U-110 was captured in May 1941.",
    r3: "Map of the Pacific in late 1941 showing Japan, the Hawaiian Islands with Pearl Harbor marked, and a dashed red circle labeled \"Japanese carriers: location unknown\".",
    r4: "Map of the central Pacific in May 1942 showing Midway Atoll, the estimated Japanese carrier approach from the northwest (about 175 miles out on June 4), and the US carriers waiting to the northeast.",
    r5: "Map of the Solomon Islands in April 1943 showing Rabaul, Bougainville and Guadalcanal, Admiral Yamamoto's flight path from Rabaul toward Bougainville, and US P-38 fighters flying from Henderson Field on Guadalcanal to intercept it on April 18, 1943.",
    r6: "Map of the English Channel in spring 1944 showing the invented army (FUSAG) in southeast England aimed at Calais, the German belief that the landing would come at Calais, and the real landings on the Normandy beaches.",
    "r1-nv": "Map of the Pacific in June 1939 showing Japan, US Navy listening posts in the Philippines and Hawaii, radio waves from Japan, and a box explaining the new five-digit Japanese naval code later called JN-25.",
    "r1-mi": "Map of Britain and the North Sea in September 1939 showing London and Hamburg, with a dashed red line of secret radio messages from Agent SNOW in London to German intelligence in Hamburg.",
    "r3-fa": "Map of the English Channel showing the escape of the German warships Scharnhorst, Gneisenau and Prinz Eugen from Brest, up the Channel and through the Strait of Dover toward Germany on February 11 and 12, 1942.",
    "r3-ul": "Map of the Libyan coast in January 1942 showing El Agheila, Benghazi, Gazala and Tobruk, with red arrows for Rommel's counterattack (January 21) and the retaking of Benghazi (January 29).",
    "r4-fa": "A diagram drawn on old paper: London sends two slightly different versions of a story to Contact A (meeting on Tuesday) and Contact B (meeting on Thursday); a German raid on Thursday shows the leak runs through B.",
    "r4-mi": "Map of Britain, France and Spain in 1942 showing Garbo in London with red dots for his imaginary agents around Britain, and a dashed red line of made-up reports to his German handlers in Madrid.",
    "r4-ul": "Map of the central Mediterranean in 1942 showing Italy, Sicily, Sardinia, Malta, Tunisia and Libya, the Axis supply route from Naples to Tripoli, a British spotter plane from Malta finding the convoy, and the strike that follows.",
    "r5-bp": "Map of Spain and the Mediterranean in April 1943 showing Huelva in southwest Spain where the body washed ashore, red dashed arrows to the fake targets Sardinia and Greece, and a navy arrow to the real target, Sicily (July 1943).",
    "r5-mi": "Map of Spain and the Mediterranean in April 1943 showing Huelva in southwest Spain where the body washed ashore, red dashed arrows to the fake targets Sardinia and Greece, and a navy arrow to the real target, Sicily (July 1943).",
    "r5-fa": "Map of the Baltic coast and occupied Poland in 1943 to 1944 showing Peenemünde (rocket base, bombed August 1943), Warsaw, the Blizna rocket test range in southeast Poland, and a route showing V-2 rocket parts flown to Britain in July 1944."
  };
  const SC = {
    title: "An Enigma machine on a desk at night, with a sheet of notes and a cipher wheel; the machine's lamps light up one at a time and the rotors turn.",
    r1: "An Enigma machine on a desk at night, with a sheet of notes and a cipher wheel; the machine's lamps light up one at a time and the rotors turn.",
    r2: "An Atlantic convoy at night under the moon: a merchant ship and escorts on dark waves, smoke drifting from funnels, a U-boat periscope cutting the water.",
    r3: "A radio room in silence: a big receiver dial with a sweeping needle, a flat green signal line, a red warning lamp and a teleprinter with paper.",
    r4: "Midway Atoll at dusk: an airfield with Quonset huts, a radar mast and fighter planes on a sandy island, the sun setting over the sea.",
    r5: "A Japanese bomber flying over jungle islands while an American P-38 fighter closes in, the background scrolling slowly.",
    r6: "The fake army in England: inflatable rubber tanks in a field near the white cliffs of Dover, a soldier pumping one up, and a radio truck sending false messages.",
    "r1-nv": "A US Navy codebreaking office in Washington at night, 1939: a punch-card sorting machine with cards running through it, stacks of red code books, a blackboard of five-digit number groups, and the Capitol dome through the window.",
    "r1-mi": "A double agent's room in London at night, 1939: a suitcase radio transmitter open on a table, a hand tapping a Morse key, headphones, a bare bulb, and rain on a window showing the Big Ben clock tower.",
    "r3-fa": "Brest harbor at night, February 1942: three German warships in silhouette leaving port, harbor cranes on the shore, mist on the water, and a searchlight sweeping the sky.",
    "r3-ul": "The North African desert at night, January 1942: a command tent with a lamp glowing inside, a radio aerial, tanks resting on the dunes, stars, and sand drifting on the wind.",
    "r4-fa": "Occupied Paris at night, 1942, seen from a dark room between red curtains: a watcher in a hat looks across a rainy street at two blue safe-house doors chalked A and B. A black Citroën Traction Avant slows at door A, drives on, and stops at door B. The raid begins: two men in hats push in through the lit doorway, another waits by the car, and a soldier in a steel helmet stands guard. The leak runs through B.",
    "r4-mi": "Garbo's desk in London, 1942: a typewriter typing a report, letters with a red seal, a desk lamp, and a wall map of Britain with pins marking imaginary agents.",
    "r4-ul": "The Mediterranean by day, 1942: a convoy of supply ships on blue water with smoke from their funnels, a far coastline, clouds, and a small British spotter plane crossing the sky.",
    "r5-bp": "A beach in southern Spain at dawn, April 1943: a red and gold sunrise, waves and foam on the sand, a fishing boat, gulls, and a briefcase with a chain lying on the sand.",
    "r5-mi": "A beach in southern Spain at dawn, April 1943: a red and gold sunrise, waves and foam on the sand, a fishing boat, gulls, and a briefcase with a chain lying on the sand.",
    "r5-fa": "Dusk on the bank of the Bug River near Sarnaki, occupied Poland, May 1944: a German V-2 test rocket in black-and-white paint lies almost intact in the reeds, nose in the mud, with the furrow it ploughed behind it. Three Home Army men in caps: one kneels by the fins, one points, one arrives with a coil of rope. The river glints and the reeds sway."
  };
  const SCENE_ID = { title: "enigma", r1: "enigma", r2: "convoy", r3: "silence", r4: "midway", r5: "intercept", r6: "decoy" };
  const roleName = (id) => D.ROLES.find((r) => r.id === id).name;
  const slots = [];
  D.ROUNDS.forEach((rd, i) => {
    const off = D.ROLES.filter((r) => D.SCEN[r.id + "-" + i]).map((r) => r.id), who = D.ROLES.filter((r) => off.indexOf(r.id) < 0).map((r) => r.name);
    slots.push({ slot: "r" + (i + 1), round: i, title: rd.title, who: who.length === 5 ? "Every role" : who.join(", "), label: D.REC[i].label, scene: SCENE_ID["r" + (i + 1)] });
    off.forEach((rid) => { const sc = D.SCEN[rid + "-" + i]; slots.push({ slot: sc.img, round: i, title: sc.title, who: roleName(rid), label: D.ROLE_HIST[rid][i].label, scene: sc.scene }); });
  });
  const imgUrl = (s) => { if (SLOT_IMG[s]) return SLOT_IMG[s]; const hi = D.HEAD_IMG.indexOf(s); if (hi >= 0 && REC_IMG[hi]) return REC_IMG[hi]; if (RECMAPS[s]) return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(RECMAPS[s]); return null; };
  const source = (s) => (SLOT_IMG[s] || (D.HEAD_IMG.indexOf(s) >= 0 && REC_IMG[D.HEAD_IMG.indexOf(s)]) ? "Your image" : "Claude's sketch map");
  const card = (o, kind) => {
    const isImg = kind === "img", file = isImg ? `images/${o.slot}.png` : `images/scene-${o.slot}.gif`;
    const prompt = isImg ? IMG_STYLE.replace("{label}", o.label) + "\n\nShow: " + IMG[o.slot] : SCENE_STYLE + "\n\nShow: " + SC[o.slot];
    const prev = isImg ? `<button class="zbtn" data-src="${o.slot}" aria-label="Enlarge ${esc(o.title)}"><img src="${imgUrl(o.slot)}" alt=""><span class="zh">⤢ Enlarge</span></button>` : ART.scene(o.scene);
    return `<article class="slot" data-k="${kind}" data-q="${esc((o.title + " " + o.who + " " + o.slot).toLowerCase())}"><div class="pv ${isImg ? "pimg" : "pscene"}">${prev}</div>
      <div class="meta"><p class="sid">${isImg ? "IMAGE" : "ANIMATION"} · ${esc(o.slot === "title" ? "TITLE SCREEN" : "ROUND " + (o.round + 1))}</p><h3>${esc(o.title)}</h3>
      <p class="who">${esc(o.who)}</p>${isImg ? `<p class="src">Now: ${source(o.slot)}</p>` : ""}
      <p class="file">Upload as <code>${file}</code>${isImg ? ` <span>(or .jpg)</span>` : ` <span>(or .png)</span>`}</p>
      <details><summary>Prompt in the matching style</summary><pre>${esc(prompt)}</pre></details>
      <button class="copy" data-p="${esc(prompt)}">Copy prompt</button></div></article>`;
  };
  const sceneSlots = [{ slot: "title", round: -1, title: "Title screen", who: "Everyone", scene: "enigma" }].concat(slots);
  $("#imgs").innerHTML = slots.map((o) => card(o, "img")).join("");
  $("#scenes").innerHTML = sceneSlots.map((o) => card(o, "scene")).join("");
  document.addEventListener("click", (e) => { const b = e.target.closest(".copy"); if (!b) return; const t = b.dataset.p, done = () => { const o = b.textContent; b.textContent = "Copied"; setTimeout(() => (b.textContent = o), 1400); };
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, () => {}); });
  /* size slider and full-screen view */
  const sz = $("#sz"), apply = () => { document.documentElement.style.setProperty("--pv", sz.value + "px"); document.querySelectorAll(".grid").forEach((g) => g.classList.toggle("one", +sz.value > 420)); };
  sz.addEventListener("input", apply); apply();
  document.addEventListener("click", (e) => { const b = e.target.closest(".zbtn"); if (!b) return; const src = b.querySelector("img").src, box = document.createElement("div"); box.className = "zbox";
    box.innerHTML = `<img src="${src}" alt=""><button class="copy zx">Close</button>`; document.body.appendChild(box); document.body.style.overflow = "hidden";
    const close = () => { box.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", k); }, k = (ev) => { if (ev.key === "Escape") close(); };
    box.addEventListener("click", close); document.addEventListener("keydown", k); });
  $("#q").addEventListener("input", (e) => { const q = e.target.value.trim().toLowerCase(); document.querySelectorAll(".slot").forEach((s) => { s.hidden = q && s.dataset.q.indexOf(q) < 0; }); });
  let n = 0; setInterval(() => { n++; document.querySelectorAll("svg.scene").forEach((sv) => sv.querySelectorAll(".pxa").forEach((g) => { const p = +g.dataset.p, m = +g.dataset.n, on = Math.floor(n / (+g.dataset.h || 1)) % m === p; g.setAttribute("display", on ? "inline" : "none"); })); }, 1000 / 12);
})();
