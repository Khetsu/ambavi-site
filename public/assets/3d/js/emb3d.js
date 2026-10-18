/* ამბავი · „მარგალიტის ფარდა“ — 3D ნაქარგობა (WebGL / Three.js)
   ბაღი, ტაძარი, დრესკოდი, მამული და ქვედა ბაღი ნამდვილი 3D სცენებია: ყოველი ჩითი, მძივი,
   მარგალიტი და ატლასის ძაფი ცალკე ობიექტია, სინათლე თითს/მაუსს/ტელეფონის დახრას მიჰყვება და
   ჩითები ბრწყინავს. ეკრანზე გამოჩენისას სურათი „იქარგება“, შეხებისას ჩითები ტალღად ტრიალებს.
   ერთი WebGL კონტექსტი ხატავს ყველა სცენას და თითოეულ ნახატზე 2D canvas-ში გადააქვს.
   თუ images/-ში შესაბამისი ფოტო დევს, ან WebGL არ არის, რჩება ფოტო / ჩვეულებრივი ილუსტრაცია. */
(async () => {
/* which embroidered scene goes where comes from CONFIG.scenes3d, so every design variant can choose its own pictures */
const SC = Object.assign({ arch: "church", dress: "dress", venue: "estate", story: ["s1", "s2", "s3"], gallery: ["g1", "g2", "g3", "g4"] }, (window.CONFIG || {}).scenes3d || {});
const TARGETS = [
  { sel: "#garden", kind: "garden" },
  { sel: ".arch-art", kind: SC.arch },
  { sel: ".dress-art", kind: SC.dress },
  { sel: ".venue-art", kind: SC.venue },
  { sel: "#f-garden", kind: "foot" },
  { sel: "#wenv", kind: "envelope" }
].map(t => ({ ...t, el: document.querySelector(t.sel) })).filter(t => t.el);
document.querySelectorAll("#story .hoop-in").forEach((el, i) => TARGETS.push({ el, kind: SC.story[i % SC.story.length], hoop: true }));
document.querySelectorAll("#gallery .hoop-in").forEach((el, i) => TARGETS.push({ el, kind: SC.gallery[i % SC.gallery.length], hoop: true }));
if (!TARGETS.length) return;
try { const c = document.createElement("canvas"); if (!(c.getContext("webgl2") || c.getContext("webgl"))) return; } catch (_) { return; }

const CDN = "https://cdn.jsdelivr.net/npm/three@0.160.0/";
let THREE, RoomEnvironment;
try {
  THREE = await import(CDN + "build/three.module.js");
  ({ RoomEnvironment } = await import(CDN + "examples/jsm/environments/RoomEnvironment.js"));
} catch (e) { console.warn("3D embroidery: Three.js not loaded (offline?)", e); return; }

const root = document.documentElement;
const MOBILE = matchMedia("(pointer: coarse)").matches || innerWidth < 700;
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches || /[?&]still\b/.test(location.search);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/* colours come from CONFIG.theme3d, so every design variant can restyle the same engine */
const TH = Object.assign({ fabric: "#f1e7d3", paper: "#f5e8cf", seal: "#7c8f6e", liner: "#e4d2b2", ink: "#8a6a2e", exposure: 1.05, shadow: .2 }, (window.CONFIG || {}).theme3d || {});
const smooth = t => t * t * (3 - 2 * t);
const rng = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const mixC = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), clamp(t, 0, 1));

/* ---------- shared renderer ---------- */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
} catch (e) { console.warn("3D embroidery:", e); return; }
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = TH.exposure;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), .04).texture;

/* ---------- geometry: one sequin, one seed bead, one pearl ... ---------- */
const G = {};
{ // cupped sequin with a centre hole (face looks +Z)
  const pr = [[.17, -.04], [.17, .03], [.6, .07], [1, .15], [1, .1], [.6, .02], [.17, -.04]].map(p => new THREE.Vector2(p[0], p[1]));
  G.seq = new THREE.LatheGeometry(pr, MOBILE ? 18 : 24); G.seq.rotateX(Math.PI / 2);
  G.bead = new THREE.TorusGeometry(.6, .42, 8, MOBILE ? 12 : 16); G.bead.rotateY(Math.PI / 2);   // hole lies along X
  G.pearl = new THREE.SphereGeometry(1, MOBILE ? 14 : 20, MOBILE ? 10 : 14);
  G.bugle = new THREE.CylinderGeometry(1, 1, 1, 10, 1);
  G.thread = new THREE.CapsuleGeometry(1, 1, 3, 8);
  G.knot = new THREE.IcosahedronGeometry(1, 1);
  G.pet = G.seq;
  const pa = G.knot.attributes.position, r = rng(7);
  for (let i = 0; i < pa.count; i++){ const k = .82 + r() * .3; pa.setXYZ(i, pa.getX(i) * k, pa.getY(i) * k, pa.getZ(i) * k); }
  G.knot.computeVertexNormals();
}
/* twisted-thread relief for satin stitches */
const twist = (() => {
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
  g.fillStyle = "#808080"; g.fillRect(0, 0, 64, 64);
  for (let i = -64; i < 128; i += 8){ const gr = g.createLinearGradient(i, 0, i + 8, 0); gr.addColorStop(0, "#5a5a5a"); gr.addColorStop(.5, "#d0d0d0"); gr.addColorStop(1, "#5a5a5a"); g.fillStyle = gr; g.beginPath(); g.moveTo(i, 64); g.lineTo(i + 8, 64); g.lineTo(i + 40, 0); g.lineTo(i + 32, 0); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 4); return t;
})();
const MAT = {
  seq: new THREE.MeshPhysicalMaterial({ metalness: .85, roughness: .2, iridescence: .3, iridescenceIOR: 1.5, envMapIntensity: 1.25 }),
  bead: new THREE.MeshPhysicalMaterial({ metalness: .05, roughness: .12, clearcoat: 1, clearcoatRoughness: .06, envMapIntensity: 1.1 }),
  pearl: new THREE.MeshPhysicalMaterial({ metalness: 0, roughness: .3, clearcoat: .8, clearcoatRoughness: .2, sheen: 1, sheenColor: new THREE.Color(0xfff2e2), iridescence: .55, iridescenceIOR: 1.35, envMapIntensity: 1.1 }),
  bugle: new THREE.MeshPhysicalMaterial({ metalness: .6, roughness: .2, clearcoat: 1, envMapIntensity: 1.2 }),
  thread: new THREE.MeshPhysicalMaterial({ metalness: 0, roughness: .42, sheen: 1, sheenRoughness: .3, sheenColor: new THREE.Color(0xffffff), bumpMap: twist, bumpScale: .5, envMapIntensity: .9 }),
  pet: new THREE.MeshPhysicalMaterial({ metalness: .08, roughness: .32, clearcoat: .6, clearcoatRoughness: .2, sheen: 1, sheenColor: new THREE.Color(0xffffff), iridescence: .25, envMapIntensity: 1 }),
  knot: new THREE.MeshStandardMaterial({ metalness: 0, roughness: .85, envMapIntensity: .8 })
};
const DEF = { seq: 1.8, bead: .9, pearl: 1.1, bugle: .9, knot: .9 };

/* ---------- helpers to "embroider" SVG paths ---------- */
const NS = "http://www.w3.org/2000/svg";
const hsvg = document.createElementNS(NS, "svg");
hsvg.setAttribute("aria-hidden", "true"); hsvg.setAttribute("style", "position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden");
document.body.appendChild(hsvg);
const hit = document.createElement("canvas").getContext("2d");
const svgPath = d => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", d); hsvg.appendChild(p); return p; };
const circ = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

class Emb {
  constructor(W, H, u, seed){ this.W = W; this.H = H; this.u = u; this.R = rng(seed); this.items = []; this.glows = []; this.extras = []; this.ordFn = (x, y) => (1 - y / H) * .8 + this.R() * .2; }
  pick(a){ return a[(this.R() * a.length) | 0]; }
  color(c, x, y, j){
    let v = typeof c === "function" ? c(x, y, this.R) : Array.isArray(c) ? this.pick(c) : c;
    const C = new THREE.Color(v ?? "#f4ede1");
    if (j) C.offsetHSL(0, 0, (this.R() - .5) * j);
    return C;
  }
  put(type, x, y, o){
    const f = (v, d) => typeof v === "function" ? v(x, y) : (v ?? d);
    this.items.push({ type, x: x - this.W / 2, y: this.H / 2 - y, z: o.z || 0, rx: o.rx || 0, ry: o.ry || 0, rz: o.rz || 0, s: o.s, c: o.c,
      ord: clamp(f(o.ord, this.ordFn(x, y)), 0, 1), sway: f(o.sway, 0), ph: this.R() * 6.28, rise: o.rise || 0, rs: (o.rs || .2) * (.7 + this.R() * .6), fl: o.fl || 0 });
  }
  one(type, x, y, r, o, row = 0){
    const R = this.R, c = this.color(o.c, x, y, o.j ?? .07), z = (typeof o.z === "function" ? o.z(x, y) : (o.z || 0)) * this.u;
    let it;
    if (type === "seq" || type === "pet"){ const tl = o.tilt ?? .3; it = { rx: -tl + (R() - .5) * .34, ry: (R() - .5) * .34, rz: (R() - .5) * .5, s: [r, r, r], z: z + r * .12 + (row % 2) * r * .12 }; }
    else if (type === "bead") it = { rz: R() * Math.PI, rx: (R() - .5) * .4, s: [r, r, r], z: z + r * .4 };
    else if (type === "pearl") it = { s: [r, r, r], z: z + r * .6 };
    else if (type === "knot") it = { rz: R() * 6, rx: R() * 6, s: [r, r, r * .8], z: z + r * .45 };
    else it = { s: [r, r, r], z };
    this.put(type, x, y, { ...it, c, ord: o.ord, sway: o.sway, rise: o.rise, rs: o.rs, fl: o.fl });
  }
  /* satin stitch fill: parallel threads across the shape, brick-split when long */
  satin(d, o = {}){
    const u = this.u, gap = (o.gap || 1.15) * u, max = (o.max || 9) * u, w = (o.w || .6) * gap, ang = (o.angle ?? 90) * Math.PI / 180;
    const P = new Path2D(d), el = svgPath(d), bb = el.getBBox(); el.remove();
    const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2, rad = Math.hypot(bb.width, bb.height) / 2 + 1;
    const ux = Math.cos(ang), uy = Math.sin(ang), vx = -uy, vy = ux, st = Math.min(.3 * u, .45);
    let li = 0;
    for (let off = -rad; off <= rad; off += gap, li++){
      const bx = cx + vx * off, by = cy + vy * off; let t0 = null;
      for (let t = -rad; t <= rad + st; t += st){
        const inn = t <= rad && hit.isPointInPath(P, bx + ux * t, by + uy * t);
        if (inn && t0 === null) t0 = t;
        else if (!inn && t0 !== null){ this.run(bx, by, ux, uy, t0, t - st, li, o, w, max); t0 = null; }
      }
    }
  }
  run(bx, by, ux, uy, t0, t1, li, o, w, max){
    const len = t1 - t0; if (len < w * 1.2) return;
    const n = Math.max(1, Math.ceil(len / max)), seg = len / n, sh = n > 1 && li % 2 ? seg * .5 : 0;
    const bs = [t0]; for (let k = 1; k <= n; k++){ const b = t0 + k * seg - sh; if (b > t0 + w * 2 && b < t1 - w * 2) bs.push(b); } bs.push(t1);
    const rz0 = Math.atan2(-uy, ux) - Math.PI / 2;
    for (let k = 0; k < bs.length - 1; k++){
      const a = bs[k], b = bs[k + 1], L = b - a - .05 * this.u; if (L < w) continue;
      const tm = (a + b) / 2, x = bx + ux * tm, y = by + uy * tm, ww = o.rm ? w * clamp(tm / o.rm, .6, 1.8) : w;
      const z = (typeof o.z === "function" ? o.z(x, y) : (o.z || 0)) * this.u + w * .55 + (o.raise || 0) * this.u * Math.pow(Math.sin(Math.PI * (tm - t0) / len), .6);
      this.put("thread", x, y, { rz: rz0 + (this.R() - .5) * .04, s: [ww, L / 3, ww * .55], z, c: this.color(o.c, x, y, o.j ?? .05), ord: o.ord, sway: o.sway });
    }
  }
  /* satin stitches fanning out from a point (skirts, drapes) */
  fan(d, ox, oy, o = {}){
    const u = this.u, gap = (o.gap || 1.15) * u, max = (o.max || 14) * u, w = (o.w || .6) * gap;
    const P = new Path2D(d), el = svgPath(d), bb = el.getBBox(); el.remove();
    let rMax = 0, aMin = Infinity, aMax = -Infinity;
    for (const [x, y] of [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]]){ rMax = Math.max(rMax, Math.hypot(x - ox, y - oy)); const a = Math.atan2(y - oy, x - ox); aMin = Math.min(aMin, a); aMax = Math.max(aMax, a); }
    const rm = o.rm || rMax * .6, st = .4, oo = { ...o, rm }; let li = 0;
    for (let a = aMin; a <= aMax; a += gap / rm, li++){
      const ux = Math.cos(a), uy = Math.sin(a); let t0 = null;
      for (let t = 0; t <= rMax + st; t += st){
        const inn = t <= rMax && hit.isPointInPath(P, ox + ux * t, oy + uy * t);
        if (inn && t0 === null) t0 = t;
        else if (!inn && t0 !== null){ this.run(ox, oy, ux, uy, t0, t - st, li, oo, w, max); t0 = null; }
      }
    }
  }
  /* scatter sequins / beads / knots inside a shape (hex grid, scale-like overlap) */
  fill(d, o = {}){
    const type = o.type || "seq", r = (o.r || DEF[type]) * this.u, gap = o.gap ? o.gap * this.u : r * (o.k || 1.55);
    const P = new Path2D(d), el = svgPath(d), bb = el.getBBox(); el.remove();
    const dy = gap * .866, jit = o.jit ?? .22; let row = 0;
    for (let y = bb.y + dy * .4; y <= bb.y + bb.height; y += dy, row++)
      for (let x = bb.x + (row % 2 ? gap * .5 : 0) + gap * .2; x <= bb.x + bb.width; x += gap){
        const jx = x + (this.R() - .5) * gap * jit, jy = y + (this.R() - .5) * gap * jit;
        if (hit.isPointInPath(P, jx, jy)) this.one(type, jx, jy, r, o, row);
      }
  }
  /* beads / pearls / bugles along a path */
  line(d, o = {}){
    const type = o.type || "pearl", el = svgPath(d), L = el.getTotalLength(), a = (o.from || 0) * L, b = (o.to ?? 1) * L, r0 = (o.r || DEF[type]) * this.u;
    for (let s = a; s <= b + 1e-6;){
      const t = (s - a) / Math.max(1e-6, b - a), k = o.grow ? o.grow(t) : 1, r = r0 * k, p = el.getPointAtLength(s);
      if (type === "bugle"){
        const p1 = el.getPointAtLength(Math.max(0, s - .4)), p2 = el.getPointAtLength(Math.min(L, s + .4)), len = (o.len || 2.6) * this.u * k;
        this.put("bugle", p.x, p.y, { rz: Math.atan2(-(p2.y - p1.y), p2.x - p1.x) - Math.PI / 2, s: [r * .42, len, r * .42], z: (o.z || 0) * this.u + r * .45, c: this.color(o.c, p.x, p.y, o.j ?? .05), ord: o.ord, sway: o.sway });
        s += len + (o.space ?? .35) * this.u; continue;
      }
      this.one(type, p.x, p.y, r, o);
      s += o.gap ? o.gap * this.u * k : r * 2.05;
    }
    el.remove();
  }
  /* text (monogram) filled with sequins / beads */
  text(str, x, y, size, o = {}){
    const sc = 6, c = document.createElement("canvas"); c.width = this.W * sc; c.height = this.H * sc;
    const g = c.getContext("2d"); g.fillStyle = "#000"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = `400 ${size * sc}px ${o.font || '"Pinyon Script", cursive'}`; g.fillText(str, x * sc, y * sc);
    const d = g.getImageData(0, 0, c.width, c.height).data, type = o.type || "bead", r = (o.r || DEF[type]) * this.u, gap = o.gap ? o.gap * this.u : r * 1.7;
    let row = 0;
    for (let yy = 0; yy < this.H; yy += gap * .866, row++)
      for (let xx = row % 2 ? gap / 2 : 0; xx < this.W; xx += gap)
        if (d[(((yy * sc) | 0) * c.width + ((xx * sc) | 0)) * 4 + 3] > 110) this.one(type, xx, yy, r, o, row);
  }
  /* sequin rosette flower with a pearl / bead heart */
  rose(x, y, o = {}){
    const u = this.u, r = (o.r || 1.5) * u, n = o.n || 6, rot = this.R() * 6, z = (o.z || 0) * u;
    for (let k = 0; k < n; k++){
      const a = rot + k / n * Math.PI * 2;
      this.put("pet", x + Math.cos(a) * r * .8, y - Math.sin(a) * r * .8, { rz: a - Math.PI / 2, rx: .5, s: [r * .72, r, r * .72], z: z + r * .3, c: this.color(o.c, x, y, .08), ord: o.ord, sway: o.sway });
    }
    this.put(o.heart || "pearl", x, y, { s: [r * .45, r * .45, r * .45], z: z + r * .6, c: this.color(o.cc || "#f7efe2", x, y, .03), ord: o.ord, sway: o.sway });
  }
}
/* volume shading: palette dark→light, lit from the upper left */
const shade = (pal, cx, cy, rx, ry, R) => (x, y) => pal[clamp(Math.floor((.55 - (x - cx) / rx * .32 - (y - cy) / ry * .22 + (R() - .5) * .35) * pal.length), 0, pal.length - 1)];

