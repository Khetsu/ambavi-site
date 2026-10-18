/* ამბავი · „მარგალიტის ფარდა“ — დიზაინის საკუთარი ნაწილი:
   Canvas-ით დახატული მძივის ფარდა, SVG ჭაღი, ნაქარგი ბაღი, ნათურები, დრესკოდის პალიტრა და სურვილების კონვერტი. */
(function(){
"use strict";
const C = window.CONFIG || {};
const $ = id => document.getElementById(id);
const DPR = Math.min(2, window.devicePixelRatio || 1);
const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const L = v => v == null ? "" : typeof v === "object" ? (v[document.documentElement.lang] || v.ka || "") : String(v);
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- bead sprites ---------- */
function mk(w, h, fn){ const c = document.createElement("canvas"); c.width = Math.ceil(w * DPR); c.height = Math.ceil(h * DPR); const g = c.getContext("2d"); g.scale(DPR, DPR); fn(g); return c; }
const PEARL = mk(6, 6, g => { const gr = g.createRadialGradient(2.1, 1.9, .3, 3, 3, 3); gr.addColorStop(0, "#FFFFFF"); gr.addColorStop(.45, "#F1E9D8"); gr.addColorStop(1, "#AE9C76"); g.fillStyle = gr; g.beginPath(); g.arc(3, 3, 2.9, 0, 7); g.fill(); });
const CRYS = mk(5, 5, g => { const gr = g.createRadialGradient(1.7, 1.5, .2, 2.5, 2.5, 2.6); gr.addColorStop(0, "#FFFFFF"); gr.addColorStop(.5, "#E6E9EF"); gr.addColorStop(1, "#8E96A3"); g.fillStyle = gr; g.beginPath(); g.moveTo(2.5, 0); g.lineTo(5, 2.5); g.lineTo(2.5, 5); g.lineTo(0, 2.5); g.closePath(); g.fill(); });
const BUGLE = mk(4, 12, g => { const gr = g.createLinearGradient(0, 0, 4, 0); gr.addColorStop(0, "#B3A07A"); gr.addColorStop(.45, "#F8F2E3"); gr.addColorStop(1, "#A28E68"); g.fillStyle = gr; g.beginPath(); if (g.roundRect) g.roundRect(.3, 0, 3.4, 12, 1.6); else g.rect(.3, 0, 3.4, 12); g.fill(); });

function strand(g, x, y0, y1, k, amp){
  let y = y0;
  while (y < y1){
    const t = k++ % 9, xx = x + Math.sin(y * .011 + x * .05) * amp;
    if (t === 0 || t === 4 || t === 7){ g.drawImage(PEARL, xx - 3, y, 6, 6); y += 6.3; }
    else if (t === 2){ g.drawImage(CRYS, xx - 2.5, y, 5, 5); y += 5.4; }
    else { const len = 9 + (k % 3); g.drawImage(BUGLE, xx - 2, y, 4, len); y += len + .6; }
  }
}
function prep(cv){
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return null;
  cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR);
  const g = cv.getContext("2d"); g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, w, h);
  return { g, w, h };
}
/* a full hanging panel of bead strands with soft folds */
function drawPanel(cv, gap, edge){
  const p = prep(cv); if (!p) return;
  const { g, w, h } = p;
  for (let x = gap / 2, i = 0; x < w + gap; x += gap, i++) strand(g, x, -4 - (i % 5) * 3, h, (i * 7) % 9, 1.3);
  for (let x = 0; x < w; x += 38){ const gr = g.createLinearGradient(x, 0, x + 38, 0); gr.addColorStop(0, "rgba(90,70,40,0)"); gr.addColorStop(.5, "rgba(90,70,40,.10)"); gr.addColorStop(1, "rgba(90,70,40,0)"); g.fillStyle = gr; g.fillRect(x, 0, 38, h); }
  if (edge){ const ex = edge === "r" ? w - 3 : 3; for (let y = 0; y < h; y += 7) g.drawImage(PEARL, ex - 3.5, y, 7, 7); }
}
/* draped valance: rows of pearls in swags with a fringe below */
function drawValance(cv){
  const p = prep(cv); if (!p) return;
  const { g, w, h } = p;
  const n = Math.max(3, Math.round(w / 130)), sw = w / n, sag = Math.min(46, h * .38);
  for (let x = 0; x < w; x += 5.5){ g.drawImage(PEARL, x, 0, 6, 6); g.drawImage(CRYS, x + 1, 7, 4, 4); }
  for (let s = 0; s < n; s++){
    const x0 = s * sw, x1 = x0 + sw;
    for (let x = x0 + 3; x < x1; x += 6){
      const t = (x - x0) / sw, y0 = 14 + sag * Math.sin(Math.PI * t) + 30, len = 16 + 30 * Math.sin(Math.PI * t);
      strand(g, x, y0, y0 + len, (x | 0) % 9, .3);
    }
    for (let r = 0; r < 6; r++){
      const steps = Math.ceil(sw / 5);
      for (let i = 0; i <= steps; i++){
        const t = i / steps, x = x0 + t * sw, y = 12 + r * 6.2 + sag * Math.sin(Math.PI * t);
        g.drawImage(r % 3 === 1 ? CRYS : PEARL, x - 3, y - 3, r % 3 === 1 ? 5 : 6, r % 3 === 1 ? 5 : 6);
      }
    }
    g.drawImage(PEARL, x0 - 6, 6, 12, 12);
  }
}
function drawAll(){
  document.querySelectorAll("canvas[data-curtain]").forEach(cv => {
    const k = cv.dataset.curtain;
    if (k === "valance") drawValance(cv);
    else if (k === "full") drawPanel(cv, 6.2, cv.classList.contains("l") ? "r" : "l");
    else drawPanel(cv, 4.6, cv.classList.contains("l") ? "r" : "l");
  });
}

