/* ამბავი · 3D კონვერტი ბეჭდით (Three.js) — ფერები და ნახატი იკითხება config.js-ის envelope-იდან.
   შეხებისას: ბეჭედი ტყდება და ნაპერწკლები იფანტება → სარქველი იხსნება (პატარა რხევით) → სინათლე გადაუვლის
   ქაღალდს → ბარათი ამოდის და გვიახლოვდება → გვერდი იხსნება. core.js #gate-ს „go“ კლასს ამატებს, აქ ვუსმენთ.
   WebGL-ის გარეშე ჩანს CSS კონვერტი (.g-fallback).

   config.js → envelope: {
     paper: ["#FBF8F2", "#ECE5D9"],  flap: ["#FCFAF5", "#EFE8DC"],  liner: ["#F4EFE6", "#E7DFD2"],
     pattern: "dots" | "stars" | "hearts" | "lines" | "flowers" | "confetti",
     accent: "#B3A083",  metal: true (accent drawn as foil),  ink: "#6A6058",  soft: "#857A6C",
     card: ["#FDFAF4", "#F3EBDD"],  cardAccent: (default accent),  cardTitle: { ka, en },  cardLine: { ka, en },
     seal: "#C9B497",  sealSide: "#9C866C",  sealMetal: 0,  sparks: "#FFD98A",
     fontHead: '"Noto Serif Georgian", serif', fontScript: '"Great Vibes", cursive' } */