const GREEN_D = TH.greensDark || ["#2c4630", "#38563a", "#466645", "#577553", "#6e8a63"];
const GREEN_L = TH.greensLight || ["#55704f", "#68835d", "#7f9873", "#97ab88", "#b3c2a3"];
const BLOOM = TH.bloom || ["#efd3cf", "#f4ede1", "#dcc6e2", "#ecd2b0", "#f6e3e0"];
const GOLD = TH.goldBeads || ["#c99d4f", "#d9b46a", "#e5c788", "#bf9145"];
const BARK = TH.bark || ["#6b4f3a", "#7d5f45", "#5c4331"];

/* ---------- designs (SVG coordinates: x right, y down) ---------- */
function cypress(E, x, base, h, k, z){
  const w = h * .16, R = E.R;
  E.fill(`M${x} ${base - h}C${x + w * 1.1} ${base - h * .62} ${x + w * 1.05} ${base - h * .2} ${x + w * .5} ${base}L${x - w * .5} ${base}C${x - w * 1.05} ${base - h * .2} ${x - w * 1.1} ${base - h * .62} ${x} ${base - h}Z`,
    { type: "seq", r: 1.45 * k, k: 1.3, c: shade(GREEN_D, x, base - h / 2, w, h / 2, R), tilt: .38, z, sway: (xx, yy) => clamp((base - yy) / h, 0, 1) * k });
}
function roundTree(E, x, base, r, k, z, blossom){
  const R = E.R;
  E.satin(`M${x - 1.7 * k} ${base}L${x - 1 * k} ${base - r * 1.1}L${x + 1 * k} ${base - r * 1.1}L${x + 1.7 * k} ${base}Z`, { angle: 90, c: BARK, z, gap: .9 * k });
  const cy = base - r * 1.55;
  const d = circ(x, cy, r) + circ(x - r * .62, cy + r * .45, r * .7) + circ(x + r * .62, cy + r * .4, r * .68);
  E.fill(d, { type: "seq", r: 1.55 * k, k: 1.32, c: shade(GREEN_L, x, cy, r, r, R), tilt: .32, z: z + .3, sway: (xx, yy) => clamp((base - yy) / (r * 2.6), 0, 1) * .8 * k });
  if (blossom) for (let i = 0; i < 4; i++){ const a = R() * 6.28, q = R() * r * .8; E.rose(x + Math.cos(a) * q, cy + Math.sin(a) * q, { r: 1.1 * k, n: 5, c: blossom, z: z + 1.4, sway: .6 * k }); }
}
function bushes(E, W, y0, skip){
  for (let x = -4; x < W + 8; x += 8 + E.R() * 4){
    if (skip && skip(x)) continue;
    const r = 6 + E.R() * 4;
    E.fill(circ(x, y0 + 2, r), { type: "knot", r: .95, k: 1.75, c: shade(GREEN_L.slice(0, 4), x, y0 - r / 2, r, r, E.R), z: 1.2 });
    const n = 1 + (E.R() * 3 | 0);
    for (let i = 0; i < n; i++) E.rose(x + (E.R() - .5) * r * 1.2, y0 + 2 - r * (.2 + E.R() * .6), { r: 1.2, n: 6, c: [E.pick(BLOOM)], z: 2.2 });
  }
}

function sceneGarden(W, H, foot){
  const E = new Emb(W, H, foot ? .9 : .95, foot ? 11 : 5), R = E.R, cx = W / 2;
  const hz = 30, hw = y => 3 + (Math.max(22, W * .08) - 3) * clamp((y - hz) / (H - hz), 0, 1);
  const onPath = (x, y, m) => !foot && Math.abs(x - cx) < hw(y) + m;
  const lanterns = [];
  if (!foot){
    // path of satin with pearl borders, scattered petals, lanterns
    E.satin(`M${cx - hw(H + 4)} ${H + 4}L${cx - hw(hz)} ${hz}L${cx + hw(hz)} ${hz}L${cx + hw(H + 4)} ${H + 4}Z`, { angle: 0, c: ["#f4ede1", "#efe5d3", "#e9dcc6", "#f7f1e6"], gap: 1, max: 5, ord: (x, y) => (1 - (y - hz) / (H - hz)) * .55 });
    for (const sd of [-1, 1]) E.line(`M${cx + sd * hw(hz)} ${hz}L${cx + sd * hw(H + 4)} ${H + 4}`, { type: "pearl", r: 1.05, c: ["#f8f1e4", "#efe4d2"], grow: t => .45 + t * .8, ord: (x, y) => (1 - (y - hz) / (H - hz)) * .5 + .05 });
    E.line(`M${cx} ${hz + 3}L${cx} ${H + 4}`, { type: "pearl", r: .9, c: ["#f7eadc", "#e8c9c4"], grow: t => .4 + t * .9, gap: 2.6, ord: (x, y) => (1 - (y - hz) / (H - hz)) * .5 + .1 });
    for (let i = 0; i < 18; i++){ const y = hz + 8 + R() * (H - hz - 6), x = cx + (R() - .5) * 2 * hw(y) * .8; E.one("seq", x, y, .75 * E.u * (.5 + (y - hz) / (H - hz)), { c: ["#e7bcb6", "#f1d6d0", "#dcc6e2"], tilt: .7, z: .9 }); }
    for (const f of [.22, .5, .82]){ const y = hz + f * (H - hz), k = .45 + .7 * f; for (const sd of [-1, 1]) lanterns.push([cx + sd * (hw(y) + 3 * k), y, k]); }
  }
  // back row, then front row of trees
  const rows = foot ? [[H + 2, 1, 0]] : [[hz + 12, .6, -2.2], [H + 3, 1.1, 0]];
  for (const [base, k, z] of rows){
    for (let x = -6 + R() * 6; x < W + 6; x += (foot ? 16 : 13) * k + R() * 8 * k){
      const big = R() < .5, h = (foot ? 40 : 52) * k * (.8 + R() * .4);
      if (onPath(x, base, (big ? h * .2 : 14 * k) + 2)) continue;
      if (big) cypress(E, x, base, h, k, z);
      else roundTree(E, x, base, (foot ? 9 : 11) * k * (.85 + R() * .3), k, z, R() < .35 ? BLOOM.slice(0, 3) : null);
    }
  }
  for (const [x, y, k] of lanterns){
    E.line(`M${x} ${y}L${x} ${y - 13 * k}`, { type: "bugle", r: 1.1 * k, len: 3 * k, c: GOLD, z: 2.4, space: .2 });
    E.put("bead", x, y - 15 * k, { s: [1.5 * k * E.u, 1.5 * k * E.u, 1.5 * k * E.u], z: 3, c: new THREE.Color("#f3c873"), rz: Math.PI / 2 });
    E.glows.push([x, y - 15 * k, 7 * k]);
  }
  bushes(E, W, H, x => onPath(x, H, 6));
  return E;
}

function sceneChurch(){
  const W = 200, H = 222, E = new Emb(W, H, 1.75, 21), R = E.R;
  const stone = (x0, y0) => (x, y) => { const row = Math.floor((y - y0) / 7), col = Math.floor((x - x0 + (row % 2) * 6) / 12), h = Math.abs(Math.sin(row * 12.9898 + col * 78.233) * 43758.5453) % 1;
    const ey = ((y - y0) % 7 + 7) % 7, ex = ((x - x0 + (row % 2) * 6) % 12 + 12) % 12; if (ey < .9 || ex < .9) return "#c9b393";
    return ["#f2e9da", "#ebdfca", "#e2d2b8", "#f5eee2", "#ddcbae"][Math.floor(h * 5)]; };
  // cypresses behind
  cypress(E, 26, 204, 112, 1.25, -3); cypress(E, 174, 204, 104, 1.2, -3);
  // walls, drum
  E.satin("M50 112L150 112L150 200L50 200Z", { angle: 90, c: stone(50, 112), gap: 1.05, max: 5.5 });
  E.satin("M86 54L114 54L114 92L86 92Z", { angle: 90, c: stone(86, 54), gap: 1.05, max: 5 });
  // roofs of sage sequins
  const roof = ["#8b9a86", "#9aab92", "#7c8c78", "#a9b8a0"];
  E.fill("M40 115L76 91L124 91L160 115Z", { type: "seq", r: 1.5, c: roof, tilt: .42, z: .6 });
  E.fill("M81 55L100 20L119 55Z", { type: "seq", r: 1.4, c: roof, tilt: .42, z: .6 });
  E.line("M80 55L120 55", { type: "pearl", r: 1, c: ["#f7efe2"], z: 1.4 });
  E.line("M40 115L76 91L124 91L160 115", { type: "bead", r: .8, c: GOLD, z: 1.4 });
  E.line("M50 119L150 119", { type: "bead", r: .75, c: GOLD, z: .4 });
  // drum windows
  for (const x of [93, 107]) E.fill(`M${x - 2.4} 80L${x - 2.4} 66A2.4 2.4 0 0 1 ${x + 2.4} 66L${x + 2.4} 80Z`, { type: "bead", r: .7, k: 1.9, c: ["#2e3d56", "#3b4d6b", "#24324a"], z: .6 });
  // cross
  E.line("M100 21L100 4", { type: "bugle", r: 1, len: 2.4, c: GOLD, z: .6, space: .15 });
  E.line("M93.5 10L106.5 10", { type: "bugle", r: 1, len: 2.4, c: GOLD, z: .9, space: .15 });
  for (const [x, y] of [[100, 2.5], [92, 10], [108, 10]]) E.one("pearl", x, y, 1.1 * E.u, { c: ["#f7efe2"], z: .6 });
  // wall windows
  for (const x of [66, 134]){
    E.fill(`M${x - 5} 160L${x - 5} 140A5 5 0 0 1 ${x + 5} 140L${x + 5} 160Z`, { type: "bead", r: .75, k: 1.9, c: ["#2e3d56", "#3b4d6b", "#24324a", "#4a5f80"], z: .5 });
    E.line(`M${x - 6.5} 161L${x - 6.5} 140A6.5 6.5 0 0 1 ${x + 6.5} 140L${x + 6.5} 161`, { type: "bead", r: .7, c: GOLD, z: .8 });
  }
  // the arched door with pearls and ivy
  E.satin("M86 200L86 160A14 14 0 0 1 114 160L114 200Z", { angle: 90, c: (x) => Math.abs(x - 100) < .9 ? "#3f2e22" : BARK[Math.floor(Math.abs(Math.sin(x * 3.1)) * 3)], gap: 1, max: 6, raise: .4 });
  E.line("M83.5 200L83.5 160A16.5 16.5 0 0 1 116.5 160L116.5 200", { type: "pearl", r: 1.2, c: ["#f8f1e4", "#efe4d2"], z: 1 });
  E.line("M80.5 200L80.5 160A19.5 19.5 0 0 1 119.5 160L119.5 200", { type: "bead", r: .75, c: GOLD, z: .8 });
  E.line("M79 196C74 180 79 162 88 150C94 142 106 141 112 150", { type: "seq", r: 1.05, gap: 2.1, c: GREEN_L, tilt: .6, z: 2 });
  for (const x of [95, 105]) E.one("bead", x, 182, .9 * E.u, { c: GOLD, z: 1.4 });
  // rose bushes, grass, stepping stones
  for (const [x0, x1] of [[16, 82], [118, 184]])
    for (let x = x0; x <= x1; x += 9){ const r = 7 + R() * 4; E.fill(circ(x, 202, r), { type: "knot", r: .95, k: 1.75, c: shade(GREEN_L.slice(0, 4), x, 196, r, r, R), z: 1.4 }); }
  for (let i = 0; i < 16; i++){ const left = i % 2, x = left ? 18 + R() * 62 : 120 + R() * 62; E.rose(x, 191 + R() * 10, { r: 1.5 + R() * .5, n: 6, c: [E.pick(["#efd3cf", "#f6e3e0", "#f4ede1", "#e9c3c3"])], z: 2.6 }); }
  E.satin("M84 201L116 201L124 218L76 218Z", { angle: 0, c: ["#efe5d3", "#e5d6bd", "#f4ede1"], gap: 1, max: 5 });
  E.fill("M0 204L76 204L74 220L0 220Z M124 204L200 204L200 220L126 220Z", { type: "knot", r: .8, k: 1.8, c: GREEN_L.slice(1), z: .4 });
  // a few golden stars
  for (let i = 0; i < 7; i++) E.one("bead", 20 + R() * 160, 8 + R() * 60, .8 * E.u, { c: GOLD, z: .5 });
  return E;
}