/* ---------- SVG builders ---------- */
function chandelier(){
  let s = '<svg viewBox="0 0 200 270" aria-hidden="true"><defs>' +
    '<radialGradient id="cglow"><stop offset="0" stop-color="#FFF4D2" stop-opacity=".95"/><stop offset="1" stop-color="#FFF4D2" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="cgold" x1="0" x2="1"><stop offset="0" stop-color="#A9823F"/><stop offset=".5" stop-color="#F3DC94"/><stop offset="1" stop-color="#A9823F"/></linearGradient>' +
    '<radialGradient id="crys" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#EEF1F6"/><stop offset="1" stop-color="#A7B0BE"/></radialGradient></defs>' +
    '<circle class="c-glow" cx="100" cy="140" r="115" fill="url(#cglow)"/>';
  for (let y = 0; y < 46; y += 6) s += '<ellipse cx="100" cy="' + y + '" rx="2.2" ry="3" fill="none" stroke="url(#cgold)" stroke-width="1.2"/>';
  s += '<path d="M84 48h32l-4 8H88z" fill="url(#cgold)"/>' +
    '<g fill="none" stroke="url(#cgold)" stroke-width="2.2"><path d="M100 56C100 80 70 82 52 96M100 56C100 80 130 82 148 96M100 56V100M100 70C88 86 76 92 70 98M100 70C112 86 124 92 130 98"/></g>' +
    '<ellipse cx="100" cy="100" rx="56" ry="9" fill="none" stroke="url(#cgold)" stroke-width="3"/>' +
    '<ellipse cx="100" cy="156" rx="40" ry="7" fill="none" stroke="url(#cgold)" stroke-width="2.4"/>' +
    '<path d="M44 100C56 130 80 150 100 156M156 100C144 130 120 150 100 156" fill="none" stroke="url(#cgold)" stroke-width="1.6"/>';
  [52, 76, 100, 124, 148].forEach((x, i) => { s += '<rect x="' + (x - 2.5) + '" y="82" width="5" height="16" rx="1.5" fill="#FBF6EA"/><circle class="c-halo" style="--d:' + (i * .37) + 's" cx="' + x + '" cy="76" r="9" fill="url(#cglow)"/><path class="c-flame" style="--d:' + (i * .23) + 's" d="M' + x + ' 71c3 4 3 7 0 9-3-2-3-5 0-9z" fill="#FFC85A"/>'; });
  const swag = (x1, x2, y, sag, n) => { for (let i = 0; i <= n; i++){ const t = i / n, x = x1 + (x2 - x1) * t, yy = y + Math.sin(Math.PI * t) * sag; s += '<circle cx="' + x.toFixed(1) + '" cy="' + yy.toFixed(1) + '" r="1.8" fill="url(#crys)"/>'; } };
  for (let k = 0; k < 4; k++) swag(52 + k * 24, 76 + k * 24, 104, 10, 8);
  for (let k = 0; k < 3; k++) swag(64 + k * 24, 88 + k * 24, 160, 8, 7);
  const drop = (x, y, len) => { s += '<g class="c-drop" style="--d:' + rnd(0, 3).toFixed(2) + 's">'; for (let i = 0; i < len; i++) s += '<circle cx="' + x + '" cy="' + (y + i * 5) + '" r="1.6" fill="url(#crys)"/>'; s += '<path d="M' + x + ' ' + (y + len * 5) + 'l3 5-3 6-3-6z" fill="url(#crys)" stroke="#C9CED8" stroke-width=".4"/></g>'; };
  [48, 60, 72, 84, 96, 104, 116, 128, 140, 152].forEach((x, i) => drop(x, 108, 6 + (i % 3) * 2));
  [66, 80, 94, 106, 120, 134].forEach((x, i) => drop(x, 164, 6 + (i % 2) * 3));
  for (let i = 0; i < 8; i++) s += '<circle cx="100" cy="' + (170 + i * 6) + '" r="2" fill="url(#crys)"/>';
  s += '<path d="M100 220l7 12-7 16-7-16z" fill="url(#crys)" stroke="#C9CED8" stroke-width=".5"/>';
  [[60, 120], [140, 118], [100, 204], [80, 176], [124, 184], [100, 132]].forEach(([x, y], i) => s += '<path class="c-tw" style="--d:' + (i * .55) + 's" d="M' + x + ' ' + (y - 5) + 'l1.2 3.8 3.8 1.2-3.8 1.2-1.2 3.8-1.2-3.8-3.8-1.2 3.8-1.2z" fill="#fff"/>');
  return s + '</svg>';
}
/* sequin-textured tree shapes */
const GREENS = ["#4F6B47", "#5F7A55", "#6E8A60", "#3F5A3E", "#7F9B6E", "#8FA97C"];
function sequins(cx, top, w, h, kind){
  let s = "";
  for (let y = top; y < top + h; y += 4.6){
    const t = (y - top) / h, half = kind === "cypress" ? w / 2 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), .7) : w / 2 * Math.sin(Math.PI * t);
    for (let x = cx - half; x <= cx + half; x += 4.6){
      const c = GREENS[(Math.random() * GREENS.length) | 0];
      s += '<circle cx="' + (x + rnd(-.8, .8)).toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.5" fill="' + c + '"/>';
    }
  }
  for (let i = 0; i < w * h / 600; i++) s += '<circle class="sq" style="--d:' + rnd(0, 4).toFixed(2) + 's" cx="' + rnd(cx - w / 3, cx + w / 3).toFixed(1) + '" cy="' + rnd(top + 6, top + h - 6).toFixed(1) + '" r="1.3" fill="#E9F2DA"/>';
  return s;
}
function garden(){
  let s = '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g filter="url(#raise)">';
  s += sequins(30, 40, 34, 170, "cypress") + sequins(72, 70, 28, 140, "cypress") + sequins(370, 40, 34, 170, "cypress") + sequins(328, 70, 28, 140, "cypress");
  s += sequins(118, 120, 70, 70, "round") + sequins(282, 120, 70, 70, "round");
  s += '<path d="M116 186v30M284 186v30" stroke="url(#satinB)" stroke-width="6"/>';
  s += '<path d="M168 150h64l70 100H98z" fill="url(#satinW)"/><path d="M168 150h64l70 100H98z" fill="none" stroke="#D8CBB0" stroke-dasharray="3 2"/>';
  for (let i = 0; i < 9; i++){ const t = i / 8, y = 156 + t * 88, half = 32 + t * 102; s += '<path d="M' + (200 - half - 8) + ' ' + y + 'q-6-8 0-14M' + (200 + half + 8) + ' ' + y + 'q6-8 0-14" fill="none" stroke="#9C7C58" stroke-width="' + (1 + t * 2).toFixed(1) + '"/>'; }
  for (let i = 0; i < 10; i++){ const t = i / 9, y = 158 + t * 84, sz = 2 + t * 4; s += '<circle cx="' + (196 - t * 6) + '" cy="' + y + '" r="' + sz + '" fill="url(#pearl)"/><circle cx="' + (204 + t * 6) + '" cy="' + (y + 3) + '" r="' + (sz * .9) + '" fill="url(#satinP)"/>'; }
  for (let i = 0; i < 6; i++){ const t = i / 5, y = 160 + t * 80, h = 6 + t * 12, xl = 200 - 22 - t * 60, xr = 200 + 22 + t * 60;
    [xl, xr].forEach(x => { s += '<rect x="' + (x - 1.4 - t) + '" y="' + (y - h) + '" width="' + (2.8 + 2 * t) + '" height="' + h + '" fill="#FBF6EA"/><path class="c-flame" style="--d:' + rnd(0, 2).toFixed(2) + 's" d="M' + x + ' ' + (y - h - 6 - 4 * t) + 'c' + (2 + t * 2) + ' ' + (3 + t * 2) + ' ' + (2 + t * 2) + ' ' + (5 + t * 3) + ' 0 ' + (6 + t * 4) + 'c-' + (2 + t * 2) + '-' + (1 + t) + '-' + (2 + t * 2) + '-' + (3 + t * 2) + ' 0-' + (6 + t * 4) + 'z" fill="#FFC85A"/>'; }); }
  return s + '</g></svg>';
}
function lights(){
  let s = '<svg viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true"><defs><radialGradient id="bulb"><stop offset="0" stop-color="#FFF6D8"/><stop offset=".55" stop-color="#FFD98A" stop-opacity=".8"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient></defs>';
  const pts = [];
  [[0, 200], [200, 400]].forEach(([a, b]) => { for (let i = 0; i <= 8; i++){ const t = i / 8; pts.push([a + (b - a) * t, 10 + 34 * Math.sin(Math.PI * t)]); } });
  s += '<path d="M0 10Q100 78 200 10Q300 78 400 10" fill="none" stroke="#7C6A4E" stroke-width="1.2"/>';
  pts.forEach(([x, y], i) => { if (i % 9 === 0) return; s += '<g class="bulb" style="--d:' + (i * .21).toFixed(2) + 's"><circle cx="' + x + '" cy="' + (y + 10) + '" r="11" fill="url(#bulb)"/><path d="M' + x + ' ' + y + 'v4" stroke="#7C6A4E"/><ellipse cx="' + x + '" cy="' + (y + 9) + '" rx="3.2" ry="4.4" fill="#FFE7A6"/></g>'; });
  return s + '</svg>';
}
function footGarden(){
  let s = '<svg viewBox="0 0 400 110" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g filter="url(#raise)">';
  [[20, 22, 90], [52, 18, 70], [348, 18, 70], [380, 22, 90]].forEach(([x, w, h]) => s += sequins(x, 110 - h, w, h, "cypress"));
  [[110, 40], [160, 30], [240, 30], [290, 40]].forEach(([x, w]) => s += sequins(x, 110 - w, w, w, "round"));
  for (let i = 0; i < 26; i++) s += '<circle cx="' + rnd(70, 330).toFixed(1) + '" cy="' + rnd(92, 108).toFixed(1) + '" r="' + rnd(2, 3.5).toFixed(1) + '" fill="' + (i % 3 ? "url(#pearl)" : "url(#satinP)") + '"/>';
  return s + '</g></svg>';
}

