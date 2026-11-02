#!/usr/bin/env node
// Renders simulator.html in headless Chromium and saves screenshots of the
// watch face (one 450x450 PNG per state + an overview sheet).
//
//   node tools/simulator/shoot.js [output-dir]     (default: tools/simulator/out)
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const OUT = path.resolve(process.argv[2] || path.join(__dirname, "out"));
const PAGE = "/tools/simulator/simulator.html";

// Fixed date/time so screenshots are reproducible
const base = { theme: 0, unread: 0, ambient: false, datePos: 0, hh: "10", mm: "10",
               dow: "lun.", day: 2, month: 11, complication: { text: "72", icon: "heart" } };

const tiles = [
  { file: "1-active",          label: "Active",                   s: {} },
  { file: "2-notification",    label: "Unread notification",      s: { unread: 2 } },
  { file: "3-ambient",         label: "Ambient (AOD)",            s: { ambient: true } },
  { file: "4-ambient-notif",   label: "Ambient + notification",   s: { ambient: true, unread: 2 } },
  { file: "5-date-top",        label: "Date on top",              s: { datePos: 1, unread: 2 } },
  { file: "6-theme-bahia",     label: "Theme Bahia",              s: { theme: 1, unread: 2 } },
  { file: "7-theme-abeille",   label: "Theme Abeille",            s: { theme: 2, unread: 2 } },
  { file: "8-theme-banner",    label: "Theme Banner",             s: { theme: 3, unread: 2 } },
];
// Edge cases, saved individually (not on the overview sheet)
const edgeCases = [
  // A complication text of 4+ characters runs into the date when it is on top
  { file: "edge-date-top-long-complication", s: { datePos: 1, complication: { text: "12 345", icon: "steps" } } },
];

const MIME = { ".html": "text/html; charset=utf-8", ".ttf": "font/ttf", ".js": "text/javascript", ".xml": "text/xml" };

// Minimal static server for the repository (fonts cannot be loaded over file://)
function serve() {
  const server = http.createServer((req, res) => {
    const file = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve(server)));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}${PAGE}`;
  const browser = await chromium.launch();

  async function shoot(scale, state, file) {
    const page = await browser.newPage({ viewport: { width: 450, height: 450 }, deviceScaleFactor: scale });
    await page.goto(url);
    await page.evaluate(() => window.fontsLoaded);
    await page.evaluate(st => window.render(st), state);
    const buf = await page.locator("#face").screenshot({ omitBackground: true, path: file });
    await page.close();
    return buf;
  }

  try {
    const sheet = [];
    for (const t of tiles) {
      const state = { ...base, ...t.s };
      await shoot(1, state, path.join(OUT, `${t.file}.png`));                 // native 450x450
      sheet.push({ label: t.label, b64: (await shoot(2, state)).toString("base64") });
    }
    for (const t of edgeCases) await shoot(1, { ...base, ...t.s }, path.join(OUT, `${t.file}.png`));

    // Overview sheet
    const html = `<!doctype html><meta charset="utf-8">
    <style>
      body{margin:0;background:#1b1c1f;font:500 15px/1.3 system-ui,sans-serif;color:#d6d6d6}
      h1{font-weight:600;font-size:20px;margin:28px 32px 4px;color:#fff}
      p{margin:0 32px 18px;color:#9a9a9a;font-size:13px}
      .grid{display:grid;grid-template-columns:repeat(4,260px);gap:28px;padding:8px 32px 32px}
      figure{margin:0;text-align:center}
      .watch{width:260px;height:260px;border-radius:50%;background:#000;box-shadow:0 0 0 6px #2c2d31,0 0 0 7px #3a3b40}
      img{width:260px;height:260px;display:block}
      figcaption{margin-top:14px}
    </style>
    <h1>luciole — watch face simulation</h1>
    <p>Approximate rendering of watchface/src/main/res/raw/watchface.xml (450×450) with SUSE / SUSE Mono · ${base.dow} ${base.day}/${base.month} · ${base.hh}:${base.mm} · heart rate complication “${base.complication.text}”</p>
    <div class="grid">${sheet.map(t => `<figure><div class="watch"><img src="data:image/png;base64,${t.b64}"></div><figcaption>${t.label}</figcaption></figure>`).join("")}</div>`;
    const page = await browser.newPage({ viewport: { width: 1220, height: 100 }, deviceScaleFactor: 2 });
    await page.setContent(html);
    await page.screenshot({ path: path.join(OUT, "overview.png"), fullPage: true });
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`Screenshots written to ${OUT}`);
})().catch(err => { console.error(err); process.exit(1); });
