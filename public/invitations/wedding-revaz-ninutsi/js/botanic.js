/* ამბავი · „ზეთისხილის ბაღი“ — გვირგვინები და ტოტები იხატება SVG-ით (ფოთლები, კენკრა, ყვავილები).
   ეკრანზე გამოჩენისას ღერო „იზრდება“ და ფოთლები თანმიმდევრობით იშლება. */
(function(){
"use strict";
const NS = "http://www.w3.org/2000/svg";
let seed = 11;
const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pick = a => a[(R() * a.length) | 0];
const el = (tag, at) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); return e; };
const LEAF = "M0 0C6-7.5 18-7.5 24 0C18 7.5 6 7.5 0 0Z";
const GREENS = ["#7E9C78", "#6F8F6A", "#94AE8C", "#5E7D5B", "#A9BFA2", "#88A68A"];
const BLUSH = ["#E8C3BB", "#F0D3CC", "#D9A8A0"], BLUE = ["#A9BDD0", "#BFD0DF", "#93AAC2"];
const deg = a => a * Math.PI / 180;

/* position lives on a wrapper <g>, the animation only scales the inner shape (CSS transforms would replace the SVG transform) */
function leaf(g, x, y, rot, s, i){
  const w = el("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s.toFixed(2)})` });
  const l = el("path", { d: LEAF, class: "lf", fill: pick(GREENS) });
  l.style.setProperty("--i", i);
  w.appendChild(l); g.appendChild(w);
}
function flower(g, x, y, r, cols, i){
  const w = el("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }), f = el("g", { class: "fl" });
  f.style.setProperty("--i", i); w.appendChild(f);
  const c = pick(cols), rot = R() * 72;
  for (let k = 0; k < 5; k++){ const a = deg(rot + k * 72); f.appendChild(el("ellipse", { cx: (Math.cos(a) * r * .55).toFixed(1), cy: (Math.sin(a) * r * .55).toFixed(1), rx: (r * .55).toFixed(1), ry: (r * .4).toFixed(1), fill: c, transform: `rotate(${(rot + k * 72).toFixed(0)} ${(Math.cos(a) * r * .55).toFixed(1)} ${(Math.sin(a) * r * .55).toFixed(1)})`, opacity: ".95" })); }
  f.appendChild(el("circle", { r: (r * .26).toFixed(1), fill: "#F3D9A0" }));
  g.appendChild(w);
}

/* a wreath: two olive branches growing up from a posy of flowers at the bottom */
function wreath(svg){
  const cx = 150, cy = 150, r = +(svg.dataset.r || 108), g = el("g", {});
  let i = 0;
  for (const [a0, a1] of [[100, 258], [80, -78]]){
    const dir = Math.sign(a1 - a0), n = 34;
    const p = a => [cx + Math.cos(deg(a)) * r, cy + Math.sin(deg(a)) * r];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    g.appendChild(el("path", { class: "stem", pathLength: "1", d: `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${x1.toFixed(1)} ${y1.toFixed(1)}`, fill: "none", stroke: "#7A8A62", "stroke-width": "1.6", "stroke-linecap": "round" }));
    for (let k = 0; k < n; k++){
      const t = k / (n - 1), a = a0 + (a1 - a0) * t, [x, y] = p(a), tang = a + 90 * dir, side = k % 2 ? 1 : -1, s = .95 - t * .45 + R() * .15;
      leaf(g, x, y, tang + side * (38 + R() * 16) + (dir < 0 ? 180 : 0), s, i++);
      if (k % 5 === 2){ const [bx, by] = p(a + dir * 2); g.appendChild(Object.assign(el("circle", { cx: (bx + side * 6).toFixed(1), cy: (by + 4).toFixed(1), r: "2.6", fill: pick(["#5E7D5B", "#3F5F45"]), class: "lf" }), {})).style.setProperty("--i", i); }
    }
  }
  // posy of flowers at the bottom
  const [bx, by] = [cx, cy + r];
  for (const [dx, dy, rr, cols] of [[-14, -4, 11, BLUSH], [12, -6, 12, BLUSH], [0, 8, 9, BLUE], [-26, 6, 7, BLUE], [26, 6, 7, ["#F6F1E6"]], [0, -16, 7, ["#F6F1E6"]]]) flower(g, bx + dx, by + dy, rr, cols, i++);
  svg.appendChild(g);
}

/* a corner sprig of olive / eucalyptus */
function sprig(svg){
  const g = el("g", {});
  const d = "M6 6C60 30 120 50 170 96S236 170 254 196";
  g.appendChild(el("path", { class: "stem", pathLength: "1", d, fill: "none", stroke: "#7A8A62", "stroke-width": "2", "stroke-linecap": "round" }));
  const path = el("path", { d }); svg.appendChild(path);
  const L = path.getTotalLength ? path.getTotalLength() : 0; let i = 0;
  if (L) for (let s = 14; s < L - 6; s += 13){
    const q = path.getPointAtLength(s), q2 = path.getPointAtLength(Math.min(L, s + 2)), tang = Math.atan2(q2.y - q.y, q2.x - q.x) * 180 / Math.PI, sc = 1.15 - s / L * .55;
    leaf(g, q.x, q.y, tang - 42 - R() * 12, sc, i++); leaf(g, q.x, q.y, tang + 42 + R() * 12, sc * .92, i++);
  }
  path.remove();
  for (const [x, y] of [[96, 50], [150, 78], [200, 130]]) flower(g, x, y, 9, R() < .5 ? BLUSH : BLUE, i++);
  svg.appendChild(g);
}

document.querySelectorAll("svg[data-wreath]").forEach(wreath);
document.querySelectorAll("svg[data-sprig]").forEach(sprig);

/* grow when visible; the gate wreath grows right away */
const live = el => el.classList.add("live");
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ live(e.target); io.unobserve(e.target); } }), { threshold: .2 }) : null;
document.querySelectorAll("svg[data-wreath], svg[data-sprig]").forEach(s => {
  if (s.closest(".gate")) { live(s); return; }
  if (!io) { live(s); return; }
  const start = () => io.observe(s);
  if (document.documentElement.classList.contains("gated")) new MutationObserver((m, o) => { if (!document.documentElement.classList.contains("gated")){ o.disconnect(); setTimeout(start, 300); } }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  else start();
});
})();