function sceneDress(){
  const W = 260, H = 204, E = new Emb(W, H, 1.6, 33), R = E.R;
  E.ordFn = (x, y) => (y / H) * .75 + R() * .25;      // sewn from the top down
  // gown: champagne sequin bodice, flowing satin skirt with folds, pearls
  E.put("pearl", 80, 20, { s: [5, 5, 5], z: 4, c: new THREE.Color("#8a6a4e") });
  E.satin("M74 25L86 25L88 36L72 36Z", { angle: 90, c: ["#d8c7ae", "#cdbb9f"], gap: 1 });
  E.fill("M60 40Q64 35 70 39Q76 44 80 47Q84 44 90 39Q96 35 100 40L96 75Q80 79 64 75Z", { type: "seq", r: 1.25, c: shade(["#c9ab78", "#d6bb8a", "#e2cb9f", "#ecdab6", "#f4e8cf"], 80, 56, 20, 20, R), tilt: .25, z: 1.2 });
  for (const sd of [-1, 1]) E.line(`M${80 + sd * 16} 40Q${80 + sd * 14} 30 ${80 + sd * 8} 27`, { type: "pearl", r: .9, c: ["#f8f1e4"], z: 1.4 });
  const skirt = (x, y) => { const t = (y - 76) / 112, fold = Math.sin(Math.atan2(y - 10, x - 80) * 38) * .5 + .5; return mixC("#efe4cf", "#9fb293", t).multiplyScalar(.8 + fold * .24); };
  E.fan("M64 77Q80 80 96 77Q113 122 132 188Q80 199 28 188Q47 122 64 77Z", 80, 10, { c: skirt, gap: 1.05, max: 16, j: .03, raise: .25, rm: 110 });
  E.line("M28 188Q80 199 132 188", { type: "pearl", r: .95, c: ["#f8f1e4", "#efe4d2"], z: 1 });
  E.line("M64 76.5Q80 80 96 76.5", { type: "pearl", r: 1.05, c: ["#f8f1e4"], z: 2.2 });
  E.rose(91, 78, { r: 2, n: 7, c: ["#e5c788", "#d9b46a"], heart: "pearl", z: 2.6 });
  for (let i = 0; i < 40; i++){ const y = 86 + R() * 96, s = (y - 76) / 112, x = 80 + (R() - .5) * (32 + 92 * s); E.one("seq", x, y, .7 * E.u, { c: ["#f4e8cf", "#e5c788", "#ffffff"], tilt: .1, z: 1.8 }); }
  E.line("M80 189L80 197", { type: "bugle", r: 1, len: 3, c: GOLD });
  E.line("M66 200Q80 194 94 200", { type: "bead", r: .8, c: GOLD });
  // suit: navy satin jacket, satin lapels, white shirt, bow tie, gold buttons
  E.put("pearl", 180, 20, { s: [5, 5, 5], z: 4, c: new THREE.Color("#8a6a4e") });
  E.satin("M174 25L186 25L188 36L172 36Z", { angle: 90, c: ["#d8c7ae", "#cdbb9f"], gap: 1 });
  const navy = (x, y) => mixC("#3b4a66", "#273248", Math.abs(x - 180) / 30 + (R() - .5) * .25);
  E.satin("M154 41Q180 33 206 41L212 124Q180 132 148 124Z", { angle: 90, c: navy, gap: 1.05, max: 7, raise: .35 });
  E.satin("M172 39L180 72L188 39Z", { angle: 90, c: ["#fbf8f2", "#f1ebe0", "#e7e0d4"], gap: .95, z: .8 });
  E.satin("M170 37L180 76L174 84L161 44Z", { angle: 72, c: ["#222b3e", "#2c364c"], gap: .95, z: 1.4, raise: .3 });
  E.satin("M190 37L180 76L186 84L199 44Z", { angle: 108, c: ["#222b3e", "#2c364c"], gap: .95, z: 1.4, raise: .3 });
  E.fill("M180 43L173 39L173 47Z M180 43L187 39L187 47Z", { type: "bead", r: .62, k: 1.8, c: ["#1b1b22", "#2a2a33"], z: 2 });
  E.one("bead", 180, 43, .9 * E.u, { c: ["#1b1b22"], z: 2.2 });
  for (const y of [93, 106]) E.one("pearl", 180, y, 1.15 * E.u, { c: GOLD, z: 1.6 });
  E.fill("M195 63L205 63L200 56Z", { type: "seq", r: .9, c: ["#f4ede1", "#ffffff"], z: 1.8 });
  E.rose(165, 60, { r: 1.6, n: 6, c: ["#efd3cf", "#f6e3e0"], z: 2.6 });
  E.line("M180 128L180 192", { type: "bugle", r: 1, len: 3, c: GOLD });
  E.line("M164 200Q180 192 196 200", { type: "bead", r: .8, c: GOLD });
  // little sprigs between them
  for (let i = 0; i < 5; i++){ const y = 120 + i * 14; E.line(`M130 ${y}Q126 ${y - 4} 122 ${y - 3}`, { type: "seq", r: .9, gap: 1.6, c: GREEN_L, tilt: .5 }); E.line(`M130 ${y}Q134 ${y - 4} 138 ${y - 3}`, { type: "seq", r: .9, gap: 1.6, c: GREEN_L, tilt: .5 }); }
  E.line("M130 190L130 112", { type: "bead", r: .6, c: GREEN_D });
  return E;
}

function sceneEstate(){
  const W = 400, H = 250, E = new Emb(W, H, 1.9, 47), R = E.R;
  E.ordFn = (x, y) => (Math.abs(x - 200) / 200) * .35 + (1 - y / H) * .45 + R() * .2;
  // golden sun, mountains with pearl snow, hills
  E.fill(circ(330, 50, 15), { type: "seq", r: 1.4, c: shade(["#c38f3e", "#d4a656", "#e2bd72", "#ecd096"], 330, 50, 15, 15, R), tilt: .15, z: -3 });
  const mtn = (x, y) => mixC("#c9d1d6", "#94a3ae", (y - 40) / 90 + (R() - .5) * .2);
  E.satin("M0 125L58 72L92 96L150 42L206 90L252 58L312 98L348 74L400 112L400 152L0 152Z", { angle: 0, c: mtn, gap: 1.25, max: 16, z: -3.4 });
  for (const [x, y, s] of [[150, 42, 13], [58, 72, 9], [252, 58, 10], [348, 74, 8]])
    E.fill(`M${x - s} ${y + s * .95}L${x} ${y}L${x + s} ${y + s * .95}L${x + s * .45} ${y + s * .7}L${x} ${y + s}L${x - s * .5} ${y + s * .72}Z`, { type: "pearl", r: .7, k: 2.1, c: ["#ffffff", "#f6f3ee"], z: -2.6 });
  E.satin("M0 150Q90 128 200 140Q310 152 400 132L400 192L0 192Z", { angle: 0, c: (x, y) => mixC("#c3cfb4", "#94a888", (y - 130) / 60 + (R() - .5) * .25), gap: 1.2, max: 8, z: -2 });
  for (const x of [62, 82, 318, 338]) cypress(E, x, 192, 92 + R() * 18, 1.15, -1.2);
  for (const x of [30, 110, 290, 372]) roundTree(E, x, 192, 13, 1, -1.6, null);
  // the house: walls, terracotta roof, tower, arcade, wooden balcony, windows
  const wall = (x, y) => ["#f0e2c6", "#e9d6b5", "#e2cba6", "#f3e8d2"][Math.floor(Math.abs(Math.sin(Math.floor(y / 3) * 7.1 + Math.floor(x / 9) * 3.3)) * 4)];
  E.satin("M110 110L290 110L290 192L110 192Z", { angle: 90, c: wall, gap: 1.1, max: 6 });
  E.satin("M182 74L218 74L218 112L182 112Z", { angle: 90, c: wall, gap: 1.05, max: 6 });
  const terra = shade(["#9c5539", "#ad6446", "#bf7656", "#cd8b6b"], 200, 90, 100, 20, R);
  E.fill("M100 114L130 90L270 90L300 114Z", { type: "seq", r: 1.45, c: terra, tilt: .45, z: .6 });
  E.fill("M178 76L200 56L222 76Z", { type: "seq", r: 1.3, c: terra, tilt: .45, z: .6 });
  E.one("pearl", 200, 53, 1.3 * E.u, { c: GOLD, z: .6 });
  E.fill(circ(200, 93, 6), { type: "bead", r: .7, k: 1.9, c: ["#c7d6dc", "#b3c6cf", "#dbe6e9"], z: .5 });
  E.line(`M194 93a6 6 0 1 0 12 0a6 6 0 1 0 -12 0`, { type: "pearl", r: .85, c: ["#f8f1e4"], z: 1 });
  for (let i = 0; i < 7; i++){ const x = 122 + i * 26;
    E.fill(`M${x - 4} 128L${x - 4} 120L${x + 4} 120L${x + 4} 128Z`, { type: "bead", r: .7, k: 1.9, c: ["#c7d6dc", "#a9bdc7", "#dbe6e9"], z: .5 });
    E.fill(`M${x - 6} 192L${x - 6} 172A6 6 0 0 1 ${x + 6} 172L${x + 6} 192Z`, { type: "bead", r: .8, k: 1.85, c: ["#6b5848", "#5a4a3c", "#7a6655"], z: .4 });
    E.line(`M${x - 7.6} 192L${x - 7.6} 172A7.6 7.6 0 0 1 ${x + 7.6} 172L${x + 7.6} 192`, { type: "bead", r: .7, c: GOLD, z: .8 });
  }
  E.line("M112 139L288 139", { type: "bugle", r: 1, len: 3.6, c: ["#7a5a40", "#6b4f3a"], z: 2.6, space: .1 });
  E.line("M112 150L288 150", { type: "bugle", r: 1.1, len: 3.6, c: ["#7a5a40", "#6b4f3a"], z: 2.6, space: .1 });
  for (let x = 114; x <= 286; x += 6) E.line(`M${x} 140L${x} 149`, { type: "bugle", r: .8, len: 2.6, c: ["#8a6a4e", "#7a5a40"], z: 2.2, space: .2 });
  E.line("M110 153L290 153", { type: "pearl", r: .8, c: ["#f8f1e4"], z: 1 });
  E.line("M110 111L290 111", { type: "bead", r: .8, c: GOLD, z: 1 });
  E.line("M110 192L110 111M290 111L290 192", { type: "bead", r: .7, c: GOLD, z: .8 });
  // vineyard rows converging to the house, with grape clusters
  E.satin("M0 192L400 192L400 250L0 250Z", { angle: 0, c: (x, y) => mixC("#9fb08f", "#7f9479", (y - 192) / 58 + (R() - .5) * .3), gap: 1.2, max: 8, z: -.4 });
  for (let xb = -260; xb <= 660; xb += 46){
    if (Math.abs(xb - 200) < 30) continue;
    E.line(`M${xb} 252L${200 + (xb - 200) * .42} 196`, { type: "seq", r: 1.2, c: GREEN_L, tilt: .5, z: .8, grow: t => 1.2 - t * .55, gap: 1.7 });
    for (let t = .08; t < .9; t += .2){ const x = xb + (200 + (xb - 200) * .42 - xb) * t, y = 252 - 56 * t, k = 1.15 - t * .5;
      for (let g = 0; g < 4; g++) E.one("bead", x + (R() - .5) * 3 * k, y + 1 + R() * 3 * k, .85 * k * E.u, { c: ["#5e3f63", "#6f4b73", "#7d5a80", "#4f3454"], z: 1.6 }); }
  }
  E.satin("M192 193L208 193L226 252L174 252Z", { angle: 0, c: ["#f4ede1", "#ece1cc", "#f7f1e6"], gap: 1, max: 6, z: .2 });
  E.line("M191 193L173 252", { type: "pearl", r: .9, c: ["#f8f1e4"], grow: t => .7 + t * .6, z: .6 });
  E.line("M209 193L227 252", { type: "pearl", r: .9, c: ["#f8f1e4"], grow: t => .7 + t * .6, z: .6 });
  return E;
}

