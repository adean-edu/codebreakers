const { chromium } = require('playwright'); const L = require('./src/logic.js'); global.DATA = require('./src/data.js');
(async () => {
  // node t.js desktop ROLE PICKS [ALLEGIANCE]   ALLEGIANCE: 0 = loyal (default), or 1-3 = double agent falsifying that report,
  // optionally followed by the lie: F (the report's first false version, default) or O (its second), e.g. 2O
  const mode = process.argv[2] || 'desktop', role = process.argv[3] || 'BP', picks = process.argv[4] || 'ABCABC', algArg = process.argv[5] || '0', alg = +algArg[0], lv = algArg[1] === 'O' ? 'O' : 'F';
  const b = await chromium.launch(); const ctx = await b.newContext(mode === 'mobile' ? { viewport: { width: 400, height: 860 } } : { viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|fonts/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  await p.goto('file://' + process.cwd() + '/dist/test.html'); await p.waitForTimeout(400); await p.screenshot({ path: `shots/${mode}-title.png`, fullPage: true });
  await p.click('#start'); await p.click(`.rolecard[data-r="${role}"]`); await p.fill('#cname', 'Marta'); await p.screenshot({ path: `shots/${mode}-pick.png`, fullPage: true }); await p.click('#begin');
  for (let r = 0; r < 6; r++) {
    await p.click('#next'); if (r === 0) await p.screenshot({ path: `shots/${mode}-brief.png`, fullPage: true });
    { const k = L.shiftFor(role, r); for (let i = 0; i < k; i++) await p.click('#dp'); }
    await p.waitForSelector('.mitem'); if (r === 0) await p.screenshot({ path: `shots/${mode}-work.png`, fullPage: true });
    await p.keyboard.press(picks[r].toLowerCase()); if(r===0) await p.screenshot({ path: `shots/${mode}-selected.png`, fullPage: true }); await p.click('#send'); await p.waitForSelector('#next',{state:'attached'}); if (r === 0) await p.screenshot({ path: `shots/${mode}-outcome.png`, fullPage: true }); await p.click('#next');
  }
  // Trust or Traitor: choose the secret allegiance
  await p.waitForSelector('[data-al]');
  if (alg) { await p.click('[data-al="D"]'); await p.click(`[data-lie="${alg}"]`); if (!(await p.isDisabled('#alok'))) errs.push('SEAL allowed before a lie was chosen'); await p.click(`[data-lv="${lv}"]`); } else await p.click('[data-al="0"]');
  await p.waitForTimeout(600); await p.screenshot({ path: `shots/${mode}-allegiance.png`, fullPage: true }); await p.click('#alok');
  await p.waitForSelector('#sigid'); const id = await p.textContent('#sigid'); console.log('signal', id);
  const pa = L.parseSignal(id); if (!pa || pa.alleg !== alg || (alg && pa.lie !== lv)) errs.push('ALLEGIANCE did not round-trip: ' + id);
  const post = await p.inputValue('#ptext'); if (!/INTEL REPORTS FROM MY FRONT/.test(post)) errs.push('POST has no intel reports');
  if (alg && post.indexOf(L.plantedLie(role, alg, lv).lie) < 0) errs.push('POST is missing the chosen lie');
  await p.screenshot({ path: `shots/${mode}-end.png`, fullPage: true });
  // decode another role (a double agent who falsified report 2), use the Archive, interrogate
  const o = role === 'NV' ? 'BP' : 'NV'; const S = L.newState(L.roleById(o), 'x'); for (let r = 0; r < 6; r++) { S.i = r; L.choose(S, r % 3); } S.alg = { v: 2, r: 5 }; const sid = L.signalId(S);
  await p.fill('#sid', sid); await p.click('#dgo'); await p.waitForSelector('.decoded'); await p.waitForSelector('[data-v]');
  await p.click('#iarch'); await p.waitForSelector('.archive .dossier'); await p.click('.ftab:nth-child(2)'); await p.hover('.archive .red'); await p.waitForTimeout(500); await p.screenshot({ path: `shots/${mode}-archive.png` }); await p.keyboard.press('Escape');
  await p.click('[data-v="D"]'); await p.click('[data-r="2"]'); for (const x of await p.$$('[data-t]')) if (await x.getAttribute('data-t') === 'T') { await x.click(); break; }
  await p.click('#ifile'); await p.waitForSelector('.vfiled'); await p.screenshot({ path: `shots/${mode}-decoded.png`, fullPage: true });
  await p.click('[data-go="board"]'); await p.waitForTimeout(200); await p.screenshot({ path: `shots/${mode}-board.png`, fullPage: true });
  const bd = await p.evaluate(() => JSON.parse(localStorage.getItem('cb_board'))); const v = (bd.verdicts || {})[sid];
  if (!v || v.v !== 'D' || v.r !== 2 || v.t !== 'T' || !v.res) errs.push('VERDICT not stored as expected: ' + JSON.stringify(v));
  if ((await p.evaluate(() => JSON.stringify(localStorage))).indexOf('Marta') >= 0) errs.push('NAME was saved');
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
