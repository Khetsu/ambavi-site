/* ამბავი · Canvas ეფექტები (საერთოა ყველა დიზაინისთვის).
   ფონური რეჟიმები (config.js → fx): petals, confetti, stars, fireflies, gold, bubbles, feathers, balloons, hearts
   რაოდენობის შეცვლა: "petals:0.5" (ნახევარი) ან "confetti:1.5".
   აფეთქებები: FX.burst("sparkle" | "confetti" | "hearts" | "petals" | "feathers" | "firework", x, y)
   ფერები theme.css-დან: --fx1 ... --fx6 */
window.FX = (function(){
"use strict";
const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const TAU = Math.PI * 2, rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[(Math.random() * a.length) | 0];
let cv = null, g = null, ca = null, ga = null, gb = null, W = 0, H = 0, DPR = 1, raf = 0, last = 0, modes = [], dens = 1, pal = [], layers = [], parts = [], rockets = [], meteors = [], spr = {}, nextMeteor = 4;

function rgba(c, a){
  c = String(c).trim();
  if (c[0] !== "#") return c;
  let h = c.slice(1); if (h.length === 3) h = h.split("").map(x => x + x).join("");
  const n = parseInt(h, 16);
  return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
}
function readPal(){
  const cs = getComputedStyle(document.documentElement); pal = [];
  for (let i = 1; i <= 6; i++){ const v = cs.getPropertyValue("--fx" + i).trim(); if (v) pal.push(v); }
  if (!pal.length) pal = ["#F3DC94", "#D4AF6A", "#FFFFFF", "#F6D9D2"];
}
function sprite(c){
  if (spr[c]) return spr[c];
  const s = document.createElement("canvas"), r = 32; s.width = s.height = r * 2;
  const x = s.getContext("2d"), gr = x.createRadialGradient(r, r, 0, r, r, r);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.18, rgba(c, .95)); gr.addColorStop(.5, rgba(c, .25)); gr.addColorStop(1, rgba(c, 0));
  x.fillStyle = gr; x.fillRect(0, 0, r * 2, r * 2);
  return (spr[c] = s);
}
function glow(c, x, y, r, a){ g.globalAlpha = Math.max(0, Math.min(1, a)); g.drawImage(sprite(c), x - r, y - r, r * 2, r * 2); }
function star4(x, y, r, rot){
  g.save(); g.translate(x, y); g.rotate(rot || 0); g.beginPath();
  g.moveTo(0, -r); g.quadraticCurveTo(r * .14, -r * .14, r, 0); g.quadraticCurveTo(r * .14, r * .14, 0, r);
  g.quadraticCurveTo(-r * .14, r * .14, -r, 0); g.quadraticCurveTo(-r * .14, -r * .14, 0, -r); g.fill(); g.restore();
}
function heartPath(s){ g.beginPath(); g.moveTo(0, s * .9); g.bezierCurveTo(-s * 1.25, s * .05, -s * .7, -s * .95, 0, -s * .35); g.bezierCurveTo(s * .7, -s * .95, s * 1.25, s * .05, 0, s * .9); }
function petalShape(s){ g.beginPath(); g.moveTo(0, -s); g.bezierCurveTo(s, -s * .4, s * .7, s * .7, 0, s); g.bezierCurveTo(-s * .7, s * .7, -s, -s * .4, 0, -s); }
function featherShape(s){
  g.fillStyle = "rgba(255,255,255,.96)"; g.strokeStyle = "rgba(140,160,190,.45)"; g.lineWidth = .8;
  g.beginPath(); g.moveTo(0, -s); g.bezierCurveTo(s * .48, -s * .6, s * .36, s * .45, 0, s * .82); g.bezierCurveTo(-s * .32, s * .3, -s * .42, -s * .6, 0, -s); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(0, -s * .9); g.quadraticCurveTo(s * .06, 0, -s * .05, s * 1.08); g.stroke();
}

/* ---------- ambient layers ---------- */
const AMB = {
  petals: { n: 16,
    make: i => ({ x: rnd(0, W), y: i ? rnd(0, H) : rnd(-80, -20), s: rnd(6, 12), vy: rnd(22, 48), sw: rnd(20, 60), sp: rnd(.5, 1.2), ph: rnd(0, TAU), r: rnd(0, TAU), vr: rnd(-1.2, 1.2), f: rnd(0, TAU), vf: rnd(1.5, 3), c: pick(pal), a: rnd(.55, .9) }),
    step: (p, dt, ts) => { p.y += p.vy * dt; p.x += Math.cos(ts * p.sp + p.ph) * p.sw * dt; p.r += p.vr * dt; p.f += p.vf * dt; return p.y < H + 30; },
    draw: p => { g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.scale(Math.cos(p.f), 1); g.globalAlpha = p.a; g.fillStyle = p.c; petalShape(p.s); g.fill(); g.globalAlpha = p.a * .35; g.fillStyle = "#fff"; g.beginPath(); g.ellipse(-p.s * .2, -p.s * .3, p.s * .16, p.s * .42, -.3, 0, TAU); g.fill(); g.restore(); } },
  confetti: { n: 22,
    make: i => ({ x: rnd(0, W), y: i ? rnd(0, H) : rnd(-60, -10), w: rnd(5, 9), h: rnd(3, 6), vy: rnd(35, 75), sw: rnd(10, 40), sp: rnd(1, 2.2), ph: rnd(0, TAU), r: rnd(0, TAU), vr: rnd(-4, 4), f: rnd(0, TAU), vf: rnd(4, 9), c: pick(pal), a: rnd(.7, 1), round: Math.random() < .25 }),
    step: (p, dt, ts) => { p.y += p.vy * dt; p.x += Math.sin(ts * p.sp + p.ph) * p.sw * dt; p.r += p.vr * dt; p.f += p.vf * dt; return p.y < H + 20; },
    draw: p => { g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.scale(1, Math.cos(p.f)); g.globalAlpha = p.a; g.fillStyle = p.c; if (p.round){ g.beginPath(); g.arc(0, 0, p.w * .45, 0, TAU); g.fill(); } else g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore(); } },
  stars: { n: 70,
    make: () => ({ x: rnd(0, W), y: rnd(0, H), r: Math.random() < .12 ? rnd(4, 7) : rnd(.6, 1.7), sp: rnd(.6, 2.2), ph: rnd(0, TAU), c: pick(pal) }),
    step: () => true,
    draw: (p, ts) => { const a = .2 + .8 * Math.abs(Math.sin(ts * p.sp + p.ph)); g.fillStyle = p.c;
      if (p.r > 3){ glow(p.c, p.x, p.y, p.r * 2, a * .55); g.globalAlpha = a; star4(p.x, p.y, p.r * (.6 + .4 * a), 0); }
      else { g.globalAlpha = a; g.fillRect(p.x, p.y, p.r, p.r); } } },
  fireflies: { n: 16,
    make: () => ({ x: rnd(0, W), y: rnd(H * .15, H), a: rnd(0, TAU), v: rnd(8, 22), r: rnd(5, 10), sp: rnd(.8, 2), ph: rnd(0, TAU), c: pick(pal) }),
    step: (p, dt) => { p.a += rnd(-3, 3) * dt; p.x += Math.cos(p.a) * p.v * dt; p.y += Math.sin(p.a) * p.v * dt - 4 * dt;
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20; if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20; return true; },
    draw: (p, ts) => glow(p.c, p.x, p.y, p.r * 2.2, .2 + .8 * Math.pow(Math.abs(Math.sin(ts * p.sp + p.ph)), 2)) },
  gold: { n: 26,
    make: i => ({ x: rnd(0, W), y: i ? rnd(0, H) : H + rnd(5, 40), vy: rnd(-12, -28), sw: rnd(5, 18), sp: rnd(.6, 1.5), ph: rnd(0, TAU), r: rnd(2, 4.5), c: pick(pal), tw: rnd(1, 3) }),
    step: (p, dt, ts) => { p.y += p.vy * dt; p.x += Math.sin(ts * p.sp + p.ph) * p.sw * dt; return p.y > -20; },
    draw: (p, ts) => glow(p.c, p.x, p.y, p.r * 2.4, .3 + .7 * Math.abs(Math.sin(ts * p.tw + p.ph))) },
  bubbles: { n: 12,
    make: i => ({ x: rnd(0, W), y: i ? rnd(0, H) : H + rnd(20, 80), r: rnd(6, 20), vy: rnd(-18, -40), sw: rnd(8, 22), sp: rnd(.6, 1.4), ph: rnd(0, TAU), c: pick(pal) }),
    step: (p, dt, ts) => { p.y += p.vy * dt; p.x += Math.sin(ts * p.sp + p.ph) * p.sw * dt; return p.y > -40; },
    draw: p => { const gr = g.createRadialGradient(p.x - p.r * .35, p.y - p.r * .35, p.r * .1, p.x, p.y, p.r);
      gr.addColorStop(0, "rgba(255,255,255,.8)"); gr.addColorStop(.6, rgba(p.c, .12)); gr.addColorStop(1, rgba(p.c, .5));
      g.globalAlpha = .6; g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill();
      g.globalAlpha = .8; g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1.2; g.beginPath(); g.arc(p.x, p.y, p.r * .68, -2.6, -1.9); g.stroke(); } },
  feathers: { n: 9,
    make: i => ({ x: rnd(0, W), y: i ? rnd(0, H) : rnd(-80, -30), s: rnd(13, 24), vy: rnd(14, 28), sw: rnd(30, 70), sp: rnd(.4, .9), ph: rnd(0, TAU), a: rnd(.6, .95), rot: 0 }),
    step: (p, dt, ts) => { p.y += p.vy * dt * (.7 + .3 * Math.sin(ts * p.sp * 2 + p.ph)); p.x += Math.cos(ts * p.sp + p.ph) * p.sw * dt; p.rot = Math.sin(ts * p.sp + p.ph) * .7; return p.y < H + 40; },
    draw: p => { g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.globalAlpha = p.a; featherShape(p.s); g.restore(); } },
  balloons: { n: 7,
    make: i => ({ x: rnd(0, W), y: i ? rnd(H * .2, H + 120) : H + rnd(60, 160), s: rnd(16, 28), vy: rnd(-26, -50), sw: rnd(10, 28), sp: rnd(.5, 1.1), ph: rnd(0, TAU), c: pick(pal), tilt: 0 }),
    step: (p, dt, ts) => { p.y += p.vy * dt; p.x += Math.sin(ts * p.sp + p.ph) * p.sw * dt; p.tilt = Math.sin(ts * p.sp + p.ph) * .12; return p.y > -p.s * 4; },
    draw: p => { const s = p.s; g.save(); g.translate(p.x, p.y); g.rotate(p.tilt); g.globalAlpha = .9;
      g.strokeStyle = "rgba(80,80,110,.4)"; g.lineWidth = 1; g.beginPath(); g.moveTo(0, s * 1.3); g.bezierCurveTo(s * .3, s * 1.8, -s * .3, s * 2.3, 0, s * 2.9); g.stroke();
      const gr = g.createRadialGradient(-s * .35, -s * .45, s * .08, 0, 0, s * 1.3); gr.addColorStop(0, "rgba(255,255,255,.9)"); gr.addColorStop(.28, p.c); gr.addColorStop(1, rgba(p.c, .85));
      g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, s, s * 1.2, 0, 0, TAU); g.fill();
      g.fillStyle = p.c; g.beginPath(); g.moveTo(-s * .16, s * 1.17); g.lineTo(s * .16, s * 1.17); g.lineTo(0, s * 1.34); g.closePath(); g.fill(); g.restore(); } },
  hearts: { n: 10,
    make: i => ({ x: rnd(0, W), y: i ? rnd(0, H) : H + rnd(10, 60), s: rnd(5, 10), vy: rnd(-14, -30), sw: rnd(10, 25), sp: rnd(.6, 1.3), ph: rnd(0, TAU), c: pick(pal), a: rnd(.35, .7) }),
    step: (p, dt, ts) => { p.y += p.vy * dt; p.x += Math.sin(ts * p.sp + p.ph) * p.sw * dt; return p.y > -20; },
    draw: (p, ts) => { g.save(); g.translate(p.x, p.y); g.rotate(Math.sin(ts * p.sp + p.ph) * .25); g.globalAlpha = p.a; g.fillStyle = p.c; heartPath(p.s); g.fill(); g.restore(); } }
};

