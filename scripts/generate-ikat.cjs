/**
 * Generates CRUX's original ikat background tile (public/textures/ikat.webp).
 * Oxblood ovals on woven sand, with the feathered vertical "bleed" of warp-dyed ikat.
 * Seamless in both directions. Run: node scripts/generate-ikat.cjs  (needs Playwright + Chromium)
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const html = `<canvas id="c"></canvas><script>
const W = 900, H = 1100;
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const TAU = Math.PI * 2;
// periodic smooth noise so the tile wraps horizontally
const ph = Array.from({ length: 6 }, () => rnd() * TAU);
const pnoise = (x) => (Math.sin(TAU * x / W + ph[0]) + 0.6 * Math.sin(TAU * 3 * x / W + ph[1]) + 0.35 * Math.sin(TAU * 7 * x / W + ph[2]) + 0.2 * Math.sin(TAU * 13 * x / W + ph[3])) / 2.15;

// 1) crisp motif on transparent canvas
const src = document.createElement('canvas'); src.width = W; src.height = H;
const g = src.getContext('2d');
const INK = '#6e1215';
g.strokeStyle = INK; g.fillStyle = INK;
function wrap(draw) { for (const dx of [-W, 0, W]) for (const dy of [-H, 0, H]) { g.save(); g.translate(dx, dy); draw(); g.restore(); } }
// two staggered rows of tall ovals with uneven, brushy line weight
function brushOval(cx, cy, rx, ry, base) {
  const steps = 160;
  for (let i = 0; i < steps; i++) {
    const a0 = (i / steps) * TAU, a1 = ((i + 1.4) / steps) * TAU;
    // thicker on the left/right flanks, thinner at top/bottom, plus wobble
    const flank = Math.abs(Math.cos(a0));
    const lw = base * (0.45 + 0.9 * flank) * (0.8 + 0.4 * Math.sin(a0 * 3 + cx));
    const wob = 1 + 0.05 * Math.sin(a0 * 5 + cy);
    wrap(() => {
      g.lineWidth = lw; g.lineCap = 'round'; g.beginPath();
      g.ellipse(cx, cy, rx * wob, ry * wob, 0, a0, a1); g.stroke();
    });
  }
}
const rows = [{ y: 270, xs: [150, 455, 760] }, { y: 820, xs: [0, 300, 610] }];
for (const r of rows) for (const x of r.xs) {
  brushOval(x + (rnd() - 0.5) * 40, r.y + (rnd() - 0.5) * 30, 95 + rnd() * 45, 215 + rnd() * 35, 26 + rnd() * 22);
}
// pinched "eyes" where ovals meet
for (const [x, y] of [[300, 545], [610, 548], [0, 548], [455, 1098], [150, 1096]]) {
  const w = 110 + rnd() * 60;
  wrap(() => { g.beginPath(); g.moveTo(x - w, y); g.quadraticCurveTo(x, y - 18, x + w, y); g.quadraticCurveTo(x, y + 18, x - w, y); g.fill(); });
}
// a heavy dyed selvedge-like band and thin warp threads (soft-ended)
function softBar(x, y, w, h, alpha) {
  const gr = g.createLinearGradient(0, y, 0, y + h);
  gr.addColorStop(0, 'rgba(107,20,22,0)'); gr.addColorStop(0.2, 'rgba(107,20,22,' + alpha + ')'); gr.addColorStop(0.8, 'rgba(107,20,22,' + alpha + ')'); gr.addColorStop(1, 'rgba(107,20,22,0)');
  wrap(() => { g.fillStyle = gr; g.fillRect(x, y, w, h); });
}
softBar(880, 0, 40, 520, 1);
softBar(0, 640, 30, 380, 0.9);
for (let i = 0; i < 16; i++) softBar(rnd() * W, rnd() * H, 1.5 + rnd() * 3.5, 140 + rnd() * 420, 0.55 + rnd() * 0.4);
g.fillStyle = INK;

// 2) bleed: shift each 1px warp column vertically, many translucent passes
const c = document.getElementById('c'); c.width = W; c.height = H;
const o = c.getContext('2d');
o.fillStyle = '#d6c2a2'; o.fillRect(0, 0, W, H);
const mid = document.createElement('canvas'); mid.width = W; mid.height = H;
const m = mid.getContext('2d');
const passes = 14;
for (let x = 0; x < W; x++) {
  const amp = 30 + 110 * Math.max(0, pnoise(x) + 0.45) + (rnd() < 0.08 ? 140 : 0);
  const bias = (rnd() - 0.5) * 24;
  for (let p = 0; p < passes; p++) {
    const t = p / passes;
    const dy = bias + (rnd() - 0.5) * 2 * amp * t * t;
    m.globalAlpha = p < 2 ? 0.5 : 0.11;
    for (const k of [-H, 0, H]) m.drawImage(src, x, 0, 1, H, x, dy + k, 1, H);
  }
}
// weft misregistration: nudge each 2px row sideways a little
for (let y = 0; y < H; y += 2) {
  const dx = Math.round(Math.sin(y * 0.05) * 2 + (rnd() - 0.5) * 3);
  for (const k of [-W, 0, W]) o.drawImage(mid, 0, y, W, 2, dx + k, y, W, 2);
}
o.globalAlpha = 1;

// 3) woven texture + fibre noise
const img = o.getImageData(0, 0, W, H), d = img.data;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 4;
  const weave = ((x + (y >> 1)) % 4 === 0 ? 0.93 : 1) * (y % 3 === 0 ? 0.96 : 1);
  const n = (rnd() - 0.5) * 14;
  d[i] = Math.min(255, d[i] * weave + n); d[i + 1] = Math.min(255, d[i + 1] * weave + n); d[i + 2] = Math.min(255, d[i + 2] * weave + n);
}
o.putImageData(img, 0, 0);
window.__out = c.toDataURL('image/webp', 0.82);
</script>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setContent(html);
  const url = await p.waitForFunction(() => window.__out, null, { timeout: 120000 }).then((h) => h.jsonValue());
  const out = path.join(__dirname, '..', 'public', 'textures', 'ikat.webp');
  fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
  console.log('wrote', out, fs.statSync(out).size, 'bytes');
  await b.close();
})();