/* ---------- hoop scenes for "our story" and "moments" (100×100, embroidered on linen) ---------- */
const tf = (d, f) => d.replace(/([MLQC])([^MLQCZ]*)/g, (m, c, a) => { const n = a.trim().split(/[\s,]+/).map(Number), out = []; for (let i = 0; i + 1 < n.length; i += 2){ const p = f(n[i], n[i + 1]); out.push(p[0].toFixed(2) + " " + p[1].toFixed(2)); } return c + out.join(" "); });
const rotAt = (cx, cy, ox, oy, a) => (x, y) => { const X = x + ox, Y = y + oy, c = Math.cos(a), s = Math.sin(a); return [cx + (X - cx) * c - (Y - cy) * s, cy + (X - cx) * s + (Y - cy) * c]; };
const HEART = (x, y, s) => `M${x} ${y + s}C${x - s * 1.1} ${y + s * .2} ${x - s * 1.2} ${y - s * .7} ${x - s * .6} ${y - s * .9}C${x - s * .3} ${y - s} ${x} ${y - s * .7} ${x} ${y - s * .5}C${x} ${y - s * .7} ${x + s * .3} ${y - s} ${x + s * .6} ${y - s * .9}C${x + s * 1.2} ${y - s * .7} ${x + s * 1.1} ${y + s * .2} ${x} ${y + s}Z`;
const BLUSH = TH.blush || ["#efc9c4", "#f4dcd6", "#e6b3ad", "#f7e7e1"];
const MONO = () => ((document.querySelector("#g-tie b") || {}).textContent || "N&D").trim();
function bigRose(E, x, y, r, c, z = 1.4){ E.rose(x, y, { r, n: 8, c, z, heart: "pet" }); E.rose(x, y, { r: r * .58, n: 6, c, z: z + r * .45, cc: "#f3d9a4" }); }

