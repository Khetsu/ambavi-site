/* ამბავი · „wedding-roma-khatia“ — 3D კონვერტი ცვილის ბეჭდით (Three.js)
   შეხებისას: ბეჭედი ტყდება → სარქველი იხსნება → ბარათი ამოდის და გვიახლოვდება → გვერდი იხსნება.
   core.js-ის კარიბჭე #gate-ს „go“ კლასს ამატებს; აქ მხოლოდ ვუსმენთ. WebGL-ის გარეშე ჩანს CSS კონვერტი (.g-fallback). */
(function(){
  const gate = document.getElementById("gate");
  if (!gate || gate.hidden) return;
  const C = window.CONFIG || {}, REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const L = v => (v && typeof v === "object") ? (v[document.documentElement.lang] || v.ka || "") : (v || "");

  /* Georgian marks as Path2D (same shapes as the <symbol>s in index.html) */
  const PETAL = "M3 -7C14 -12 21 -25 14 -39C11 -30 6 -26 -1 -24C4 -20 6 -14 3 -7Z";
  const CROSS = "M12 1L15.5 7L22 5.5L19 12L22 18.5L15.5 17L12 23L8.5 17L2 18.5L5 12L2 5.5L8.5 7Z";

  Promise.all([
    import("three"),
    import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js"),
    Promise.race([Promise.all([
      document.fonts.load('400 80px "Noto Serif Georgian"', "რომა ხატია"),
      document.fonts.load('400 60px "Great Vibes"', "Roma"),
      document.fonts.load('500 40px "Cormorant Garamond"', "08"),
      document.fonts.load('500 30px "Noto Sans Georgian"', "ქუთაისი")
    ]), new Promise(r => setTimeout(r, 2500))])
  ]).then(([THREE, ENV]) => build(THREE, ENV.RoomEnvironment)).catch(e => console.warn("gate3d:", e));

  function build(THREE, RoomEnvironment){
    const canvas = document.createElement("canvas");
    canvas.className = "g-canvas"; canvas.setAttribute("aria-hidden", "true");
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    gate.insertBefore(canvas, gate.querySelector(".g-top"));
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .82;

    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, .1, 100);
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
    scene.add(new THREE.HemisphereLight(0xfff4e4, 0x8a7458, .45));
    const key = new THREE.DirectionalLight(0xffe9cc, 1.25); key.position.set(2.5, 3.5, 6); scene.add(key);

    const W = 3.2, H = 2.2, FH = H * .62, CW = W * .92, CH = H * .9;

    /* ---------- canvas textures: color / metalness / roughness drawn by the same painter ---------- */
    const GOLD = "#B3A083";
    function tex(w, h, paint){
      const make = mode => {
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        const g = c.getContext("2d"); paint(g, mode, w, h);
        const t = new THREE.CanvasTexture(c); t.anisotropy = 8;
        if (mode === "color") t.colorSpace = THREE.SRGBColorSpace;
        return t;
      };
      return { map: make("color"), metalnessMap: make("metal"), roughnessMap: make("rough") };
    }
    const ink = (mode, color) => mode === "color" ? color : mode === "metal" ? "#000" : "#fff";
    const gold = mode => mode === "color" ? GOLD : mode === "metal" ? "#fff" : "#5c5c5c";
    function ground(g, mode, w, h, a, b){
      if (mode !== "color"){ g.fillStyle = mode === "metal" ? "#000" : "#fff"; g.fillRect(0, 0, w, h); return; }
      const gr = g.createLinearGradient(0, 0, w * .3, h); gr.addColorStop(0, a); gr.addColorStop(1, b);
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      const id = g.getImageData(0, 0, w, h), d = id.data;
      for (let i = 0; i < d.length; i += 4){ const n = (Math.random() - .5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
      g.putImageData(id, 0, 0);
    }
    function borjgali(g, x, y, r, style){
      g.save(); g.translate(x, y); g.scale(r / 44, r / 44); g.fillStyle = style; g.strokeStyle = style;
      const p = new Path2D(PETAL);
      for (let k = 0; k < 7; k++){ g.save(); g.rotate(k * Math.PI * 2 / 7); g.fill(p); g.restore(); }
      g.beginPath(); g.arc(0, 0, 6.5, 0, 7); g.fill();
      g.lineWidth = 1.6; g.beginPath(); g.arc(0, 0, 44, 0, 7); g.stroke(); g.restore();
    }
    function cross(g, x, y, s, style){ g.save(); g.translate(x - 12 * s, y - 12 * s); g.scale(s, s); g.fillStyle = style; g.fill(new Path2D(CROSS)); g.restore(); }
    function text(g, str, x, y, font, style, spacing){
      g.font = font; g.fillStyle = style; g.textAlign = "center"; g.textBaseline = "middle";
      if (spacing && "letterSpacing" in g) g.letterSpacing = spacing + "px";
      g.fillText(str, x, y); if ("letterSpacing" in g) g.letterSpacing = "0px";
    }

    const host = L(C.host) || "რომა & ხატია", script = C.script || "Roma & Khatia";
    const [Y, M, D] = String(C.date || "2026-11-08").split("-");
    const dots = D + " · " + M + " · " + Y;

    /* liner: burgundy with a gold lattice of Bolnisi crosses */
    const liner = tex(512, 512, (g, mode, w, h) => {
      ground(g, mode, w, h, "#F4EFE6", "#E7DFD2");
      for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++){
        const cx = x * 64 + (y % 2 ? 32 : 0), cy = y * 64;
        cross(g, cx, cy, .9, gold(mode));
        g.fillStyle = gold(mode); g.beginPath(); g.arc(cx + 32, cy, 1.8, 0, 7); g.fill();
      }
    });
    liner.map.wrapS = liner.map.wrapT = THREE.RepeatWrapping;

    /* envelope front: paper, the fold shadows, a gold script line */
    const front = tex(1024, 704, (g, mode, w, h) => {
      ground(g, mode, w, h, "#FBF8F2", "#ECE5D9");
      if (mode === "color"){
        g.fillStyle = "rgba(120,92,58,.07)";
        g.beginPath(); g.moveTo(0, h); g.lineTo(w / 2, h * .5); g.lineTo(w, h); g.fill();
        g.strokeStyle = "rgba(120,92,58,.18)"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(0, h); g.lineTo(w / 2, h * .5); g.lineTo(w, h); g.stroke();
      }
      g.strokeStyle = gold(mode); g.lineWidth = 2; g.strokeRect(22, 22, w - 44, h - 44);
      text(g, script, w / 2, h * .885, '400 58px "Great Vibes", cursive', gold(mode));
    });
    /* flap outside: paper with a gold edge line */
    const flapTex = tex(1024, 448, (g, mode, w, h) => {
      ground(g, mode, w, h, "#FCFAF5", "#EFE8DC");
      g.strokeStyle = gold(mode); g.lineWidth = 3;
      g.beginPath(); g.moveTo(44, 16); g.lineTo(w / 2, h - 44); g.lineTo(w - 44, 16); g.stroke();
      g.lineWidth = 1.2; g.beginPath(); g.moveTo(80, 16); g.lineTo(w / 2, h - 80); g.lineTo(w - 80, 16); g.stroke();
    });
    /* the card inside */
    const card = tex(1200, 808, (g, mode, w, h) => {
      ground(g, mode, w, h, "#FDFAF4", "#F3EBDD");
      g.strokeStyle = gold(mode); g.lineWidth = 3; g.strokeRect(34, 34, w - 68, h - 68);
      g.lineWidth = 1.2; g.strokeRect(48, 48, w - 96, h - 96);
      [[48, 48], [w - 48, 48], [48, h - 48], [w - 48, h - 48]].forEach(([x, y]) => cross(g, x, y, 1.1, gold(mode)));
      borjgali(g, w / 2, 128, 46, gold(mode));
      text(g, document.documentElement.lang === "en" ? "WEDDING INVITATION" : "საქორწილო მოსაწვევი", w / 2, 226, '500 26px "Noto Sans Georgian", sans-serif', ink(mode, "#857A6C"), 6);
      text(g, host, w / 2, 340, '400 92px "Noto Serif Georgian", serif', ink(mode, "#6A6058"));
      text(g, script, w / 2, 452, '400 70px "Great Vibes", cursive', gold(mode));
      g.strokeStyle = gold(mode); g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(w / 2 - 190, 540); g.lineTo(w / 2 - 26, 540); g.moveTo(w / 2 + 26, 540); g.lineTo(w / 2 + 190, 540); g.stroke();
      cross(g, w / 2, 540, .85, gold(mode));
      text(g, dots, w / 2, 622, '500 60px "Cormorant Garamond", serif', ink(mode, "#8C7C6C"), 8);
      text(g, L(C.city) || "ქუთაისი", w / 2, 702, '400 28px "Noto Sans Georgian", sans-serif', ink(mode, "#857A6C"), 4);
    });
    /* wax: monogram + a ring of dots, used as color and bump */
    const wax = (() => {
      const c = document.createElement("canvas"); c.width = c.height = 512; const g = c.getContext("2d");
      const gr = g.createRadialGradient(200, 180, 20, 256, 256, 300); gr.addColorStop(0, "#C9C9C9"); gr.addColorStop(1, "#8a8a8a");
      g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
      g.fillStyle = "#5a5a5a"; g.beginPath(); g.arc(256, 256, 200, 0, 7); g.fill();
      g.fillStyle = "#b8b8b8"; g.beginPath(); g.arc(256, 256, 186, 0, 7); g.fill();
      for (let k = 0; k < 28; k++){ const a = k / 28 * Math.PI * 2; g.fillStyle = "#e8e8e8"; g.beginPath(); g.arc(256 + Math.cos(a) * 164, 256 + Math.sin(a) * 164, 6, 0, 7); g.fill(); }
      borjgali(g, 256, 256, 150, "rgba(255,255,255,.18)");
      text(g, C.monogram || "რ ხ", 256, 262, '500 120px "Noto Serif Georgian", serif', "#f4f4f4");
      const t = new THREE.CanvasTexture(c); t.center.set(.5, .5); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();

    const paperMat = (t, side) => new THREE.MeshStandardMaterial({ map: t.map, metalnessMap: t.metalnessMap, roughnessMap: t.roughnessMap, metalness: 1, roughness: 1, envMapIntensity: .5, emissive: 0xffffff, emissiveMap: t.map, emissiveIntensity: .5, side: side || THREE.FrontSide });
    const uvFit = (geo, x0, y0, w, h) => { const p = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - x0) / w, (p.getY(i) - y0) / h); uv.needsUpdate = true; return geo; };

    /* ---------- the envelope ---------- */
    const env = new THREE.Group(); scene.add(env);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshStandardMaterial({ map: liner.map, metalnessMap: liner.metalnessMap, roughnessMap: liner.roughnessMap, metalness: 1, roughness: 1, envMapIntensity: .6, emissive: 0xffffff, emissiveMap: liner.map, emissiveIntensity: .25 }));
    liner.map.repeat.set(2, 1.4); back.material.metalnessMap.repeat.set(2, 1.4); back.material.roughnessMap.repeat.set(2, 1.4);
    [liner.metalnessMap, liner.roughnessMap].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; });
    env.add(back);
    const backOut = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshStandardMaterial({ color: 0xE8DCC8, roughness: .95, side: THREE.BackSide })); env.add(backOut);

    const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), paperMat(card)); cardMesh.position.z = .015; env.add(cardMesh);

    const fs = new THREE.Shape(); fs.moveTo(-W / 2, -H / 2); fs.lineTo(W / 2, -H / 2); fs.lineTo(W / 2, H / 2); fs.lineTo(0, -.12); fs.lineTo(-W / 2, H / 2); fs.closePath();
    const frontMesh = new THREE.Mesh(uvFit(new THREE.ShapeGeometry(fs), -W / 2, -H / 2, W, H), paperMat(front)); frontMesh.position.z = .03; env.add(frontMesh);

    const hinge = new THREE.Group(); hinge.position.set(0, H / 2, .045); env.add(hinge);
    const ff = new THREE.Shape(); ff.moveTo(-W / 2, 0); ff.lineTo(W / 2, 0); ff.lineTo(.12, -FH + .06); ff.quadraticCurveTo(0, -FH - .02, -.12, -FH + .06); ff.closePath();
    const flapGeo = uvFit(new THREE.ShapeGeometry(ff), -W / 2, -FH, W, FH);
    hinge.add(new THREE.Mesh(flapGeo, paperMat(flapTex)));
    const flapIn = new THREE.Mesh(flapGeo, new THREE.MeshStandardMaterial({ map: liner.map, metalnessMap: liner.metalnessMap, roughnessMap: liner.roughnessMap, metalness: 1, roughness: 1, envMapIntensity: .6, emissive: 0xffffff, emissiveMap: liner.map, emissiveIntensity: .25, side: THREE.BackSide }));
    hinge.add(flapIn);

    /* the wax seal: two halves of a wobbly disc, so it can crack open */
    const sealMat = () => new THREE.MeshStandardMaterial({ color: 0xC9B497, map: wax, roughness: .34, metalness: .05, envMapIntensity: .7, bumpMap: wax, bumpScale: 2.4, transparent: true });
    const sealSide = () => new THREE.MeshStandardMaterial({ color: 0x9C866C, roughness: .5, transparent: true });
    const seal = new THREE.Group(); seal.position.set(0, -FH + .1, .05); hinge.add(seal);
    const halves = [0, Math.PI].map(t0 => {
      const geo = new THREE.CylinderGeometry(.36, .38, .09, 40, 1, false, t0, Math.PI);
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++){
        const x = p.getX(i), z = p.getZ(i), r = Math.hypot(x, z); if (r < .2) continue;
        const a = Math.atan2(z, x), k = 1 + .05 * Math.sin(5 * a) + .035 * Math.sin(11 * a + 1) + .02 * Math.sin(19 * a + 2);
        p.setX(i, x * k); p.setZ(i, z * k);
      }
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, [sealSide(), sealMat(), sealSide()]);
      m.rotation.x = Math.PI / 2; m.rotation.y = 0;
      const g = new THREE.Group(); g.add(m); seal.add(g); return g;
    });
    wax.rotation = Math.PI / 2;

    /* soft shadow under the envelope */
    const sh = document.createElement("canvas"); sh.width = sh.height = 128; const sg = sh.getContext("2d");
    const sgr = sg.createRadialGradient(64, 64, 4, 64, 64, 64); sgr.addColorStop(0, "rgba(60,40,20,.45)"); sgr.addColorStop(1, "rgba(60,40,20,0)"); sg.fillStyle = sgr; sg.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.5, H * 1.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false }));
    shadow.position.z = -.35; env.add(shadow);

    /* ---------- layout ---------- */
    const TAN = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    let camZ = 10;
    function size(){
      const w = gate.clientWidth || innerWidth, h = gate.clientHeight || innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      camZ = Math.max(W * 1.28 / (2 * TAN * camera.aspect), H * 2.5 / (2 * TAN));
      camera.position.set(0, 0, camZ); camera.updateProjectionMatrix();
    }
    size(); addEventListener("resize", size);

    let px = 0, py = 0, tx = 0, ty = 0;
    addEventListener("pointermove", e => { tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1; }, { passive: true });
    addEventListener("deviceorientation", e => { if (e.gamma == null) return; tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); }, { passive: true });

    /* ---------- timeline after the touch ---------- */
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out = t => 1 - Math.pow(1 - t, 3);
    const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
    let t0 = 0, alive = true; const K = REDUCED ? .2 : 1;
    new MutationObserver(() => { if (gate.classList.contains("go") && !t0) t0 = performance.now(); if (gate.hidden) alive = false; }).observe(gate, { attributes: true, attributeFilter: ["class", "hidden"] });

    function frame(now){
      if (!alive){ renderer.dispose(); return; }
      requestAnimationFrame(frame);
      px += (tx - px) * .05; py += (ty - py) * .05;
      const t = typeof window.__gateT === "number" ? window.__gateT : t0 ? (now - t0) / 1000 / K : 0, idle = now / 1000;
      const calm = 1 - out(seg(t, 0, .6));                         // tilt fades out once it starts
      env.position.set(0, -.18 + Math.sin(idle * 1.3) * .05 * calm, 0);
      env.rotation.set(-.16 * calm + py * .12 * calm + Math.sin(idle * .9) * .03 * calm, px * .28 * calm, Math.sin(idle * .7) * .02 * calm);

      /* 1) the seal is pressed, cracks and the halves fall away */
      const press = seg(t, 0, .18), crack = out(seg(t, .18, .95));
      seal.scale.setScalar(1 - .08 * Math.sin(press * Math.PI));
      halves.forEach((h, k) => {
        const s = k ? 1 : -1;
        h.position.set(s * crack * .7, -crack * crack * 3.2, crack * 1.1);
        h.rotation.set(crack * 1.2, s * crack * .9, s * crack * 1.6);
        h.children[0].material.forEach(m => { m.opacity = 1 - seg(t, .8, .95); });
      });
      /* 2) the flap opens; past 90° it moves behind the card */
      const fo = ease(seg(t, .45, 1.45));
      hinge.rotation.x = -fo * Math.PI * 1.03;
      hinge.position.z = fo > .5 ? -.006 : .045;
      /* 3) the card slides up, then comes to us */
      const up = ease(seg(t, 1.25, 2.25)), come = ease(seg(t, 2.1, 3.25));
      env.position.y -= come * 3.6;
      const fit = Math.max(CW / (1.02 * 2 * TAN * camera.aspect), CH / (.8 * 2 * TAN)), zFinal = camZ - fit;
      cardMesh.position.set(0, up * H * .62 + come * (-env.position.y - up * H * .62), .015 + come * zFinal);
      cardMesh.rotation.z = Math.sin(up * Math.PI) * .03;
      shadow.material.opacity = 1 - come;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
    gate.classList.add("has3d");
  }
})();
