const { render } = require("./render.js"), S = require("./specs.js");
(async () => { for (const k of process.argv.slice(2)) { await render(S[k], `/home/claude/cb/maps/out/${k}.png`); console.log("rendered", k); } })();