function sceneBooks(){            // 2019 · by the bookshelf, autumn
  const E = new Emb(100, 100, 1, 101), R = E.R;
  const BK = ["#8c4a3c", "#5c6e58", "#c49a5a", "#3e4f6b", "#a8784a", "#7a5a7e", "#cdb48f", "#6b3f3f", "#4f6a6a"];
  for (const [y0, h0, h1, x0, x1] of [[62, 20, 31, 12, 88], [92, 17, 23, 6, 94]]){
    E.satin(`M${x0 - 6} ${y0}L${x1 + 6} ${y0}L${x1 + 6} ${y0 + 4}L${x0 - 6} ${y0 + 4}Z`, { angle: 0, c: BARK, gap: .9, max: 10, z: .2 });
    let x = x0;
    while (x < x1 - 4){
      const w = 4.2 + R() * 3.4, h = h0 + R() * (h1 - h0), col = E.pick(BK), lean = R() < .14 && x + w + 9 < x1;
      const d = lean ? `M${x} ${y0}L${x + w} ${y0}L${x + w + h * .32} ${y0 - h * .95}L${x + h * .32} ${y0 - h * .95}Z` : `M${x} ${y0}L${x + w} ${y0}L${x + w} ${y0 - h}L${x} ${y0 - h}Z`;
      E.satin(d, { angle: lean ? 73 : 90, c: [col], j: .08, gap: .85, max: 9, z: .5, raise: .3 });
      if (!lean) for (const yy of [y0 - h + 2.6, y0 - 3]) E.line(`M${x + .7} ${yy}L${x + w - .7} ${yy}`, { type: "bead", r: .38, c: GOLD, z: 1.3 });
      x += w + (lean ? h * .32 : 0) + .45;
    }
  }
  E.fill(HEART(50, 22, 9), { type: "seq", r: 1.2, c: ["#c0504d", "#d0645c", "#b84545", "#d9786e"], tilt: .25, z: .6 });
  for (let i = 0; i < 14; i++) E.one("seq", 8 + R() * 84, 4 + R() * 30, 1.5, { c: ["#c96a2b", "#d98a3a", "#b5532a", "#e0a743"], tilt: .7, z: 7, rise: -78, rs: .06 });
  return E;
}
function sceneMountains(){        // 2022 · Svaneti towers, mist and a campfire
  const E = new Emb(100, 100, 1, 202), R = E.R;
  for (let i = 0; i < 16; i++) E.one("bead", 8 + R() * 84, 6 + R() * 22, .55, { c: GOLD, z: .4, fl: .45 });
  E.satin("M0 62L18 40L30 50L52 22L72 46L84 36L100 52L100 72L0 72Z", { angle: 0, c: (x, y) => mixC("#d3dae0", "#8d9cab", (y - 22) / 50 + (R() - .5) * .2), gap: .95, max: 12, z: -.6 });
  for (const [x, y, s] of [[52, 22, 7], [18, 40, 5], [84, 36, 5]]) E.fill(`M${x - s} ${y + s * .9}L${x} ${y}L${x + s} ${y + s * .9}L${x + s * .4} ${y + s * .7}L${x} ${y + s}L${x - s * .45} ${y + s * .72}Z`, { type: "pearl", r: .55, k: 2, c: ["#ffffff", "#f5f2ec"], z: 0 });
  E.satin("M0 70Q30 63 60 69Q80 73 100 67L100 100L0 100Z", { angle: 0, c: (x, y) => mixC("#9fb08f", "#6f8566", (y - 65) / 35 + (R() - .5) * .3), gap: .95, max: 10, z: .2 });
  for (const [x, w, top] of [[30, 7, 30], [41, 6, 40]]){
    E.satin(`M${x - w / 2} 74L${x + w / 2} 74L${x + w / 2 - .5} ${top}L${x - w / 2 + .5} ${top}Z`, { angle: 90, c: ["#e6dccb", "#d9ccb6", "#cfc0a6", "#eee6d8"], gap: .8, max: 4, z: .8 });
    E.fill(`M${x - w / 2 - 1} ${top}L${x} ${top - 6}L${x + w / 2 + 1} ${top}Z`, { type: "seq", r: .85, c: ["#8b8f93", "#9ea3a6", "#777c80"], tilt: .45, z: 1.3 });
    for (const yy of [top + 6, top + 14]) E.one("bead", x, yy, .55, { c: ["#2e3d56"], z: 1.6 });
  }
  E.fill("M0 63Q25 59 50 63Q75 67 100 62L100 67Q75 71 50 67Q25 63 0 68Z", { type: "knot", r: .75, k: 2, c: ["#ffffff", "#f4f1ec", "#ebe7e0"], z: 2.4, sway: .7 });
  E.line("M56 86L72 80", { type: "bugle", r: 1.2, len: 3, c: BARK, z: 1.4, space: .1 });
  E.line("M56 80L72 86", { type: "bugle", r: 1.2, len: 3, c: BARK, z: 1.9, space: .1 });
  E.fill("M64 64C59 71 57 76 59 80C61 84 67 84 69 80C71 76 69 71 64 64Z", { type: "seq", r: .95, k: 1.4, c: (x, y) => y < 71 ? "#ffd970" : y < 77 ? "#f6a63b" : "#e2622b", tilt: .2, z: 2.4, fl: .2 });
  E.glows.push([64, 76, 16]);
  for (let i = 0; i < 8; i++) E.one("bead", 62 + R() * 4, 66, .4, { c: ["#ffd36b", "#ffb347"], z: 3, rise: 26, rs: .35 });
  return E;
}
function sceneRingBook(){         // 2026 · a ring in the book, spring blossom
  const E = new Emb(100, 100, 1, 303), R = E.R;
  E.line("M0 6Q18 12 28 24Q34 32 33 42", { type: "bead", r: .65, c: BARK, z: .5 });
  E.line("M18 12Q24 6 34 6", { type: "bead", r: .5, c: BARK, z: .5 });
  for (const [x, y, r] of [[8, 9, 2.6], [20, 15, 3], [28, 24, 2.4], [33, 36, 2.2], [30, 6, 2.2], [14, 4, 1.8]]) E.rose(x, y, { r, n: 5, c: E.R() < .5 ? BLUSH : ["#fbf4ee", "#f6eae3"], z: 1.2, cc: "#e9c77f" });
  for (let i = 0; i < 6; i++) E.one("seq", 10 + R() * 40, 6 + R() * 20, .9, { c: BLUSH, tilt: .7, z: 7, rise: -70, rs: .07 });
  E.satin("M11 76Q31 70 50 75Q69 70 89 76L89 81Q69 75 50 80Q31 75 11 81Z", { angle: 90, c: ["#7a2f35", "#8a3a40", "#6d282e"], gap: .8, z: 0 });
  for (const sd of [-1, 1]){
    const X = v => 50 + sd * v;
    E.satin(`M${X(36)} 75Q${X(18)} 67 50 73L50 41Q${X(18)} 34 ${X(36)} 42Z`, { angle: 0, c: ["#fbf6ea", "#f4ecdc", "#efe5d1"], gap: .85, max: 14, z: .7, raise: .5 });
    for (let j = 0; j < 7; j++){ const y = 45 + j * 3.8; E.line(`M${X(32)} ${y}Q${X(18)} ${y - 4} ${X(4)} ${y + .8}`, { type: "bead", r: .26, gap: .75, c: ["#9c8a76", "#8a7764"], z: 1.4 }); }
  }
  E.line("M50 41L50 73", { type: "bead", r: .4, c: ["#cbb796"], z: 1.2 });
  E.extras.push({ kind: "ring", x: 50, y: 27, r: 10.5, z: 7, spin: .45 });
  for (let i = 0; i < 6; i++){ const a = i / 6 * 6.28; E.one("bead", 50 + Math.cos(a) * 17, 26 + Math.sin(a) * 15, .5, { c: ["#fff6dc", "#f3d9a4"], z: 3, fl: .5 }); }
  return E;
}
function sceneToast(){            // champagne toast
  const E = new Emb(100, 100, 1, 404), R = E.R;
  for (let i = 0; i < 26; i++) E.one("seq", 6 + R() * 88, 6 + R() * 88, .8, { c: ["#e5c788", "#f4ede1", "#efc9c4", "#dcc6e2"], tilt: .5, z: .3, sway: .3 });
  for (const sd of [-1, 1]){
    const f = rotAt(50, 70, 50 + sd * 9.5, 0, sd * .23);
    const bowl = "M-7 12Q-7 35 -1.5 45L1.5 45Q7 35 7 12Z", wine = "M-6.4 20Q-6.4 35 -1.4 44L1.4 44Q6.4 35 6.4 20Z";
    E.fill(tf(wine, f), { type: "seq", r: .85, c: ["#e9cf8f", "#dcb96a", "#f0dca6", "#e3c47c"], tilt: .15, z: .8 });
    E.line(tf("M-7 12Q-7 35 -1.5 45L1.5 45Q7 35 7 12", f), { type: "bead", r: .55, c: ["#e7f0f2", "#d8e6ea", "#f4f8f9"], z: 1.6 });
    E.line(tf("M-7 12L7 12", f), { type: "pearl", r: .45, c: ["#ffffff"], z: 1.6 });
    E.line(tf("M0 45L0 68", f), { type: "bugle", r: .9, len: 2.4, c: ["#e7f0f2", "#d8e6ea"], z: 1.2, space: .1 });
    E.line(tf("M-8 69Q0 66 8 69", f), { type: "bead", r: .55, c: ["#e7f0f2", "#d8e6ea"], z: 1.2 });
    for (let i = 0; i < 9; i++){ const p = f((R() - .5) * 7, 30 + R() * 12); E.one("pearl", p[0], p[1], .38, { c: ["#fff8e6"], z: 2, rise: 16, rs: .35 }); }
    void bowl;
  }
  for (let k = 0; k < 8; k++){ const a = k / 8 * 6.28; E.line(`M${50 + Math.cos(a) * 4} ${12 + Math.sin(a) * 4}L${50 + Math.cos(a) * 9} ${12 + Math.sin(a) * 9}`, { type: "bead", r: .45, c: GOLD, z: 1.4, fl: .3 }); }
  E.glows.push([50, 12, 12]);
  E.fill(HEART(50, 86, 4.5), { type: "seq", r: .9, c: ["#c0504d", "#d0645c"], tilt: .2, z: .8 });
  return E;
}
function sceneWreath(){           // monogram in a flower wreath
  const E = new Emb(100, 100, 1, 505), R = E.R;
  for (let a = 0; a < 6.28; a += .1){
    for (const [rr, off] of [[33, .0], [37, .05]]){
      const x = 50 + Math.cos(a + off) * rr, y = 50 + Math.sin(a + off) * rr;
      E.put("seq", x, y, { rz: -(a + off) + (rr > 35 ? .5 : -.5), rx: .45, s: [1.05, 1.9, 1.05], z: .5, c: E.color(GREEN_L, x, y, .08) });
    }
  }
  for (let k = 0; k < 9; k++){ const a = k / 9 * 6.28 - 1.2, x = 50 + Math.cos(a) * 35, y = 50 + Math.sin(a) * 35; bigRose(E, x, y, 3 + R() * .8, [E.pick([BLUSH, ["#fbf4ee", "#f3ebe2"], ["#dcc6e2", "#e8d9ec"], ["#ecd2b0", "#f3dfc3"]])].flat(), 1.6);
    for (let p = 0; p < 3; p++){ const b = a + .3 + p * .06; E.one("pearl", 50 + Math.cos(b) * (32 + p), 50 + Math.sin(b) * (32 + p), .6, { c: ["#f8f1e4"], z: 1.8 }); } }
  E.text(MONO(), 50, 53, 30, { type: "seq", r: .72, gap: 1.05, c: GOLD, tilt: .1, z: .5 });
  return E;
}
function sceneBouquet(){          // bridal bouquet with a satin bow
  const E = new Emb(100, 100, 1, 606), R = E.R;
  E.satin("M44 58L56 58L53 92L47 92Z", { angle: 90, c: ["#6f8a5a", "#7f9a66", "#5f7a4c"], gap: .8, max: 10, z: .3 });
  E.fill(circ(50, 40, 25), { type: "seq", r: 1.3, c: shade(GREEN_L, 50, 40, 25, 25, R), tilt: .4, z: .4 });
  const spots = [[50, 38], [38, 34], [62, 34], [44, 24], [57, 23], [33, 46], [67, 46], [50, 52], [41, 47], [59, 48], [29, 32], [71, 32]];
  spots.forEach(([x, y], i) => bigRose(E, x + (R() - .5) * 2, y + (R() - .5) * 2, 4 + R() * 1.2, [BLUSH, ["#fbf4ee", "#f3ebe2"], ["#ecd2b0", "#f3dfc3"], ["#dcc6e2", "#e8d9ec"]][i % 4], 2));
  for (let i = 0; i < 26; i++){ const a = R() * 6.28, q = 14 + R() * 13; E.one("pearl", 50 + Math.cos(a) * q, 40 + Math.sin(a) * q * .9, .55, { c: ["#ffffff", "#f8f1e4"], z: 3.5 }); }
  for (const sd of [-1, 1]){
    E.satin(`M50 66C${50 + sd * 8} 57 ${50 + sd * 15} 60 ${50 + sd * 11} 67C${50 + sd * 8} 71 ${50 + sd * 3} 69 50 66Z`, { angle: 90 + sd * 50, c: ["#f7efe2", "#efe3cf", "#fbf6ec"], gap: .75, z: 1.5, raise: .5 });
    E.satin(`M50 67L${50 + sd * 7} 84L${50 + sd * 4} 85L50 70Z`, { angle: 90 + sd * 20, c: ["#f7efe2", "#efe3cf"], gap: .75, z: 1.3 });
  }
  E.one("pearl", 50, 66.5, 1.6, { c: ["#f8f1e4"], z: 2.4 });
  return E;
}
function sceneCake(){             // three-tier wedding cake
  const E = new Emb(100, 100, 1, 707), R = E.R;
  E.ordFn = (x, y) => (1 - y / 100) * .85 + R() * .15;
  E.line("M18 88Q50 94 82 88", { type: "pearl", r: .8, c: ["#f8f1e4", "#efe4d2"], z: .3 });
  const icing = ["#fbf6ec", "#f4ecdc", "#efe4d0", "#f8f2e6"];
  for (const [x0, x1, y0, y1] of [[22, 78, 66, 88], [30, 70, 46, 66], [37, 63, 29, 46]]){
    E.satin(`M${x0} ${y1}L${x0} ${y0}L${x1} ${y0}L${x1} ${y1}Z`, { angle: 90, c: icing, gap: .8, max: 6, z: .4, raise: .6 });
    E.line(`M${x0} ${y1 - .6}L${x1} ${y1 - .6}`, { type: "pearl", r: .7, c: ["#f8f1e4"], z: 1.4 });
    E.line(`M${x0} ${y0 + .5}L${x1} ${y0 + .5}`, { type: "pearl", r: .5, c: ["#f8f1e4"], z: 1.4 });
    const n = Math.round((x1 - x0) / 9), w = (x1 - x0) / n;
    for (let k = 0; k < n; k++) E.line(`M${x0 + k * w} ${y0 + 3}Q${x0 + k * w + w / 2} ${y0 + 8} ${x0 + (k + 1) * w} ${y0 + 3}`, { type: "bead", r: .4, c: GOLD, z: 1.2 });
  }
  const path = svgPath("M42 30Q62 40 48 54Q36 64 60 82"), L = path.getTotalLength();
  for (let s = 0; s <= L; s += 5.2){ const p = path.getPointAtLength(s); bigRose(E, p.x + (R() - .5) * 2, p.y, 2.6 + R() * .8, E.R() < .5 ? BLUSH : ["#fbf4ee", "#f3ebe2"], 2.2);
    E.put("seq", p.x + 3.5, p.y + 1.5, { rz: -.8, rx: .5, s: [.9, 1.7, .9], z: 1.8, c: E.color(GREEN_L, 0, 0, .08) }); }
  path.remove();
  E.line(HEART(50, 18, 6).replace(/Z$/, ""), { type: "bead", r: .55, c: GOLD, z: 1, fl: .15 });
  E.line("M50 24L50 29", { type: "bugle", r: .7, len: 2, c: GOLD, z: 1 });
  for (let i = 0; i < 10; i++) E.one("bead", 10 + R() * 80, 8 + R() * 40, .45, { c: ["#fff6dc", "#f3d9a4"], z: 1, fl: .5 });
  return E;
}
function sceneCoffee(){           // first meeting over coffee, steam drawing a heart
  const E = new Emb(100, 100, 1, 808), R = E.R;
  E.satin("M0 70L100 70L100 100L0 100Z", { angle: 0, c: BARK.concat(["#8a6a4e"]), gap: .9, max: 14, z: -.3 });
  for (const [cx, sd, CUP] of [[34, -1, TH.blush || BLUSH], [66, 1, ["#bfd0b8", "#aec3a6", "#cad9c3"]]]){
    E.satin(`M${cx - 15} 80Q${cx} 86 ${cx + 15} 80L${cx + 15} 82Q${cx} 89 ${cx - 15} 82Z`, { angle: 0, c: ["#fbf6ec", "#f1e8d8"], gap: .7, z: .5 });
    E.satin(`M${cx - 10} 58L${cx + 10} 58Q${cx + 9} 78 ${cx} 79Q${cx - 9} 78 ${cx - 10} 58Z`, { angle: 90, c: CUP, gap: .75, z: 1, raise: .6 });
    E.line(`M${cx - 9.5} 76.5Q${cx} 81 ${cx + 9.5} 76.5`, { type: "bead", r: .4, c: GOLD, z: 1.6 });
    E.line(`M${cx + sd * 9.6} 62Q${cx + sd * 15} 63 ${cx + sd * 14} 68Q${cx + sd * 13} 72 ${cx + sd * 8} 72`, { type: "bead", r: .7, c: GOLD, z: 1.2 });
    E.line(`M${cx - 10} 58.5L${cx + 10} 58.5`, { type: "bead", r: .45, c: GOLD, z: 1.6 });
    E.fill(`M${cx - 9} 59.5L${cx + 9} 59.5L${cx + 8.8} 61.5L${cx - 8.8} 61.5Z`, { type: "seq", r: .6, c: ["#6b4a33", "#5a3c28"], tilt: .1, z: 1.4 });
    E.rose(cx, 69, { r: 1.7, n: 5, c: ["#fbf6ee", "#ffffff"], z: 2.2, cc: "#e5c788" });
  }
  const hp = svgPath(HEART(50, 30, 10).replace(/Z$/, "")), L = hp.getTotalLength();
  for (let s = 0; s < L; s += 2.4){ const p = hp.getPointAtLength(s); E.one("pearl", p.x, p.y, .7, { c: ["#ffffff", "#f7efe2"], z: 2, fl: .2 }); }
  hp.remove();
  for (let i = 0; i < 12; i++) E.one("pearl", 30 + R() * 40, 48 + R() * 6, .45, { c: ["#ffffff"], z: 2, rise: 22, rs: .18 });
  return E;
}
function sceneRingBox(){          // the proposal: an open velvet ring box
  const E = new Emb(100, 100, 1, 909), R = E.R, V = TH.velvet || ["#7a2f35", "#8a3a40", "#6d282e"];
  for (let i = 0; i < 16; i++) E.one("pet", 8 + R() * 84, 66 + R() * 28, 1.6, { c: TH.blush || BLUSH, tilt: .5, z: .2 });
  E.satin("M24 46Q50 40 76 46L76 30Q50 18 24 30Z", { angle: 90, c: V, gap: .8, max: 10, z: .6, raise: .8 });
  E.satin("M26 44Q50 39 74 44L74 32Q50 22 26 32Z", { angle: 0, c: ["#fbf6ec", "#f1e8d8"], gap: .7, z: 1.4, raise: .3 });
  E.satin("M22 50L78 50L80 78Q50 84 20 78Z", { angle: 90, c: V, gap: .8, max: 10, z: .6, raise: .9 });
  E.satin("M27 52L73 52L72 60Q50 64 28 60Z", { angle: 0, c: ["#fbf6ec", "#f1e8d8", "#e9dcc6"], gap: .7, z: 1.6, raise: .6 });
  E.line("M22 50L78 50", { type: "bead", r: .55, c: GOLD, z: 2 });
  E.line("M24 46Q50 40 76 46", { type: "bead", r: .5, c: GOLD, z: 2 });
  E.extras.push({ kind: "ring", x: 50, y: 46, r: 8.5, z: 6, spin: .5 });
  for (let i = 0; i < 8; i++){ const a = i / 8 * 6.28; E.one("bead", 50 + Math.cos(a) * 18, 40 + Math.sin(a) * 14, .5, { c: ["#fff6dc", "#f3d9a4"], z: 3, fl: .55 }); }
  return E;
}
function sceneSea(){              // seaside sunset with a sailboat
  const E = new Emb(100, 100, 1, 1010), R = E.R;
  E.fill("M30 58A20 20 0 0 1 70 58Z", { type: "seq", r: 1.15, c: shade(["#e07a3f", "#eb9a4c", "#f2b866", "#f7d48c"], 50, 48, 20, 12, R), tilt: .12, z: -.4 });
  E.satin("M0 20L100 20L100 58L0 58Z", { angle: 0, c: (x, y) => mixC("#f6e2d2", "#f1c9a8", (y - 20) / 38 + (R() - .5) * .15), gap: 1, max: 16, z: -1 });
  E.satin("M0 58L100 58L100 100L0 100Z", { angle: 0, c: (x, y) => mixC(TH.sea1 || "#7fa6b8", TH.sea2 || "#3f6b84", (y - 58) / 42 + (R() - .5) * .25), gap: .95, max: 9, z: -.4 });
  for (let i = 0; i < 26; i++){ const y = 60 + R() * 30; E.one("bead", 50 + (R() - .5) * (8 + (y - 58) * 1.2), y, .45, { c: ["#ffe2a8", "#fff3d6"], z: .4, fl: .5 }); }
  E.satin("M58 72L74 72L71 76L61 76Z", { angle: 0, c: BARK, gap: .7, z: 1 });
  E.satin("M66 71L66 48L76 70Z", { angle: 90, c: ["#ffffff", "#f6f1ea"], gap: .65, z: 1.4, raise: .5 });
  E.satin("M65 71L65 52L57 70Z", { angle: 90, c: ["#fbf6ec", "#efe5d3"], gap: .65, z: 1.2, raise: .4 });
  for (const [x, y] of [[26, 30], [34, 26], [18, 36]]) E.line(`M${x - 3} ${y}Q${x - 1.5} ${y - 1.6} ${x} ${y}Q${x + 1.5} ${y - 1.6} ${x + 3} ${y}`, { type: "bead", r: .35, c: ["#5c5c5c"], z: .5 });
  return E;
}
function sceneRings(){            // wedding rings on a satin cushion
  const E = new Emb(100, 100, 1, 1111), R = E.R, P = TH.cushion || ["#fbf6ec", "#f4ecdc", "#efe5d1"];
  E.satin("M18 52Q50 40 82 52Q88 66 82 80Q50 90 18 80Q12 66 18 52Z", { angle: 90, c: P, gap: .8, max: 9, z: .4, raise: 1.4 });
  E.line("M18 52Q50 40 82 52Q88 66 82 80Q50 90 18 80Q12 66 18 52Z", { type: "pearl", r: .8, c: ["#f8f1e4"], z: 1.4 });
  for (const [x, y] of [[18, 52], [82, 52], [82, 80], [18, 80]]){ E.one("bead", x, y, 1.2, { c: GOLD, z: 1.8 }); E.line(`M${x} ${y}L${x + (x < 50 ? -3 : 3)} ${y + 6}`, { type: "bugle", r: .7, len: 1.6, c: GOLD, z: 1.6, space: .05 }); }
  E.extras.push({ kind: "rings", x: 50, y: 50, r: 11, z: 11, spin: .4 });
  bigRose(E, 26, 70, 3, TH.blush || BLUSH, 2); bigRose(E, 74, 70, 3, ["#fbf4ee", "#f3ebe2"], 2);
  for (let i = 0; i < 9; i++) E.one("bead", 14 + R() * 72, 10 + R() * 26, .5, { c: ["#fff6dc", "#f3d9a4"], z: .6, fl: .55 });
  return E;
}
function sceneArbor(){            // outdoor ceremony: a flower arch and rows of chairs
  const W = 200, H = 222, E = new Emb(W, H, 1.75, 1212), R = E.R;
  cypress(E, 22, 190, 100, 1.15, -3); cypress(E, 178, 190, 96, 1.1, -3);
  E.fill("M0 186Q100 176 200 186L200 222L0 222Z", { type: "knot", r: .85, k: 1.8, c: GREEN_L.slice(0, 4), z: -.4 });
  E.satin("M90 180L110 180L128 222L72 222Z", { angle: 0, c: ["#fbf6ec", "#f4ecdc", "#f7f1e6"], gap: 1, max: 6, z: .2 });
  for (const sd of [-1, 1]) E.line(`M${100 + sd * 10} 180L${100 + sd * 28} 222`, { type: "pearl", r: .8, c: ["#f8f1e4"], z: .8, grow: t => .7 + t * .6 });
  for (const sd of [-1, 1]) E.satin(`M${100 + sd * 46 - 3} 186L${100 + sd * 46 - 3} 92L${100 + sd * 46 + 3} 92L${100 + sd * 46 + 3} 186Z`, { angle: 90, c: ["#fbf6ec", "#efe5d3"], gap: .9, z: .5, raise: .4 });
  const ap = svgPath("M54 96A46 46 0 0 1 146 96"), AL = ap.getTotalLength();
  for (let s = 0; s <= AL; s += 2.2){ const p = ap.getPointAtLength(s); for (let k = 0; k < 2; k++) E.one("seq", p.x + (R() - .5) * 8, p.y + (R() - .5) * 8, 1.25 * E.u, { c: GREEN_L, tilt: .5, z: 1 }); }
  for (let s = 0; s <= AL; s += 7){ const p = ap.getPointAtLength(s); bigRose(E, p.x + (R() - .5) * 3, p.y + (R() - .5) * 3, 2.6 + R(), E.pick([TH.blush || BLUSH, BLOOM, ["#fbf4ee", "#f3ebe2"]]), 2); }
  for (const sd of [-1, 1]) for (let y = 104; y < 180; y += 9){ const x = 100 + sd * 46 + (R() - .5) * 4; E.fill(circ(x, y, 4), { type: "seq", r: 1.1, c: GREEN_L, tilt: .5, z: 1.2 }); if (R() < .6) bigRose(E, x + (R() - .5) * 4, y, 2.2, E.pick([TH.blush || BLUSH, BLOOM]), 2.2); }
  for (let k = 0; k < 6; k++){ const x = 66 + k * 13.6, L = 14 + R() * 18; E.line(`M${x} ${52 + Math.abs(x - 100) * .55}L${x + (R() - .5) * 3} ${52 + Math.abs(x - 100) * .55 + L}`, { type: "seq", r: .8, gap: 1.4, c: GREEN_L, tilt: .6, z: 1.6, sway: .4 }); }
  E.line("M58 104Q100 128 142 104", { type: "bead", r: .7, gap: 3.6, c: ["#fff1c9", "#ffe39a"], z: 2.4, fl: .5 });
  for (const sd of [-1, 1]) for (let row = 0; row < 3; row++) for (let c = 0; c < 2; c++){
    const x = 100 + sd * (24 + c * 15 + row * 5), y = 197 + row * 9, s = 1.25 + row * .15;
    E.line(`M${x - 3 * s} ${y}L${x - 3 * s} ${y - 9 * s}M${x + 3 * s} ${y}L${x + 3 * s} ${y - 9 * s}`, { type: "bugle", r: .55, len: 1.6, c: GOLD, z: 2, space: .05 });
    E.line(`M${x - 3.5 * s} ${y - 9 * s}L${x + 3.5 * s} ${y - 9 * s}M${x - 3.5 * s} ${y - 4 * s}L${x + 3.5 * s} ${y - 4 * s}`, { type: "bead", r: .4, c: GOLD, z: 2.2 });
  }
  return E;
}
function sceneVilla(){            // a palace in a forested valley (Borjomi style)
  const W = 400, H = 250, E = new Emb(W, H, 1.9, 1313), R = E.R;
  E.ordFn = (x, y) => (Math.abs(x - 200) / 200) * .35 + (1 - y / H) * .45 + R() * .2;
  E.satin("M0 110L70 70L130 96L200 50L270 92L330 66L400 104L400 150L0 150Z", { angle: 0, c: (x, y) => mixC("#b9c9c0", "#7f988c", (y - 50) / 100 + (R() - .5) * .2), gap: 1.25, max: 16, z: -3.4 });
  for (const [x0, x1] of [[-10, 150], [250, 410]]) E.fill(`M${x0} 175Q${(x0 + x1) / 2} 95 ${x1} 175Z`, { type: "seq", r: 1.4, k: 1.3, c: shade(GREEN_D, (x0 + x1) / 2, 140, 80, 40, R), tilt: .4, z: -2 });
  const wall = ["#f6efe2", "#efe5d2", "#e8dcc6"], roof = TH.roof || ["#6f9a88", "#5f8a78", "#7fab98"];
  E.satin("M120 120L280 120L280 192L120 192Z", { angle: 90, c: wall, gap: 1.1, max: 6 });
  E.satin("M80 140L120 140L120 192L80 192ZM280 140L320 140L320 192L280 192Z", { angle: 90, c: wall, gap: 1.1, max: 6 });
  E.fill("M114 122L130 104L270 104L286 122Z", { type: "seq", r: 1.4, c: roof, tilt: .45, z: .6 });
  E.fill("M76 142L88 130L120 130L120 142ZM280 130L312 130L324 142L280 142Z", { type: "seq", r: 1.3, c: roof, tilt: .45, z: .6 });
  E.satin("M168 104L200 82L232 104Z", { angle: 0, c: wall, gap: 1, z: 1 });
  E.line("M168 104L200 82L232 104", { type: "bead", r: .8, c: GOLD, z: 1.4 });
  E.fill(circ(200, 95, 4), { type: "bead", r: .6, k: 1.9, c: ["#c7d6dc", "#dbe6e9"], z: 1.6 });
  for (let i = 0; i < 6; i++){ const x = 170 + i * 12; E.satin(`M${x - 2.4} 192L${x - 2.4} 124L${x + 2.4} 124L${x + 2.4} 192Z`, { angle: 90, c: ["#ffffff", "#f3ece0", "#e2d7c4"], gap: .8, z: 2, raise: .9 }); E.line(`M${x - 3.4} 124L${x + 3.4} 124`, { type: "bead", r: .6, c: GOLD, z: 2.6 }); }
  for (const x of [134, 150, 250, 266, 92, 108, 292, 308]){ const y0 = x < 120 || x > 280 ? 150 : 132;
    E.fill(`M${x - 4} ${y0 + 26}L${x - 4} ${y0 + 4}A4 4 0 0 1 ${x + 4} ${y0 + 4}L${x + 4} ${y0 + 26}Z`, { type: "bead", r: .65, k: 1.9, c: TH.glass || ["#2f4a46", "#3b5a55", "#26403c"], z: .5 });
    E.line(`M${x - 5.2} ${y0 + 27}L${x - 5.2} ${y0 + 4}A5.2 5.2 0 0 1 ${x + 5.2} ${y0 + 4}L${x + 5.2} ${y0 + 27}`, { type: "bead", r: .55, c: GOLD, z: .8 }); }
  E.line("M120 120L280 120", { type: "pearl", r: .8, c: ["#f8f1e4"], z: 1.2 });
  E.satin("M0 192L400 192L400 250L0 250Z", { angle: 0, c: (x, y) => mixC("#9fb69a", "#6e8a6a", (y - 192) / 58 + (R() - .5) * .3), gap: 1.2, max: 10, z: -.4 });
  E.satin("M0 226Q100 218 200 226Q300 234 400 224L400 238Q300 246 200 238Q100 230 0 240Z", { angle: 0, c: ["#a9c8d4", "#8fb5c4", "#c3dbe3"], gap: 1, max: 12, z: .1 });
  for (let i = 0; i < 24; i++) E.one("bead", R() * 400, 226 + R() * 10, .7, { c: ["#ffffff", "#e8f3f7"], z: .8, fl: .5 });
  E.satin("M184 206Q200 200 216 206L214 214Q200 218 186 214Z", { angle: 0, c: wall, gap: .9, z: 1 });
  for (let i = 0; i < 14; i++) E.one("pearl", 200 + (R() - .5) * 6, 204, .8, { c: ["#ffffff", "#e8f3f7"], z: 2, rise: 18, rs: .4 });
  return E;
}
function sceneTbilisi(){          // Old Tbilisi: painted houses with carved balconies above the river
  const W = 400, H = 250, E = new Emb(W, H, 1.9, 1414), R = E.R;
  E.ordFn = (x, y) => (x / W) * .4 + (1 - y / H) * .4 + R() * .2;
  E.fill("M0 120Q60 70 140 80Q200 40 260 74Q330 60 400 110L400 150L0 150Z", { type: "knot", r: .9, k: 1.8, c: shade(GREEN_L, 200, 90, 200, 40, R), z: -3.2 });
  E.satin("M226 74L226 44L234 44L234 38L242 38L242 44L250 44L250 74Z", { angle: 90, c: ["#c9b393", "#bba383", "#d6c3a5"], gap: 1, max: 5, z: -2.4 });
  E.line("M226 74L210 82M250 74L280 80", { type: "bead", r: .8, c: ["#bba383"], z: -2.2 });
  const houses = [[20, 92, 108, TH.house1 || "#e8b4a6"], [92, 160, 96, TH.house2 || "#ecd29a"], [160, 236, 112, TH.house3 || "#b9d0b7"], [236, 308, 100, TH.house4 || "#b3cbe0"], [308, 384, 116, TH.house5 || "#e9c7b8"]];
  for (const [x0, x1, top, col] of houses){
    const C = new THREE.Color(col), cols = [col, "#" + C.clone().offsetHSL(0, 0, -.04).getHexString(), "#" + C.clone().offsetHSL(0, 0, .03).getHexString()];
    E.satin(`M${x0} 200L${x0} ${top}L${x1} ${top}L${x1} 200Z`, { angle: 90, c: cols, gap: 1.1, max: 7 });
    E.fill(`M${x0 - 4} ${top + 1}L${(x0 + x1) / 2} ${top - 18}L${x1 + 4} ${top + 1}Z`, { type: "seq", r: 1.35, c: ["#a85f43", "#b76e4f", "#c98463", "#9c5539"], tilt: .45, z: .6 });
    const by = top + 30;
    for (let x = x0 + 8; x < x1 - 6; x += 14){
      E.fill(`M${x} ${top + 24}L${x} ${top + 10}L${x + 8} ${top + 10}L${x + 8} ${top + 24}Z`, { type: "bead", r: .65, k: 1.9, c: TH.glass || ["#7fa8c4", "#9cbfd6", "#5f8db0"], z: .5 });
      E.fill(`M${x} ${by + 32}L${x} ${by + 20}L${x + 8} ${by + 20}L${x + 8} ${by + 32}Z`, { type: "bead", r: .65, k: 1.9, c: TH.glass || ["#7fa8c4", "#9cbfd6", "#5f8db0"], z: .5 });
    }
    const dx = (x0 + x1) / 2;
    E.satin(`M${dx - 7} 200L${dx - 7} ${by + 26}A7 7 0 0 1 ${dx + 7} ${by + 26}L${dx + 7} 200Z`, { angle: 90, c: BARK, gap: .9, max: 8, z: .6, raise: .4 });
    E.line(`M${dx - 8.4} 200L${dx - 8.4} ${by + 26}A8.4 8.4 0 0 1 ${dx + 8.4} ${by + 26}L${dx + 8.4} 200`, { type: "bead", r: .6, c: GOLD, z: 1 });
    E.satin(`M${x0 + 2} ${by + 10}L${x0 + 2} ${by - 2}L${x1 - 2} ${by - 2}L${x1 - 2} ${by + 10}Z`, { angle: 90, c: ["#7a5a40", "#8a6a4e", "#6b4f3a"], gap: .9, z: 2.2, raise: .3 });
    for (let x = x0 + 5; x < x1 - 3; x += 5) E.line(`M${x} ${by - 1}L${x} ${by + 9}`, { type: "bugle", r: .55, len: 1.8, c: ["#e8d6b8", "#d9c3a5"], z: 2.8, space: .15 });
    E.line(`M${x0} ${by - 3}L${x1} ${by - 3}`, { type: "bead", r: .7, c: ["#5c4331"], z: 2.6 });
  }
  E.line("M100 150Q120 140 136 148Q150 156 160 146", { type: "seq", r: 1.1, gap: 1.8, c: GREEN_L, tilt: .5, z: 3.2 });
  for (let i = 0; i < 6; i++) E.one("bead", 110 + i * 9, 150 + (i % 2) * 3, .9, { c: ["#5e3f63", "#6f4b73"], z: 3.4 });
  E.satin("M0 200L400 200L400 250L0 250Z", { angle: 0, c: (x, y) => mixC("#9fbccb", "#5f8ba3", (y - 200) / 50 + (R() - .5) * .3), gap: 1.1, max: 12, z: -.3 });
  for (let i = 0; i < 30; i++) E.one("bead", R() * 400, 204 + R() * 40, .7, { c: ["#ffe9b8", "#ffffff"], z: .4, fl: .5 });
  for (let k = 0; k < 9; k++){ const x = 20 + k * 45; E.line(`M${x} 200L${x} 190`, { type: "bugle", r: .7, len: 2.4, c: GOLD, z: 3 }); E.one("bead", x, 188, 1.2, { c: ["#f3c873"], z: 3.4 }); E.glows.push([x, 188, 6]); }
  return E;
}
const HOOP = { s1: sceneBooks, s2: sceneMountains, s3: sceneRingBook, g1: sceneToast, g2: sceneWreath, g3: sceneBouquet, g4: sceneCake,
  coffee: sceneCoffee, ringbox: sceneRingBox, sea: sceneSea, rings: sceneRings };