function build(){
  const area = Math.min(1.7, Math.max(.55, (W * H) / (390 * 844)));
  layers = [];
  if (REDUCED) return;
  modes.forEach(m => {
    const [k, f] = String(m).split(":"), def = AMB[k];
    if (!def) return;
    const n = Math.round(def.n * area * (f ? +f : 1) * dens), list = [];
    for (let i = 0; i < n; i++) list.push(def.make(true));
    layers.push({ k, def, list });
  });
}

/* ---------- bursts ---------- */
const PHYS = { sparkle: [90, .94], confetti: [620, .962], hearts: [-40, .93], petals: [70, .95], feathers: [18, .94], spark: [110, .955] };
function add(p){ p.max = p.life; parts.push(p); }
function burst(kind, x, y, n){
  if (REDUCED || !g) return;
  const K = kind || "sparkle";
  if (K === "firework") return firework(x, y);
  if (x == null){ x = W / 2; y = H / 2; }
  const N = n || { sparkle: 42, confetti: 140, hearts: 26, petals: 34, feathers: 14 }[K] || 40;
  for (let i = 0; i < N; i++){
    const a = K === "confetti" ? -Math.PI / 2 + rnd(-1.3, 1.3) : rnd(0, TAU);
    const v = K === "confetti" ? rnd(280, 760) : K === "feathers" ? rnd(40, 170) : rnd(80, 330);
    add({ k: K, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: K === "confetti" ? rnd(2.4, 4) : K === "feathers" ? rnd(2.5, 4) : rnd(1, 2),
      c: pick(pal), s: K === "hearts" ? rnd(5, 11) : K === "petals" ? rnd(6, 11) : K === "feathers" ? rnd(12, 20) : K === "confetti" ? rnd(5, 9) : rnd(2, 5),
      r: rnd(0, TAU), vr: rnd(-6, 6), f: rnd(0, TAU), vf: rnd(4, 10), round: Math.random() < .2 });
  }
}
function firework(x, y){
  if (REDUCED || !g) return;
  if (x == null){ x = rnd(W * .15, W * .85); y = rnd(H * .12, H * .45); }
  rockets.push({ x: x + rnd(-30, 30), y: H + 10, tx: x, ty: y, vy: -rnd(560, 720), c: pick(pal), px: x, py: H + 10 });
}
function fireworks(n, gap){ for (let i = 0; i < (n || 5); i++) setTimeout(() => firework(), i * (gap || 420) + rnd(0, 220)); }
function explode(r){
  const n = 70 + (Math.random() * 30 | 0), c2 = pick(pal);
  for (let i = 0; i < n; i++){
    const a = TAU * i / n + rnd(-.05, .05), v = rnd(90, 270) * (Math.random() < .2 ? .55 : 1);
    add({ k: "spark", x: r.tx, y: r.ty, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(1.1, 1.9), c: i % 3 ? r.c : c2, s: rnd(1.4, 2.4), r: 0, vr: 0, f: 0, vf: 0 });
  }
  add({ k: "flash", x: r.tx, y: r.ty, vx: 0, vy: 0, life: .35, c: r.c, s: 60, r: 0, vr: 0, f: 0, vf: 0 });
}
function trail(x, y){
  if (REDUCED || !g || parts.length > 400) return;
  add({ k: "sparkle", x, y, vx: rnd(-20, 20), vy: rnd(-10, 30), life: .7, c: pick(pal), s: rnd(1.5, 3), r: 0, vr: 0, f: 0, vf: 0 });
}

