/* ამბავი · „მარგალიტის ფარდა“ — 3D სცენა (WebGL / Three.js)
   ყოველი მარგალიტი, მძივი და ბროლი ცალკე 3D ობიექტია. ფარდის ძაფებს ფიზიკა ამოძრავებს
   (Verlet), ჭაღი ნამდვილი 3D-ა ოქროთი და ბროლით, სინათლეს Bloom ეფექტი აქვს.
   თუ ბრაუზერს WebGL არ აქვს, გვერდი ავტომატურად 2D ფარდას აჩვენებს (theme.js). */
/* ჩვეულებრივი სკრიპტი (არა module), რომ გვერდი ფაილზე ორჯერ დაჭერითაც (file://) მუშაობდეს */
(async () => {
const CDN = "https://cdn.jsdelivr.net/npm/three@0.160.0/";
let THREE, RoomEnvironment, EffectComposer, RenderPass, UnrealBloomPass, OutputPass;
try {
  THREE = await import(CDN + "build/three.module.js");
  [{ RoomEnvironment }, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
    "environments/RoomEnvironment.js", "postprocessing/EffectComposer.js", "postprocessing/RenderPass.js",
    "postprocessing/UnrealBloomPass.js", "postprocessing/OutputPass.js"].map(p => import(CDN + "examples/jsm/" + p)));
} catch (e) { console.warn("3D stage: Three.js not loaded (offline?)", e); return; }

const stage = document.querySelector(".stage"), gate = document.getElementById("gate"), root = document.documentElement;
const MOBILE = matchMedia("(pointer: coarse)").matches || innerWidth < 700;
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const PREVIEW = new URLSearchParams(location.search).has("preview");
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TH = Object.assign({ linen: "#EFE5D2", linenInk: "#7A6646", back: "#E3D6BE", pearl: "#E9DCC4", pearlSheen: "#ffe8cf", bugle: "#CDB68E", gold: "#D9B36C", ground: "#a8977a", warm: "#ffd29a", exposure: .82 }, (window.CONFIG || {}).theme3d || {});
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function webgl(){ try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch(_) { return false; } }

function canvasTex(size, draw){ const c = document.createElement("canvas"); c.width = c.height = size; draw(c.getContext("2d"), size); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const linen = () => { const t = canvasTex(512, (g, s) => {
  g.fillStyle = TH.linen; g.fillRect(0, 0, s, s);
  const d = g.getImageData(0, 0, s, s), a = d.data;
  for (let i = 0; i < a.length; i += 4){ const n = (Math.random() - .5) * 18; a[i] += n; a[i + 1] += n; a[i + 2] += n * .9; }
  g.putImageData(d, 0, 0);
  g.globalAlpha = .06; g.strokeStyle = TH.linenInk;
  for (let i = 0; i < s; i += 3){ g.beginPath(); g.moveTo(0, i); g.lineTo(s, i); g.stroke(); g.beginPath(); g.moveTo(i, 0); g.lineTo(i, s); g.stroke(); }
}); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 4); return t; };
const glowTex = () => canvasTex(128, (g, s) => { const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.25, "rgba(255,228,170,.85)"); gr.addColorStop(1, "rgba(255,210,140,0)"); g.fillStyle = gr; g.fillRect(0, 0, s, s); });

