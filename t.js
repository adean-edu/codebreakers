const { chromium } = require('playwright'); const L = require('./src/logic.js'); global.DATA = require('./src/data.js');
(async () => {
  const mode = process.argv[2] || 'desktop', role = process.argv[3] || 'BP', picks = process.argv[4] || 'ABCABC';
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
  await p.waitForSelector('#sigid'); const id = await p.textContent('#sigid'); console.log('signal', id);
  await p.screenshot({ path: `shots/${mode}-end.png`, fullPage: true });
  // decode another role
  const o = 'NV'; const S = L.newState(L.roleById(o), 'x'); for (let r = 0; r < 6; r++) { S.i = r; L.choose(S, r % 3); } const sid = L.signalId(S);
  await p.fill('#sid', sid); await p.click('#dgo'); await p.waitForSelector('.decoded'); await p.screenshot({ path: `shots/${mode}-decoded.png`, fullPage: true });
  await p.click('[data-go="board"]'); await p.waitForTimeout(200); await p.screenshot({ path: `shots/${mode}-board.png`, fullPage: true });
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
