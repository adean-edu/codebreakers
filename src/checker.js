/* Teacher checking page: paste students' private submissions and check every Signal ID and message. Nothing is stored or sent anywhere. */
(function () {
  const D = DATA, L = Logic, $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ID_RE = /\b[A-Z]{2}-[ABC]{6}-[A-Z0-9]{2}\b/g;
  const norm = (t) => String(t || "").toUpperCase().replace(/[^A-Z]+/g, " ").trim();
  const roleByName = (n) => D.ROLES.find((r) => norm(r.name) === norm(n));

  /* Read one submission's text into its parts. */
  function readOne(text) {
    const head = /MISSION COMPLETE\s*·\s*([^\n·]*)(?:·\s*([^\n]*))?/.exec(text) || [];
    const line = (label) => { const m = new RegExp("^\\s*" + label + "\\s*:(.*)$", "mi").exec(text); return m ? m[1] : null; };
    const ownLine = line("My Signal IDs?"), decLine = line("Decoded with Signal IDs from");
    const msgs = {}; text.split(/\r?\n/).forEach((ln) => { const m = /^\s*([1-6])\.\s.*\):\s*(.+)$/.exec(ln); if (m) msgs[+m[1] - 1] = m[2].trim(); });
    const refl = text.split(/^\s*Decoded with Signal IDs from:.*$/mi)[1] || "";
    return {
      name: (head[1] || "").trim() || "(no name)", roleName: (head[2] || "").trim(),
      own: ownLine === null ? null : (ownLine.toUpperCase().match(ID_RE) || []),
      dec: decLine === null ? [] : (decLine.toUpperCase().match(ID_RE) || []),
      decRaw: decLine, msgs, refl: refl.trim()
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
    return { sub, role, covered, missing, right, notes, warn, ok, nRoles: D.ROLE_IDS.length - missing.length };
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

  function run() {
    const text = $("#subs").value, parts = text.split(/(?=MISSION COMPLETE)/i).filter((t) => /MISSION COMPLETE/i.test(t));
    if (!parts.length) { $("#out").innerHTML = `<p class="err">No submissions found. Each one starts with "MISSION COMPLETE".</p>`; return; }
    const rows = parts.map((t) => check(readOne(t))); crossCheck(rows);
    const nOk = rows.filter((r) => r.ok).length, nNote = rows.filter((r) => r.ok && r.warn.length).length;
    $("#out").innerHTML = `<p class="sum"><b>${rows.length}</b> submission${rows.length > 1 ? "s" : ""} checked · <b class="ok">${nOk} complete</b>${nNote ? ` (${nNote} with a note to check)` : ""} · <b class="bad">${rows.length - nOk} not complete</b></p>
      <table><thead><tr><th>Student</th><th>Role</th><th>Own Signal ID</th><th>Roles covered</th><th>Messages</th><th>Result</th><th>Notes</th></tr></thead><tbody>${rows.map((r) => `<tr class="${r.ok ? (r.warn.length ? "w" : "g") : "b"}">
        <td>${esc(r.sub.name)}</td><td>${esc(r.role ? r.role.name : r.sub.roleName || "?")}</td><td class="mono">${esc((r.sub.own || []).join(", ") || "none")}</td>
        <td>${r.nRoles} of 5<div class="roles">${D.ROLES.map((x) => `<span class="${r.covered[x.id] ? "on" : ""}" title="${esc(x.name + ": " + (r.covered[x.id] || "missing"))}">${x.id}</span>`).join("")}</div></td>
        <td>${r.right} of 6</td><td><b>${r.ok ? (r.warn.length ? "Complete, check note" : "✓ Complete") : "✗ Not complete"}</b></td>
        <td>${r.notes.concat(r.warn).map((n) => `<div>${esc(n)}</div>`).join("") || "None"}</td></tr>`).join("")}</tbody></table>
      <div class="row"><button class="btn" id="tsv">Copy results for a spreadsheet</button><span class="small" id="tsvmsg" role="status"></span></div>`;
    $("#tsv").addEventListener("click", () => {
      const tsv = [["Student", "Role", "Own Signal ID", "Roles covered", "Messages", "Result", "Notes"].join("\t")].concat(rows.map((r) => [r.sub.name, r.role ? r.role.name : r.sub.roleName, (r.sub.own || []).join(" "), r.nRoles + "/5", r.right + "/6", r.ok ? (r.warn.length ? "Complete (check note)" : "Complete") : "Not complete", r.notes.concat(r.warn).join(" ")].join("\t"))).join("\n");
      navigator.clipboard.writeText(tsv).then(() => { $("#tsvmsg").textContent = "Copied. Paste into a spreadsheet."; }, () => { $("#tsvmsg").textContent = "Your browser would not copy."; });
    });
  }

  /* Look up one Signal ID: what that student chose. */
  function look() {
    const p = L.parseSignal($("#one").value), out = $("#oneout");
    if (!p) { out.innerHTML = `<p class="err">That is not a real Signal ID. It looks like XX-ABCABC-YY.</p>`; return; }
    out.innerHTML = `<p><b>${esc(p.role.name)}</b> · ${esc(p.ending.title)} · ${esc(p.rank.title)} · score ${p.fs.total}</p><ol>${p.picks.map((x, i) => { const sc = D.SCEN[p.role.id + "-" + i]; return `<li><b>${esc(sc ? sc.title : D.ROUNDS[i].title)}:</b> ${"ABC"[x.slot]}. ${esc(x.label)}</li>`; }).join("")}</ol>`;
  }

  $("#go").addEventListener("click", run);
  $("#clear").addEventListener("click", () => { $("#subs").value = ""; $("#out").innerHTML = ""; });
  $("#onego").addEventListener("click", look); $("#one").addEventListener("keydown", (e) => { if (e.key === "Enter") look(); });
})();
