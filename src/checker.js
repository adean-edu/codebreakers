/* Teacher checking page: paste students' private submissions and check every Signal ID and message. Nothing is stored or sent anywhere. */
(function () {
  const D = DATA, L = Logic, $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ID_RE = /\b[A-Z]{2}-[ABC]{6}(?:-[A-Z0-9])?-[A-Z0-9]{2}\b/g;
  /* Trust or Traitor verdicts: "<ID> A" or "<ID> D2T", "*" = with research. */
  const VD_RE = /\b([A-Z]{2}-[ABC]{6}-[A-Z0-9]-[A-Z0-9]{2})\s+(A|D([1-3])([TFO]))(\*?)/g;
  const norm = (t) => String(t || "").toUpperCase().replace(/[^A-Z]+/g, " ").trim();
  const roleByName = (n) => D.ROLES.find((r) => norm(r.name) === norm(n));

  /* Read one submission's text into its parts. */
  function readOne(text) {
    const head = /MISSION COMPLETE\s*·\s*([^\n·]*)(?:·\s*([^\n]*))?/.exec(text) || [];
    const line = (label) => { const m = new RegExp("^\\s*" + label + "\\s*:(.*)$", "mi").exec(text); return m ? m[1] : null; };
    const ownLine = line("My Signal IDs?"), decLine = line("Decoded with Signal IDs from");
    const msgs = {}; text.split(/\r?\n/).forEach((ln) => { const m = /^\s*([1-6])\.\s.*\):\s*(.+)$/.exec(ln); if (m) msgs[+m[1] - 1] = m[2].trim(); });
    const vdLine = line("Verdicts"), verdicts = [];
    if (vdLine) { let m; VD_RE.lastIndex = 0; while ((m = VD_RE.exec(vdLine.toUpperCase()))) verdicts.push({ id: m[1], vd: m[2] === "A" ? { v: "A", res: !!m[5] } : { v: "D", r: +m[3], t: m[4], res: !!m[5] } }); }
    const refl = (text.split(/^\s*Decoded with Signal IDs from:.*$/mi)[1] || "").replace(/^\s*(Verdicts|Interrogation score)\s*:.*$/gmi, "");
    return {
      name: (head[1] || "").trim() || "(no name)", roleName: (head[2] || "").trim(),
      own: ownLine === null ? null : (ownLine.toUpperCase().match(ID_RE) || []),
      dec: decLine === null ? [] : (decLine.toUpperCase().match(ID_RE) || []),
      decRaw: decLine, msgs, refl: refl.trim(), verdicts, hasVd: vdLine !== null
    };
  }

  /* Check one submission. Returns the row for the results table. */
  function check(sub) {
    const notes = [], warn = [], role = roleByName(sub.roleName), covered = {};
    // the student's own game
    let ownOk = false;
    if (sub.own === null || !sub.own.length) {
      warn.push("No own Signal ID in the submission (made with an older version of the game, or edited). Coverage counts their stated role.");
      if (role) covered[role.id] = "own (stated)";
    } else {
      sub.own.forEach((id) => {
        const p = L.parseSignal(id);
        if (!p) { notes.push(`Own Signal ID ${id} is not a real Signal ID.`); return; }
        covered[p.role.id] = "own"; if (!role || p.role.id === role.id) ownOk = true;
      });
      if (role && !ownOk && !notes.length) notes.push(`Says they played ${role.name}, but their own Signal ID is for a different role.`);
      if (!role && sub.own.some((id) => L.parseSignal(id))) ownOk = true;
    }
    // the classmates they decoded
    const bad = [], decRoles = [];
    sub.dec.forEach((id) => { const p = L.parseSignal(id); if (!p) bad.push(id); else { decRoles.push(p.role.id); if (!covered[p.role.id]) covered[p.role.id] = id; } });
    if (bad.length) notes.push(`Not real Signal IDs: ${bad.join(", ")}.`);
    if (sub.decRaw === null) notes.push("No \"Decoded with Signal IDs from\" line.");
    if (sub.own && sub.dec.some((id) => sub.own.indexOf(id) >= 0)) warn.push("Lists their own Signal ID as a decoded classmate.");
    const missing = D.ROLE_IDS.filter((r) => !covered[r]);
    if (missing.length) notes.push(`No Signal ID for: ${missing.map((r) => L.roleById(r).name).join(", ")}.`);
    // the six messages
    let right = 0; const wrong = [];
    D.ROUNDS.forEach((rd, i) => { if (norm(sub.msgs[i]) === norm(rd.msg.join(" "))) right++; else wrong.push(i + 1); });
    if (wrong.length) notes.push(`Message${wrong.length > 1 ? "s" : ""} wrong or missing: round ${wrong.join(", ")}.`);
    const ok = !notes.length && (ownOk || sub.own === null || !sub.own.length);
    // Trust or Traitor: rescore every verdict from the Signal IDs (the student's own "Interrogation score" line is ignored)
    const vs = { pts: 0, max: 0, n: 0, right: 0, res: 0, list: [] };
    sub.verdicts.forEach((x) => { const p = L.parseSignal(x.id); if (!p || p.alleg == null || (sub.own || []).indexOf(x.id) >= 0) return; const s = L.verdictScore(p.alleg, x.vd); vs.pts += s.pts; vs.max += s.max; vs.n++; if (s.right) vs.right++; if (x.vd.res) vs.res++; vs.list.push({ id: x.id, p, vd: x.vd, s }); });
    return { sub, role, covered, missing, right, notes, warn, ok, nRoles: D.ROLE_IDS.length - missing.length, vs };
  }

  /* Cross-checks between students: shared own Signal IDs, identical reflections. */
  function crossCheck(rows) {
    const byOwn = {}, byRefl = {};
    rows.forEach((r) => { (r.sub.own || []).forEach((id) => { (byOwn[id] = byOwn[id] || []).push(r.sub.name); }); if (r.sub.refl.length > 15) (byRefl[norm(r.sub.refl)] = byRefl[norm(r.sub.refl)] || []).push(r.sub.name); });
    rows.forEach((r) => {
      (r.sub.own || []).forEach((id) => { const o = byOwn[id].filter((n) => n !== r.sub.name); if (o.length) r.warn.push(`Same own Signal ID as ${o.join(", ")}. Two students can make identical choices, but check.`); });
      const o = r.sub.refl.length > 15 ? byRefl[norm(r.sub.refl)].filter((n) => n !== r.sub.name) : []; if (o.length) r.warn.push(`Same reflection word for word as ${o.join(", ")}.`);
    });
  }

  /* Trust or Traitor: each student's own file as an agent, scored from classmates' verdicts. Loyal: +1 per decoder who approved. Double: +1 per decoder fooled (who approved). */
  function agents(rows) {
    const byId = {};
    rows.forEach((r) => (r.sub.own || []).forEach((id) => { const p = L.parseSignal(id); if (p && p.alleg != null) byId[id] = { id, p, name: r.sub.name, row: r, seen: 0, pts: 0, caught: 0 }; }));
    rows.forEach((r) => r.vs.list.forEach((x) => { const a = byId[x.id] || (byId[x.id] = { id: x.id, p: x.p, name: null, seen: 0, pts: 0, caught: 0 }); a.seen++; if (x.vd.v === "A") a.pts++; else if (x.p.alleg && x.vd.r === x.p.alleg) a.caught++; }));
    rows.forEach((r) => { r.agent = null; (r.sub.own || []).forEach((id) => { if (byId[id]) r.agent = byId[id]; }); });
    return Object.values(byId);
  }
  function unmaskHTML(rows, ag) {
    if (!ag.length) return `<p class="small">No Trust or Traitor Signal IDs in these submissions (they come from version 3 of the game or later).</p>`;
    const dbl = ag.filter((a) => a.p.alleg), top = (list, f) => { const m = Math.max(0, ...list.map(f)); return m > 0 ? list.filter((x) => f(x) === m) : []; };
    const who = (a) => esc(a.name || "Unknown student") + " · " + esc(a.p.role.name);
    const deceivers = top(dbl, (a) => a.pts), catchers = top(rows.filter((r) => r.vs.n), (r) => r.vs.pts);
    return `<div class="unmask"><h2>THE UNMASKING</h2>
      <div class="awards"><div class="box"><p class="sl">BEST DECEIVER</p>${deceivers.length ? deceivers.map((a) => `<p><b>${who(a)}</b><br>fooled ${a.pts} of ${a.seen} decoder${a.seen === 1 ? "" : "s"}</p>`).join("") : "<p>No double agent fooled anyone.</p>"}</div>
      <div class="box"><p class="sl">BEST SPY-CATCHER</p>${catchers.length ? catchers.map((r) => `<p><b>${esc(r.sub.name)}</b><br>${r.vs.pts} interrogation point${r.vs.pts === 1 ? "" : "s"} from ${r.vs.n} verdict${r.vs.n === 1 ? "" : "s"}</p>`).join("") : "<p>No verdicts yet.</p>"}</div></div>
      <h3>Allegiances</h3><table><thead><tr><th>Agent</th><th>Signal ID</th><th>Allegiance</th><th>Decoders</th><th>Agent points</th></tr></thead><tbody>${ag.map((a) => `<tr><td>${who(a)}</td><td class="mono">${esc(a.id)}</td><td><b>${a.p.alleg ? "Double agent" : "Loyal"}</b></td><td>${a.seen}</td><td>${a.pts} (${a.p.alleg ? "fooled" : "approved by"} ${a.pts}${a.p.alleg ? `, caught by ${a.caught}` : ""})</td></tr>`).join("")}</tbody></table>
      <h3>Every planted lie</h3>${dbl.length ? `<ol class="lies">${dbl.map((a) => { const x = L.plantedLie(a.p.role.id, a.p.alleg, a.p.lie); return `<li><b>${who(a)}</b>, report ${a.p.alleg}:<br><span class="lie">Planted: ${esc(x.lie)}</span><br><span class="truth">Truth: ${esc(x.truth)}</span></li>`; }).join("")}</ol>` : "<p>No double agents in these submissions.</p>"}
      <p class="small">Only Signal IDs that appear in pasted submissions are listed. An agent with no name was decoded by someone here but did not submit.</p></div>`;
  }
  function run() {
    const text = $("#subs").value, parts = text.split(/(?=MISSION COMPLETE)/i).filter((t) => /MISSION COMPLETE/i.test(t));
    if (!parts.length) { $("#out").innerHTML = `<p class="err">No submissions found. Each one starts with "MISSION COMPLETE".</p>`; return; }
    const rows = parts.map((t) => check(readOne(t))); crossCheck(rows); const ag = agents(rows);
    const vdCell = (r) => r.vs.n ? `${r.vs.pts} of ${r.vs.max}<div class="small">${r.vs.right} of ${r.vs.n} right${r.vs.res ? ` · research on ${r.vs.res}` : ""}</div>` : (r.sub.hasVd ? "None filed" : "—");
    const agCell = (r) => r.agent ? `${r.agent.p.alleg ? "Double" : "Loyal"}: ${r.agent.pts}` : "—";
    const nOk = rows.filter((r) => r.ok).length, nNote = rows.filter((r) => r.ok && r.warn.length).length;
    $("#out").innerHTML = `<p class="sum"><b>${rows.length}</b> submission${rows.length > 1 ? "s" : ""} checked · <b class="ok">${nOk} complete</b>${nNote ? ` (${nNote} with a note to check)` : ""} · <b class="bad">${rows.length - nOk} not complete</b></p>
      <table><thead><tr><th>Student</th><th>Role</th><th>Own Signal ID</th><th>Roles covered</th><th>Messages</th><th>Result</th><th>Verdicts</th><th>As agent</th><th>Notes</th></tr></thead><tbody>${rows.map((r) => `<tr class="${r.ok ? (r.warn.length ? "w" : "g") : "b"}">
        <td>${esc(r.sub.name)}</td><td>${esc(r.role ? r.role.name : r.sub.roleName || "?")}</td><td class="mono">${esc((r.sub.own || []).join(", ") || "none")}</td>
        <td>${r.nRoles} of 5<div class="roles">${D.ROLES.map((x) => `<span class="${r.covered[x.id] ? "on" : ""}" title="${esc(x.name + ": " + (r.covered[x.id] || "missing"))}">${x.id}</span>`).join("")}</div></td>
        <td>${r.right} of 6</td><td><b>${r.ok ? (r.warn.length ? "Complete, check note" : "✓ Complete") : "✗ Not complete"}</b></td><td>${vdCell(r)}</td><td>${agCell(r)}</td>
        <td>${r.notes.concat(r.warn).map((n) => `<div>${esc(n)}</div>`).join("") || "None"}</td></tr>`).join("")}</tbody></table>
      <div class="row"><button class="btn" id="tsv">Copy results for a spreadsheet</button><span class="small" id="tsvmsg" role="status"></span></div>
      <p class="small"><b>Verdicts</b> (Trust or Traitor): +1 for the right verdict; on a double agent, +1 more for the right report and +1 for the right truth. A perfect verdict made with research (a blacked-out line revealed in the Archive) scores 2 instead of 3. <b>As agent</b>: a loyal agent scores 1 per classmate who approved them, a double agent 1 per classmate fooled.</p>
      <div class="row"><button class="btn ghost" id="unbtn" aria-expanded="false">Show the Unmasking</button><span class="small">Reveals who was a double agent. Show it to the class only when everyone is done.</span></div><div id="unmask" hidden>${unmaskHTML(rows, ag)}</div>`;
    $("#unbtn").addEventListener("click", (e) => { const u = $("#unmask"), open = u.hidden; u.hidden = !open; e.currentTarget.textContent = open ? "Hide the Unmasking" : "Show the Unmasking"; e.currentTarget.setAttribute("aria-expanded", open); if (open) u.scrollIntoView({ block: "start" }); });
    $("#tsv").addEventListener("click", () => {
      const tsv = [["Student", "Role", "Own Signal ID", "Roles covered", "Messages", "Result", "Verdict points", "Verdicts filed", "Research used", "Allegiance", "Agent points", "Notes"].join("\t")].concat(rows.map((r) => [r.sub.name, r.role ? r.role.name : r.sub.roleName, (r.sub.own || []).join(" "), r.nRoles + "/5", r.right + "/6", r.ok ? (r.warn.length ? "Complete (check note)" : "Complete") : "Not complete", r.vs.n ? r.vs.pts + "/" + r.vs.max : "", r.vs.n, r.vs.res, r.agent ? (r.agent.p.alleg ? "Double" : "Loyal") : "", r.agent ? r.agent.pts : "", r.notes.concat(r.warn).join(" ")].join("\t"))).join("\n");
      navigator.clipboard.writeText(tsv).then(() => { $("#tsvmsg").textContent = "Copied. Paste into a spreadsheet."; }, () => { $("#tsvmsg").textContent = "Your browser would not copy."; });
    });
  }

  /* Look up one Signal ID: what that student chose. */
  function look() {
    const p = L.parseSignal($("#one").value), out = $("#oneout");
    if (!p) { out.innerHTML = `<p class="err">That is not a real Signal ID. It looks like XX-ABCABC-K-YY.</p>`; return; }
    out.innerHTML = `<p><b>${esc(p.role.name)}</b> · ${esc(p.ending.title)} · ${esc(p.rank.title)} · score ${p.fs.total}</p><ol>${p.picks.map((x, i) => { const sc = D.SCEN[p.role.id + "-" + i]; return `<li><b>${esc(sc ? sc.title : D.ROUNDS[i].title)}:</b> ${"ABC"[x.slot]}. ${esc(x.label)}</li>`; }).join("")}</ol>`;
  }

  $("#go").addEventListener("click", run);
  $("#clear").addEventListener("click", () => { $("#subs").value = ""; $("#out").innerHTML = ""; });
  $("#onego").addEventListener("click", look); $("#one").addEventListener("keydown", (e) => { if (e.key === "Enter") look(); });
})();