/* ---------- build ---------- */
/* every block is optional, so a design can leave sections out */
const put = (id, fn) => { const el = $(id); if (el) el.innerHTML = fn(); };
put("chandelier", chandelier); put("garden", garden); put("lights", lights); put("f-garden", footGarden);
const pal = $("palette");
if (pal) (C.palette || []).forEach((c, i) => { const d = document.createElement("span"); d.style.background = c; d.style.setProperty("--i", i); pal.appendChild(d); });
const mapBtn = $("map-btn");
if (mapBtn){
mapBtn.href = C.mapUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(L(C.address));
mapBtn.addEventListener("click", () => { mapBtn.href = C.mapUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(L(C.address)); });
}

/* ---------- photo slots: images/garden.jpg, arch.jpg, dress-code.jpg, venue.jpg replace the embroidered drawings ---------- */
document.querySelectorAll("[data-art]").forEach(el => {
  const img = new Image();
  img.alt = ""; img.decoding = "async"; img.className = "art-photo";
  img.onload = () => { el.textContent = ""; el.appendChild(img); el.classList.add("has-photo"); };
  img.src = el.dataset.art;
});
/* gentle 3D tilt of photos and illustrations following the finger / mouse / phone tilt */
/* only recomputed when the finger, mouse, phone tilt or scroll actually changed — no work on idle frames */
let gx = 0, gy = 0, dirty = true, tiltList = null;
const tiltEls = () => tiltList || (tiltList = Array.from(document.querySelectorAll(".art, .hoop, .name-card, .count, .ev, .rsvp, .place")));
addEventListener("deviceorientation", e => { if (e.gamma != null){ gx = Math.max(-1, Math.min(1, e.gamma / 25)); gy = Math.max(-1, Math.min(1, (e.beta - 45) / 25)); dirty = true; } }, { passive: true });
addEventListener("pointermove", e => { gx = e.clientX / innerWidth * 2 - 1; gy = e.clientY / innerHeight * 2 - 1; dirty = true; }, { passive: true });
addEventListener("scroll", () => { dirty = true; }, { passive: true });
setTimeout(() => { tiltList = null; dirty = true; }, 1500);
if (!REDUCED) (function tilt(){ requestAnimationFrame(tilt); if (!dirty) return; dirty = false;
  const vh = innerHeight; tiltEls().forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return; const c = (r.top + r.height / 2) / vh - .5; el.style.setProperty("--rx", (-gy * 4 - c * 6).toFixed(2) + "deg"); el.style.setProperty("--ry", (gx * 6).toFixed(2) + "deg"); }); })();