const FIG = { church: () => sceneChurch(), dress: () => sceneDress(), estate: () => sceneEstate(), arbor: () => sceneArbor(), villa: () => sceneVilla(), tbilisi: () => sceneTbilisi(), rings: () => sceneRings() };
const realPhoto = el => { const i = el.querySelector(".photo img"); return !!(i && i.complete && i.naturalWidth > 0 && !i.dataset.fb); };
const linenBump = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); g.fillStyle = "#808080"; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 128; i += 4){ g.fillStyle = "rgba(255,255,255,.2)"; g.fillRect(0, i, 128, 2); g.fillStyle = "rgba(0,0,0,.14)"; g.fillRect(i, 0, 2, 128); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(16, 16); return t; })();
const fabricMat = new THREE.MeshPhysicalMaterial({ color: TH.fabric, roughness: .93, sheen: .5, sheenColor: new THREE.Color(0xffffff), bumpMap: linenBump, bumpScale: 1.2, envMapIntensity: .6 });
const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xe8c47c, metalness: 1, roughness: .14, clearcoat: .4, envMapIntensity: 1.6 });
const gemMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0, ior: 2.4, clearcoat: 1, envMapIntensity: 3.2, flatShading: true });

/* ---------- a scene = one figure on the page ---------- */
const glowTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,226,160,1)"); gr.addColorStop(.35, "rgba(255,200,110,.45)"); gr.addColorStop(1, "rgba(255,190,100,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();

const scenes = [];
const m4 = new THREE.Matrix4(), qq = new THREE.Quaternion(), eu = new THREE.Euler(0, 0, 0, "ZYX"), vp = new THREE.Vector3(), vs = new THREE.Vector3();

function makeScene(T){
  const el = T.el;
  if (el.classList.contains("has-photo") || (T.hoop && realPhoto(el))) return null;
  const cv = document.createElement("canvas"); cv.className = "emb3d"; cv.setAttribute("aria-hidden", "true");
  el.insertBefore(cv, el.firstChild);
  const S = { T, el, cv, ctx: cv.getContext("2d"), revealT: null, vis: false, taps: [], built: false, aspect: 0 };
  scenes.push(S);
  return S;
}

function build(S){
  const cw = S.cv.clientWidth, ch = S.cv.clientHeight; if (cw < 20 || ch < 20) return false;
  const k = S.T.kind;
  if (k === "envelope") return buildEnvelope(S, cw, ch);
  if (k === "g2" && document.fonts && !document.fonts.check('30px "Pinyon Script"')){   // the monogram needs its script font
    if (!S.fontWait){ S.fontWait = performance.now(); document.fonts.load('30px "Pinyon Script"').catch(() => {}); }
    if (performance.now() - S.fontWait < 4000) return false;
  }
  let E;
  if (k === "garden" || k === "foot"){ const H = k === "foot" ? 60 : 100; E = sceneGarden(clamp(Math.round(H * cw / ch), 80, 520), H, k === "foot"); }
  else if (HOOP[k]) E = HOOP[k]();
  else E = (FIG[k] || FIG.estate)();
  const hoop = !!HOOP[k];
  if (S.scene) disposeScene(S);
  S.E = E; S.aspect = cw / ch;
  const scene = new THREE.Scene(); scene.environment = envTex;
  const grp = new THREE.Group(); scene.add(grp);
  scene.add(new THREE.HemisphereLight(0xfff6ea, 0xb5a48a, .55));
  const key = new THREE.DirectionalLight(0xfff0dc, 2.3); key.castShadow = true;
  const ext = Math.max(E.W, E.H) * .62;
  Object.assign(key.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: ext * 8 });
  const sm = hoop ? (MOBILE ? 512 : 1024) : (MOBILE ? 1024 : 2048); key.shadow.mapSize.set(sm, sm); key.shadow.bias = -.0004; key.shadow.normalBias = .02; key.shadow.radius = 3;
  scene.add(key); scene.add(key.target);
  const catcher = hoop ? new THREE.Mesh(new THREE.PlaneGeometry(E.W * 1.6, E.H * 1.6), fabricMat) : new THREE.Mesh(new THREE.PlaneGeometry(E.W * 1.6, E.H * 1.6), new THREE.ShadowMaterial({ opacity: k === "garden" ? TH.shadow * .7 : TH.shadow }));
  catcher.position.z = hoop ? -1.2 : -4 * E.u; catcher.receiveShadow = true; grp.add(catcher);
  if (hoop) catcher.userData.keepMat = true;
  // real 3D objects: a gold ring with a diamond
  const spin = [];
  const ring = (r, gem) => { const g = new THREE.Group(), band = new THREE.Mesh(new THREE.TorusGeometry(r, r * .12, 24, 72), goldMat); band.castShadow = true; g.add(band);
    if (gem){ const st = new THREE.Mesh(new THREE.OctahedronGeometry(r * .3, 0), gemMat); st.position.y = r * 1.22; st.scale.set(1, 1.15, 1);
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(r * .2, r * .1, r * .22, 12), goldMat); cup.position.y = r * 1.05; st.castShadow = cup.castShadow = true; g.add(st, cup); }
    return g; };
  for (const ex of E.extras) if (ex.kind === "ring" || ex.kind === "rings"){
    let g;
    if (ex.kind === "ring") g = ring(ex.r, true);
    else { g = new THREE.Group(); const a = ring(ex.r, true), b = ring(ex.r * .92, false); a.position.x = -ex.r * .45; b.position.x = ex.r * .45; b.rotation.y = Math.PI / 2; g.add(a, b); }
    g.position.set(ex.x - E.W / 2, E.H / 2 - ex.y, ex.z); g.scale.setScalar(.001); grp.add(g); spin.push({ g, sp: ex.spin, z: ex.z });
  }
  if (spin.length) S.update = (t) => { const P = S.revealT === null ? (REDUCED ? 9 : 0) : (t - S.revealT) / 2.8, k2 = smooth(clamp((P - .55) / .35, 0, 1));
    for (const s of spin){ s.g.rotation.y = t * s.sp; s.g.rotation.x = -.25 + Math.sin(t * .8) * .06; s.g.scale.setScalar(Math.max(.001, k2)); s.g.position.z = s.z + (1 - k2) * 12; } };
  // instanced meshes per stitch type
  const groups = {};
  for (const it of E.items) (groups[it.type] = groups[it.type] || []).push(it);
  S.meshes = [];
  for (const type in groups){
    const list = groups[type], mesh = new THREE.InstancedMesh(G[type], MAT[type], list.length);
    mesh.castShadow = true; mesh.receiveShadow = type === "thread" || type === "knot";
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false;
    list.forEach((it, i) => mesh.setColorAt(i, it.c));
    mesh.instanceColor.needsUpdate = true;
    grp.add(mesh);
    S.meshes.push({ mesh, list, type, sway: list.map((it, i) => it.sway || it.rise || it.fl ? i : -1).filter(i => i >= 0) });
  }
  S.glows = E.glows.map(([x, y, r]) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    sp.position.set(x - E.W / 2, E.H / 2 - y, 6 * E.u); sp.scale.setScalar(r * 2); sp.userData.r = r * 2; grp.add(sp); return sp; });
  const cam = new THREE.PerspectiveCamera(22, S.aspect, 1, 5000);
  const th = Math.tan(THREE.MathUtils.degToRad(11));
  cam.position.set(0, 0, Math.max(E.H / 2 / th, E.W / 2 / (th * S.aspect)) * (hoop ? .98 : 1.05));
  cam.lookAt(0, 0, 0);
  Object.assign(S, { scene, grp, key, cam, built: true, full: false, ext });
  pose(S, 0, true);
  return true;
}
/* ---------- the wishes envelope: embossed paper, liner, card, wax seal, a flap that really opens ---------- */
function canvasTex(w, h, draw, color){ const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); if (color) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function fibers(g, w, h, R){ g.fillStyle = "#808080"; g.fillRect(0, 0, w, h); for (let i = 0; i < w * h / 90; i++){ g.strokeStyle = R() < .5 ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.06)"; g.lineWidth = 1; const x = R() * w, y = R() * h, a = R() * 6.28, l = 3 + R() * 9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); } }
function sprig(g, x, y, s, rot, R){   // a raised flower spray for the emboss
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.strokeStyle = "#fff"; g.fillStyle = "#fff"; g.lineWidth = 4; g.lineCap = "round";
  g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(30, -40, 70, -50, 120, -46); g.stroke();
  for (let i = 0; i < 7; i++){ const t = .12 + i * .12, lx = 120 * t, ly = -46 * Math.sin(t * 2) - 6; g.save(); g.translate(lx, ly); g.rotate((i % 2 ? 1 : -1) * .9); g.beginPath(); g.ellipse(0, -12, 6, 14, 0, 0, 6.28); g.fill(); g.restore(); }
  for (const [fx, fy, fr] of [[124, -46, 22], [60, -58, 15], [30, -14, 12]]){
    for (let p = 0; p < 6; p++){ const a = p / 6 * 6.28 + R(); g.beginPath(); g.ellipse(fx + Math.cos(a) * fr * .55, fy + Math.sin(a) * fr * .55, fr * .5, fr * .32, a, 0, 6.28); g.fill(); }
    g.fillStyle = "#bdbdbd"; g.beginPath(); g.arc(fx, fy, fr * .22, 0, 6.28); g.fill(); g.fillStyle = "#fff";
  }
  g.restore();
}
function buildEnvelope(S, cw, ch){
  if (S.scene) disposeScene(S);
  const env = S.el, ew = env.clientWidth, eh = env.clientHeight, k = 150 / ew, R = rng(91);
  const EW = 150, EH = 100;
  const scene = new THREE.Scene(); scene.environment = envTex;
  scene.add(new THREE.HemisphereLight(0xfff6ea, 0xb5a48a, .6));
  const key = new THREE.DirectionalLight(0xfff0dc, 2.1); key.castShadow = true;
  Object.assign(key.shadow.camera, { left: -130, right: 130, top: 130, bottom: -130, near: 1, far: 900 });
  key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0005; key.shadow.normalBias = .02;
  scene.add(key, key.target);
  const grp = new THREE.Group(); scene.add(grp);
  const offY = (ch / 2 - (110 + eh / 2)) * k;
  grp.position.y = offY;
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.ShadowMaterial({ opacity: .18 })); catcher.position.z = -6; catcher.receiveShadow = true; grp.add(catcher);

  const paperBump = (florals) => { const t = canvasTex(768, 512, (g, w, h) => { fibers(g, w, h, R); if (florals){ g.filter = "blur(3px)"; florals(g, w, h); g.filter = "none"; } }); t.repeat.set(1 / EW, 1 / EH); t.offset.set(.5, .5); return t; };
  const paper = (bump, color = TH.paper) => new THREE.MeshPhysicalMaterial({ color, roughness: .8, sheen: .6, sheenColor: new THREE.Color(0xffffff), sheenRoughness: .6, bumpMap: bump, bumpScale: 4, envMapIntensity: .7 });
  const bevel = { bevelEnabled: true, bevelThickness: .22, bevelSize: .35, bevelSegments: 2, curveSegments: 18 };

  // back + liner with a tiny gold lattice
  const back = new THREE.Mesh(new THREE.BoxGeometry(EW, EH, .8), paper(paperBump()));
  back.castShadow = back.receiveShadow = true; grp.add(back);
  const linerMap = canvasTex(512, 344, (g, w, h) => { g.fillStyle = TH.liner; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(184,137,63,.55)"; g.lineWidth = 1.4;
    for (let i = -h; i < w; i += 22){ g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); g.beginPath(); g.moveTo(i + h, 0); g.lineTo(i, h); g.stroke(); }
    g.fillStyle = "rgba(200,160,90,.8)"; for (let x = 0; x < w; x += 22) for (let y = 0; y < h; y += 22){ g.beginPath(); g.arc(x + 11, y + 11, 1.6, 0, 6.28); g.fill(); } }, true);
  const liner = new THREE.Mesh(new THREE.PlaneGeometry(EW - 6, EH - 6), new THREE.MeshPhysicalMaterial({ map: linerMap, roughness: .55, metalness: .15, sheen: .3 }));
  liner.position.z = .42; liner.receiveShadow = true; grp.add(liner);

  // the card that slides out
  const cardMap = canvasTex(1024, 672, (g, w, h) => {}, true);
  const drawCard = () => { const c = cardMap.image, g = c.getContext("2d"), w = c.width, h = c.height;
    g.fillStyle = "#fbf7ef"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "#c9a45c"; g.lineWidth = 3; g.strokeRect(26, 26, w - 52, h - 52); g.lineWidth = 1.2; g.strokeRect(40, 40, w - 80, h - 80);
    g.fillStyle = TH.ink; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = '400 150px "Pinyon Script", cursive'; g.fillText("Wishes", w / 2, h * .36);
    g.fillStyle = "#b8893f"; g.save(); g.translate(w / 2, h * .66); g.scale(2.2, 2.2); g.beginPath(); g.moveTo(0, 12); g.bezierCurveTo(-24, -4, -14, -22, 0, -10); g.bezierCurveTo(14, -22, 24, -4, 0, 12); g.fill(); g.restore();
    cardMap.needsUpdate = true; };
  drawCard(); if (document.fonts) document.fonts.load('150px "Pinyon Script"').then(drawCard).catch(() => {});
  const edge = new THREE.MeshPhysicalMaterial({ color: 0xf7f1e4, roughness: .7 });
  const card = new THREE.Mesh(new THREE.BoxGeometry(EW - 16, EH - 12, .45), [edge, edge, edge, edge, new THREE.MeshPhysicalMaterial({ map: cardMap, roughness: .62, sheen: .4, sheenColor: new THREE.Color(0xffffff) }), edge]);
  card.position.set(0, -2, 1.05); card.castShadow = card.receiveShadow = true; grp.add(card);

  // front pocket with embossed flower sprays in the corners
  const fs = new THREE.Shape(); fs.moveTo(-EW / 2, -EH / 2); fs.lineTo(EW / 2, -EH / 2); fs.lineTo(EW / 2, EH / 2 - 3); fs.lineTo(7, -3); fs.quadraticCurveTo(0, -8, -7, -3); fs.lineTo(-EW / 2, EH / 2 - 3); fs.closePath();
  const frontBump = paperBump((g, w, h) => { sprig(g, 40, h - 40, 1.25, -.25, R); g.save(); g.translate(w, 0); g.scale(-1, 1); sprig(g, 40, h - 40, 1.25, -.25, R); g.restore(); sprig(g, w / 2 - 60, h - 30, .8, -.05, R); });
  const front = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: .4, ...bevel }), paper(frontBump, TH.paperFront || 0xf7ebd4));
  front.position.z = 1.45; front.castShadow = front.receiveShadow = true; grp.add(front);

  // flap on a hinge + wax seal with the monogram
  const hs = new THREE.Shape(); hs.moveTo(-EW / 2, 0); hs.lineTo(EW / 2, 0); hs.lineTo(7, -55); hs.quadraticCurveTo(0, -60, -7, -55); hs.closePath();
  const flapBump = canvasTex(768, 512, (g, w, h) => { fibers(g, w, h, R); g.filter = "blur(3px)"; sprig(g, w / 2 - 70, h * .62, .9, -.1, R); g.filter = "none"; });
  flapBump.repeat.set(1 / EW, 1 / EH); flapBump.offset.set(.5, 1);
  const flap = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: .3, ...bevel }), paper(flapBump, TH.paperFlap || 0xf8eed9));
  flap.castShadow = flap.receiveShadow = true;
  const hinge = new THREE.Group(); hinge.position.set(0, EH / 2, 2.35); hinge.add(flap); grp.add(hinge);
  const mono = (document.querySelector("#g-tie b") || {}).textContent || "N&D";
  const sealBump = canvasTex(256, 256, (g, w, h) => { g.fillStyle = "#808080"; g.fillRect(0, 0, w, h); g.filter = "blur(2px)"; g.strokeStyle = "#fff"; g.lineWidth = 6; g.beginPath(); g.arc(w / 2, h / 2, w * .36, 0, 6.28); g.stroke(); g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = '400 84px "Pinyon Script", cursive'; g.fillText(mono, w / 2, h / 2 + 6); g.filter = "none"; });
  const sealGeo = new THREE.CylinderGeometry(12, 12.6, 2.6, 56, 1); sealGeo.rotateX(Math.PI / 2);
  { const p = sealGeo.attributes.position; for (let i = 0; i < p.count; i++){ const x = p.getX(i), y = p.getY(i), r = Math.hypot(x, y); if (r > 9){ const a = Math.atan2(y, x), f = 1 + Math.sin(a * 7 + 1.3) * .04 + Math.sin(a * 13) * .025; p.setXY(i, x * f, y * f); } } sealGeo.computeVertexNormals(); }
  const seal = new THREE.Mesh(sealGeo, new THREE.MeshPhysicalMaterial({ color: TH.seal, roughness: .32, clearcoat: .7, clearcoatRoughness: .25, bumpMap: sealBump, bumpScale: 6, envMapIntensity: 1 }));
  seal.position.set(0, -51, 1.7); seal.castShadow = true; hinge.add(seal);
  const pearlM = MAT.pearl.clone(); pearlM.color = new THREE.Color(0xf7efe2);
  for (const [x, y, r] of [[-15, -47, 2.2], [15, -47, 2.2], [-11, -58, 1.6], [11, -58, 1.6]]){ const p = new THREE.Mesh(G.pearl, pearlM); p.scale.setScalar(r); p.position.set(x, y, 1.3); p.castShadow = true; hinge.add(p); }

  const cam = new THREE.PerspectiveCamera(22, cw / ch, 1, 5000);
  cam.position.set(0, 0, (ch * k / 2) / Math.tan(THREE.MathUtils.degToRad(11)));
  cam.lookAt(0, 0, 0);
  let po = 0;
  S.update = (t, dt) => {
    po += ((env.classList.contains("open") ? 1 : 0) - po) * Math.min(1, dt * (REDUCED ? 60 : 2.4));
    const fa = smooth(clamp(po * 1.7, 0, 1)) * Math.PI * 1.04;
    hinge.rotation.x = -fa; hinge.position.z = fa > Math.PI / 2 ? .35 : 2.35;
    const cp = smooth(clamp((po - .4) / .6, 0, 1));
    card.position.y = -2 + 47 * cp; card.position.z = 1.05 + cp * .3; card.rotation.z = Math.sin(cp * Math.PI) * .04;
  };
  Object.assign(S, { E: { W: EW, H: EH, items: [] }, scene, grp, key, cam, meshes: [], glows: [], built: true, full: true, ext: 110, aspect: cw / ch, envGroupY: offY });
  return true;
}