function init(){
  const cv = document.createElement("canvas"); cv.className = "stage3d"; cv.setAttribute("aria-hidden", "true"); stage.prepend(cv);
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: !MOBILE, powerPreference: "high-performance" });
  let DPR = Math.min(MOBILE ? 1.6 : 2, devicePixelRatio || 1);
  renderer.setPixelRatio(DPR);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = TH.exposure;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  root.classList.add("three");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 60);
  const CAMZ = 6; camera.position.set(0, 0, CAMZ);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;

  /* ---------- size ---------- */
  let W = 1, H = 1, vw = 1, vh = 1;
  function measure(){
    W = stage.clientWidth; H = stage.clientHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    vh = 2 * CAMZ * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)); vw = vh * camera.aspect;
  }
  measure();

  /* ---------- backdrop, lights ---------- */
  const back = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ map: linen(), color: TH.back, roughness: .96 }));
  back.position.z = -1.4; back.receiveShadow = true; scene.add(back);
  scene.add(new THREE.HemisphereLight(0xfff3e0, TH.ground, .55));
  const key = new THREE.DirectionalLight(0xffe9cc, 1.45);
  key.position.set(.9, 3.2, 5); key.castShadow = true;
  key.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048); key.shadow.radius = 5; key.shadow.bias = -.0004;
  scene.add(key, key.target);
  const warm = new THREE.PointLight(TH.warm, 0, 6, 1.7); scene.add(warm);

  /* ---------- materials ---------- */
  const matPearl = new THREE.MeshPhysicalMaterial({ color: TH.pearl, roughness: .3, metalness: 0, clearcoat: 1, clearcoatRoughness: .15, sheen: 1, sheenColor: new THREE.Color(TH.pearlSheen), sheenRoughness: .4, iridescence: .35, iridescenceIOR: 1.3, envMapIntensity: 1.2 });
  const matBugle = new THREE.MeshStandardMaterial({ color: TH.bugle, metalness: .7, roughness: .28, envMapIntensity: 1.4 });
  const matCrys = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: .03, clearcoat: 1, ior: 1.6, envMapIntensity: 2.6, transmission: MOBILE ? 0 : .35, thickness: .1 });
  const matGold = new THREE.MeshStandardMaterial({ color: TH.gold, metalness: 1, roughness: .22, envMapIntensity: 1.3 });
  const geoPearl = new THREE.SphereGeometry(1, MOBILE ? 10 : 14, MOBILE ? 8 : 10);
  const geoBugle = new THREE.CylinderGeometry(1, 1, 1, 8, 1);
  const geoCrys = new THREE.OctahedronGeometry(1, 0);

  /* ---------- the curtain: strands of beads on verlet chains ---------- */
  const M = 22;                      // nodes per strand
  let strands = [], beads = [], meshes = {}, valanceCount = 0, built = false;
  const dummy = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3(), q = new THREE.Quaternion();

  function buildCurtain(){
    Object.values(meshes).forEach(m => { scene.remove(m); m.dispose(); });
    strands = []; beads = [];
    const n = MOBILE ? 66 : Math.round(clamp(vw / .045, 90, 170));
    const span = vw + .16, s = span / n, r = s * .47, pitch = s * .98;
    const top = vh / 2 + .02, len = vh + .3, nb = Math.floor(len / pitch);
    const counts = { pearl: 0, bugle: 0, crys: 0 };
    const half = n / 2, G = .27;
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n; i++){
      const left = i < half, k = left ? i : n - 1 - i;          // k = 0 at the outer edge
      const closedX = -span / 2 + (i + .5 + layer * .5) * s;
      const gx = (left ? -1 : 1) * (span / 2 - (k + .5) * s * G);
      const inner = 1 - k / (half - 1);                           // 1 at the centre seam
      const st = { closedX, gx: gx + layer * s * G * .5, x: closedX, z: .22 - layer * .07 + Math.sin(i * 2.3) * .015, fold: Math.sin(k * 1.9) * .07, delay: (1 - inner) * .38, top, len,
        p: new Float32Array(M * 2), o: new Float32Array(M * 2), rest: len / (M - 1), seed: Math.random() * 10 };
      for (let j = 0; j < M; j++){ st.p[j * 2] = st.o[j * 2] = closedX; st.p[j * 2 + 1] = st.o[j * 2 + 1] = top - j * st.rest; }
      strands.push(st);
      for (let j = 0; j < nb; j++){
        const t = (j + i * 3) % 7, type = (t === 0 || t === 3) ? "pearl" : t === 5 ? "crys" : "bugle";
        beads.push({ s: strands.length - 1, u: (j + .5 + layer * .5) * pitch / len, type, idx: counts[type]++, r });
      }
    }
    /* draped valance across the top (static) */
    const swN = MOBILE ? 3 : Math.max(4, Math.round(vw / 1.3)), sw = span / swN, sag = Math.min(.32, vh * .08), rv = r * .82;
    const val = [];
    for (let x = -span / 2; x <= span / 2; x += rv * 2.1) val.push([x, top - rv, .42, rv]);
    for (let w = 0; w < swN; w++){
      const x0 = -span / 2 + w * sw;
      for (let row = 0; row < 6; row++){
        const steps = Math.ceil(sw / (rv * 2.05));
        for (let i = 0; i <= steps; i++){ const t = i / steps; val.push([x0 + t * sw, top - .1 - row * rv * 2.05 - sag * Math.sin(Math.PI * t), .42 + row * .004, rv * (row % 3 === 1 ? .8 : 1)]); }
      }
      for (let x = x0 + s; x < x0 + sw; x += s * 1.2){
        const t = (x - x0) / sw, y0 = top - .1 - 6 * rv * 2.05 - sag * Math.sin(Math.PI * t), L = .07 + .17 * Math.sin(Math.PI * t);
        for (let y = 0; y < L; y += pitch) val.push([x, y0 - y, .41, r * .9]);
      }
      val.push([x0, top - .08, .45, rv * 2.2]);
    }
    valanceCount = val.length;
    meshes.pearl = new THREE.InstancedMesh(geoPearl, matPearl, counts.pearl + valanceCount);
    meshes.bugle = new THREE.InstancedMesh(geoBugle, matBugle, counts.bugle);
    meshes.crys = new THREE.InstancedMesh(geoCrys, matCrys, counts.crys);
    Object.values(meshes).forEach(m => { m.castShadow = true; m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); });
    val.forEach(([x, y, z, rr], i) => { dummy.position.set(x, y, z); dummy.quaternion.identity(); dummy.scale.setScalar(rr); dummy.updateMatrix(); meshes.pearl.setMatrixAt(counts.pearl + i, dummy.matrix); });
    meshes.pearl.instanceMatrix.needsUpdate = true;
    built = true;
  }

  /* ---------- chandelier ---------- */
  const chand = new THREE.Group(); scene.add(chand);
  const flames = [];
  (function buildChandelier(){
    const glow = glowTex();
    for (let i = 0; i < 9; i++){ const l = new THREE.Mesh(new THREE.TorusGeometry(.028, .007, 6, 14), matGold); l.position.y = .62 + i * .045; l.rotation.y = i % 2 ? Math.PI / 2 : 0; chand.add(l); }
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .95, 10), matGold); stem.position.y = .12; chand.add(stem);
    [[.58, .045], [.3, .035], [-.02, .05], [-.3, .03]].forEach(([y, rr]) => { const b = new THREE.Mesh(new THREE.SphereGeometry(rr, 16, 12), matGold); b.position.y = y; chand.add(b); });
    const crown = new THREE.Mesh(new THREE.TorusGeometry(.13, .012, 8, 40), matGold); crown.rotation.x = Math.PI / 2; crown.position.y = .55; chand.add(crown);
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(.44, .016, 10, 80), matGold); ring1.rotation.x = Math.PI / 2; ring1.position.y = .08; chand.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(.27, .012, 10, 60), matGold); ring2.rotation.x = Math.PI / 2; ring2.position.y = -.2; chand.add(ring2);
    const ARMS = 6, cp = [];
    for (let a = 0; a < ARMS; a++){
      const ang = a / ARMS * Math.PI * 2, cx = Math.cos(ang), cz = Math.sin(ang);
      const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, .5, 0), new THREE.Vector3(cx * .18, .42, cz * .18), new THREE.Vector3(cx * .4, .2, cz * .4), new THREE.Vector3(cx * .44, .1, cz * .44)]);
      chand.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, .011, 6), matGold));
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(.04, .025, .03, 14), matGold); cup.position.set(cx * .44, .11, cz * .44); chand.add(cup);
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .13, 12), new THREE.MeshStandardMaterial({ color: 0xFFF9EE, roughness: .6, emissive: 0x3a2a10, emissiveIntensity: .3 }));
      candle.position.set(cx * .44, .19, cz * .44); chand.add(candle);
      const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xffd38a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
      fl.position.set(cx * .44, .29, cz * .44); fl.scale.set(.09, .14, 1); chand.add(fl); flames.push(fl);
      cp.push([cx * .44, cz * .44, ang]);
    }
    /* crystals: swags between candles, hanging drops, centre pendant */
    const list = [];
    for (let a = 0; a < ARMS; a++){
      const a0 = cp[a][2], a1 = a0 + Math.PI * 2 / ARMS;
      for (let i = 1; i < 12; i++){ const t = i / 12, an = a0 + (a1 - a0) * t; list.push([Math.cos(an) * .44, .06 - Math.sin(Math.PI * t) * .1, Math.sin(an) * .44, .012]); }
    }
    for (let d = 0; d < 18; d++){ const an = d / 18 * Math.PI * 2, L = 5 + (d % 3) * 2; for (let i = 0; i < L; i++) list.push([Math.cos(an) * .42, .04 - i * .034, Math.sin(an) * .42, i === L - 1 ? .022 : .011]); }
    for (let d = 0; d < 12; d++){ const an = d / 12 * Math.PI * 2 + .2, L = 5 + (d % 2) * 3; for (let i = 0; i < L; i++) list.push([Math.cos(an) * .25, -.23 - i * .034, Math.sin(an) * .25, i === L - 1 ? .02 : .01]); }
    for (let i = 0; i < 10; i++) list.push([0, -.36 - i * .035, 0, .012]);
    list.push([0, -.78, 0, .045]);
    const cr = new THREE.InstancedMesh(geoCrys, matCrys, list.length);
    list.forEach(([x, y, z, rr], i) => { dummy.position.set(x, y, z); dummy.rotation.set(0, i * .7, 0); dummy.scale.set(rr, rr * 1.5, rr); dummy.updateMatrix(); cr.setMatrixAt(i, dummy.matrix); });
    cr.castShadow = true; chand.add(cr);
    chand.traverse(o => { if (o.isMesh) o.castShadow = true; });
  })();
  const htmlChand = document.getElementById("chandelier");
  function placeChandelier(){
    const sr = stage.getBoundingClientRect(), r = htmlChand.getBoundingClientRect();
    const cy = (r.top - sr.top + r.height * .42) / H, sc = (r.height / H) * vh / 1.75;
    chand.scale.setScalar(sc); chand.position.set(0, (.5 - cy) * vh * 1.08, -.45);
    warm.position.set(0, chand.position.y, .4);
  }

  /* ---------- floating dust in the warm light ---------- */
  const dustN = MOBILE ? 90 : 180, dg = new THREE.BufferGeometry(), dp = new Float32Array(dustN * 3), dv = [];
  for (let i = 0; i < dustN; i++){ dp[i * 3] = (Math.random() - .5) * 3; dp[i * 3 + 1] = (Math.random() - .5) * 3; dp[i * 3 + 2] = Math.random() * 1.2 - .3; dv.push(Math.random() * .04 + .01); }
  dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ map: glowTex(), size: .045, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffe7b8, toneMapped: false }));
  scene.add(dust);

  /* ---------- post-processing ---------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), .4, .55, .9);
  composer.addPass(bloom); composer.addPass(new OutputPass());
  let useBloom = true;

  function resize(){
    measure();
    renderer.setSize(W, H, false); composer.setPixelRatio(DPR); composer.setSize(W, H);
    back.scale.set(vw * 1.6, vh * 1.6, 1);
    const sc = key.shadow.camera; sc.left = -vw / 2 - 1; sc.right = vw / 2 + 1; sc.top = vh / 2 + 1; sc.bottom = -vh / 2 - 1; sc.updateProjectionMatrix();
    buildCurtain(); placeChandelier();
    if (opened || openT !== null) strands.forEach(s => { s.x = s.gx; for (let j = 0; j < M; j++){ s.p[j * 2] = s.o[j * 2] = s.gx; } });
  }

  /* ---------- opening ---------- */
  let openT = null, opened = false, t = 0, light = 0;
  const startOpen = () => { if (openT === null) openT = t; };
  if (!gate || gate.hidden || new URLSearchParams(location.search).has("open")) { opened = true; openT = -10; }
  if (gate) new MutationObserver(() => { if (gate.classList.contains("go")) startOpen(); }).observe(gate, { attributes: true, attributeFilter: ["class"] });

  /* ---------- touch / pointer pushes the strands ---------- */
  const ptr = { x: 9, y: 9, on: false };
  addEventListener("pointermove", e => {
    const sr = stage.getBoundingClientRect();
    if (e.clientY < sr.top || e.clientY > sr.bottom){ ptr.on = false; return; }
    ptr.x = ((e.clientX - sr.left) / W - .5) * vw; ptr.y = (.5 - (e.clientY - sr.top) / H) * vh; ptr.on = true;
  }, { passive: true });
  addEventListener("pointerleave", () => { ptr.on = false; });
  let tiltX = 0, tiltY = 0;
  addEventListener("deviceorientation", e => { if (e.gamma != null){ tiltX = clamp(e.gamma / 30, -1, 1); tiltY = clamp((e.beta - 45) / 30, -1, 1); } }, { passive: true });

  /* ---------- simulation ---------- */
  function step(dt){
    const p = openT === null ? 0 : (t - openT);
    const g = -7 * dt * dt, damp = .982;
    for (let i = 0; i < strands.length; i++){
      const s = strands[i];
      const local = clamp((p - s.delay) / 2.1, 0, 1), e = ease(local);
      s.x = s.closedX + (s.gx - s.closedX) * e;
      s.prog = e;
      const wind = (Math.sin(t * .7 + s.seed) * .5 + Math.sin(t * 1.9 + s.seed * 2) * .25) * .012 * dt * dt * 60;
      for (let j = 1; j < M; j++){
        const ix = j * 2, iy = ix + 1, px = s.p[ix], py = s.p[iy];
        let vx = (px - s.o[ix]) * damp, vy = (py - s.o[iy]) * damp;
        s.o[ix] = px; s.o[iy] = py;
        let fx = wind * (j / M);
        if (ptr.on){ const dx = px - ptr.x, dy = py - ptr.y, d2 = dx * dx + dy * dy; if (d2 < .09){ fx += dx / (Math.sqrt(d2) + .02) * .0016 * (1 - d2 / .09); } }
        s.p[ix] = px + vx + fx; s.p[iy] = py + vy + g;
      }
      s.p[0] = s.x; s.p[1] = s.top;
      for (let it = 0; it < 5; it++){
        for (let j = 0; j < M - 1; j++){
          const a = j * 2, b = a + 2, dx = s.p[b] - s.p[a], dy = s.p[b + 1] - s.p[a + 1], d = Math.sqrt(dx * dx + dy * dy) || 1e-6, diff = (d - s.rest) / d * .5;
          if (j === 0){ s.p[b] -= dx * diff * 2; s.p[b + 1] -= dy * diff * 2; }
          else { s.p[a] += dx * diff; s.p[a + 1] += dy * diff; s.p[b] -= dx * diff; s.p[b + 1] -= dy * diff; }
        }
        s.p[0] = s.x; s.p[1] = s.top;
      }
      // follow-the-leader pass: every link is exactly `rest`, so the chain can never stretch or explode
      for (let j = 1; j < M; j++){
        const a = (j - 1) * 2, b = j * 2, dx = s.p[b] - s.p[a], dy = s.p[b + 1] - s.p[a + 1], d = Math.sqrt(dx * dx + dy * dy);
        if (!(d > 1e-6)){ s.p[b] = s.o[b] = s.p[a]; s.p[b + 1] = s.o[b + 1] = s.p[a + 1] - s.rest; continue; }
        const k = s.rest / d, nx = s.p[a] + dx * k, ny = s.p[a + 1] + dy * k;
        s.o[b] += (nx - s.p[b]) * .9; s.o[b + 1] += (ny - s.p[b + 1]) * .9;
        s.p[b] = nx; s.p[b + 1] = ny;
      }
    }
  }
  function updateBeads(){
    for (let b = 0; b < beads.length; b++){
      const bd = beads[b], s = strands[bd.s], f = bd.u * (M - 1), k = Math.min(M - 2, f | 0), fr = f - k;
      const ax = s.p[k * 2], ay = s.p[k * 2 + 1], bx = s.p[k * 2 + 2], by = s.p[k * 2 + 3];
      const x = ax + (bx - ax) * fr, y = ay + (by - ay) * fr, z = s.z + s.fold * (s.prog || 0) * (1 - bd.u * .3);
      dummy.position.set(x, y, z);
      if (bd.type === "bugle"){ dir.set(bx - ax, by - ay, 0).normalize(); q.setFromUnitVectors(up, dir); dummy.quaternion.copy(q); dummy.scale.set(bd.r * .62, bd.r * 2.05, bd.r * .62); }
      else if (bd.type === "crys"){ dummy.quaternion.setFromAxisAngle(up, b * .9 + t * .2); dummy.scale.set(bd.r * .95, bd.r * 1.25, bd.r * .95); }
      else { dummy.quaternion.identity(); dummy.scale.setScalar(bd.r); }
      dummy.updateMatrix();
      meshes[bd.type].setMatrixAt(bd.idx, dummy.matrix);
    }
    meshes.pearl.instanceMatrix.needsUpdate = meshes.bugle.instanceMatrix.needsUpdate = meshes.crys.instanceMatrix.needsUpdate = true;
  }

  /* ---------- loop ---------- */
  let visible = true, last = performance.now(), slow = 0, frames = 0;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(stage);
  document.addEventListener("visibilitychange", () => { last = performance.now(); });
  resize();
  for (let i = 0; i < 90; i++) step(1 / 60);
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { const pw = W; measure(); if (Math.abs(W - pw) > 30 || Math.abs(stage.clientHeight - H) > 120) resize(); }, 200); });

  function frame(now){
    requestAnimationFrame(frame);
    if (!visible || document.hidden) { last = now; return; }
    const dt = clamp((now - last) / 1000, 0, .25); last = now; t += dt;
    if (!REDUCED || openT !== null){ const n = clamp(Math.ceil(dt * 60 - .01), 1, 8); for (let i = 0; i < n; i++) step(dt / n); updateBeads(); }
    const open = openT === null ? 0 : clamp((t - openT - .3) / 2.2, 0, 1);
    light += ((opened || open > .4 ? 1 : 0) - light) * Math.min(1, dt * 1.5);
    warm.intensity = light * (1.6 + Math.sin(t * 9) * .08 + Math.sin(t * 13.7) * .05);
    flames.forEach((f, i) => { const k = .9 + Math.sin(t * 11 + i) * .08 + Math.random() * .05; f.scale.set(.09 * k * (.4 + light * .6), .14 * k * (.4 + light * .6), 1); f.material.opacity = .35 + light * .65; });
    chand.visible = opened || openT !== null; chand.rotation.y = t * .12; chand.rotation.z = Math.sin(t * .6) * .015;
    dust.material.opacity = light * .7;
    const pos = dg.attributes.position.array;
    for (let i = 0; i < dustN; i++){ pos[i * 3 + 1] += dv[i] * dt; pos[i * 3] += Math.sin(t * .5 + i) * .0006; if (pos[i * 3 + 1] > 1.6) pos[i * 3 + 1] = -1.6; }
    dg.attributes.position.needsUpdate = true;
    const px = ptr.on && !MOBILE ? ptr.x / vw : tiltX * .5, py = ptr.on && !MOBILE ? ptr.y / vh : -tiltY * .3;
    camera.position.x += (px * .25 - camera.position.x) * .04; camera.position.y += (py * .18 - camera.position.y) * .04;
    camera.position.z = CAMZ - light * .18; camera.lookAt(0, 0, 0);
    bloom.strength = .18 + light * .25;
    if (useBloom) composer.render(); else renderer.render(scene, camera);
    if (++frames > 40){ if (dt > .045) slow++; else slow = Math.max(0, slow - 1); if (slow > 25){ slow = 0; if (useBloom){ useBloom = false; } else if (DPR > 1){ DPR = 1; renderer.setPixelRatio(1); renderer.shadowMap.enabled = false; resize(); } } }
  }
  if (PREVIEW) { for (let i = 0; i < 2; i++) step(1 / 60); updateBeads(); }
  requestAnimationFrame(frame);
}

/* start */
if (stage && webgl()) { try { init(); } catch (e) { console.warn("3D stage:", e); root.classList.remove("three"); const c = document.querySelector(".stage3d"); if (c) c.remove(); } }
})();
