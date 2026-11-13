/* Draws the r4-fa Real History image: the A/B bait test as a clean flowchart in the teacher's briefing-map style
   (cream paper, navy and red, title box, info box, footer). It matches the r4-fa animation: two safe houses chalked
   A and B, and the raid comes to B. No compass and no "From the record" footer, because it shows a method, not one
   documented case.  Usage (from the repo root): node maps/r4fa-flowchart.js img/r4-fa.png
   House style from maps/redraw/STEPS.md (briefing style): navy #16264A, red #A01E18, cream boxes #F6E8C8, paper #E8D0A0,
   Georgia throughout (bold labels, regular bullet text), 4 px + 1.4 px navy frame, cream footer band at y 948-1008.
   Needs Playwright + Chromium only (Georgia is a system font; no internet needed). */
const { chromium } = require("playwright");
const out = process.argv[2] || "img/r4-fa.png";
const W = 1536, H = 1024, NAVY = "#16264A", RED = "#A01E18", CREAM = "#F6E8C8", INK = "#16264A", PAPER = "#E8D0A0";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const T = (x, y, s, st, a) => `<text x="${x}" y="${y}" text-anchor="${a || "middle"}" style="${st}">${esc(s)}</text>`;
const serif = (sz, w, it, c) => `font:${it ? "italic " : ""}${w || 700} ${sz}px Georgia, serif;fill:${c || NAVY}`;
const mono = (sz, w) => `font:${w || 400} ${sz}px Georgia, serif;fill:${NAVY}`;   // STEPS.md: bullet facts in Georgia Regular
// a framed box, like the callouts on the other maps
const box = (x, y, w, h, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${CREAM}" stroke="${col || NAVY}" stroke-width="3"/><rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 12}" fill="none" stroke="${col || NAVY}" stroke-width="1.2"/>`;
const arrow = (d, col, dash) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="5" ${dash ? 'stroke-dasharray="16 10"' : ""} stroke-linecap="round" marker-end="url(#ah${col === RED ? "r" : "n"})"/>`;
// icons
const tower = (x, y) => `<g transform="translate(${x} ${y})" fill="${NAVY}"><rect x="-13" y="-70" width="26" height="110"/><rect x="-17" y="-78" width="34" height="10"/><path d="M-13 -78L0 -112L13 -78Z"/><rect x="-1.5" y="-128" width="3" height="18"/><circle cx="0" cy="-48" r="9" fill="${CREAM}"/><path d="M0 -48V-54M0 -48L4 -46" stroke="${NAVY}" stroke-width="2"/>
  <rect x="-48" y="-10" width="30" height="50"/><rect x="18" y="-22" width="44" height="62"/><path d="M18 -22L40 -40L62 -22Z"/><rect x="-62" y="10" width="16" height="30"/>${[-40, -30, 26, 38, 50].map((wx) => `<rect x="${wx}" y="${wx > 0 ? -8 : 2}" width="5" height="12" fill="${CREAM}"/>`).join("")}</g>`;
const person = (x, y, letter) => `<g transform="translate(${x} ${y})" fill="${NAVY}"><path d="M-46 62C-46 26 -26 14 0 14C26 14 46 26 46 62Z"/><ellipse cx="0" cy="-8" rx="17" ry="21"/><path d="M-34 -24C-22 -30 22 -30 34 -24C30 -20 -30 -20 -34 -24Z"/><path d="M-17 -26C-16 -44 -9 -50 -4 -48L0 -44L4 -48C9 -50 16 -44 17 -26Z"/><rect x="-17" y="-31" width="34" height="5" fill="#33536d"/>
  <circle cx="30" cy="40" r="17" fill="${CREAM}" stroke="${RED}" stroke-width="3"/><text x="30" y="49" text-anchor="middle" style="${serif(26, 700, 0, RED)}">${letter}</text></g>`;
const door = (x, y, letter) => `<g transform="translate(${x} ${y})"><rect x="-70" y="-20" width="140" height="92" fill="#e9cb92" stroke="${INK}" stroke-width="2"/>${[-6, 6, 18, 30, 42, 54, 66].map((yy) => `<line x1="-70" x2="70" y1="${yy}" y2="${yy}" stroke="#c9a970" stroke-width="1.5"/>`).join("")}
  <path d="M-28 72V-6A28 26 0 0 1 28 -6V72Z" fill="#2c4f6b" stroke="${NAVY}" stroke-width="3"/><path d="M0 -32V72" stroke="${NAVY}" stroke-width="2.5"/><circle cx="-7" cy="36" r="2.6" fill="#e0b040"/><circle cx="7" cy="36" r="2.6" fill="#e0b040"/>
  <text x="0" y="16" text-anchor="middle" style="font:italic 700 30px Georgia, serif;fill:#f4efe2">${letter}</text><rect x="-5" y="-42" width="10" height="7" fill="#e0b040" stroke="${NAVY}" stroke-width="1.5"/></g>`;
// a black Citroën Traction Avant, side view, facing left (as in the animation)
const car = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${INK}"><path d="M-62 14C-62 0 -55 -6 -44 -8L-14 -10L-2 -30C2 -36 8 -38 16 -38H36C46 -38 54 -32 60 -22L68 -8C72 -2 72 6 72 14Z"/>
  <path d="M-66 18C-64 2 -54 -6 -42 -6C-30 -6 -22 2 -20 18Z"/><path d="M22 18C24 2 34 -6 46 -6C58 -6 68 2 70 18Z"/><rect x="-24" y="12" width="48" height="5"/>
  <path d="M2 -28H22V-12H-6Z" fill="#6c8496"/><path d="M27 -28H40C46 -28 51 -22 54 -12H27Z" fill="#6c8496"/><circle cx="-56" cy="-12" r="6" fill="#e0b040" stroke="${INK}" stroke-width="3"/>
  <circle cx="-42" cy="20" r="13"/><circle cx="-42" cy="20" r="6" fill="#6c8496"/><circle cx="46" cy="20" r="13"/><circle cx="46" cy="20" r="6" fill="#6c8496"/></g>`;
const raider = (x, y) => `<g transform="translate(${x} ${y})" fill="${INK}"><path d="M-10 -40H10V-36H16V-32H-16V-36H-10Z"/><circle cx="0" cy="-24" r="7"/><path d="M-11 -16H11L15 26H-15Z"/><rect x="-9" y="26" width="6" height="12"/><rect x="3" y="26" width="6" height="12"/></g>`;

// layout: two rows, A on top (navy, nothing happens) and B below (red, the raid)
const RA = 400, RB = 716, MID = (RA + RB) / 2;
let s = "";
// London
s += box(46, MID - 130, 196, 260) + tower(144, MID + 36) + T(144, MID + 112, "LONDON", serif(30));
// stories
[[RA, "A", NAVY], [RB, "B", RED]].forEach(([y, L, col]) => {
  s += arrow(`M246 ${MID} C 270 ${MID} 262 ${y} 292 ${y}`, col, true);
  s += box(304, y - 78, 236, 156, col) + T(422, y - 34, `STORY ${L}`, serif(28, 700, 0, col)) + T(422, y + 6, "“The meeting is at", serif(20, 600, 1)) + T(422, y + 38, `safe house ${L}.”`, serif(20, 600, 1));
  s += arrow(`M548 ${y} H 590`, col, true);
  s += box(604, y - 96, 160, 192, col) + person(684, y - 16, L) + T(684, y + 82, `CONTACT ${L}`, serif(19));
  s += arrow(`M772 ${y} H 812`, col, true);
  s += box(826, y - 96, 196, 192, col) + door(924, y - 30, L) + T(924, y + 82, `SAFE HOUSE ${L}`, serif(18));
  s += arrow(`M1030 ${y} H 1060`, col, true);
});
// outcomes
s += box(1074, RA - 96, 200, 192) + T(1174, RA - 22, "NO RAID", serif(34)) + T(1174, RA + 20, "Nothing happens", serif(18, 600, 1)) + T(1174, RA + 50, "at house A.", serif(18, 600, 1));
s += box(1074, RB - 96, 200, 192, RED) + car(1138, RB - 42, .7) + raider(1216, RB - 46) + raider(1244, RB - 42) + T(1174, RB + 28, "GERMAN RAID", serif(21, 700, 0, RED)) + T(1174, RB + 56, "at house B,", serif(17, 600, 1)) + T(1174, RB + 80, "the next day", serif(17, 600, 1));
// conclusion
const CX = 1324, CW = 172, CY = MID - 20, CH = 250;
s += arrow(`M1280 ${RB} C 1300 ${RB} 1296 ${CY + CH - 40} ${CX - 12} ${CY + CH - 40}`, RED, true);
s += `<rect x="${CX}" y="${CY}" width="${CW}" height="${CH}" fill="${CREAM}" stroke="${RED}" stroke-width="4"/><rect x="${CX + 7}" y="${CY + 7}" width="${CW - 14}" height="${CH - 14}" fill="none" stroke="${RED}" stroke-width="1.2"/>`;
s += T(CX + CW / 2, CY + 40, "CONCLUSION", serif(18, 700, 0, RED)) + `<line x1="${CX + 22}" x2="${CX + CW - 22}" y1="${CY + 52}" y2="${CY + 52}" stroke="${RED}" stroke-width="2"/>`;
["THE LEAK", "RUNS", "THROUGH", "CONTACT B."].forEach((w, i) => (s += T(CX + CW / 2, CY + 96 + i * 38, w, serif(20))));
// title box
s += box(40, 34, 640, 128) + T(360, 92, "FINDING THE LEAK", serif(46)) + `<line x1="74" x2="226" y1="129" y2="129" stroke="${RED}" stroke-width="2.5"/><line x1="494" x2="646" y1="129" y2="129" stroke="${RED}" stroke-width="2.5"/>` + T(360, 141, "Paris, 1942", serif(36, 600, 1, RED));
// info box
const items = [["1", "London gives each contact a slightly different story."], ["2", "Only London knows who got which version."], ["3", "Watch which story the Germans act on."], ["!", "Everyone who carries the bait is in danger."]];
s += box(712, 34, 784, 212) + T(738, 72, "THE BAIT TEST", serif(26, 700, 0, RED), "start") + `<line x1="736" x2="1472" y1="82" y2="82" stroke="${RED}" stroke-width="2"/>`;
items.forEach(([k, t], i) => { const y = 116 + i * 36; s += `<circle cx="746" cy="${y - 7}" r="6" fill="${k === "!" ? RED : NAVY}"/>` + T(764, y, t, mono(21, k === "!" ? 700 : 400), "start"); });
// footer (a method, not one documented case, so no "From the record")
const F0 = 948, F1 = 1008, FM = (F0 + F1) / 2;   // STEPS.md footer band: cream, double red rules each side, centred text
s += `<rect x="14" y="${F0}" width="${W - 28}" height="${F1 - F0}" fill="${CREAM}"/><line x1="14" x2="${W - 14}" y1="${F0}" y2="${F0}" stroke="${NAVY}" stroke-width="2.5"/>`;
[[44, 330], [1206, W - 44]].forEach(([a, b]) => [FM - 4, FM + 4].forEach((y) => (s += `<line x1="${a}" x2="${b}" y1="${y}" y2="${y}" stroke="${RED}" stroke-width="2"/>`)));
s += T(W / 2, FM + 10, "HOW A BAIT TEST WORKS • Finding a leak, 1942", "font:italic 700 29px Georgia, serif;fill:" + NAVY + ";letter-spacing:2px");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>
  <marker id="ahr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10z" fill="${RED}"/></marker><marker id="ahn" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10z" fill="${NAVY}"/></marker>
  <radialGradient id="vig" cx="50%" cy="48%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#5a3a10" stop-opacity=".38"/></radialGradient>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .23  0 0 0 0 .08  0 0 0 .22 0"/></filter>
  <filter id="blot"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .3  0 0 0 0 .1  0 0 0 .5 -.18"/></filter></defs>
  <rect width="${W}" height="${H}" fill="${PAPER}"/><rect width="${W}" height="${H}" filter="url(#blot)"/><rect width="${W}" height="${H}" filter="url(#grain)"/>
  ${s}<rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect x="5" y="5" width="${W - 10}" height="${H - 10}" fill="none" stroke="${NAVY}" stroke-width="4"/><rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="none" stroke="${NAVY}" stroke-width="1.4"/></svg>`;
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: W, height: H } });
  await p.setContent(`<style>body{margin:0}</style>${svg}`); await p.waitForTimeout(200);
  await p.screenshot({ path: out }); await b.close(); console.log("wrote", out);
})();