function stepPart(p, dt){
  if (p.k === "flash"){ p.life -= dt; return; }
  const ph = PHYS[p.k] || PHYS.sparkle, d = Math.pow(ph[1], dt * 60);
  p.vx *= d; p.vy = p.vy * d + ph[0] * dt;
  if (p.k === "confetti"){ if (p.vy > 150) p.vy = 150; p.x += Math.sin(p.f) * 26 * dt; }
  if (p.k === "petals" || p.k === "feathers"){ p.x += Math.sin(p.f * .4) * 30 * dt; }
  p.px = p.x; p.py = p.y;
  p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.f += p.vf * dt; p.life -= dt;
}
function drawPart(p){
  const a = Math.max(0, Math.min(1, p.life / p.max * 1.6));
  switch (p.k){
    case "confetti":
      g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.scale(1, Math.cos(p.f)); g.globalAlpha = Math.min(1, p.life * 1.5); g.fillStyle = p.c;
      if (p.round){ g.beginPath(); g.arc(0, 0, p.s * .45, 0, TAU); g.fill(); } else g.fillRect(-p.s / 2, -p.s * .3, p.s, p.s * .6);
      g.restore(); break;
    case "hearts":
      g.save(); g.translate(p.x, p.y); g.rotate(Math.sin(p.f) * .3); g.globalAlpha = a; g.fillStyle = p.c; heartPath(p.s); g.fill(); g.restore(); break;
    case "petals":
      g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.scale(Math.cos(p.f), 1); g.globalAlpha = a; g.fillStyle = p.c; petalShape(p.s); g.fill(); g.restore(); break;
    case "feathers":
      g.save(); g.translate(p.x, p.y); g.rotate(Math.sin(p.f * .5) * .8); g.globalAlpha = a; featherShape(p.s); g.restore(); break;
    case "spark":
      g.globalAlpha = a; g.strokeStyle = p.c; g.lineWidth = p.s; g.lineCap = "round";
      g.beginPath(); g.moveTo(p.x - p.vx * .045, p.y - p.vy * .045); g.lineTo(p.x, p.y); g.stroke();
      glow(p.c, p.x, p.y, p.s * 3, a * .8); break;
    case "flash":
      glow(p.c, p.x, p.y, p.s * (1.4 - p.life), p.life * 2); break;
    default:
      glow(p.c, p.x, p.y, p.s * 3.2, a * .9); g.globalAlpha = a; g.fillStyle = "#fff"; star4(p.x, p.y, p.s * 1.6, p.r * .3);
  }
}

