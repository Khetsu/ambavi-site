/* ამბავი · გახსნა „ქაღალდის ყვავილები“ (Three.js)
   მთელ ეკრანზე რელიეფური ქაღალდის ყვავილებია (ნამდვილი სინათლე და ჩრდილი), შუაში თეთრი ოვალი ტექსტით (HTML, .bl-oval).
   შეხებისას: ოვალი ფეთქავს → ყვავილები ცენტრიდან გარეთ ტრიალით მიფრინავენ, თან ოქროს მტვერი → ოვალი იზრდება და
   გვერდი იხსნება. core.js #gate-ს „go“ კლასს ამატებს, აქ ვუსმენთ. WebGL-ის გარეშე ჩანს CSS ფონი და ოვალი.
   config.js → bloom: { paper: "#ECE8E0", petal: "#F6F3EE", light: 1.7, gold: "#E6C98A" } (ყველაფერი არასავალდებულოა) */
(function(){
  const gate = document.getElementById("gate");
  if (!gate || gate.hidden) return;
  const C = window.CONFIG || {}, B = Object.assign({ paper: "#EEEAE3", petal: "#FBF9F5", light: 1.55, gold: "#E6C98A" }, C.bloom || {});
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  import("three").then(T => build(T)).catch(e => console.warn("bloom3d:", e));

  function build(THREE){
    const canvas = document.createElement("canvas"); canvas.className = "g-canvas"; canvas.setAttribute("aria-hidden", "true");
    let renderer; try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch (e) { return; }
    gate.insertBefore(canvas, gate.firstChild);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.VSMShadowMap;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(B.paper);
    const camera = new THREE.PerspectiveCamera(30, 1, .1, 100); camera.position.set(0, 0, 10);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xe4ddd2, 1.7));
    const sun = new THREE.DirectionalLight(0xfffaf2, B.light); sun.position.set(-2.4, 3.2, 6); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 7; sun.shadow.blurSamples = 16; sun.shadow.bias = -.0006;
    const sc = sun.shadow.camera; sc.left = sc.bottom = -6; sc.right = sc.top = 6; sc.near = 1; sc.far = 20; scene.add(sun);

    let seed = 9; const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: B.paper, roughness: 1 })); paper.receiveShadow = true; scene.add(paper);
    const mat = new THREE.MeshStandardMaterial({ color: B.petal, roughness: .92 });
    const EX = { depth: .012, bevelEnabled: true, bevelThickness: .008, bevelSize: .012, bevelSegments: 2, curveSegments: 10 };

    /* shapes: one rounded petal (used many times), a broad leaf, a thin crease */
    const petalGeo = (() => { const p = new THREE.Shape(); p.moveTo(0, 0); p.bezierCurveTo(.42, .18, .5, .78, .2, .98); p.quadraticCurveTo(0, 1.06, -.2, .98); p.bezierCurveTo(-.5, .78, -.42, .18, 0, 0); return new THREE.ExtrudeGeometry(p, EX); })();
    const leafGeo = (() => { const s = new THREE.Shape(); s.moveTo(0, -1); s.bezierCurveTo(.7, -.5, .6, .5, 0, 1); s.bezierCurveTo(-.6, .5, -.7, -.5, 0, -1); return new THREE.ExtrudeGeometry(s, EX); })();
    const veinGeo = (() => { const s = new THREE.Shape(); s.moveTo(-.01, 0); s.lineTo(.01, 0); s.lineTo(.003, 1); s.lineTo(-.003, 1); return new THREE.ExtrudeGeometry(s, { depth: .005, bevelEnabled: false }); })();
    const CORE = new THREE.CylinderGeometry(.12, .14, .05, 28), DOT = new THREE.SphereGeometry(.028, 10, 8);
    const mesh = (g, p) => { const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; p.add(m); return m; };
    /* a ring of petals; each petal is tilted a little so its edge throws a shadow */
    const ring = (G, n, len, z, off, tilt) => { for (let k = 0; k < n; k++){ const g = new THREE.Group(); g.rotation.z = off + k / n * Math.PI * 2; g.position.z = z; G.add(g);
      const m = mesh(petalGeo, g); m.scale.set(len * (.9 + rnd() * .2) * (n > 6 ? .8 : 1), len, 1); m.rotation.x = -tilt;
      const v = mesh(veinGeo, g); v.scale.set(1, len * .62, 1); v.position.set(0, len * .12, .03); v.rotation.x = -tilt; } };
    const items = [];
    function flower(x, y, s, z){
      const G = new THREE.Group(); G.position.set(x, y, z); G.rotation.z = rnd() * 6.28; G.scale.setScalar(s); scene.add(G);
      const n = [5, 6, 5, 8][(rnd() * 4) | 0];
      ring(G, n, 1, 0, 0, .06); ring(G, n, .68, .04, Math.PI / n, .14); if (rnd() < .6) ring(G, n, .4, .08, .3, .25);
      const c = mesh(CORE, G); c.rotation.x = Math.PI / 2; c.position.z = .11;
      for (let k = 0; k < 9; k++){ const a = k / 9 * Math.PI * 2, d = mesh(DOT, G); d.position.set(Math.cos(a) * .17, Math.sin(a) * .17, .11); }
      items.push({ g: G, x, y, z, s, rz: G.rotation.z, ph: rnd() * 6, spin: [rnd() - .5, rnd() - .5, rnd() - .5].map(v => v * 5), lift: .6 + rnd() * .8 });
    }
    function leaf(x, y, s, z){
      const G = new THREE.Group(); G.position.set(x, y, z); G.rotation.z = rnd() * 6.28; G.scale.set(s * .55, s, s); scene.add(G);
      mesh(leafGeo, G); const v = mesh(veinGeo, G); v.position.z = .02;
      items.push({ g: G, x, y, z, s, rz: G.rotation.z, ph: rnd() * 6, spin: [rnd() - .5, rnd() - .5, rnd() - .5].map(v => v * 5), lift: .6 + rnd() * .8, leaf: true });
    }

    /* fill the view: leaves underneath, then big flowers, then a few small ones on top */
    let VW = 3, VH = 5;
    function layout(){
      const w = gate.clientWidth || innerWidth, h = gate.clientHeight || innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      const tan = Math.tan(THREE.MathUtils.degToRad(15)); VH = 2 * 10 * tan; VW = VH * camera.aspect;
    }
    layout();
    const cell = Math.max(VW, VH) / 3.3;
    for (let gy = -VH / 2 - cell * .5; gy < VH / 2 + cell; gy += cell * .78) for (let gx = -VW / 2 - cell * .5; gx < VW / 2 + cell; gx += cell * .82){
      const x = gx + (rnd() - .5) * cell * .5, y = gy + (rnd() - .5) * cell * .5;
      leaf(x + (rnd() - .5) * cell * .6, y + (rnd() - .5) * cell * .6, cell * (.45 + rnd() * .2), .02);
      flower(x, y, cell * (.5 + rnd() * .22), .06 + rnd() * .06);
    }
    for (let i = 0; i < 8; i++) flower((rnd() - .5) * VW * 1.1, (rnd() - .5) * VH * 1.1, cell * (.26 + rnd() * .12), .22);
    const maxD = Math.hypot(VW, VH) / 2;

    /* gold dust that bursts when it opens */
    const dot = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.35, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    const ND = 260, dp = new Float32Array(ND * 3), dv = [];
    for (let i = 0; i < ND; i++){ const a = rnd() * 6.28, s = .5 + rnd() * 1.6; dv.push([Math.cos(a) * s * VW * .5, Math.sin(a) * s * VH * .35, .5 + rnd() * 2.5]); }
    const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
    const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: B.gold, size: .07, map: dot, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(dust);

    const oval = gate.querySelector(".bl-oval"), otext = gate.querySelector(".bl-in");
    let px = 0, py = 0, tx = 0, ty = 0;
    addEventListener("pointermove", e => { tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1; }, { passive: true });
    addEventListener("deviceorientation", e => { if (e.gamma == null) return; tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); }, { passive: true });
    addEventListener("resize", layout);

    const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
    let t0 = 0, alive = true; const K = REDUCED ? .25 : 1;
    new MutationObserver(() => { if (gate.classList.contains("go") && !t0) t0 = performance.now(); if (gate.hidden) alive = false; }).observe(gate, { attributes: true, attributeFilter: ["class", "hidden"] });
    function frame(now){
      if (!alive){ renderer.dispose(); return; }
      requestAnimationFrame(frame);
      px += (tx - px) * .05; py += (ty - py) * .05;
      const t = typeof window.__gateT === "number" ? window.__gateT : t0 ? (now - t0) / 1000 / K : 0, idle = now / 1000;
      camera.position.set(px * .22, -py * .22, 10); camera.lookAt(0, 0, 0);
      sun.position.set(-2.4 + Math.sin(idle * .3) * .4, 3.2, 6);
      for (const it of items){
        const d = Math.hypot(it.x, it.y) / maxD, p = seg(t, .3 + d * .55, 1.75 + d * .55), e = p * p * p;
        const dx = it.x / (Math.hypot(it.x, it.y) || 1), dy = it.y / (Math.hypot(it.x, it.y) || 1);
        it.g.position.set(it.x + dx * e * VW * 1.1, it.y + dy * e * VH * .9, it.z + e * 4 * it.lift + Math.sin(p * Math.PI) * .6);
        it.g.rotation.set(it.spin[0] * e, it.spin[1] * e, it.rz + Math.sin(idle * .5 + it.ph) * .012 + it.spin[2] * e * .6);
        const sp = 1 + Math.sin(seg(t, .05, .4) * Math.PI) * .03 * (1 - d);      // a little wave before the flight
        it.g.scale.setScalar(it.s * sp * (it.leaf ? 1 : 1)); if (it.leaf) it.g.scale.set(it.s * .55 * sp, it.s * sp, it.s);
      }
      const ds = seg(t, .25, 2.4), de = 1 - Math.pow(1 - ds, 3);
      for (let i = 0; i < ND; i++){ const v = dv[i]; dp[i * 3] = v[0] * de; dp[i * 3 + 1] = v[1] * de + ds * .4; dp[i * 3 + 2] = .4 + v[2] * de; }
      dg.attributes.position.needsUpdate = true; dust.material.opacity = t > .25 ? Math.sin(ds * Math.PI) * .95 : 0;
      if (oval){ const og = seg(t, 1.25, 2.5), oe = og * og * (3 - 2 * og), pulse = Math.sin(seg(t, 0, .4) * Math.PI) * .04;
        oval.style.transform = "translate(-50%,-50%) scale(" + (1 + pulse + oe * 6) + ")"; oval.style.boxShadow = t > 1.25 ? "none" : "";
        if (otext && t > 0){ const tf = seg(t, .35, 1.25); otext.style.opacity = String(1 - tf); otext.style.transform = "scale(" + (1 + pulse - tf * .08) + ")"; otext.style.filter = "blur(" + (tf * 3) + "px)"; } }
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
    gate.classList.add("has3d");
  }
})();
