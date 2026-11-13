/* Pure rules: ordering, ciphers, Signal IDs, scoring. */
const Logic = (function () {
  const D = typeof DATA !== "undefined" ? DATA : require("./data.js");
  const clamp = (v) => Math.max(0, Math.min(100, v));
  const roleIdx = (id) => D.ROLE_IDS.indexOf(id);
  const roleById = (id) => D.ROLES.find((r) => r.id === id);
  /* order[j] = index into role.r[round].c shown in slot j */
  function order(rid, round) { const o = (roleIdx(rid) * 2 + round) % 3; return [0, 1, 2].map((j) => (j + o) % 3); }
  function kindOf(round, ci) { return D.ORDER[round][ci]; }
  function shiftFor(rid, round) { return ((round * 7 + roleIdx(rid) * 5 + 3) % 25) + 1; }
  function encode(text, k) { return text.replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k) % 26) + 65)); }
  function decode(text, k) { return text.replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 - k + 26 * 2) % 26) + 65)); }
  const piece = (round, rid) => D.ROUNDS[round].msg[roleIdx(rid)];
  function newState(role, name) { return { role, name, i: 0, st: { s: 50, i: 50, t: 50 }, score: 0, path: "", log: [] }; }
  function choose(S, slot) {
    const r = S.i, ci = order(S.role.id, r)[slot], c = S.role.r[r].c[ci], k = D.KINDS[kindOf(r, ci)];
    const fx = { s: k.s, i: k.i, t: k.t };
    ["s", "i", "t"].forEach((m) => { S.st[m] = clamp(S.st[m] + fx[m]); });
    S.score += k.p; S.path += "ABC"[slot];
    S.log.push({ i: r, slot, label: c[0], out: c[1], fx, pts: k.p, kind: kindOf(r, ci) });
    return { c, fx, pts: k.p };
  }
  function ending(st) {
    const by = (id) => D.ENDINGS.find((e) => e.id === id);
    if (st.s <= 38) return by("burned"); if (st.t <= 35) return by("lone");
    if (st.s >= 62 && st.i >= 58) return by("quiet"); if (st.s >= 62) return by("vault");
    if (st.i >= 70) return by("gambler"); return by("steady");
  }
  function finalScore(S) { const e = ending(S.st), meters = Math.round((S.st.s + S.st.i + S.st.t) / 3 * 0.5); return { total: S.score + meters + e.bonus, meters, ending: e.bonus, e }; }
  function rank(total) { let r = D.RANKS[0]; D.RANKS.forEach((x) => { if (total >= x.min) r = x; }); return r; }
  const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  function chk(body) { let h = 0; for (let i = 0; i < body.length; i++) h = (h * 31 + body.charCodeAt(i) * (i + 7)) % 1024; return ALPHA[h >> 5] + ALPHA[h & 31]; }
  function signalId(S) { const body = S.role.id + "-" + S.path; return body + "-" + chk(body); }
  /* Rebuild a finished game from a Signal ID. Returns null if invalid. */
  function parseSignal(raw) {
    const m = /^([A-Z]{2})-([ABC]{6})-([A-Z0-9]{2})$/.exec(String(raw || "").trim().toUpperCase().replace(/\s+/g, ""));
    if (!m || roleIdx(m[1]) < 0 || chk(m[1] + "-" + m[2]) !== m[3]) return null;
    const role = roleById(m[1]), S = newState(role, ""); const picks = [];
    for (let r = 0; r < 6; r++) { S.i = r; const slot = "ABC".indexOf(m[2][r]); const res = choose(S, slot); picks.push({ slot, label: res.c[0], kind: kindOf(r, order(role.id, r)[slot]) }); }
    const fs = finalScore(S);
    return { id: m[0], role, S, picks, fs, rank: rank(fs.total), ending: fs.e };
  }
  /* Achievement badges, earned from a finished game. Pure: depends only on the log, meters, score and hints used. */
  const BADGE_DEFS = [
    { id: "quiet", name: "The Quiet Hand", icon: "★", why: "Reached the best ending: bold, and still hidden.", test: (c) => c.e.id === "quiet" },
    { id: "flawless", name: "Flawless", icon: "◆", why: "Made the strongest call in all six rounds.", test: (c) => c.S.score >= 120 },
    { id: "clean", name: "Clean Crack", icon: "✓", why: "Cracked all six ciphers without using a hint.", test: (c) => !(c.S.hints > 0) },
    { id: "cover", name: "Cover Story Master", icon: "▲", why: "Hid the source of your intelligence at least three times.", test: (c) => c.n.cover >= 3 },
    { id: "burn", name: "Never Burned", icon: "●", why: "Kept Secrecy at 40 or higher the whole way through.", test: (c) => c.minS >= 40 },
    { id: "trust", name: "Trusted Colleague", icon: "✚", why: "Finished with Trust at 58 or higher.", test: (c) => c.S.st.t >= 58 },
    { id: "impact", name: "Game Changer", icon: "⚑", why: "Finished with Impact at 70 or higher.", test: (c) => c.S.st.i >= 70 },
    { id: "ledger", name: "Balanced Ledger", icon: "=", why: "Finished with Secrecy, Impact and Trust all at 50 or more.", test: (c) => c.S.st.s >= 50 && c.S.st.i >= 50 && c.S.st.t >= 50 },
    { id: "vault", name: "Vault Door", icon: "▣", why: "Held information back at least three times.", test: (c) => c.n.hold + c.n.hold3 >= 3 },
    { id: "bold", name: "Bold Move", icon: "!", why: "Acted openly and took the risk at least twice.", test: (c) => c.n.open >= 2 },
    { id: "honest", name: "Honest Broker", icon: "♦", why: "Told the truth when the signals stopped.", test: (c) => c.n.share >= 1 },
    { id: "lesson", name: "Lesson Learned", icon: "?", why: "Made a bad guess, and now you know better.", test: (c) => c.n.blunder >= 1 },
    { id: "duty", name: "Reporting for Duty", icon: "+", why: "Finished all six rounds of the operation.", test: () => true }
  ];
  function badges(S) {
    const e = ending(S.st), n = { cover: 0, share: 0, open: 0, hold: 0, hold3: 0, blunder: 0 }; let s = 50, minS = 50;
    S.log.forEach((x) => { n[x.kind] = (n[x.kind] || 0) + 1; s = clamp(s + x.fx.s); minS = Math.min(minS, s); });
    const c = { S, e, n, minS }, got = BADGE_DEFS.filter((b) => b.test(c)).map(({ id, name, icon, why }) => ({ id, name, icon, why }));
    return { got, total: BADGE_DEFS.length };
  }
  return { badges, clamp, roleIdx, roleById, order, kindOf, shiftFor, encode, decode, piece, newState, choose, ending, finalScore, rank, signalId, parseSignal, chk };
})();
if (typeof module !== "undefined") module.exports = Logic;