function disposeScene(S){
  S.meshes.forEach(m => m.mesh.dispose()); S.glows.forEach(g => g.material.dispose());
  S.scene.traverse(o => { if (o.isMesh && o.geometry && o.geometry.type === "PlaneGeometry"){ o.geometry.dispose(); if (!o.userData.keepMat) o.material.dispose(); } });
  S.key.shadow.map && S.key.shadow.map.dispose();
}

/* place every stitch: sewing-in progress, sway in the breeze, sequin flip waves */
function pose(S, t, all){
  const P = S.revealT === null ? (REDUCED ? 99 : 0) : (t - S.revealT) / 2.8;
  const revealing = P < 1.25, taps = S.taps.filter(a => t - a.t < 2.2); S.taps = taps;
  if (!all && !revealing && !taps.length && S.full) { // only swaying stitches move
    for (const m of S.meshes){ if (!m.sway.length) continue; for (const i of m.sway) set(m, i, m.list[i], t, 1, taps); m.mesh.instanceMatrix.needsUpdate = true; }
    return;
  }
  for (const m of S.meshes){
    for (let i = 0; i < m.list.length; i++){
      const it = m.list[i], s = REDUCED ? 1 : smooth(clamp((P - it.ord * .78) / .22, 0, 1));
      set(m, i, it, t, s, taps);
    }
    m.mesh.instanceMatrix.needsUpdate = true;
  }
  if (!revealing) S.full = true;
}
function set(m, i, it, t, s, taps){
  let sx = REDUCED ? 0 : Math.sin(t * 1.3 + it.ph * .3 + it.y * .03) * it.sway * .9, rx = it.rx, rz = it.rz;
  if (m.type === "seq" && taps.length) for (const a of taps){ const d = Math.hypot(it.x - a.x, it.y - a.y), w = clamp(1 - Math.abs((t - a.t) * 70 - d) / 14, 0, 1); rx += smooth(w) * Math.PI * 2 * a.dir; }
  let dy = 0, kk = 1;
  if (it.rise && !REDUCED){ const f = ((t * it.rs + it.ph) % 1 + 1) % 1; dy = f * it.rise; kk = Math.sin(Math.PI * f); rz += f * 3 * Math.sign(it.rise); sx += Math.sin(t * 2 + it.ph) * Math.abs(it.rise) * .04; }
  if (it.fl && !REDUCED) kk *= 1 + Math.sin(t * 11 + it.ph * 5) * it.fl;
  vp.set(it.x + sx, it.y + dy, it.z + (1 - s) * 9);
  eu.set(rx + (1 - s) * 1.2, it.ry, rz + sx * .02);
  qq.setFromEuler(eu);
  const k = (s < 1 ? s * (1 + Math.sin(s * Math.PI) * .25) : 1) * kk;
  vs.set(it.s[0] * k, it.s[1] * k, it.s[2] * k);
  m4.compose(vp, qq, vs); m.mesh.setMatrixAt(i, m4);
}

