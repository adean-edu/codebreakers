(function () {
  const D = DATA, L = Logic;
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  const root = document.getElementById("app");
  let S = null, view = "title", stage = "brief", prevView = "title", picked = null, solved = false, lastDecoded = null, chosen = null, titleCard = false, typedFor = -1, fxTimer = null;
  const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FX_ON = location.hash === "#fx", noFx = () => (navigator.webdriver && !FX_ON) || reduceMotion();   // automated tests skip the effects unless asked
  /* small synthesized sound effects for the title card, typewriter and stamp */
  let _ac = null, _cardMaster = null;
  /* Title cards: the key word of each round title, sent in Morse over the static. */
  const MORSE = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--.." };
  const CARD_WORDS = ["POLAND", "ATLANTIC", "SIGNALS", "MIDWAY", "SECRET", "DDAY"], DIT = .075;   // POLAND, ATLANTIC, SIGNALS, MIDWAY, SECRET, D-DAY
  const morseSecs = (w) => w.split("").reduce((s, ch, i) => s + (i ? 3 : 0) + MORSE[ch].split("").reduce((u, e, k) => u + (k ? 1 : 0) + (e === "." ? 1 : 3), 0), 0) * DIT;
  const cardSecs = (w) => Math.max(3.8, .55 + morseSecs(w || "V") + .7);
  function stopCard() { const m = _cardMaster; _cardMaster = null; if (!m || !_ac) return; try { const t = _ac.currentTime; m.gain.cancelScheduledValues(t); m.gain.setValueAtTime(m.gain.value, t); m.gain.linearRampToValueAtTime(0.0001, t + .08); setTimeout(() => { try { m.disconnect(); } catch (e) { } }, 150); } catch (e) { } }
  function sfx(kind, n) {
    if (!store.get("cb_sound", true)) return;
    try {
      _ac = _ac || new (window.AudioContext || window.webkitAudioContext)(); if (_ac.state === "suspended") _ac.resume();
      const ac = _ac, t = ac.currentTime; let dest = ac.destination;   // title-card sounds go through their own master gain so they can be cut off
      if (kind === "card") { stopCard(); const m = ac.createGain(); m.connect(ac.destination); _cardMaster = m; dest = m; }
      const noise = (at, f, q, vol, len, type) => { const n = Math.floor(ac.sampleRate * len), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2); const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = buf; fl.type = type || "bandpass"; fl.frequency.value = f; fl.Q.value = q; g.gain.value = vol; s.connect(fl); fl.connect(g); g.connect(dest); s.start(at); };
      const thud = (at, f0, f1, vol, d) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(f1, at + d); g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(0.0001, at + d); o.connect(g); g.connect(ac.destination); o.start(at); o.stop(at + d + .02); };
      const beep = (at, f, len, vol) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(vol, at + .008); g.gain.setValueAtTime(vol, at + len - .012); g.gain.linearRampToValueAtTime(0.0001, at + len); o.connect(g); g.connect(dest); o.start(at); o.stop(at + len + .02); };
      if (kind === "slam") {   // a rubber stamp: soft pad tap, then the heavy thump of the handle on the desk
        noise(t + .1, 1100, .6, .55, .05, "lowpass");                     // rubber meets paper
        thud(t + .18, 105, 48, .95, .2);                                  // the thump
        noise(t + .18, 520, .7, 1.1, .11, "lowpass");                     // muffled wooden knock
        noise(t + .26, 380, .7, .3, .08, "lowpass");                      // the desk settles
      } else if (kind === "card") {   // title card: soft radio static, with the title word in Morse
        const len = cardSecs(n), nn = Math.floor(ac.sampleRate * len), buf = ac.createBuffer(1, nn, ac.sampleRate), d = buf.getChannelData(0);
        for (let k = 0; k < nn; k++) d[k] = Math.random() * 2 - 1;
        const src = ac.createBufferSource(), hp = ac.createBiquadFilter(), lp = ac.createBiquadFilter(), g = ac.createGain();
        src.buffer = buf; hp.type = "highpass"; hp.frequency.value = 350; lp.type = "lowpass"; lp.frequency.value = 2800;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(.012, t + .3); g.gain.setValueAtTime(.012, t + len - .7); g.gain.linearRampToValueAtTime(0.0001, t + len);
        src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(dest); src.start(t);
        for (let k = 0; k < 7; k++) noise(t + .15 + Math.random() * (len - 1.2), 1800, .7, .03, .012, "lowpass");   // faint crackle
        let at = t + .55; (n || "V").split("").forEach((ch) => { MORSE[ch].split("").forEach((s) => { const l = s === "." ? DIT : DIT * 3; beep(at, 660, l, .06); at += l + DIT; }); at += DIT * 2; });   // the title word in Morse
      }
    } catch (e) { }
  }
  /* Dial click (decoded once, on first use). */
  let dialBufs = null, dialPending = 0, unlockBuf = null, unlockPending = 0;
  const b64buf = (u) => { const bin = atob(u.split(",")[1]), b = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i); return b.buffer; };
  function loadDial(ac) {
    if (dialBufs) return; dialBufs = [];
    DIAL_SND.forEach((u, k) => ac.decodeAudioData(b64buf(u)).then((buf) => { dialBufs[k] = buf; const p = dialPending; dialPending = 0; if (p) playDial(); }));
    ac.decodeAudioData(b64buf(SOLVE_SND)).then((buf) => { unlockBuf = buf; const p = unlockPending; unlockPending = 0; if (p) playSolve(); });
  }
  function playSolve() {
    if (!unlockBuf) { unlockPending = 1; return; }
    try { const ac = _ac, s = ac.createBufferSource(), lp = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = unlockBuf; lp.type = "lowpass"; lp.frequency.value = 16000; g.gain.value = .4; s.connect(lp); lp.connect(g); g.connect(ac.destination); s.start(); } catch (e) { }
  }
  function playDial() {
    const ready = (dialBufs || []).filter(Boolean); if (!ready.length) { dialPending = 1; return; }
    try { const ac = _ac || (_ac = new (window.AudioContext || window.webkitAudioContext)()); const s = ac.createBufferSource(), lp = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = ready[Math.floor(Math.random() * ready.length)]; s.playbackRate.value = .94 + Math.random() * .12; lp.type = "lowpass"; lp.frequency.value = 8000; g.gain.value = .275; s.connect(lp); lp.connect(g); g.connect(ac.destination); s.start(); } catch (e) { }
  }
  /* Real typewriter recording that plays while the briefing types. */
  let _typeBuf = null, _typeNode = null, _typeTok = 0;
  async function typeStart() {
    const tok = ++_typeTok; if (!store.get("cb_sound", true)) return;
    try {
      _ac = _ac || new (window.AudioContext || window.webkitAudioContext)(); if (_ac.state === "suspended") _ac.resume();
      if (!_typeBuf) { const bin = atob(TYPE_SND.split(",")[1]), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); _typeBuf = await _ac.decodeAudioData(u.buffer); }
      if (tok !== _typeTok) return;                                   // typing already finished or skipped
      const s = _ac.createBufferSource(), lp = _ac.createBiquadFilter(), g = _ac.createGain(); s.buffer = _typeBuf; lp.type = "lowpass"; lp.frequency.value = 6500; g.gain.value = .5;
      s.connect(lp); lp.connect(g); g.connect(_ac.destination); s.start(); _typeNode = { s, g };
    } catch (e) { }
  }
  function typeStop() {
    _typeTok++; const n = _typeNode; _typeNode = null; if (!n) return;
    try { const t = _ac.currentTime; n.g.gain.cancelScheduledValues(t); n.g.gain.setValueAtTime(n.g.gain.value, t); n.g.gain.linearRampToValueAtTime(0.0001, t + .15); n.s.stop(t + .2); } catch (e) { }
  }
  /* Round title card: a black screen with the date and place, like a newsreel. Click or press any key to skip. */
  function showTitleCard(done) {
    const sc = scen(S.role.id, S.i), rd = sc || D.ROUNDS[S.i], word = sc ? sc.word : CARD_WORDS[S.i], place = sc ? sc.place : D.PLACES[S.i]; if (noFx()) { done(); return; }
    const el = document.createElement("div"); el.className = "tcard"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", `Round ${S.i + 1}: ${rd.title}`);
    el.innerHTML = `<div class="tc-in"><p class="tc-k">ROUND ${S.i + 1} OF 6</p><p class="tc-d">${esc(rd.date)}</p><span class="tc-rule"></span><p class="tc-t">${esc(rd.title)}</p><p class="tc-p">${esc(place)}</p></div><p class="tc-skip">click or press any key to skip</p>`;
    document.body.appendChild(el); sfx("card", word);
    let over = false; const end = () => { if (over) return; over = true; document.removeEventListener("keydown", end); el.classList.add("out"); stopCard(); setTimeout(() => { el.remove(); done(); }, 350); };
    el.addEventListener("click", end); document.addEventListener("keydown", end); setTimeout(end, cardSecs(word) * 1000 + 100);
  }
  /* Typewriter reveal for the briefing text. */
  function typeIn() {
    const els = $$(".paper p").filter((e) => !e.closest(".eyes")); if (!els.length || noFx() || typedFor === S.i) return; typedFor = S.i;
    const full = els.map((e) => e.textContent), total = full.reduce((n, t) => n + t.length, 0), step = Math.max(2, Math.ceil(total / (5000 / 24)));
    els.forEach((e) => { e.style.minHeight = e.offsetHeight + "px"; e.textContent = ""; });
    const skip = document.createElement("button"); skip.className = "mini skiptype"; skip.textContent = "Skip typing"; const paper = $(".paper"); if (paper) paper.prepend(skip);
    let ei = 0, ci = 0, n = 0; const caret = document.createElement("span"); caret.className = "caret"; caret.textContent = "▌";
    const finish = () => { clearInterval(fxTimer); fxTimer = null; typeStop(); caret.remove(); skip.remove(); els.forEach((e, i) => { e.textContent = full[i]; e.style.minHeight = ""; }); };
    skip.addEventListener("click", finish);
    fxTimer = setInterval(() => {
      if (ei >= els.length) { finish(); return; }
      const e = els[ei]; ci = Math.min(full[ei].length, ci + step); e.textContent = full[ei].slice(0, ci); e.appendChild(caret);
      if (ci >= full[ei].length) { ei++; ci = 0; if (ei < els.length) sfx("return"); }
    }, 24);
    typeStart();
  }
  /* Enlarge a Real History image: full-screen view, closed by the button, a click anywhere, or Escape. */
  function openZoom(src, label, from) {
    const el = document.createElement("div"); el.className = "zoombox"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", label);
    el.innerHTML = `<figure><img src="${src}" alt="${esc(label)}"><figcaption>${esc(label)}</figcaption></figure><button class="btn zoomx">Close</button>`;
    document.body.appendChild(el); document.body.style.overflow = "hidden";
    const close = () => { document.removeEventListener("keydown", key); el.remove(); document.body.style.overflow = ""; if (from) from.focus(); };
    const key = (e) => { if (e.key === "Escape") close(); };
    el.addEventListener("click", close); document.addEventListener("keydown", key); el.querySelector(".zoomx").focus();
  }
  const realKind = (rid, i) => ((D.ROLE_HIST[rid][i] || {}).call || D.REALCALL[i]).kind;
  /* Stamped debrief */
  const STAMPS = { cover: ["APPROVED", "good"], share: ["TRUSTED", "good"], open: ["HIGH RISK", "risk"], hold: ["FILED AWAY", "calm"], hold3: ["NO REPLY", "calm"], blunder: ["COMPROMISED", "risk"] };
  const METERS = [["s", "Secrecy", "Does the enemy still believe its codes are safe?"], ["i", "Impact", "Did your intelligence change events?"], ["t", "Trust", "Do the people who rely on you still trust you?"]];
  const saveGame = (done) => { if (S) store.set("cb_game", { S, done: !!done, at: Date.now() }); };
  const loadGame = () => { const g = store.get("cb_game", null); return g && g.S && g.S.role && L.roleById(g.S.role.id) && Array.isArray(g.S.log) ? g : null; };
  const board = () => { const b = store.get("cb_board", { sig: [], own: null }); b.sig = b.sig || []; return b; };
  /* Individual scenarios: a role's own version of a round, when its story happens away from the headline event. */
  const scen = (rid, i) => D.SCEN[rid + "-" + i] || null;
  const rTitle = (rid, i) => (scen(rid, i) || D.ROUNDS[i]).title, rDate = (rid, i) => (scen(rid, i) || D.ROUNDS[i]).date;
  /* Image and animation slots. On the hosted game (GitHub Pages), a file named after a slot in the images/ folder replaces the built-in picture:
     images/<slot>.png or .jpg for a Real History image, images/scene-<slot>.gif or .png for an animation. See the Asset Studio for every slot name. */
  const IMG_BUILTIN = {}; D.HEAD_IMG.forEach((s, i) => { if (REC_IMG[i]) IMG_BUILTIN[s] = REC_IMG[i]; });
  Object.keys(RECMAPS).forEach((k) => { IMG_BUILTIN[k] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(RECMAPS[k]); }); Object.assign(IMG_BUILTIN, SLOT_IMG);
  const CAN_SWAP = /^https?:$/.test(location.protocol) && !/claude\.ai|claudeusercontent/.test(location.hostname), FOUND = {};
  const imgSrc = (slot) => FOUND[slot] || (CAN_SWAP ? `images/${slot}.png` : IMG_BUILTIN[slot]);
  window.__imgNext = (el) => { const slot = el.dataset.slot, tried = el.getAttribute("src"); let next;
    if (tried === `images/${slot}.png`) next = `images/${slot}.jpg`; else next = IMG_BUILTIN[slot];
    if (!next || tried === next) { el.onerror = null; return; } if (next === IMG_BUILTIN[slot]) FOUND[slot] = next; el.src = next; };
  window.__imgOk = (el) => { FOUND[el.dataset.slot] = el.getAttribute("src"); };
  function swapScene(box) {
    if (!CAN_SWAP || !box) return; const slot = box.dataset.scene; if (FOUND["scene-" + slot] === false) return;
    const tryExt = (list) => { if (!list.length) { FOUND["scene-" + slot] = false; return; } const im = new Image(), src = `images/scene-${slot}.${list[0]}`;
      im.onload = () => { FOUND["scene-" + slot] = src; box.innerHTML = `<img class="sceneimg" src="${src}" alt="">`; }; im.onerror = () => tryExt(list.slice(1)); im.src = src; };
    if (FOUND["scene-" + slot]) { box.innerHTML = `<img class="sceneimg" src="${FOUND["scene-" + slot]}" alt="">`; return; } tryExt(["gif", "png"]);
  }
  const KIND_NOTE = { cover: "Used with a cover story", share: "Shared honestly", open: "Acted openly", hold: "Held back", hold3: "Stayed silent", blunder: "Guessed" };

  /* ---------- shared UI ---------- */
  function topbar(extra) {
    return `<header class="bar"><button class="logo" data-go="title" aria-label="Back to the title screen">CODEBREAKERS: THE SILENT SERVICE</button><span class="classif">TOP SECRET // EYES ONLY</span><nav class="bar-r">${extra || ""}<button class="mini" data-go="board">Decoder board</button></nav></header>`;
  }
  function hud() {
    const pips = D.ROUNDS.map((r, i) => `<span class="pip ${i < S.i ? "done" : i === S.i ? "now" : ""}" title="Round ${i + 1}"></span>`).join("");
    const bars = METERS.map(([k, n, h]) => `<div class="meter" title="${esc(h)}"><span class="ml">${n}</span><span class="mt"><span class="mf m-${k}" style="width:${S.st[k]}%"></span></span><b>${S.st[k]}</b></div>`).join("");
    return `<div class="hud" role="group" aria-label="Status"><div class="pips" aria-label="Round ${S.i + 1} of 6">${pips}</div>${bars}<div class="score">SCORE <b>${S.score}</b></div></div>`;
  }
  function bindGo() { $$("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go))); }
  function go(v) {
    if (v === "board") { if (view !== "board") prevView = view; }
    
    view = v; render(); window.scrollTo(0, 0);
    try { history.replaceState(null, "", v === "board" ? "#board" : location.pathname + location.search); } catch (e) { }
  }
  function render() {
    if (fxTimer) { clearInterval(fxTimer); fxTimer = null; typeStop(); } const oc = $(".tcard"); if (oc) { oc.remove(); stopCard(); } const zx = $(".zoombox"); if (zx) { zx.remove(); document.body.style.overflow = ""; }
    ({ title: renderTitle, pick: renderPick, round: renderRound, end: renderEnd, board: renderBoard }[view] || renderTitle)();
    bindGo(); const h = $("[data-focus]"); if (h) h.focus({ preventScroll: true });
  }
  function copyText(text, btn, done) {
    const row = btn && btn.closest(".row"), msg = row && row.nextElementSibling && row.nextElementSibling.classList.contains("cmsg") ? row.nextElementSibling : null, ok = () => { if (msg) msg.textContent = done || "Copied. Paste it into Padlet."; if (btn) { const t = btn.textContent; btn.textContent = "Copied"; setTimeout(() => { btn.textContent = t; }, 1500); } };
    const fb = () => { const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); let d = false; try { d = document.execCommand("copy"); } catch (e) { } ta.remove(); if (d) ok(); else if (msg) msg.textContent = "Select the text and press Ctrl+C (Cmd+C on a Mac)."; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fb); else fb();
  }

  /* ---------- title ---------- */
  function renderTitle() {
    const b = board(), n = b.sig.length, saved = loadGame();
    root.innerHTML = topbar() + `<main class="wrap">
      <section class="hero"><div class="hero-art" data-scene="title">${ART.scene("enigma")}</div>
        <div class="hero-t"><span class="stampline">TOP SECRET</span><h1 data-focus tabindex="-1">Codebreakers: The Silent Service</h1>
        <p class="lede">You hold one piece of a secret message. The people who hold the rest are your classmates. Crack your fragment, make the call, then use Padlet to piece the message together.</p>
        <p class="boot">&gt; CLEARANCE: <span>GRANTED</span><br>&gt; OPERATION: <span>SIX ROUNDS, 1939 TO 1944</span><br>&gt; ASSET: <span>YOU</span><b class="blink">_</b></p>
        <div class="row">${saved ? `<button class="btn" id="resume">Resume: ${esc(saved.S.role.name)}, round ${Math.min(saved.S.i + 1, 6)}</button>` : ""}<button class="btn${saved ? " ghost" : ""}" id="start">${saved ? "Start a new game" : "Begin operation"}</button><button class="btn ghost" data-go="board">Decoder board${n ? ` (${n})` : ""}</button></div></div></section>
      <section class="how panel"><h2>Your mission</h2><ol class="steps">
        <li><span><b>Play your role.</b> Six rounds. Each has a private briefing, a coded fragment to crack, and orders to give.</span></li>
        <li><span><b>Post your file to Padlet.</b> You finish with a case card and a Signal ID.</span></li>
        <li><span><b>Decode classmates.</b> Paste their Signal IDs into the decoder. You see what their role did, and pieces of the secret messages unlock.</span></li>
                <li><span><b>Reply on Padlet.</b> Reply to each classmate you decode, using a question you pick from the list.</span></li>
        <li><span><b>Submit the decoded messages.</b> You cannot read all six messages alone. Decode all four other roles, then submit the decoded messages to your teacher for credit for the assignment. Do not post them on Padlet.</span></li></ol></section></main>`;
    swapScene($(".hero-art"));
    $("#start").addEventListener("click", () => { if (saved) store.set("cb_game", null); go("pick"); });
    const rs = $("#resume"); if (rs) rs.addEventListener("click", () => { S = saved.S; picked = S.role.id; stage = "brief"; solved = false; chosen = null; titleCard = !saved.done; typedFor = -1; go(saved.done ? "end" : "round"); });
  }

  /* ---------- role pick ---------- */
  function renderPick() {
    root.innerHTML = topbar() + `<main class="wrap"><div><p class="kick">STEP 1 OF 2 · PERSONNEL FILES</p><h1 data-focus tabindex="-1">Choose your role</h1></div>
      <p class="lede">Pick any role you like. Every role holds a different piece of the message in every round.</p>
      <div class="roles" role="radiogroup" aria-label="Role">${D.ROLES.map((r) => `<button class="rolecard${picked === r.id ? " on" : ""}" role="radio" aria-checked="${picked === r.id}" data-r="${r.id}"><span class="rp">${ART.portrait(r.id, "pk" + r.id)}</span><span class="rb"><span class="rcode">${r.id}</span><b>${esc(r.name)}</b><small>${esc(r.place)}</small></span><span class="rb rd">${esc(r.blurb)}</span></button>`).join("")}</div>
      <div class="field"><label for="cname">STEP 2 OF 2 · Your name or codename (printed on your Padlet card)</label><input id="cname" maxlength="24" autocomplete="off" value="${esc(store.get("cb_name", ""))}"></div>
      <div class="row"><button class="btn" id="begin" disabled>Begin round 1</button><button class="btn ghost" data-go="title">Back</button></div><p class="err" id="perr" role="alert"></p></main>`;
    const bb = $("#begin"), sync = () => { bb.disabled = !picked; };
    $$(".rolecard").forEach((c) => c.addEventListener("click", () => { picked = c.dataset.r; $$(".rolecard").forEach((x) => { const on = x.dataset.r === picked; x.classList.toggle("on", on); x.setAttribute("aria-checked", on); }); sync(); }));
    sync();
    bb.addEventListener("click", () => {
      const name = $("#cname").value.trim(); if (!name) { $("#perr").textContent = "Enter a name or codename first."; $("#cname").focus(); return; }
      store.set("cb_name", name); S = L.newState(L.roleById(picked), name); stage = "brief"; solved = false; chosen = null; titleCard = true; typedFor = -1;
      const b = board(); b.own = { role: S.role.id, rounds: 0 }; b.prog = b.prog || {}; b.prog[S.role.id] = 0; store.set("cb_board", b); saveGame(false); go("round");
    });
  }

  /* ---------- round ---------- */
  const OBJ = {
    brief: "Read the situation below. When you are ready, open your envelope for a private briefing that no other role receives.",
    decrypt: "Decrypt your fragment. Drag the dial, or use the arrows or slider, until the green DECODED line reads as English.",
    decide: "Choose your orders. Click an option (or press A, B or C), then press Send orders.",
    outcome: "Debrief. See what your decision caused and how your gauges moved, then continue."
  };
  function steps(cur) {
    return `<ol class="steptrack" aria-label="Round steps">${["Briefing", "Decrypt", "Decide", "Debrief"].map((n, i) => `<li class="st ${i < cur ? "done" : i === cur ? "now" : ""}" ${i === cur ? 'aria-current="step"' : ""}><b>${i + 1}</b><span class="sl2">${n}</span></li>`).join("")}</ol>`;
  }
  const timelineStrip = (r, sc) => { const list = D.TIMELINE.concat(sc ? [Object.assign({ mine: 1 }, sc.tl)] : []).sort((a, b) => a.k - b.k);
    return `<ol class="tl" aria-label="Timeline, 1939 to 1945">${list.map((e) => { const now = sc ? e.mine : e.r === r, tag = now ? `<b class="here">YOU ARE HERE</b>` : e.r === r ? `<i class="rn">Meanwhile</i>` : e.r !== undefined ? `<i class="rn">Round ${e.r + 1}</i>` : "";
      return `<li class="${now ? "now" : e.r !== undefined ? "rd" : ""}"${now ? ' aria-current="true"' : ""}><span class="d">${esc(e.d)}</span>${esc(e.t)}${tag}</li>`; }).join("")}</ol>`; };
  function renderRound() {
    const rd = D.ROUNDS[S.i], role = S.role, rr = role.r[S.i], sc = scen(role.id, S.i), hist = D.ROLE_HIST[role.id][S.i];
    const imgSlot = sc ? sc.img : D.HEAD_IMG[S.i], recLabel = sc ? hist.label : D.REC[S.i].label;
    const head = `<div><p class="kick">ROUND ${S.i + 1} OF 6 · ${esc(rDate(role.id, S.i))}${sc ? ` · ${esc(sc.place.toUpperCase())}` : ""}</p><h1 data-focus tabindex="-1">${esc(rTitle(role.id, S.i))}</h1></div>`;
    let body = "", cur = 0, obj = OBJ.brief;
    if (stage === "brief") {
      const prevK = S.i > 0 && S.log[S.i - 1] ? S.log[S.i - 1].kind : null, prevOff = S.i > 0 && D.ROLE_HIST[role.id][S.i - 1], ec = !prevK ? null : prevOff ? { t: D.ECHO_GENERIC[prevK] } : D.ECHO[S.i] ? D.ECHO[S.i][prevK] : null;
      body = `${ec ? `<aside class="echo" aria-label="Your war so far"><span class="echost">YOUR WAR SO FAR</span><p class="echok">Because of your orders in round ${S.i}: ${esc(rTitle(role.id, S.i - 1))}</p><p class="echot">${esc(ec.t)}</p>${ec.real ? `<p class="echor"><b>Real history:</b> ${esc(ec.real)}</p>` : ""}</aside>` : ""}<div class="hero-art small" data-scene="${imgSlot}">${ART.scene(sc ? sc.scene : rd.scene)}</div>${timelineStrip(S.i, sc)}<div class="paper">${(sc ? sc.sitrep : rd.sitrep).map((p) => `<p>${esc(p)}</p>`).join("")}${sc && D.MEANWHILE[S.i] ? `<p class="meanwhile">${esc(D.MEANWHILE[S.i])}</p>` : ""}</div>
        <aside class="rec" aria-label="From the record"><span class="recst">REAL HISTORY</span><div class="recbody">${sc ? `<p class="reck">FROM THE RECORD · ${esc(hist.label)}</p><p class="rect">${esc(hist.t)}</p>` : `<p class="reck">FROM THE RECORD · ${esc(D.REC[S.i].label)}</p><p class="rect">${esc(D.REC[S.i].text)}</p>${hist ? `<div class="recrole"><p class="reck">ON YOUR FRONT · ${esc(hist.label)}</p><p class="rect">${esc(hist.t)}</p></div>` : ""}`}<p class="recf">This really happened. Keep it in mind when you choose your orders.</p></div>${IMG_BUILTIN[imgSlot] || CAN_SWAP ? `<figure class="recimg"><button class="zoombtn" id="zoom" aria-label="Enlarge the image: ${esc(recLabel)}"><img data-slot="${imgSlot}" src="${imgSrc(imgSlot)}" onload="__imgOk(this)" onerror="__imgNext(this)" alt="Illustration: ${esc(recLabel)}"><span class="zoomhint" aria-hidden="true">⤢ Click to enlarge</span></button></figure>` : `<figure class="recmap">${ART.map(S.i)}<figcaption>Sketch map, not to scale</figcaption></figure>`}</aside>
        <p class="eq"><b>Essential question</b> ${esc(rd.eq)}</p><div class="terms">${rd.terms.map((t) => `<p><b>${esc(t.t)}.</b> ${esc(t.d)}</p>`).join("")}</div>
        ${S.i === 0 ? `<p class="gauge-help">Your three gauges: <b>Secrecy</b> (does the enemy still trust its codes?), <b>Impact</b> (did your intelligence change events?) and <b>Trust</b> (do your colleagues still rely on you?). Strong careers need all three.</p>` : ""}
        <div class="row"><button class="btn" id="next">Open your envelope</button></div>`;
    } else if (stage === "work") {
      cur = solved ? 2 : 1; obj = solved ? OBJ.decide : OBJ.decrypt;
      const k = L.shiftFor(role.id, S.i), pl = L.piece(S.i, role.id), cipher = L.encode(pl, k), pos = L.roleIdx(role.id) + 1;
      body = `<div class="paper eyes"><span class="stamp">EYES ONLY</span><div class="dochead"><span><b>FROM</b> ${esc(rr.src)}</span><span><b>TO</b> ${esc(role.name)}</span><span><b>DATE</b> ${esc(rDate(role.id, S.i))}</span><span><b>REF</b> NK-${String(S.i + 1).padStart(2, "0")}-${role.id}</span></div><p>${esc(rr.text)}</p><p class="small">Other roles in your class received different briefings for this round.</p></div>
        <section class="decoder panel" aria-labelledby="dt"><h2 id="dt">Intercept: piece ${pos} of 5</h2><p>An operator copied down your station's part of a message. It is a simple shift cipher: every letter was moved the same number of places. Rotate the inner ring until the text reads as English.</p>
        <div class="cipher" aria-label="Coded text"><span class="clabel">INTERCEPTED</span><code>${esc(cipher)}</code></div>
        <div class="diskwrap"><svg id="disk" viewBox="0 0 260 260" role="img" aria-label="Cipher disk. Drag to rotate."></svg>
          <div class="dctl"><div class="dset"><button class="mini" id="dm" aria-label="Turn the disk back one">◀</button><label for="dr">Shift <b id="dv">0</b></label><button class="mini" id="dp" aria-label="Turn the disk forward one">▶</button></div>
          <input id="dr" type="range" min="0" max="25" value="0" aria-valuetext="Shift 0"><div class="sigrow"><span class="clabel">SIGNAL</span><div class="sbar" id="sbar" role="img" aria-label="Signal strength">${"<i></i>".repeat(13)}</div><b id="slab">NOISE</b></div>
          <div class="cipher out" aria-live="polite"><span class="clabel">DECODED</span><code id="dout"></code></div>
          <div class="row"><button class="mini" id="dkey">Need a hint?</button><button class="mini" id="dsnd" aria-pressed="true">Sound: on</button></div><div id="dmsg" role="status"></div></div></div></section>
        <section id="decide" ${solved ? "" : "hidden"}></section>`;
    } else {
      cur = 3; obj = OBJ.outcome;
      const lg = S.log[S.log.length - 1], pl = L.piece(S.i, role.id);
      const chips = METERS.map(([m, n]) => `<span class="chip ${lg.fx[m] >= 0 ? "up" : "dn"}">${n} ${lg.fx[m] >= 0 ? "+" : ""}${lg.fx[m]}</span>`).join("");
      const slots = D.ROLES.map((r) => `<li class="slot ${r.id === role.id ? "mine" : ""}"><span>${esc(r.short)}</span><b>${r.id === role.id ? esc(pl) : "?????"}</b></li>`).join("");
      body = `<div class="paper"><p class="src">Outcome</p><p>${esc(lg.out)}</p><div class="chips">${chips}<span class="chip">+${lg.pts} experience</span></div></div>
        <div class="paper"><p class="src">In history</p><p>${esc(sc ? hist.t : rd.real)}</p></div>
        ${(() => { const rc = (D.ROLE_HIST[role.id][S.i] || {}).call || D.REALCALL[S.i], same = lg.kind === rc.kind; return `<div class="realcall ${same ? "same" : "diff"}"><p class="rck">THE REAL CALL</p><p class="rcv">${same ? "✓ You made the same call the real people made." : "✗ The real people chose differently."}</p><p class="rct">${esc(rc.t)}</p></div>`; })()}
        <section class="panel"><h2>The message so far</h2><p class="small">Your piece is pinned. The other four belong to other roles. They unlock when you decode classmates' Signal IDs on the Decoder board.</p><ol class="slots">${slots}</ol></section>
        <div class="row"><button class="btn" id="next">${S.i < 5 ? "Next round" : "Close the file"}</button></div>`;
    }
    root.innerHTML = topbar() + `<main class="wrap">${hud()}${head}${steps(cur)}<div class="obj" role="note"><span>OBJECTIVE</span><p id="objt">${esc(obj)}</p></div>${body}</main>`;
    if (stage === "brief") { const nowEl = $(".tl .now"); if (nowEl) nowEl.parentNode.scrollLeft = Math.max(0, nowEl.offsetLeft - 60); }
    if (stage === "brief") { const zb = $("#zoom"); if (zb) zb.addEventListener("click", () => { const im = zb.querySelector("img"); openZoom(im.currentSrc || im.src, recLabel, zb); }); swapScene($(".hero-art.small")); }
    if (stage === "brief") { const go1 = () => typeIn(); if (titleCard) { titleCard = false; showTitleCard(go1); } else go1(); }
    if (stage === "outcome") { const lg = S.log[S.log.length - 1], st = STAMPS[lg.kind] || ["FILED", "calm"], pp = $(".paper"); if (pp) { pp.classList.add("outc"); const sp = document.createElement("span"); sp.className = "dstamp"; sp.dataset.tone = st[1]; sp.textContent = st[0]; pp.appendChild(sp); if (!noFx()) { pp.classList.add("pre"); setTimeout(() => { pp.classList.remove("pre"); sp.classList.add("slam"); pp.classList.add("thump"); sfx("slam"); }, 650); } } }
    if (stage === "brief") $("#next").addEventListener("click", () => { stage = "work"; solved = false; chosen = null; render(); window.scrollTo(0, 0); });
    else if (stage === "work") bindWork();
    else {
      $("#next").addEventListener("click", () => { S.i++; stage = "brief"; solved = false; chosen = null; titleCard = true; if (S.i >= 6) { S.i = 5; go("end"); } else { saveGame(false); render(); window.scrollTo(0, 0); } });
    }
  }
  function bindWork() {
    const role = S.role, k = L.shiftFor(role.id, S.i), pl = L.piece(S.i, role.id), cipher = L.encode(pl, k);
    const svg = $("#disk"), A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; let o = "", inn = "";
    for (let i = 0; i < 26; i++) { const a = i * 360 / 26; o += `<text transform="rotate(${a} 130 130) translate(130 20)" class="dl o" text-anchor="middle">${A[i]}</text>`; inn += `<text transform="rotate(${a} 130 130) translate(130 52)" class="dl n" text-anchor="middle">${A[i]}</text>`; }
    svg.setAttribute("viewBox", "0 0 260 260");
    svg.innerHTML = `<circle cx="130" cy="130" r="126" class="d1"/><circle cx="130" cy="130" r="90" class="d2"/><circle cx="130" cy="130" r="64" class="d3"/><g>${o}</g><g id="inner">${inn}</g><path d="M130 4v18" class="dmark"/><circle cx="130" cy="130" r="6" class="d4"/>`;
    const r = $("#dr"), out = $("#dout"); let prevV = -1;
    let snd = store.get("cb_sound", true), ac = null;
    const tick = (lock) => {
      try { if (navigator.vibrate) navigator.vibrate(lock ? [20, 30, 40] : 8); } catch (e) { }
      if (!snd) return;
      try {
        ac = ac || _ac || (_ac = new (window.AudioContext || window.webkitAudioContext)()); if (ac.state === "suspended") ac.resume();
        const t0 = ac.currentTime;
        if (lock) {   // cipher solved: the supplied door-open recording
          loadDial(ac); playSolve();
        } else {      // the dial click: a real metal ratchet click from the supplied recording, with tiny pitch changes so repeats don't sound identical
          loadDial(ac); playDial();
        }
      } catch (e) { }
    };
    const sb = $("#dsnd"); const syncSnd = () => { sb.textContent = "Sound: " + (snd ? "on" : "off"); sb.setAttribute("aria-pressed", String(snd)); }; syncSnd();
    sb.addEventListener("click", () => { snd = !snd; store.set("cb_sound", snd); syncSnd(); if (snd) tick(false); });
    const set = (v) => {
      v = ((v % 26) + 26) % 26; r.value = v; $("#dv").textContent = v; r.setAttribute("aria-valuetext", "Shift " + v);
      const inn2 = $("#inner"); inn2.style.transformOrigin = "130px 130px"; inn2.style.transform = `rotate(${v * 360 / 26}deg)`;
      const dec = L.decode(cipher, v), dist = Math.min(Math.abs(v - k), 26 - Math.abs(v - k)), lit = 13 - dist;
      out.innerHTML = Array.from(dec).map((ch, i) => `<span class="lt${v === k ? " won" : ""}" style="animation-delay:${v === k ? i * 45 : 0}ms">${esc(ch)}</span>`).join("");
      $$("#sbar i").forEach((e, i) => { e.className = i < lit ? (lit >= 12 ? "on hot" : lit >= 9 ? "on warm" : "on") : ""; });
      $("#slab").textContent = v === k ? "LOCKED" : lit >= 12 ? "ALMOST!" : lit >= 9 ? "WARMER" : lit >= 6 ? "FAINT" : "NOISE";
      if (v !== prevV) { tick(v === k); prevV = v; }
      if (v === k) win();
    };
    const win = () => {
      if (solved) return; solved = true; const dw = $(".diskwrap"); if (dw) { dw.classList.add("burst"); setTimeout(() => dw.classList.remove("burst"), 1200); } $("#dmsg").innerHTML = `<div class="granted">ACCESS GRANTED</div><p class="dmsg">Your piece reads: ${esc(pl)}.</p>`;
      const dec = $("#decide"); dec.hidden = false; renderDecide(dec); const o2 = $("#objt"); if (o2) o2.textContent = OBJ.decide;
      const st = $$(".st"); st.forEach((e, i) => { e.classList.toggle("done", i < 2); e.classList.toggle("now", i === 2); }); 
      dec.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    r.addEventListener("input", () => set(+r.value)); $("#dm").addEventListener("click", () => set(+r.value - 1)); $("#dp").addEventListener("click", () => set(+r.value + 1));
    let hn = 0; const hints = () => { const lo = Math.max(1, k - 4), hi = Math.min(25, lo + 8); return [
      "Look for the shortest words in the intercepted text. One and two letter words are easiest to crack. Turn the wheel until they make sense.",
      `The clerk narrows it down: the shift is somewhere from ${lo} to ${hi}.`,
      `The clerk remembers that your piece starts with the letter ${pl[0]}. Turn the wheel until the decoded text starts with ${pl[0]}.`]; };
    const hb = $("#dkey"); const hlab = () => { hb.textContent = hn >= 3 ? "No more hints" : `Need a hint? (${hn} of 3 used)`; hb.disabled = hn >= 3; }; hlab();
    hb.addEventListener("click", () => { if (hn >= 3 || solved) return; const h = hints(); $("#dmsg").innerHTML = h.slice(0, hn + 1).map((t, i) => `<p class="dmsg"><b>Hint ${i + 1}.</b> ${esc(t)}</p>`).join(""); hn++; S.hints = (S.hints || 0) + 1; hlab(); });
    /* drag the wheel */
    let drag = null; const ang = (ev) => { const b = svg.getBoundingClientRect(); return Math.atan2(ev.clientY - (b.top + b.height / 2), ev.clientX - (b.left + b.width / 2)) * 180 / Math.PI; };
    svg.addEventListener("pointerdown", (ev) => { drag = { a: ang(ev), v: +r.value, acc: 0, last: ang(ev) }; try { svg.setPointerCapture(ev.pointerId); } catch (e) { } });
    svg.addEventListener("pointermove", (ev) => { if (!drag) return; const a = ang(ev); let d = a - drag.last; if (d > 180) d -= 360; if (d < -180) d += 360; drag.acc += d; drag.last = a; const nv = drag.v + Math.round(drag.acc / (360 / 26)); if (nv !== +r.value && ((nv % 26) + 26) % 26 !== +r.value) set(nv); });
    const end = () => { drag = null; }; svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
    if (solved) { set(k); $("#dmsg").innerHTML = `<p class="dmsg">Decoded: ${esc(pl)}.</p>`; renderDecide($("#decide")); } else set(0);
  }
  function renderDecide(el) {
    const role = S.role, rr = role.r[S.i], ord = L.order(role.id, S.i), pl = L.piece(S.i, role.id);
    el.innerHTML = `<div class="paper"><p class="src">Orders · your piece: ${esc(pl)}</p><h2>${esc(rr.ask)}</h2><ul class="menu">${ord.map((ci, j) => `<li><button class="mitem" data-j="${j}" aria-pressed="false"><span class="key">${"ABC"[j]}</span><span>${esc(rr.c[ci][0])}</span></button></li>`).join("")}</ul>
      <div class="sendrow"><button class="btn" id="send" disabled>Send orders</button><p class="small" id="shint">Select an option first. You cannot undo orders once sent.</p></div></div>`;
    const sel = (j) => { chosen = j; $$(".mitem", el).forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.j === j))); $("#send").disabled = false; $("#shint").textContent = "Option " + "ABC"[j] + " selected. Press Send orders (or Enter) to commit."; };
    const send = () => { if (chosen === null || stage !== "work") return; L.choose(S, chosen); const b = board(); b.own = { role: role.id, rounds: S.i + 1 }; b.prog = b.prog || {}; b.prog[role.id] = Math.max(b.prog[role.id] || 0, S.i + 1); store.set("cb_board", b); stage = "outcome"; render(); window.scrollTo(0, 0); };
    $$(".mitem", el).forEach((b) => b.addEventListener("click", () => sel(+b.dataset.j)));
    $("#send").addEventListener("click", send);
    window.__sel = sel; window.__send = send;
  }
  document.addEventListener("keydown", (ev) => {
    if (ev.ctrlKey || ev.metaKey || ev.altKey || view !== "round" || stage !== "work" || !solved) return;
    const tag = ev.target && ev.target.tagName; if (/TEXTAREA|INPUT|SELECT/.test(tag)) return;
    const j = "abc".indexOf(ev.key.toLowerCase());
    if (j >= 0 && ev.key.length === 1 && window.__sel) { ev.preventDefault(); window.__sel(j); }
    else if (ev.key === "Enter" && tag !== "BUTTON" && chosen !== null && window.__send) { ev.preventDefault(); window.__send(); }
  });

  /* ---------- end ---------- */
  function renderEnd() {
    const fs = L.finalScore(S), e = fs.e, rank = L.rank(fs.total), id = L.signalId(S), role = S.role, rIdx = D.RANKS.indexOf(rank);
    S.ended = { fs, e, rank, id };
    const b = board(); b.own = { role: role.id, rounds: 6 }; b.prog = b.prog || {}; b.prog[role.id] = 6; store.set("cb_board", b); saveGame(true);
    const meters = METERS.map(([k, n]) => `<div class="meter"><span class="ml">${n}</span><span class="mt"><span class="mf m-${k}" style="width:${S.st[k]}%"></span></span><b>${S.st[k]}</b></div>`).join("");
    root.innerHTML = topbar() + `<main class="wrap">
      <section class="endhero"><div class="pw">${ART.portrait(role.id, "end")}<div class="stampbig">CLEARED<br>${esc(rank.title.toUpperCase())}</div></div><div><p class="kick">FILE CLOSED · ${esc(role.name.toUpperCase())}</p><h1 data-focus tabindex="-1">${esc(e.title)}</h1><p class="small">${esc(e.tag)}</p><p>${esc(e.desc)}</p></div></section>
      <section class="stats"><div class="stat"><span class="sl">FINAL SCORE</span><b>${fs.total}</b><small>Choices ${S.score} · Stats ${fs.meters} · Ending ${fs.ending}</small></div><div class="stat"><span class="sl">RANK</span><b class="t">${esc(rank.title)}</b><small>${rIdx + 1} of ${D.RANKS.length}</small></div><div class="stat wide"><span class="sl">SIGNAL ID</span><b class="mono" id="sigid">${id}</b><small>Goes on your Padlet card. Classmates decode it.</small></div></section>
      <div class="meters3">${meters}</div>
      ${badgesHTML()}
      <p class="note"><b>Think about it.</b> ${esc(e.ask)}</p><p class="note"><b>Real people in roles like yours.</b> ${esc(role.echo)}</p>
      <section><h2>Your decisions</h2><ol class="journey">${S.log.map((x) => `<li><span class="jd">${esc(rDate(role.id, x.i))}</span><b>${esc(rTitle(role.id, x.i))}</b><span>${"ABC"[x.slot]}. ${esc(x.label)}</span><span class="jk">${esc(KIND_NOTE[x.kind])}${x.kind === realKind(role.id, x.i) ? " · ✓ same as history" : " · different from history"}</span></li>`).join("")}</ol><p class="small">You matched the real decision in ${S.log.filter((x) => x.kind === realKind(role.id, x.i)).length} of 6 rounds.</p></section>
      <section class="decoder"><h2>Decode a classmate</h2><p>Find a classmate's Padlet card from a different role. Type their Signal ID here. You will see their choices and unlock their pieces of the messages.</p>${decoderForm()}</section>
      <section class="padlet"><h2>Post to Padlet</h2><p>Add your card image and post text to the class Padlet. Then decode classmates from other roles with the Signal IDs on their cards, and reply to their posts.</p>
        <div class="cardwrap" id="cardsvg">${cardSVG()}</div><div class="row"><button class="btn" id="dl">Download card image</button><button class="btn ghost" id="cpimg">Copy image</button></div>
        <div class="field"><label for="qsel">Question for your classmates</label><select id="qsel">${role.qs.concat([e.ask]).map((q, i) => `<option value="${i}">${esc(clip(q, 100))}</option>`).join("")}</select></div>
        <div class="field"><label for="ptext">Post text (edit it so it sounds like you)</label><textarea id="ptext" rows="12"></textarea></div><div class="row"><button class="btn" id="cptext">Copy post text</button><button class="btn ghost" id="again">Play another role</button></div><p class="small cmsg" role="status"></p></section></main>`;
    const qs = role.qs.concat([e.ask]), paint = () => { $("#ptext").value = cardText(qs[+$("#qsel").value]); };
    $("#qsel").addEventListener("change", paint); paint();
    $("#cptext").addEventListener("click", (ev) => copyText($("#ptext").value, ev.currentTarget, "Copied. Paste it into your Padlet post."));
    $("#again").addEventListener("click", () => { store.set("cb_game", null); S = null; picked = null; go("pick"); });
    $("#dl").addEventListener("click", downloadCard); $("#cpimg").addEventListener("click", copyCard);
    bindDecoder();
  }
  function badgesHTML() {
    const b = L.badges(S); return `<section class="badges"><h2>Badges earned</h2><ul class="bdg">${b.got.map((x) => `<li><span class="medal" aria-hidden="true">${x.icon}</span><span><b>${esc(x.name)}</b><small>${esc(x.why)}</small></span></li>`).join("")}</ul><p class="small">${b.got.length} of ${b.total} badges. Play a different role to earn more.</p></section>`;
  }
  function cardText(q) {
    const fs = S.ended.fs, role = S.role, L1 = "━━━━━━━━━━━━━━━━━━━━";
    return [`${S.name.toUpperCase()} · ${role.name}`, `${S.ended.e.title} · ${S.ended.rank.title} · Score ${fs.total}`, "", `SIGNAL ID: ${S.ended.id}`, `Secrecy ${S.st.s} · Impact ${S.st.i} · Trust ${S.st.t}`, `Badges: ${L.badges(S).got.filter((x) => x.id !== "duty").map((x) => x.name).join(" · ") || "Reporting for Duty"}`, L1, `QUESTION FOR YOU: ${q}`, L1, "Decode my Signal ID in Codebreakers: The Silent Service, then reply with DECODED and my ID.", "#NeedToKnow"].join("\n");
  }
  function cardSVG() {
    const role = S.role, fs = S.ended.fs, W = 640, H = 500;
    const rows = S.log.map((x, i) => `<text x="206" y="${272 + i * 31}" font-size="12" fill="#dfe3dc"><tspan fill="#f0b93a" font-weight="700">${i + 1}  ${esc(L.piece(i, role.id))}</tspan></text><text x="206" y="${286 + i * 31}" font-size="11" fill="#8e9a93">${esc(clip(x.label, 54))}</text>`).join("");
    const bar = (k, n, y) => `<text x="206" y="${y}" font-size="11" fill="#8e9a93" letter-spacing="2">${n.toUpperCase()}</text><rect x="290" y="${y - 9}" width="220" height="9" fill="#1a2320"/><rect x="290" y="${y - 9}" width="${S.st[k] * 2.2}" height="9" fill="${{ s: "#4f7d96", i: "#f0b93a", t: "#5f9e6e" }[k]}"/><text x="520" y="${y}" font-size="11" fill="#dfe3dc">${S.st[k]}</text>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Courier New, monospace" shape-rendering="crispEdges"><rect width="${W}" height="${H}" fill="#07090a"/><rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="#46555b" stroke-width="4"/>
      <path d="M10 34v-24h24M${W - 34} ${H - 10}h24v-24" stroke="#f0b93a" stroke-width="4" fill="none"/>
      <text x="28" y="40" font-size="11" fill="#e0544a" letter-spacing="4">TOP SECRET // CODEBREAKERS: THE SILENT SERVICE</text>
      <g transform="translate(28 56)"><rect width="152" height="176" fill="#000" stroke="#46555b" stroke-width="4"/><svg x="0" y="0" width="152" height="176" viewBox="0 0 120 140" preserveAspectRatio="xMidYMid slice">${ART.portraitInner(role.id, "cd")}</svg></g>
      <text x="206" y="82" font-size="30" font-weight="700" fill="#dfe3dc" letter-spacing="1">${esc(clip(S.name.toUpperCase(), 16))}</text><text x="206" y="106" font-size="14" fill="#f0b93a">${esc(role.name)}</text><text x="206" y="126" font-size="13" fill="#8e9a93">${esc(S.ended.e.title)}</text>
      <g><rect x="396" y="40" width="200" height="60" fill="none" stroke="#e0544a" stroke-width="4"/><text x="496" y="64" text-anchor="middle" font-size="12" fill="#e0544a" font-weight="700" letter-spacing="3">CLEARED</text><text x="496" y="88" text-anchor="middle" font-size="14" fill="#e0544a" font-weight="700">${esc(clip(S.ended.rank.title.toUpperCase(), 18))}</text></g>
      ${bar("s", "Secrecy", 156)}${bar("i", "Impact", 176)}${bar("t", "Trust", 196)}
      <text x="206" y="222" font-size="11" fill="#8e9a93" letter-spacing="2">SCORE</text><text x="262" y="222" font-size="15" font-weight="700" fill="#dfe3dc">${fs.total}</text><text x="320" y="222" font-size="11" fill="#8e9a93" letter-spacing="2">SIGNAL ID</text><text x="398" y="222" font-size="17" font-weight="700" fill="#f0b93a" letter-spacing="2">${S.ended.id}</text>
      <text x="28" y="262" font-size="11" fill="#8e9a93" letter-spacing="3">PIECES</text>${S.log.map((x, i) => `<text x="28" y="${284 + i * 31}" font-size="12" fill="#f0b93a" font-weight="700">R${i + 1} ${esc(clip(L.piece(i, role.id), 12))}</text>`).join("")}
      ${S.log.map((x, i) => `<text x="206" y="${284 + i * 31}" font-size="11" fill="#c9d0c8">${esc(clip(x.label, 56))}</text>`).join("")}
      <text x="28" y="${H - 44}" font-size="11" fill="#f0b93a">BADGES</text><text x="86" y="${H - 44}" font-size="11" fill="#c9d0c8">${esc(clip(L.badges(S).got.filter((x) => x.id !== "duty").map((x) => x.name).join(" · ") || "Reporting for Duty", 66))}</text>
      <text x="28" y="${H - 26}" font-size="10" fill="#6e8077">Decode this Signal ID in Codebreakers: The Silent Service to read my choices. · Unit 10 World History</text></svg>`;
  }
  async function cardPNG() {
    const svg = $("#cardsvg svg"), vb = svg.viewBox.baseVal, scale = 2, xml = new XMLSerializer().serializeToString(svg);
    const img = new Image(); await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml); });
    const c = document.createElement("canvas"); c.width = vb.width * scale; c.height = vb.height * scale; const cx = c.getContext("2d"); cx.imageSmoothingEnabled = false; cx.drawImage(img, 0, 0, c.width, c.height);
    return new Promise((res) => c.toBlob(res, "image/png"));
  }
  async function downloadCard() {
    const msg = (t) => { const m = $("#cardsvg").closest("section").querySelector(".cmsg"); if (m) m.textContent = t; };
    try {
      const blob = await cardPNG(), name = "need-to-know-" + S.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".png";
      let dl = null; try { dl = window.claude && window.claude.use ? await window.claude.use("downloads") : null; } catch (e) { }
      if (dl) { try { await dl.save({ filename: name, data: blob }); msg("Card image saved. Attach it to your Padlet post."); return; } catch (e) { if (e && e.code === "declined") return; } }
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); msg("Card image downloaded. Attach it to your Padlet post.");
    } catch (e) { msg("Could not make the image. Take a screenshot of the card instead."); }
  }
  async function copyCard() {
    const m = $("#cardsvg").closest("section").querySelector(".cmsg");
    try { const blob = await cardPNG(); await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]); m.textContent = "Card image copied. Paste it into Padlet."; } catch (e) { m.textContent = "Your browser would not copy the image. Use Download instead."; }
  }

  /* ---------- decoder ---------- */
  function decoderForm() { return `<div class="dform"><label for="sid" class="sr">Signal ID</label><input id="sid" placeholder="Example: BP-ACBACB-FD" autocomplete="off" spellcheck="false" maxlength="16"><button class="btn" id="dgo">Decode</button></div><p class="err" id="derr" role="alert"></p><div id="dres" aria-live="polite"></div>`; }
  function bindDecoder() {
    const run = () => {
      const p = L.parseSignal($("#sid").value), err = $("#derr"); $("#dres").innerHTML = "";
      if (!p) { err.textContent = "That Signal ID does not decode. Check the letters and dashes. It looks like XX-ABCABC-YY."; return; }
      err.textContent = ""; const b = board(); if (b.sig.indexOf(p.id) < 0) { b.sig.push(p.id); store.set("cb_board", b); }
      lastDecoded = p.id; $("#dres").innerHTML = decodedCard(p); bindReply(p);
    };
    $("#dgo").addEventListener("click", run); $("#sid").addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
    if (lastDecoded && view === "board") { const p = L.parseSignal(lastDecoded); if (p) { $("#sid").value = ""; } }
  }
  function decodedCard(p) {
    const mine = S && S.role ? S : null;
    const rows = p.picks.map((x, i) => `<li><span class="jd">R${i + 1} · ${esc(rTitle(p.role.id, i))}</span><span class="pc">“${esc(L.piece(i, p.role.id))}”</span><span>${esc(x.label)}</span></li>`).join("");
    const sameRole = mine && mine.role.id === p.role.id;
    return `<div class="paper decoded"><p class="src">DECODED · ${esc(p.id)}</p><div class="dp"><div>${ART.portrait(p.role.id, "dc" + p.role.id)}</div><div><h3>${esc(p.role.name)}</h3><p><b>${esc(p.ending.title)}</b> · ${esc(p.rank.title)} · score ${p.fs.total}</p><p class="small">Their pieces are now on the board.</p></div></div>${sameRole ? `<p class="warn">This is the same role as yours, so it adds no new pieces. Look for a different role to fill the board.</p>` : ""}<ol class="journey">${rows}</ol>
      <div class="field"><label for="rr">Reply about round</label><select id="rr">${D.ROUNDS.map((r, i) => `<option value="${i}">${i + 1}. ${esc(rTitle(p.role.id, i))}</option>`).join("")}</select></div>
      <div class="field"><label for="rq">Question for them (pick one)</label><select id="rq"></select></div>
      <textarea id="rtext" rows="6" readonly aria-label="Reply text"></textarea><div class="row"><button class="mini" id="cprep">Copy reply</button></div><p class="small cmsg" role="status"></p><p class="small">Paste this as a reply on their card post on Padlet.</p></div>`;
  }

  const REPLY_QS = ["What did you think would happen when you made that choice?", "Which of Secrecy, Impact or Trust were you protecting?", "Would you make the same choice again? Why or why not?", "What did your role know that other roles did not?"];
  function bindReply(p) {
    const rrs = $("#rr"), rq = $("#rq"), ta = $("#rtext"); if (!rrs) return;
    const fill = () => { const r = +rrs.value, prev = rq.value; rq.innerHTML = [D.ROUNDS[r].ask].concat(REPLY_QS).map((q, i) => `<option value="${i}">${esc(clip(q, 90))}</option>`).join(""); if (prev) rq.value = prev; paint(); };
    const paint = () => {
      const r = +rrs.value, qs = [D.ROUNDS[r].ask].concat(REPLY_QS), mineRole = (S && S.role) || (board().own && L.roleById(board().own.role));
      let mine = mineRole ? `I played ${mineRole.name}.` : "";
      if (S && S.log[r]) mine = `I chose: ${S.log[r].label}\n` + (S.log[r].label === p.picks[r].label ? "We made the same call." : "We made different calls.");
      const L1 = "━━━━━━━━━━━━━━━━━━━━";
      ta.value = [`DECODED ${p.id} (${p.role.name})`, L1, `ROUND ${r + 1}: ${rTitle(p.role.id, r)}`, L1, `You chose: ${p.picks[r].label}`, ...(mine ? ["", mine] : []), "", L1, "QUESTION FOR YOU", L1, qs[+rq.value || 0]].join("\n");
    };
    rrs.addEventListener("change", fill); rq.addEventListener("change", paint); fill();
    $("#cprep").addEventListener("click", (e) => copyText(ta.value, e.currentTarget, "Copied. Paste it as a reply on their Padlet post."));
  }

  /* ---------- completion post ---------- */
  function completionText(b, parsed, refl) {
    const prog = b.prog || {}, mine = (b.own && L.roleById(b.own.role)) || null, nm = store.get("cb_name", "") || "Anonymous";
    const ids = parsed.map((p) => p.id + " (" + p.role.short + ")").join(", ");
    return `MISSION COMPLETE · ${nm.toUpperCase()}${mine ? " · " + mine.name : ""}\nI decoded all six secret messages with help from classmates.\n\n` + D.ROUNDS.map((r, i) => `${i + 1}. ${r.title} (${r.date}): ${r.msg.join(" ")}`).join("\n") + `\n\nDecoded with Signal IDs from: ${ids || "none yet"}\n` + (refl ? "\n" + refl + "\n" : "");
  }
  function completion(b, parsed, full) {
    if (full < 6) return `<section class="panel"><h2>Submission</h2><p>Decode all six messages to unlock your submission for the teacher. You need Signal IDs from all four other roles. ${6 - full} to go.</p></section>`;
    return `<section class="padlet panel"><h2>All six messages decoded</h2><p><b>Do not post this on Padlet.</b> Other students could copy it. Copy it and submit it to your teacher the way your class turns in assignments. Add a sentence about what you learned.</p>
      <div class="field"><label for="crefl">Your reflection (one or two sentences)</label><textarea id="crefl" rows="3" placeholder="Which message surprised you most, and why?"></textarea></div>
      <div class="field"><label for="cptext2">Your submission</label><textarea id="cptext2" rows="14" readonly></textarea></div>
      <div class="row"><button class="btn" id="cppost">Copy submission</button></div><p class="small cmsg" role="status"></p></section>`;
  }

  /* ---------- board ---------- */
  function renderBoard() {
    const b = board(), parsed = b.sig.map(L.parseSignal).filter(Boolean), have = {};
    parsed.forEach((p) => { have[p.role.id] = true; });
    const own = b.own || null;
    const prog = b.prog || {}; if (own && prog[own.role] === undefined) prog[own.role] = own.rounds;
    const known = (r, rid) => (prog[rid] || 0) > r || !!have[rid];
    let full = 0;
    const rows = D.ROUNDS.map((rd, r) => {
      const n = D.ROLES.filter((x) => known(r, x.id)).length, done = n === 5; if (done) full++;
      const slots = D.ROLES.map((x) => `<li class="slot ${known(r, x.id) ? "got" : ""}"><span>${esc(x.short)}</span><b>${known(r, x.id) ? esc(L.piece(r, x.id)) : "?????"}</b></li>`).join("");
      return `<section class="brow ${done ? "full" : ""}"><h3>Round ${r + 1}: ${esc(rd.title)} <span class="cnt">${done ? "● MESSAGE COMPLETE" : n + " OF 5 PIECES"}</span></h3><ol class="slots">${slots}</ol>${done ? `<div class="paper"><p class="src">Full message</p><p class="fullmsg">${esc(rd.msg.join(" "))}</p><p>${esc(rd.real)}</p><p class="eq"><b>Discuss</b> ${esc(rd.ask)}</p></div>` : ""}</section>`;
    }).join("");
    root.innerHTML = topbar() + `<main class="wrap"><button class="mini" id="bk">Back</button><h1 data-focus tabindex="-1">Decoder board</h1>
      <p class="lede">Each round hides a five-part message. You hold one part of each. Decode classmates' Signal IDs from other roles to fill the rest. ${full} of 6 messages complete.</p>
      <section class="decoder"><h2>Decode a Signal ID</h2>${decoderForm()}</section>
      ${parsed.length ? `<section><h2>Decoded so far</h2><ul class="chiplist">${parsed.map((p) => `<li><button class="chipb" data-sig="${p.id}">${esc(p.id)} · ${esc(p.role.short)}</button></li>`).join("")}</ul></section>` : ""}
      ${completion(b, parsed, full)}
      ${rows}<p class="small"><button class="mini" id="clr">Clear decoded signals</button></p></main>`;
    $("#bk").addEventListener("click", () => go(prevView === "board" ? "title" : prevView));
    bindDecoder();
    $$("[data-sig]").forEach((c) => c.addEventListener("click", () => { const p = L.parseSignal(c.dataset.sig); $("#dres").innerHTML = decodedCard(p); bindReply(p); $("#dres").scrollIntoView({ block: "nearest" }); }));
    const cp = $("#cppost"); if (cp) { const ta = $("#cptext2"), refl = $("#crefl"), upd = () => { ta.value = completionText(b, parsed, refl.value.trim()); }; refl.addEventListener("input", upd); upd(); cp.addEventListener("click", (e) => copyText(ta.value, e.currentTarget, "Copied. Submit it to your teacher. Do not post it on Padlet.")); }
    $("#clr").addEventListener("click", () => { const b2 = board(); b2.sig = []; store.set("cb_board", b2); renderBoard(); bindGo(); });
  }



  const h = location.hash; view = h === "#board" ? "board" : "title"; render();
})();

(function () { if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; let n = 0; setInterval(function () { n++; document.querySelectorAll("svg.portrait, svg.scene").forEach(function (sv) { const o = +sv.dataset.o || 0, t = n + o; sv.querySelectorAll(".pxa").forEach(function (g) { const k = g.dataset.s, p = +g.dataset.p, m = +g.dataset.n; const on = m ? Math.floor(t / (+g.dataset.h || 1)) % m === p : k === "b" ? t % 40 < 2 : k === "r" ? t % 24 >= 12 : t % 12 === p; const d = on ? "inline" : "none"; if (g.getAttribute("display") !== d) g.setAttribute("display", d); }); }); }, 1000 / 12); })();