(function(){
  const gate = document.getElementById("gate");
  if (!gate || gate.hidden) return;
  const C = window.CONFIG || {}, REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const L = v => (v && typeof v === "object") ? (v[document.documentElement.lang] || v.ka || "") : (v || "");
  const E = Object.assign({
    paper: ["#FBF8F2", "#ECE5D9"], flap: ["#FCFAF5", "#EFE8DC"], liner: ["#F4EFE6", "#E7DFD2"], pattern: "dots",
    accent: "#B3A083", metal: true, ink: "#6A6058", soft: "#857A6C", card: ["#FDFAF4", "#F3EBDD"],
    cardTitle: { ka: "მოსაწვევი", en: "INVITATION" }, cardLine: null,
    seal: "#C9B497", sealSide: "#9C866C", sealMetal: 0, sparks: "#FFD98A", back: "#E8DCC8",
    fontHead: '"Noto Serif Georgian", serif', fontScript: '"Great Vibes", cursive', fontNum: '"Cormorant Garamond", serif'
  }, C.envelope || {});

  Promise.all([
    import("three"),
    import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js"),
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))])
  ]).then(([THREE, ENV]) => build(THREE, ENV.RoomEnvironment)).catch(e => console.warn("envelope3d:", e));

  function build(THREE, RoomEnvironment){
    const canvas = document.createElement("canvas");
    canvas.className = "g-canvas"; canvas.setAttribute("aria-hidden", "true");
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    gate.insertBefore(canvas, gate.querySelector(".g-top"));
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .85;

    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, .1, 100);
    scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
    scene.add(new THREE.HemisphereLight(0xfff4e4, 0x8a7458, .45));
    const key = new THREE.DirectionalLight(0xffecd2, 1.3); key.position.set(2.5, 3.5, 6); scene.add(key);
    const sweep = new THREE.PointLight(0xfff1d8, 0, 9, 1.6); scene.add(sweep);

    const W = 3.2, H = 2.2, FH = H * .62, CW = W * .92, CH = H * .9;

    /* ---------- painters: each texture is drawn three times (colour / metalness / roughness) ---------- */
    function tex(w, h, paint){
      const make = mode => { const c = document.createElement("canvas"); c.width = w; c.height = h; paint(c.getContext("2d"), mode, w, h); const t = new THREE.CanvasTexture(c); t.anisotropy = 8; if (mode === "color") t.colorSpace = THREE.SRGBColorSpace; return t; };
      return { map: make("color"), metalnessMap: make("metal"), roughnessMap: make("rough") };
    }
    const ink = (mode, color) => mode === "color" ? color : mode === "metal" ? "#000" : "#fff";
    const acc = mode => mode === "color" ? E.accent : mode === "metal" ? (E.metal ? "#fff" : "#000") : (E.metal ? "#555" : "#fff");
    const cacc = mode => mode === "color" ? (E.cardAccent || E.accent) : acc(mode);
    function ground(g, mode, w, h, [a, b]){
      if (mode !== "color"){ g.fillStyle = mode === "metal" ? "#000" : "#fff"; g.fillRect(0, 0, w, h); return; }
      const gr = g.createLinearGradient(0, 0, w * .3, h); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      const id = g.getImageData(0, 0, w, h), d = id.data; for (let i = 0; i < d.length; i += 4){ const n = (Math.random() - .5) * 12; d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(id, 0, 0);
    }
    function text(g, str, x, y, font, style, spacing){ if (!str) return; g.font = font; g.fillStyle = style; g.textAlign = "center"; g.textBaseline = "middle"; if ("letterSpacing" in g) g.letterSpacing = (spacing || 0) + "px"; g.fillText(str, x, y); if ("letterSpacing" in g) g.letterSpacing = "0px"; }
    const star = (g, x, y, r) => { g.beginPath(); for (let i = 0; i < 10; i++){ const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); };
    const heart = (g, x, y, r) => { g.beginPath(); g.moveTo(x, y + r * .9); g.bezierCurveTo(x - r * 1.4, y - r * .2, x - r * .6, y - r * 1.2, x, y - r * .35); g.bezierCurveTo(x + r * .6, y - r * 1.2, x + r * 1.4, y - r * .2, x, y + r * .9); g.fill(); };
    const blossom = (g, x, y, r) => { for (let k = 0; k < 5; k++){ const a = k / 5 * Math.PI * 2; g.beginPath(); g.ellipse(x + Math.cos(a) * r * .55, y + Math.sin(a) * r * .55, r * .45, r * .3, a, 0, 7); g.fill(); } };
    const CONF = ["#FF6B9A", "#FFC93C", "#4CC9F0", "#7BE07B", "#B388FF"];
    function pattern(g, mode, w, h){
      g.fillStyle = acc(mode); g.strokeStyle = acc(mode);
      for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++){
        const cx = x * 64 + (y % 2 ? 32 : 0), cy = y * 64;
        if (E.pattern === "stars") star(g, cx, cy, 6);
        else if (E.pattern === "hearts") heart(g, cx, cy, 6);
        else if (E.pattern === "flowers") blossom(g, cx, cy, 9);
        else if (E.pattern === "lines"){ g.lineWidth = 1.4; g.beginPath(); g.moveTo(cx - 14, cy); g.lineTo(cx, cy - 14); g.lineTo(cx + 14, cy); g.lineTo(cx, cy + 14); g.closePath(); g.stroke(); }
        else if (E.pattern === "confetti"){ if (mode === "color") g.fillStyle = CONF[(x + y * 3) % 5]; g.save(); g.translate(cx, cy); g.rotate((x * 7 + y * 3) % 6); g.fillRect(-6, -2.5, 12, 5); g.restore(); g.beginPath(); g.arc(cx + 32, cy + 18, 3.5, 0, 7); g.fill(); }
        else { g.beginPath(); g.arc(cx, cy, 3.2, 0, 7); g.fill(); }
      }
    }

    const host = L(C.host), script = C.script || "";
    const [Y, M, D] = String(C.date || "2026-01-01").split("-"), dots = D + " · " + M + " · " + Y;

    const liner = tex(512, 512, (g, mode, w, h) => { ground(g, mode, w, h, E.liner); pattern(g, mode, w, h); });
    [liner.map, liner.metalnessMap, liner.roughnessMap].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1.4); });
    const front = tex(1024, 704, (g, mode, w, h) => {
      ground(g, mode, w, h, E.paper);
      if (mode === "color"){ g.fillStyle = "rgba(0,0,0,.06)"; g.beginPath(); g.moveTo(0, h); g.lineTo(w / 2, h * .5); g.lineTo(w, h); g.fill(); g.strokeStyle = "rgba(0,0,0,.14)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, h); g.lineTo(w / 2, h * .5); g.lineTo(w, h); g.stroke(); }
      g.strokeStyle = acc(mode); g.lineWidth = 2.5; g.strokeRect(22, 22, w - 44, h - 44);
      text(g, script, w / 2, h * .885, "400 58px " + E.fontScript, acc(mode));
    });
    const flapTex = tex(1024, 448, (g, mode, w, h) => {
      ground(g, mode, w, h, E.flap); g.strokeStyle = acc(mode); g.lineWidth = 3;
      g.beginPath(); g.moveTo(44, 16); g.lineTo(w / 2, h - 44); g.lineTo(w - 44, 16); g.stroke();
      g.lineWidth = 1.2; g.beginPath(); g.moveTo(80, 16); g.lineTo(w / 2, h - 80); g.lineTo(w - 80, 16); g.stroke();
    });
    const card = tex(1200, 808, (g, mode, w, h) => {
      ground(g, mode, w, h, E.card);
      g.strokeStyle = cacc(mode); g.lineWidth = 3; g.strokeRect(34, 34, w - 68, h - 68); g.lineWidth = 1.2; g.strokeRect(48, 48, w - 96, h - 96);
      text(g, L(E.cardTitle), w / 2, 150, "500 28px " + E.fontHead, ink(mode, E.soft), 8);
      text(g, host, w / 2, 290, "400 96px " + E.fontHead, ink(mode, E.ink));
      text(g, script, w / 2, 410, "400 74px " + E.fontScript, cacc(mode));
      g.strokeStyle = cacc(mode); g.lineWidth = 1.5; g.beginPath(); g.moveTo(w / 2 - 190, 500); g.lineTo(w / 2 - 20, 500); g.moveTo(w / 2 + 20, 500); g.lineTo(w / 2 + 190, 500); g.stroke();
      g.fillStyle = cacc(mode); g.beginPath(); g.moveTo(w / 2, 490); g.lineTo(w / 2 + 9, 500); g.lineTo(w / 2, 510); g.lineTo(w / 2 - 9, 500); g.fill();
      text(g, dots, w / 2, 588, "500 62px " + E.fontNum, ink(mode, E.ink), 8);
      text(g, L(E.cardLine) || L(C.city), w / 2, 680, "400 30px " + E.fontHead, ink(mode, E.soft), 4);
    });
    const wax = (() => {
      const c = document.createElement("canvas"); c.width = c.height = 512; const g = c.getContext("2d");
      const gr = g.createRadialGradient(200, 180, 20, 256, 256, 300); gr.addColorStop(0, "#d4d4d4"); gr.addColorStop(1, "#8a8a8a"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
      g.fillStyle = "#5a5a5a"; g.beginPath(); g.arc(256, 256, 200, 0, 7); g.fill(); g.fillStyle = "#bcbcbc"; g.beginPath(); g.arc(256, 256, 186, 0, 7); g.fill();
      for (let k = 0; k < 28; k++){ const a = k / 28 * Math.PI * 2; g.fillStyle = "#ececec"; g.beginPath(); g.arc(256 + Math.cos(a) * 164, 256 + Math.sin(a) * 164, 6, 0, 7); g.fill(); }
      text(g, C.monogram || "", 256, 262, "500 " + (String(C.monogram || "").length > 2 ? 96 : 130) + "px " + E.fontHead, "#f6f6f6");
      const t = new THREE.CanvasTexture(c); t.center.set(.5, .5); t.rotation = Math.PI / 2; t.colorSpace = THREE.SRGBColorSpace; return t;
    })();

    const paperMat = (t, side) => new THREE.MeshStandardMaterial({ map: t.map, metalnessMap: t.metalnessMap, roughnessMap: t.roughnessMap, metalness: 1, roughness: 1, envMapIntensity: .6, emissive: 0xffffff, emissiveMap: t.map, emissiveIntensity: .45, side: side || THREE.FrontSide });
    const uvFit = (geo, x0, y0, w, h) => { const p = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - x0) / w, (p.getY(i) - y0) / h); uv.needsUpdate = true; return geo; };

    /* ---------- the envelope ---------- */
    const env = new THREE.Group(); scene.add(env);
    const linerMat = side => new THREE.MeshStandardMaterial({ map: liner.map, metalnessMap: liner.metalnessMap, roughnessMap: liner.roughnessMap, metalness: 1, roughness: 1, envMapIntensity: .6, emissive: 0xffffff, emissiveMap: liner.map, emissiveIntensity: .3, side: side || THREE.FrontSide });
    env.add(new THREE.Mesh(new THREE.PlaneGeometry(W, H), linerMat()));
    env.add(new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshStandardMaterial({ color: E.back, roughness: .95, side: THREE.BackSide })));
    const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), paperMat(card)); cardMesh.position.z = .015; env.add(cardMesh);
    const fs = new THREE.Shape(); fs.moveTo(-W / 2, -H / 2); fs.lineTo(W / 2, -H / 2); fs.lineTo(W / 2, H / 2); fs.lineTo(0, -.12); fs.lineTo(-W / 2, H / 2); fs.closePath();
    const frontMesh = new THREE.Mesh(uvFit(new THREE.ShapeGeometry(fs), -W / 2, -H / 2, W, H), paperMat(front)); frontMesh.position.z = .03; env.add(frontMesh);
    const hinge = new THREE.Group(); hinge.position.set(0, H / 2, .045); env.add(hinge);
    const ff = new THREE.Shape(); ff.moveTo(-W / 2, 0); ff.lineTo(W / 2, 0); ff.lineTo(.12, -FH + .06); ff.quadraticCurveTo(0, -FH - .02, -.12, -FH + .06); ff.closePath();
    const flapGeo = uvFit(new THREE.ShapeGeometry(ff), -W / 2, -FH, W, FH);
    hinge.add(new THREE.Mesh(flapGeo, paperMat(flapTex)), new THREE.Mesh(flapGeo, linerMat(THREE.BackSide)));

    /* the seal: two halves of a wobbly disc, so it can crack */
    const sealMat = () => new THREE.MeshStandardMaterial({ color: E.seal, map: wax, roughness: E.sealMetal ? .25 : .34, metalness: E.sealMetal, envMapIntensity: E.sealMetal ? 1.2 : .7, bumpMap: wax, bumpScale: 2.4, transparent: true });
    const sealSide = () => new THREE.MeshStandardMaterial({ color: E.sealSide, roughness: .45, metalness: E.sealMetal * .8, transparent: true });
    const seal = new THREE.Group(); seal.position.set(0, -FH + .1, .05); hinge.add(seal);
    const halves = [0, Math.PI].map(t0 => {
      const geo = new THREE.CylinderGeometry(.36, .38, .09, 40, 1, false, t0, Math.PI), p = geo.attributes.position;
      for (let i = 0; i < p.count; i++){ const x = p.getX(i), z = p.getZ(i), r = Math.hypot(x, z); if (r < .2) continue; const a = Math.atan2(z, x), k = 1 + .05 * Math.sin(5 * a) + .035 * Math.sin(11 * a + 1) + .02 * Math.sin(19 * a + 2); p.setX(i, x * k); p.setZ(i, z * k); }
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, [sealSide(), sealMat(), sealSide()]); m.rotation.x = Math.PI / 2;
      const g = new THREE.Group(); g.add(m); seal.add(g); return g;
    });

    /* sparks that burst from the seal */
    const dot = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.3, "rgba(255,255,255,.7)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    const NS = 140, sp = new Float32Array(NS * 3), sv = [];
    for (let i = 0; i < NS; i++){ const a = Math.random() * Math.PI * 2, e = (Math.random() - .3) * 1.4, s = .8 + Math.random() * 2.2; sv.push([Math.cos(a) * Math.cos(e) * s, Math.sin(e) * s + .6, Math.sin(a) * Math.cos(e) * s * .5 + 1]); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    const sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: E.sparks, size: .09, map: dot, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); env.add(sparks);

    /* soft shadow */
    const sh = document.createElement("canvas"); sh.width = sh.height = 128; const sgc = sh.getContext("2d");
    const sgr = sgc.createRadialGradient(64, 64, 4, 64, 64, 64); sgr.addColorStop(0, "rgba(40,25,10,.45)"); sgr.addColorStop(1, "rgba(40,25,10,0)"); sgc.fillStyle = sgr; sgc.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.5, H * 1.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false })); shadow.position.z = -.35; env.add(shadow);

    /* ---------- layout ---------- */
    const TAN = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)); let camZ = 10;
    function size(){ const w = gate.clientWidth || innerWidth, h = gate.clientHeight || innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camZ = Math.max(W * 1.28 / (2 * TAN * camera.aspect), H * 2.5 / (2 * TAN)); camera.position.set(0, 0, camZ); camera.updateProjectionMatrix(); }
    size(); addEventListener("resize", size);
    let px = 0, py = 0, tx = 0, ty = 0;
    addEventListener("pointermove", e => { tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1; }, { passive: true });
    addEventListener("deviceorientation", e => { if (e.gamma == null) return; tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); }, { passive: true });

    /* ---------- timeline ---------- */
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out = t => 1 - Math.pow(1 - t, 3);
    const back = t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };   // a little overshoot
    const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
    let t0 = 0, alive = true; const K = REDUCED ? .2 : 1;
    new MutationObserver(() => { if (gate.classList.contains("go") && !t0) t0 = performance.now(); if (gate.hidden) alive = false; }).observe(gate, { attributes: true, attributeFilter: ["class", "hidden"] });

    function frame(now){
      if (!alive){ renderer.dispose(); return; }
      requestAnimationFrame(frame);
      px += (tx - px) * .05; py += (ty - py) * .05;
      const t = typeof window.__gateT === "number" ? window.__gateT : t0 ? (now - t0) / 1000 / K : 0, idle = now / 1000;
      const calm = 1 - out(seg(t, 0, .6));
      env.position.set(0, -.18 + Math.sin(idle * 1.3) * .05 * calm, 0);
      env.rotation.set(-.16 * calm + py * .12 * calm + Math.sin(idle * .9) * .03 * calm, px * .28 * calm, Math.sin(idle * .7) * .02 * calm);
      /* 1) press, crack, sparks */
      const press = seg(t, 0, .18), crack = out(seg(t, .18, .95));
      seal.scale.setScalar(1 - .1 * Math.sin(press * Math.PI));
      halves.forEach((h, k) => { const s = k ? 1 : -1; h.position.set(s * crack * .7, -crack * crack * 3.2, crack * 1.1); h.rotation.set(crack * 1.2, s * crack * .9, s * crack * 1.6); h.children[0].material.forEach(m => { m.opacity = 1 - seg(t, .8, .95); }); });
      const st = seg(t, .16, 1.3), so = seal.getWorldPosition(new THREE.Vector3()); env.worldToLocal(so);
      for (let i = 0; i < NS; i++){ const v = sv[i], d = out(st) * .9; sp[i * 3] = so.x + v[0] * d; sp[i * 3 + 1] = so.y + v[1] * d - st * st * .8; sp[i * 3 + 2] = so.z + v[2] * d * .5; }
      sg.attributes.position.needsUpdate = true; sparks.material.opacity = t > .16 ? Math.max(0, 1 - st * 1.05) : 0;
      /* 2) the flap opens with a little bounce; past 90° it goes behind the card */
      const fo = back(seg(t, .45, 1.5));
      hinge.rotation.x = -Math.min(fo, 1.04) * Math.PI * 1.03;
      hinge.position.z = fo > .5 ? -.006 : .045;
      /* 3) a light sweeps across the paper */
      const sw = seg(t, .5, 2.2); sweep.intensity = Math.sin(sw * Math.PI) * 6; sweep.position.set(-3 + sw * 6, 1.2, 1.6);
      /* 4) the card slides up, then comes to us */
      const up = ease(seg(t, 1.25, 2.25)), come = ease(seg(t, 2.1, 3.25));
      env.position.y -= come * 3.6;
      const fit = Math.max(CW / (1.02 * 2 * TAN * camera.aspect), CH / (.8 * 2 * TAN)), zFinal = camZ - fit;
      cardMesh.position.set(0, up * H * .62 + come * (-env.position.y - up * H * .62), .015 + come * zFinal);
      cardMesh.rotation.z = Math.sin(up * Math.PI) * .04; cardMesh.rotation.y = Math.sin(come * Math.PI) * .12;
      shadow.material.opacity = 1 - come;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
    gate.classList.add("has3d");
  }
})();