/* ---------- interaction: light follows finger / mouse / phone tilt ---------- */
const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener("pointermove", e => { ptr.tx = (e.clientX / innerWidth - .5) * 2; ptr.ty = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
addEventListener("deviceorientation", e => { if (e.gamma != null){ ptr.tx = clamp(e.gamma / 25, -1, 1); ptr.ty = clamp((e.beta - 45) / 25, -1, 1); } }, { passive: true });

/* ---------- loop ---------- */
let DPR = Math.min(devicePixelRatio || 1, MOBILE ? 1.75 : 2), bw = 0, bh = 0, last = performance.now(), slow = 0, frames = 0;
const io = new IntersectionObserver(es => es.forEach(e => { const S = scenes.find(s => s.cv === e.target); if (S) S.vis = e.isIntersecting; }), { rootMargin: "80px 0px" });
const revealIO = new IntersectionObserver(es => es.forEach(e => { const S = scenes.find(s => s.cv === e.target); if (S && e.isIntersecting) S.want = true; }), { threshold: .25 });

for (const T of TARGETS){
  const S = makeScene(T); if (!S) continue;
  io.observe(S.cv); revealIO.observe(S.cv);
  S.cv.addEventListener("pointerdown", e => {
    if (!S.built) return;
    const r = S.cv.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width * 2 - 1, ny = -((e.clientY - r.top) / r.height * 2 - 1);
    const ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(nx, ny), S.cam);
    const p = new THREE.Vector3(); ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), p);
    S.taps.push({ x: p.x, y: p.y, t: S.now || 0, dir: Math.random() < .5 ? 1 : -1 }); S.full = false;
  });
}
if (!scenes.length) return;
root.classList.add("emb-3d");

/* build every scene ahead of time (nearest first, one per idle moment) and compile its shaders,
   so nothing heavy ever happens in the middle of a scroll */
const embStats = window.__emb = { builds: [] };
const idle = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 500 }) : f => setTimeout(f, 50);
function prebuild(){
  if (root.classList.contains("gated")){ setTimeout(prebuild, 500); return; }
  const now = performance.now(), vh = innerHeight;
  let best = null, bd = Infinity;
  for (const S of scenes){
    if (S.built || !S.cv.isConnected || S.cv.clientWidth < 20 || (S.retry && S.retry > now)) continue;
    const r = S.cv.getBoundingClientRect(), d = r.top > vh ? r.top - vh : r.bottom < 0 ? -r.bottom : 0;
    if (d < bd){ bd = d; best = S; }
  }
  if (!best){ if (scenes.some(S => !S.built)) setTimeout(prebuild, 400); return; }
  const t0 = performance.now();
  if (build(best)){ try { renderer.compile(best.scene, best.cam); } catch (_) {} }
  else best.retry = performance.now() + 300;          // e.g. the monogram font is still loading
  embStats.builds.push([best.T.kind, Math.round(performance.now() - t0)]);
  idle(prebuild);
}
let started = false;
const kick = () => { if (started || root.classList.contains("gated")) return; started = true; setTimeout(prebuild, 2600); };
new MutationObserver(kick).observe(root, { attributes: true, attributeFilter: ["class"] }); kick();

let t = 0, rt;
addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => scenes.forEach(S => { if (S.built && Math.abs(S.cv.clientWidth / Math.max(1, S.cv.clientHeight) - S.aspect) > .04) { S.built = false; S.full = false; } }), 250); });

function frame(now){
  requestAnimationFrame(frame);
  const dt = clamp((now - last) / 1000, 0, .1); last = now; t += dt;
  if (root.classList.contains("gated") || document.hidden) return;
  ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt * 3); ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt * 3);
  let drew = false;
  for (let i = scenes.length - 1; i >= 0; i--){
    const S = scenes[i];
    if (!S.cv.isConnected || S.el.classList.contains("has-photo") || (S.T.hoop && realPhoto(S.el))){ if (S.built) disposeScene(S); S.cv.remove(); S.el.classList.remove("emb-on"); scenes.splice(i, 1); continue; }   // a real photo replaced it
    if (!S.vis) continue;
    const w = Math.round(S.cv.clientWidth * DPR), h = Math.round(S.cv.clientHeight * DPR);
    if (w < 8 || h < 8) continue;
    if (!S.built && !build(S)) continue;
    if (S.cv.width !== w || S.cv.height !== h){ S.cv.width = w; S.cv.height = h; }
    if (S.want && S.revealT === null) S.revealT = t;
    S.now = t;
    pose(S, t, false); if (S.update) S.update(t, dt);
    // light drifts slowly and follows the pointer, so sequins glint
    const E = S.E, ex = S.ext;
    S.key.position.set((-.55 + ptr.x * .6 + Math.sin(t * .35) * .15) * ex * 1.6, (.75 - ptr.y * .45 + Math.cos(t * .27) * .1) * ex * 1.6, ex * 2.2);
    S.grp.rotation.set(-ptr.y * .07 - .03, ptr.x * .09, 0);
    for (const g of S.glows){ const f = 1 + Math.sin(t * 9 + g.position.x) * .06 + Math.sin(t * 13.3 + g.position.y) * .05; g.scale.setScalar(g.userData.r * f); }
    if (w > bw || h > bh){ bw = Math.max(bw, w); bh = Math.max(bh, h); renderer.setSize(bw, bh, false); }
    renderer.setViewport(0, 0, w, h); renderer.setScissor(0, 0, w, h); renderer.setScissorTest(true);
    renderer.render(S.scene, S.cam);
    S.ctx.clearRect(0, 0, w, h);
    S.ctx.drawImage(renderer.domElement, 0, bh - h, w, h, 0, 0, w, h);
    if (!S.shown){ S.shown = true; S.el.classList.add("emb-on"); }
    drew = true;
  }
  // weak phone? lower the resolution instead of stuttering
  const work = performance.now() - now;      // time this frame really took (stays ~0 in frame-by-frame video capture)
  if (drew && ++frames > 40){ if (dt > .05 || work > 14) slow++; else slow = Math.max(0, slow - 1);
    if (slow > 18){ slow = 0;
      if (DPR > 1) DPR = Math.max(1, DPR - .35);
      else if (renderer.shadowMap.enabled){ renderer.shadowMap.enabled = false; scenes.forEach(S => S.scene && S.scene.traverse(o => { if (o.material) o.material.needsUpdate = true; })); }
      scenes.forEach(S => S.full = false); } }
}
requestAnimationFrame(frame);
})();
