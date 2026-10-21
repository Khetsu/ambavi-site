/* ამბავი · ცოცხალი 3D ფონი მთელ გვერდზე (Three.js): ატლასის ფურცლები და მარგალიტები ნელა ცვივა, ბრუნავს და
   სქროლისას სხვადასხვა სიღრმეზე მოძრაობს. ჩნდება გახსნის შემდეგ (html.opened); ჩერდება, როცა გვერდი დამალულია.
   config.js → ambient: { petals: 16, pearls: 12, colors: ["#FBF8F2", "#F3E4DA", "#EFE6D6"] } */
(function(){
  const C = window.CONFIG || {}, A = Object.assign({ petals: 11, pearls: 9, colors: ["#FBF8F2", "#F3E4DA", "#EFE6D6"] }, C.ambient || {});
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || /[?&]preview/.test(location.search)) return;
  Promise.all([import("three"), import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js")])
    .then(([T, E]) => build(T, E.RoomEnvironment)).catch(e => console.warn("ambient3d:", e));

  function build(THREE, RoomEnvironment){
    const canvas = document.createElement("canvas"); canvas.className = "amb3d"; canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:40;opacity:0;transition:opacity 2s ease";
    let renderer; try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    document.body.appendChild(canvas);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75)); renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(40, 1, .1, 60); camera.position.z = 10;
    scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
    scene.add(new THREE.HemisphereLight(0xfffcf6, 0xf0e6d8, 1.9));
    const key = new THREE.DirectionalLight(0xfff3e2, 1.6); key.position.set(-3, 5, 6); scene.add(key);

    let seed = 3; const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    /* a curved satin petal */
    const pg = new THREE.PlaneGeometry(1, 1, 12, 16), pp = pg.attributes.position;
    for (let i = 0; i < pp.count; i++){ const u = pp.getX(i) * 2, t = pp.getY(i) + .5; const w = t < .55 ? .2 + .8 * Math.sin(t / .55 * Math.PI / 2) : Math.sqrt(Math.max(0, 1 - ((t - .55) / .47) ** 2)); pp.setXYZ(i, u * w * .32, t * .5 - .25, .12 * t * t + .05 * u * u); }
    pg.computeVertexNormals();
    const pearlMat = new THREE.MeshPhysicalMaterial({ color: "#F8F2E9", roughness: .12, clearcoat: 1, clearcoatRoughness: .08, iridescence: .35, sheen: .3 });
    const ball = new THREE.SphereGeometry(1, 28, 20);
    const items = [];
    let VW = 6, VH = 10;
    const spawn = (o, top) => { o.d = .3 + rnd() * .9; o.x = (rnd() - .5) * VW * 1.1; o.y = top ? VH * (.55 + rnd() * .3) : (rnd() - .5) * VH * 1.2; o.z = -5 + o.d * 5; o.v = .18 + rnd() * .3; o.ph = rnd() * 6; o.rs = [rnd() - .5, rnd() - .5, rnd() - .5].map(v => v * 1.6); };
    for (let i = 0; i < A.petals; i++){ const m = new THREE.Mesh(pg, new THREE.MeshPhysicalMaterial({ color: A.colors[i % A.colors.length], roughness: .4, sheen: 1, sheenRoughness: .3, sheenColor: new THREE.Color("#ffffff"), side: THREE.DoubleSide, transparent: true, opacity: .85, emissive: new THREE.Color(A.colors[i % A.colors.length]), emissiveIntensity: .35 })); m.scale.setScalar(.55 + rnd() * .3); scene.add(m); const o = { m }; spawn(o); items.push(o); }
    for (let i = 0; i < A.pearls; i++){ const m = new THREE.Mesh(ball, pearlMat); m.scale.setScalar(.045 + rnd() * .05); scene.add(m); const o = { m, pearl: true }; spawn(o); items.push(o); }

    function size(){ const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); VH = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(20)); VW = VH * camera.aspect; }
    size(); addEventListener("resize", size);
    let last = performance.now(), lastScroll = scrollY, vis = true;
    document.addEventListener("visibilitychange", () => { vis = !document.hidden; });
    function frame(now){
      requestAnimationFrame(frame);
      const on = document.documentElement.classList.contains("opened");
      canvas.style.opacity = on ? "1" : "0";
      if (!on || !vis){ last = now; return; }
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const ds = (scrollY - lastScroll) / innerHeight * VH; lastScroll = scrollY;
      for (const o of items){
        o.y -= o.v * dt * (o.pearl ? .7 : 1); o.y += ds * (.25 + o.d * .7);            // deeper things move less with the page
        if (o.y < -VH * .7 || o.y > VH * .9) spawn(o, o.y < 0);
        const t = now / 1000 + o.ph;
        o.m.position.set(o.x + Math.sin(t * .6) * .35 * o.d, o.y, o.z);
        if (!o.pearl) o.m.rotation.set(t * o.rs[0], t * o.rs[1], t * o.rs[2] + Math.sin(t) * .4);
      }
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
  }
})();
