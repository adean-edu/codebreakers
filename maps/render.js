/* Renders a Real History map in the style of the teacher's r1-mi map. Usage: node render.js spec.js out.png */
const fs = require("fs"), { chromium } = require("playwright"), COAST = require("./coast.js");
const W = 1536, H = 1024, MX0 = 22, MY0 = 22, MX1 = 1514, MY1 = 940;
const NAVY = "#102a40", RED = "#a5231a", SEA = "#a7bcb3", LAND = "#f6d99c", CREAM = "#fae4b5", INK = "#13283a";
const FONTS = `@font-face{font-family:Lora;src:url(file:///usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf);font-weight:400 700}
@font-face{font-family:Lora;font-style:italic;src:url(file:///usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf);font-weight:400 700}
@font-face{font-family:Mono;src:url(file:///usr/share/fonts/truetype/freefont/FreeMono.ttf)}
@font-face{font-family:Mono;font-weight:700;src:url(file:///usr/share/fonts/truetype/freefont/FreeMonoBold.ttf)}`;
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
module.exports.render = async function (spec, out) {
  const v = spec.view, cs = Math.cos(v.lat0 * Math.PI / 180), cx = (MX0 + MX1) / 2 + (v.dx || 0), cy = (MY0 + MY1) / 2 + (v.dy || 0);
  const P = (lon, lat) => [cx + (lon - v.lon0) * cs * v.k, cy - (lat - v.lat0) * v.k];
  const R = rng(spec.seed || 7);
  // coastlines: project, subdivide, roughen
  const noise = (x, y) => Math.sin(x * .09 + y * .05) * .5 + Math.sin(x * .23 - y * .17 + 1.3) * .3 + Math.sin(x * .51 + y * .43 + 2.1) * .2;
  const rough = (pts, amp) => { const o = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), n = Math.max(1, Math.round(L / 4)), nx = -dy / (L || 1), ny = dx / (L || 1);
      for (let j = 0; j < n; j++) { const t = j / n, x = a[0] + dx * t, y = a[1] + dy * t, off = amp * noise(x, y) + amp * .35 * Math.sin((x + y) * 1.7); o.push([x + nx * off, y + ny * off]); } } return o; };
  const path = (pts, close) => "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + (close ? "Z" : "");
  const lands = (spec.land || Object.keys(COAST)).map((k) => path(rough(COAST[k].map(([a, b]) => P(a, b)), spec.rough || 2.2), true));
  const LANDD = lands.join(" ");
  // sea waves
  let waves = ""; for (let y = MY0 + 8; y < MY1; y += 11) { let x = MX0 - 30 + R() * 30; while (x < MX1) { const n = 2 + Math.floor(R() * 4), w = 7 + R() * 3, yy = y + (R() - .5) * 4; let d = `M${x.toFixed(1)} ${yy.toFixed(1)}`; for (let k = 0; k < n; k++) d += `q${(w / 2).toFixed(1)} ${(k % 2 ? 2.6 : -2.6)} ${w.toFixed(1)} 0`; waves += `<path d="${d}"/>`; x += n * w + 6 + R() * 22; } }
  // borders
  const borders = (spec.borders || []).map((b) => `<path d="${path(b.map(([a, c]) => P(a, c)))}" fill="none" stroke="${INK}" stroke-width="2.2" stroke-dasharray="7 5" stroke-linecap="round"/>`).join("");
  const rivers = (spec.rivers || []).map((b) => `<path d="${path(b.map(([a, c]) => P(a, c)))}" fill="none" stroke="#3d6a86" stroke-width="2.2" stroke-linecap="round"/>`).join("");
  // labels
  const lab = (l) => { const [x, y] = l.xy || P(l.lon, l.lat), k = l.kind || "city";
    const st = { country: `font:italic 700 ${l.size || 46}px Lora;letter-spacing:${l.ls === undefined ? 12 : l.ls}px;fill:${NAVY}`, sea: `font:italic 700 ${l.size || 40}px Lora;letter-spacing:${l.ls === undefined ? 16 : l.ls}px;fill:${NAVY}`, region: `font:italic 700 ${l.size || 26}px Lora;letter-spacing:${l.ls === undefined ? 6 : l.ls}px;fill:${NAVY}`, city: `font:700 ${l.size || 26}px Lora;letter-spacing:1px;fill:${l.red ? RED : NAVY}`, note: `font:italic 600 ${l.size || 22}px Lora;fill:${l.red ? RED : NAVY}` }[k];
    const lines = String(l.t).split("\n"), lh = (l.size || ({ country: 46, sea: 40, region: 26, city: 26, note: 22 })[k]) * 1.15;
    return `<text transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${l.rot || 0})" text-anchor="${l.a || "middle"}" style="${st};paint-order:stroke;stroke:${k === "country" || k === "sea" ? "none" : "rgba(250,228,181,.75)"};stroke-width:5px">${lines.map((s, i) => `<tspan x="0" y="${(i * lh).toFixed(1)}">${esc(s)}</tspan>`).join("")}</text>`; };
  const labels = (spec.labels || []).map(lab).join("");
  // routes
  const routes = (spec.routes || []).map((r) => { const pts = r.pts.map((q) => (q.length === 2 && Math.abs(q[0]) < 200 && !r.px ? P(q[0], q[1]) : q)); const c = r.color === "navy" ? NAVY : r.color === "ink" ? INK : RED;
    let d; if (pts.length === 3 && r.curve) d = `M${pts[0][0]} ${pts[0][1]}Q${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]}`; else { d = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (i < pts.length - 1 && r.smooth !== false) { const m = [(b[0] + pts[i + 1][0]) / 2, (b[1] + pts[i + 1][1]) / 2]; d += `Q${b[0]} ${b[1]} ${m[0]} ${m[1]}`; } else d += `L${b[0]} ${b[1]}`; } }
    return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${r.w || 5}" ${r.dash === false ? "" : `stroke-dasharray="${r.dash || "16 10"}"`} stroke-linecap="round" ${r.arrow === false ? "" : `marker-end="url(#ah${r.color === "navy" ? "n" : r.color === "ink" ? "i" : "r"})"`}/>`; }).join("");
  // icons
  const icon = (ic) => { const [x, y] = ic.xy || P(ic.lon, ic.lat), s = ic.s || 1, t = `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s}) rotate(${ic.rot || 0})`;
    if (ic.type === "tower") return `<g transform="${t}" stroke="${INK}" fill="none" stroke-width="2.4"><path d="M-12 22L0 -26L12 22M-8 6H8M-5 -6H5M-10 14L6 -2M10 14L-6 -2"/><circle cx="0" cy="-28" r="3" fill="${INK}"/><g stroke="${RED}" stroke-width="2.6"><path d="M-16 -32l-6 -6 4 -2 -7 -7M16 -32l6 -6 -4 -2 7 -7M-20 -16l-9 -2 3 -3 -9 -2M20 -16l9 -2 -3 -3 9 -2M0 -38l-3 -8 4 0 -3 -9"/></g></g>`;
    if (ic.type === "ship") return `<g transform="${t}" fill="${ic.color === "red" ? RED : NAVY}"><path d="M-30 0L30 0L24 7L-26 7Z"/><rect x="-14" y="-6" width="18" height="6"/><rect x="-8" y="-12" width="7" height="6"/><rect x="8" y="-4" width="10" height="4"/><rect x="-24" y="-3" width="8" height="3"/><path d="M-4 -12V-20" stroke="${ic.color === "red" ? RED : NAVY}" stroke-width="2"/></g>`;
    if (ic.type === "plane") return `<g transform="${t}" fill="${ic.color === "red" ? RED : NAVY}"><path d="M-3 -20h6l1 14 18 6v4l-18 -2 -1 10 6 4v3l-9 -2 -9 2v-3l6 -4 -1 -10 -18 2v-4l18 -6z"/></g>`;
    if (ic.type === "star") return `<g transform="${t}"><path d="M0 -15L4.4 -4.6 15.5 -4.6 6.5 2.2 9.8 13 0 6.5 -9.8 13 -6.5 2.2 -15.5 -4.6 -4.4 -4.6Z" fill="${RED}" stroke="${CREAM}" stroke-width="2"/></g>`;
    if (ic.type === "burst") return `<g transform="${t}"><path d="M0 -24L6 -9 22 -14 11 -2 24 8 8 8 6 24 -2 10 -16 20 -10 4 -24 -2 -9 -8 -14 -22 -2 -10Z" fill="${RED}" stroke="${CREAM}" stroke-width="2"/></g>`;
    if (ic.type === "rocket") return `<g transform="${t}" fill="${NAVY}"><path d="M0 -30C6 -22 7 -10 7 6L12 16H-12L-7 6C-7 -10 -6 -22 0 -30Z"/><path d="M-7 10L-14 20H-6ZM7 10L14 20H6Z"/></g>`;
    if (ic.type === "case") return `<g transform="${t}"><rect x="-18" y="-11" width="36" height="24" rx="3" fill="#7a4a2a" stroke="${INK}" stroke-width="2"/><path d="M-7 -11v-5h14v5" fill="none" stroke="${INK}" stroke-width="2.5"/><rect x="-3" y="-2" width="6" height="5" fill="#e0b040"/></g>`;
    if (ic.type === "tank") return `<g transform="${t}" fill="${ic.color === "red" ? RED : NAVY}"><rect x="-22" y="-2" width="44" height="12" rx="6"/><rect x="-12" y="-11" width="20" height="9" rx="2"/><rect x="6" y="-8" width="24" height="3"/></g>`;
    return ""; };
  const icons = (spec.icons || []).map(icon).join("");
  const dots = (spec.dots || []).map((d) => { const [x, y] = d.xy || P(d.lon, d.lat); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${d.r || 10}" fill="${d.color === "navy" ? NAVY : RED}" stroke="${CREAM}" stroke-width="3"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(d.r || 10) + 1.5}" fill="none" stroke="${INK}" stroke-width="1.2"/>` + (d.label ? lab({ t: d.label, xy: [x + (d.lx || 18), y + (d.ly === undefined ? 9 : d.ly)], a: d.la || "start", kind: "city", size: d.size || 26, red: d.labelRed }) : ""); }).join("");
  // callouts: {x,y,w,lines:[...], to:[lon,lat] | xy, red:true}
  const callouts = (spec.callouts || []).map((c) => { const lh = c.lh || 30, h = c.h || (c.lines.length * lh + 24), bc = c.navy ? NAVY : RED; let tail = "";
    if (c.to || c.toxy) { const [tx, ty] = c.toxy || P(c.to[0], c.to[1]); let ax, ay, ux, uy;
      if (ty > c.y + h || ty < c.y) { ax = Math.max(c.x + 26, Math.min(c.x + c.w - 26, c.ax !== undefined ? c.x + c.ax : tx)); ay = ty > c.y + h ? c.y + h : c.y; ux = 0; uy = ty > ay ? 1 : -1; }
      else { ax = tx > c.x + c.w ? c.x + c.w : c.x; ay = Math.max(c.y + 18, Math.min(c.y + h - 18, ty)); ux = tx > ax ? 1 : -1; uy = 0; }
      const tipx = ax + ux * 22, tipy = ay + uy * 22, px = -uy, py = ux;
      tail = `<path d="M${tipx} ${tipy} L${tx} ${ty}" stroke="${bc}" stroke-width="2.6"/><path d="M${ax + px * 13} ${ay + py * 13} L${tipx} ${tipy} L${ax - px * 13} ${ay - py * 13}" fill="${CREAM}" stroke="${bc}" stroke-width="3" stroke-linejoin="round"/><path d="M${ax + px * 11 - ux * 2} ${ay + py * 11 - uy * 2}L${ax - px * 11 - ux * 2} ${ay - py * 11 - uy * 2}" stroke="${CREAM}" stroke-width="5"/>`; }
    return `<g><rect x="${c.x}" y="${c.y}" width="${c.w}" height="${h}" fill="${CREAM}" stroke="${bc}" stroke-width="3"/>${tail}<rect x="${c.x + 5}" y="${c.y + 5}" width="${c.w - 10}" height="${h - 10}" fill="none" stroke="${bc}" stroke-width="1"/>` +
      c.lines.map((s, i) => `<text x="${c.x + c.w / 2}" y="${c.y + 12 + lh * (i + .82)}" text-anchor="middle" style="font:${c.italic && i === c.lines.length - 1 ? "italic 600" : "700"} ${c.size || 24}px ${c.mono ? "Mono" : "Lora"};fill:${NAVY};letter-spacing:.5px">${esc(s)}</text>`).join("") + `</g>`; }).join("");
  // title box
  const tb = Object.assign({ x: 40, y: 34, w: 700, h: 128 }, spec.titleBox || {}), tsz = spec.titleSize || 42;
  const title = `<rect x="${tb.x}" y="${tb.y}" width="${tb.w}" height="${tb.h}" fill="${CREAM}" stroke="${NAVY}" stroke-width="3"/><rect x="${tb.x + 6}" y="${tb.y + 6}" width="${tb.w - 12}" height="${tb.h - 12}" fill="none" stroke="${NAVY}" stroke-width="1.2"/>
    <text x="${tb.x + tb.w / 2}" y="${tb.y + 58}" text-anchor="middle" style="font:700 ${tsz}px Lora;fill:${NAVY};letter-spacing:.5px">${esc(spec.title)}</text>
    <line id="dl" x1="${tb.x + 34}" x2="${tb.x + 100}" y1="${tb.y + 95}" y2="${tb.y + 95}" stroke="${RED}" stroke-width="2.5"/><line id="dr" x1="${tb.x + tb.w - 100}" x2="${tb.x + tb.w - 34}" y1="${tb.y + 95}" y2="${tb.y + 95}" stroke="${RED}" stroke-width="2.5"/>
    <text id="dt" x="${tb.x + tb.w / 2}" y="${tb.y + 107}" text-anchor="middle" style="font:italic 600 36px Lora;fill:${RED}">${esc(spec.date)}</text>`;
  // info box
  let info = ""; if (spec.info) { const b = spec.info, lh = 30; let y = b.y + 66, rows = "";
    b.items.forEach((it, i) => { const lines = it[1].split("\n"); rows += `<circle cx="${b.x + 30}" cy="${y - 7}" r="5.5" fill="${i < (b.redDots === undefined ? 2 : b.redDots) ? RED : NAVY}"/><text x="${b.x + 46}" y="${y}" style="font:22px Mono;fill:${NAVY}"><tspan style="font-weight:700">${esc(it[0])}:</tspan> ${esc(lines[0])}</text>`; for (let j = 1; j < lines.length; j++) { y += lh - 2; rows += `<text x="${b.x + 46 + (it[0].length + 2) * 13.2 * (b.hang === false ? 0 : 1)}" y="${y}" style="font:22px Mono;fill:${NAVY}">${esc(lines[j])}</text>`; } y += lh; });
    const h = y - b.y - 6; info = `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${h}" fill="${CREAM}" stroke="${NAVY}" stroke-width="3"/><rect x="${b.x + 6}" y="${b.y + 6}" width="${b.w - 12}" height="${h - 12}" fill="none" stroke="${NAVY}" stroke-width="1.2"/>
      <text x="${b.x + 26}" y="${b.y + 38}" style="font:700 26px Lora;fill:${RED};letter-spacing:.5px">${esc(b.title)}</text><line x1="${b.x + 24}" x2="${b.x + b.w - 24}" y1="${b.y + 47}" y2="${b.y + 47}" stroke="${RED}" stroke-width="2"/>${rows}`; }
  // scale bar, correct for the center latitude
  let scale = ""; if (spec.scale) { const s = spec.scale, pxPerMile = v.k / 69.05, miles = s.miles, kmStep = s.km; const wMi = miles * pxPerMile, wKm = kmStep * v.k / 111.2;
    const ticks = (n, w, y, lab, unit, up) => { let o = `<line x1="${s.x}" x2="${s.x + w}" y1="${y}" y2="${y}" stroke="${NAVY}" stroke-width="2.5"/>`; for (let i = 0; i <= n; i++) { const x = s.x + w * i / n; o += `<line x1="${x}" x2="${x}" y1="${y - 8}" y2="${y + 8}" stroke="${NAVY}" stroke-width="2.5"/><text x="${x}" y="${up ? y - 14 : y + 30}" text-anchor="middle" style="font:700 19px Lora;fill:${NAVY}">${lab * i}</text>`; } return o + `<text x="${s.x + w + 30}" y="${up ? y - 14 : y + 30}" style="font:700 19px Lora;fill:${NAVY}">${unit}</text>`; };
    scale = ticks(s.n || 3, wMi, s.y, miles / (s.n || 3), "Miles", true) + ticks(s.nk || 3, wKm, s.y + 6, kmStep / (s.nk || 3), "Kilometres", false); }
  const compass = `<g transform="translate(1476 74)"><path d="M0 -30L13 18L0 8L-13 18Z" fill="${NAVY}"/><path d="M0 -30L0 8L-13 18Z" fill="#33536d"/><text y="56" text-anchor="middle" style="font:700 34px Lora;fill:${NAVY}">N</text></g>`;
  const ft = spec.footer, ftw = ft.length * 15.5 + 30;
  const footer = `<rect x="${MX0}" y="${MY1}" width="${MX1 - MX0}" height="${H - 22 - MY1}" fill="#f8e0ad"/><line x1="${MX0}" x2="${MX1}" y1="${MY1}" y2="${MY1}" stroke="${INK}" stroke-width="3"/>
    <line id="fl" x1="50" x2="400" y1="${MY1 + 42}" y2="${MY1 + 42}" stroke="${RED}" stroke-width="3"/><line id="fr" x1="1100" x2="${W - 50}" y1="${MY1 + 42}" y2="${MY1 + 42}" stroke="${RED}" stroke-width="3"/>
    <text id="ft" x="${W / 2}" y="${MY1 + 53}" text-anchor="middle" style="font:italic 700 31px Lora;fill:${NAVY};letter-spacing:2.5px">FROM THE RECORD • ${esc(ft)}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><marker id="ahr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10z" fill="${RED}"/></marker><marker id="ahn" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10z" fill="${NAVY}"/></marker><marker id="ahi" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10z" fill="${INK}"/></marker>
  <filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .38  0 0 0 0 .18  0 0 0 .55 -.18"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="mottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="4" seed="9"/><feColorMatrix values="0 0 0 0 .85  0 0 0 0 .52  0 0 0 0 .2  0 0 0 1.4 -.55"/></filter>
  <filter id="seamottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".008" numOctaves="3" seed="5"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .32  0 0 0 0 .4  0 0 0 1.2 -.5"/></filter>
  <radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="60%" stop-color="#7a4a10" stop-opacity="0"/><stop offset="100%" stop-color="#7a4a10" stop-opacity=".35"/></radialGradient>
  <clipPath id="mapc"><rect x="${MX0}" y="${MY0}" width="${MX1 - MX0}" height="${MY1 - MY0}"/></clipPath><clipPath id="landc">${lands.map((d) => `<path d="${d}"/>`).join("")}</clipPath></defs>
  <rect width="${W}" height="${H}" fill="#f1cf92"/>
  <g clip-path="url(#mapc)"><rect x="${MX0}" y="${MY0}" width="${MX1 - MX0}" height="${MY1 - MY0}" fill="${SEA}"/><rect x="${MX0}" y="${MY0}" width="${MX1 - MX0}" height="${MY1 - MY0}" filter="url(#seamottle)" opacity=".5"/>
    <g fill="none" stroke="#1d3f5c" stroke-width="1.6" stroke-linecap="round" opacity=".62">${waves}</g>
    ${lands.map((d) => `<path d="${d}" fill="${LAND}"/>`).join("")}<g clip-path="url(#landc)"><rect x="${MX0}" y="${MY0}" width="${MX1 - MX0}" height="${MY1 - MY0}" filter="url(#mottle)" opacity=".55"/></g>
    ${rivers}${borders}${lands.map((d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`).join("")}
    ${labels}${routes}${icons}${dots}${scale}${callouts}</g>
  ${footer}<rect x="${MX0}" y="${MY0}" width="${MX1 - MX0}" height="${H - 22 - MY0}" fill="none" stroke="${INK}" stroke-width="3.5"/><rect x="8" y="8" width="${W - 16}" height="${H - 16}" fill="none" stroke="${INK}" stroke-width="1.5" opacity=".7"/>
  ${title}${info}${compass}
  <rect width="${W}" height="${H}" fill="url(#vig)"/><rect width="${W}" height="${H}" fill="#fff" filter="url(#paper)" opacity=".5"/></svg>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}body{margin:0}</style></head><body>${svg}</body></html>`;
  fs.writeFileSync("/tmp/mapw/page.html", html);
  const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: W, height: H } })).newPage();
  await p.goto("file:///tmp/mapw/page.html"); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.evaluate(() => { const fit = (t, l, r, gap) => { const b = document.getElementById(t).getBBox(); document.getElementById(l).setAttribute("x2", b.x - gap); document.getElementById(r).setAttribute("x1", b.x + b.width + gap); }; fit("ft", "fl", "fr", 22); fit("dt", "dl", "dr", 16); });
  await p.screenshot({ path: out }); await b.close();
};