/* ---------- loop ---------- */
function frame(now){
  raf = requestAnimationFrame(frame);
  const dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
  const ts = now / 1000;
  g = ga; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
  for (const L of layers){
    for (let i = 0; i < L.list.length; i++){ let p = L.list[i]; if (!L.def.step(p, dt, ts)){ p = L.list[i] = L.def.make(false); } L.def.draw(p, ts); }
    if (L.k === "stars"){
      nextMeteor -= dt;
      if (nextMeteor <= 0){ nextMeteor = rnd(4, 9); meteors.push({ x: rnd(W * .2, W), y: rnd(0, H * .4), v: rnd(500, 800), life: 1, len: rnd(80, 160) }); }
    }
  }
  g.globalAlpha = 1;
  g = gb; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
  for (let i = meteors.length - 1; i >= 0; i--){
    const m = meteors[i]; m.x -= m.v * dt * .9; m.y += m.v * dt * .45; m.life -= dt * 1.2;
    if (m.life <= 0){ meteors.splice(i, 1); continue; }
    const gr = g.createLinearGradient(m.x, m.y, m.x + m.len * .9, m.y - m.len * .45);
    gr.addColorStop(0, "rgba(255,255,255," + m.life + ")"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.globalAlpha = 1; g.strokeStyle = gr; g.lineWidth = 1.6; g.beginPath(); g.moveTo(m.x, m.y); g.lineTo(m.x + m.len * .9, m.y - m.len * .45); g.stroke();
  }
  for (let i = rockets.length - 1; i >= 0; i--){
    const r = rockets[i]; r.px = r.x; r.py = r.y;
    r.y += r.vy * dt; r.x += (r.tx - r.x) * Math.min(1, dt * 2.5);
    g.globalAlpha = .9; g.strokeStyle = r.c; g.lineWidth = 2; g.lineCap = "round"; g.beginPath(); g.moveTo(r.x, r.y + 18); g.lineTo(r.x, r.y); g.stroke();
    glow(r.c, r.x, r.y, 8, .9);
    if (r.y <= r.ty){ rockets.splice(i, 1); explode(r); }
  }
  for (let i = parts.length - 1; i >= 0; i--){
    const p = parts[i]; stepPart(p, dt);
    if (p.life <= 0 || p.y > H + 60){ parts.splice(i, 1); continue; }
    drawPart(p);
  }
  g.globalAlpha = 1;
}
function resize(){
  const pw = W;
  W = innerWidth; H = innerHeight; DPR = Math.min(2, window.devicePixelRatio || 1);
  cv.width = ca.width = Math.round(W * DPR); cv.height = ca.height = Math.round(H * DPR);
  if (!layers.length || Math.abs(W - pw) > 40) build();
}
function init(o){
  o = o || {};
  modes = [].concat(o.modes || []); dens = o.density == null ? 1 : o.density;
  if (cv) return;
  ca = document.createElement("canvas"); ca.id = "fx-amb"; ca.setAttribute("aria-hidden", "true");
  cv = document.createElement("canvas"); cv.id = "fx"; cv.setAttribute("aria-hidden", "true");
  document.body.appendChild(ca); document.body.appendChild(cv);
  ga = ca.getContext("2d"); gb = g = cv.getContext("2d");
  readPal(); resize(); build();
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden){ cancelAnimationFrame(raf); raf = 0; }
    else if (!raf){ last = 0; raf = requestAnimationFrame(frame); }
  });
  raf = requestAnimationFrame(frame);
}
function setModes(m){ modes = [].concat(m || []); build(); }
return { init, burst, firework, fireworks, trail, setModes };
})();