drawAll();
let rw = innerWidth;
addEventListener("resize", () => { if (Math.abs(innerWidth - rw) > 30){ rw = innerWidth; drawAll(); } });
if (document.fonts) document.fonts.ready.then(drawAll);

/* ---------- wishes envelope ---------- */
const env = $("wenv"), form = $("wish-form");
if (!env || !form) return;
function openEnv(){
  if (env.classList.contains("open")) return;
  env.classList.add("open");
  setTimeout(() => { form.hidden = false; requestAnimationFrame(() => form.classList.add("show")); $("w-text").focus({ preventScroll: true }); }, 900);
  if (window.FX){ const r = env.getBoundingClientRect(); window.FX.burst("sparkle", r.left + r.width / 2, r.top + r.height * .3, 30); }
}
env.addEventListener("click", openEnv);
env.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openEnv(); } });
function wishText(){
  const en = document.documentElement.lang === "en", t = $("w-text").value.trim(), n = $("w-name").value.trim();
  return (en ? "A wish for " : "სურვილი წყვილს: ") + L(C.host) + "\n\n" + (t || "♥") + (n ? "\n\n— " + n : "");
}
$("w-wa").addEventListener("click", () => { $("w-wa").href = "https://wa.me/" + String(C.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(wishText()); });
$("w-copy").addEventListener("click", () => {
  const done = () => { $("w-copy-label").textContent = document.documentElement.lang === "en" ? "Copied ✓" : "დაკოპირდა ✓"; };
  try { navigator.clipboard.writeText(wishText()).then(done); } catch(_) {}
});
})();
