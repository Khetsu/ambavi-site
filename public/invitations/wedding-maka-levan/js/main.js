/* მაკა და ლევანი · საიტის ლოგიკა: ენა, ისტორია, განრიგი, უკუთვლა, დასწრება, კონვერტი და ეფექტები.
   მონაცემები config.js-შია, ტექსტები i18n.js-ში. */
(function(){
"use strict";
const C = window.CONFIG, I = window.I18N;
const $ = id => document.getElementById(id);
const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = window.matchMedia && matchMedia("(pointer: fine)").matches;
const [Y, M, D] = C.date.split("-").map(Number);
const WD = new Date(Date.UTC(Y, M - 1, D)).getUTCDay();
const pad = n => String(n).padStart(2, "0");
const unset = s => !s || /\[.*\]/.test(s);
const store = { get(k){ try { return localStorage.getItem(k); } catch(_) { return null; } }, set(k, v){ try { localStorage.setItem(k, v); } catch(_) {} } };

let lang = store.get("maka-levani-lang") === "en" ? "en" : "ka";
const T = () => I[lang];
const en = () => lang === "en";
const pick = (ka, e) => en() ? (e || ka) : ka;
const groom = () => en() ? C.groomEn : C.groom;
const bride = () => en() ? C.brideEn : C.bride;
const city = () => en() ? (C.cityEn || C.city) : C.city;
const mainEvent = () => C.events.find(e => e.main) || C.events[0];

/* ---------- photo with placeholder: shows the frame until the file exists ---------- */
function photo(src, label){
  const d = document.createElement("div");
  d.className = "photo";
  d.innerHTML = '<div class="ph"><svg><use href="#i-photo"/></svg><b>' + T().photoHere + '</b><small></small></div>';
  d.querySelector("small").textContent = src || "";
  if (src){
    const img = new Image();
    img.alt = label || ""; img.decoding = "async";
    img.onload = () => d.classList.add("has");
    img.onerror = () => { if (!img.dataset.fb){ img.dataset.fb = "1"; img.src = "images/art/" + src.split("/").pop().replace(/\.\w+$/, "") + ".svg"; } else img.remove(); };
    img.src = src;
    d.appendChild(img);
  }
  return d;
}

/* ---------- text ---------- */
function fill(){
  const t = T();
  document.documentElement.lang = lang;
  document.title = groom() + t.and + bride();
  const vals = {
    monogram: C.monogram,
    latinNames: C.brideEn + " & " + C.groomEn,
    eyebrowShort: en() ? "Wedding invitation" : "საქორწილო მოსაწვევი",
    dots: pad(D) + " · " + pad(M) + " · " + Y,
    whereLine: t.weekdays[WD] + (unset(city()) ? "" : " · " + city()),
    lead: pick(C.lead, C.leadEn),
    toast: pick(C.toast, C.toastEn),
    storyIntro: pick(C.storyIntro, C.storyIntroEn)
  };
  document.querySelectorAll("[data-t]").forEach(el => {
    if (el.classList.contains("nm")) return;
    el.textContent = vals[el.dataset.t] ?? "";
  });
  document.querySelectorAll("[data-i18n]").forEach(el => { const v = t[el.dataset.i18n]; if (typeof v === "string") el.textContent = v; });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t[el.dataset.i18nPh]; });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t[el.dataset.i18nAria]); });
  $("gate").setAttribute("aria-label", t.openAria);
  $("music").setAttribute("aria-label", t.musicAria);
  document.querySelectorAll(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  names();
  $("date-line").innerHTML = '<span class="m">' + t.months[M - 1] + '</span><span class="d foil">' + pad(D) + '</span><span class="y">' + Y + '</span>';
  $("date-line").setAttribute("aria-label", t.when(D, t.months[M - 1]) + " " + Y);
  const hp = $("hero-photo"); hp.textContent = ""; hp.appendChild(photo(C.heroPhoto, C.brideEn + " & " + C.groomEn));
  story();
  schedule();
  gallery();
  calendar();
  if (!$("rsvp-done").hidden) buildMessage();
}

/* names in Georgian, letter by letter with a soft blur-in */
function names(){
  const h = $("names"), parts = h.querySelectorAll(".nm");
  let i = 0;
  [bride(), groom()].forEach((word, k) => {
    parts[k].textContent = "";
    [...word].forEach(ch => {
      const s = document.createElement("span");
      s.className = "ch"; s.textContent = ch; s.style.setProperty("--i", i++);
      parts[k].appendChild(s);
    });
  });
  h.setAttribute("aria-label", bride() + " & " + groom());
}

/* ---------- our story ---------- */
function story(){
  const ol = $("story");
  ol.querySelectorAll(".chap").forEach(n => n.remove());
  C.story.forEach((s, i) => {
    const li = document.createElement("li");
    li.className = "chap" + (i % 2 ? " flip" : "");
    li.innerHTML = '<div class="pic"></div><span class="dot" aria-hidden="true"><svg><use href="#heart"/></svg></span>' +
      '<div class="txt"><span class="yr foil"></span><span class="ssn"></span><h3></h3><p></p></div>';
    li.querySelector(".pic").appendChild(photo(s.photo, pick(s.title, s.titleEn)));
    li.querySelector(".yr").textContent = s.year;
    li.querySelector(".ssn").textContent = pick(s.season, s.seasonEn);
    li.querySelector("h3").textContent = pick(s.title, s.titleEn);
    li.querySelector("p").textContent = pick(s.text, s.textEn);
    ol.appendChild(li);
  });
  watch(ol.querySelectorAll(".chap"));
}

/* ---------- schedule ---------- */
function schedule(){
  const ol = $("day"), t = T();
  ol.textContent = "";
  C.events.forEach(ev => {
    const li = document.createElement("li");
    li.className = "stop";
    const where = unset(C.city) ? ev.place : ev.place + ", " + city();
    li.innerHTML = '<span class="tm"></span><span class="ic"><svg><use href="#i-' + (ev.icon || "rings") + '"/></svg></span>' +
      '<div class="info"><h3></h3><p></p>' +
      (unset(ev.place) ? "" : '<a class="map" target="_blank" rel="noopener"><svg><use href="#pin"/></svg><span></span></a>') + '</div>';
    li.classList.toggle("has-pic", !!ev.photo);
    li.querySelector(".tm").textContent = ev.time;
    li.querySelector("h3").textContent = pick(ev.title, ev.titleEn);
    li.querySelector("p").textContent = where;
    if (ev.photo){
      const wrap = document.createElement("div"); wrap.className = "evpic";
      wrap.appendChild(photo(ev.photo, ev.place)); li.appendChild(wrap);
    }
    const a = li.querySelector(".map");
    if (a){
      a.lastChild.textContent = t.map;
      a.href = /^https?:/.test(ev.map) ? ev.map : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ev.map || where);
    }
    ol.appendChild(li);
  });
  watch(ol.querySelectorAll(".stop"));
}

/* ---------- gallery ---------- */
function gallery(){
  const ul = $("gallery");
  ul.textContent = "";
  (C.photos || []).forEach((src, i) => {
    const li = document.createElement("li");
    li.className = "g" + (i + 1);
    li.appendChild(photo(src, C.brideEn + " & " + C.groomEn + " · " + (i + 1)));
    ul.appendChild(li);
  });
  watch(ul.querySelectorAll("li"));
}

/* ---------- calendar ---------- */
function calendar(){
  const d1 = Y + pad(M) + pad(D), next = new Date(Date.UTC(Y, M - 1, D + 1));
  const d2 = next.getUTCFullYear() + pad(next.getUTCMonth() + 1) + pad(next.getUTCDate());
  const details = C.events.map(e => e.time + " " + pick(e.title, e.titleEn) + (unset(e.place) ? "" : ", " + e.place)).join("\n");
  $("cal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(T().weddingOf(bride(), groom())) +
    "&dates=" + d1 + "/" + d2 +
    (unset(C.city) ? "" : "&location=" + encodeURIComponent(city())) +
    "&details=" + encodeURIComponent(details);
}

/* ---------- countdown rings, to the main event, Tbilisi time (UTC+4) ---------- */
(function(){
  const [hh, mm] = (mainEvent().time || "12:00").split(":").map(Number);
  const target = Date.UTC(Y, M - 1, D, hh - 4, mm || 0, 0);
  const CIRC = 2 * Math.PI * 44;
  document.querySelectorAll(".ringbox .pg").forEach(c => { c.style.strokeDasharray = CIRC; c.style.strokeDashoffset = CIRC; });
  const set = (id, v, frac) => {
    const el = $("cd-" + id);
    if (el.textContent !== String(v)){
      el.textContent = v;
      if (!REDUCED){ el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); }
    }
    $("ring-" + id).style.strokeDashoffset = CIRC * (1 - Math.min(1, Math.max(0, frac)));
  };
  function tick(){
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    if (s === 0){ $("count").hidden = true; $("count-done").hidden = false; return; }
    const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    set("d", d, d / 365);
    set("h", pad(h), h / 24);
    set("m", pad(m), m / 60);
    set("s", pad(sec), sec / 60);
  }
  tick(); setInterval(tick, 1000);
})();

/* ---------- effects ---------- */
/* gold glitter that twinkles and drifts up */
function glitter(box, n){
  if (REDUCED || !box) return;
  for (let i = 0; i < n; i++){
    const s = document.createElement("span"), k = .5 + Math.random();
    s.style.left = (Math.random() * 100) + "%";
    s.style.top = (Math.random() * 100) + "%";
    s.style.width = s.style.height = (2 + Math.random() * 4) * k + "px";
    const dur = 4 + Math.random() * 6;
    s.style.animationDuration = dur + "s, " + (dur * 1.7) + "s";
    s.style.animationDelay = (-Math.random() * dur) + "s";
    box.appendChild(s);
  }
}

/* rose and ivory petals falling in 3D */
function petals(n){
  if (REDUCED) return;
  const box = $("petals"), tones = [["#FFFFFF", "#F2DCD6"], ["#F6D9D2", "#E2AFA6"], ["#FFF4E6", "#EBD2B0"]];
  for (let i = 0; i < n; i++){
    const p = document.createElement("span"), c = tones[i % tones.length], k = .6 + Math.random() * .9;
    p.className = "petal";
    p.innerHTML = '<svg viewBox="0 0 20 26"><defs><linearGradient id="pg' + i + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><path d="M10 1C17 6 19 16 10 25C1 16 3 6 10 1Z" fill="url(#pg' + i + ')" stroke="rgba(180,140,90,.25)" stroke-width=".5"/><path d="M10 4V22" stroke="rgba(180,140,90,.18)" stroke-width=".6"/></svg>';
    const dur = 12 + Math.random() * 12;
    p.style.left = (Math.random() * 100) + "%";
    p.style.width = 16 * k + "px"; p.style.height = 21 * k + "px";
    p.style.setProperty("--sway", (30 + Math.random() * 70) + "px");
    p.style.animationDuration = dur + "s, " + (3 + Math.random() * 3) + "s";
    p.style.animationDelay = (-Math.random() * dur) + "s, " + (-Math.random() * 4) + "s";
    box.appendChild(p);
  }
}

/* shimmer burst of tiny stars */
function burst(host, x, y, n){
  if (REDUCED) return;
  for (let i = 0; i < n; i++){
    const s = document.createElement("span"); s.className = "spark";
    if (i % 4 === 0){ s.classList.add("h"); s.textContent = "\u2665"; }
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 160;
    s.style.left = (x - 6) + "px"; s.style.top = (y - 6) + "px";
    s.style.setProperty("--x", Math.cos(a) * d + "px");
    s.style.setProperty("--y", Math.sin(a) * d + "px");
    s.style.setProperty("--s", (.5 + Math.random() * 1.1).toFixed(2));
    s.style.animation = "burst " + (.9 + Math.random() * .9) + "s cubic-bezier(.2,.7,.2,1) forwards";
    host.appendChild(s);
    setTimeout(() => s.remove(), 1900);
  }
}

function confetti(){
  if (REDUCED) return;
  const box = $("confetti"), colors = ["#E9D6A3", "#BF9B57", "#F6D9D2", "#FFFFFF", "#C9D3BE", "#E2AFA6"];
  for (let i = 0; i < 64; i++){
    const c = document.createElement("i");
    c.style.left = (Math.random() * 100) + "%";
    c.style.background = colors[i % colors.length];
    c.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    c.style.setProperty("--r", (Math.random() * 900 - 450) + "deg");
    c.style.animationDuration = (2.6 + Math.random() * 2) + "s";
    c.style.animationDelay = (Math.random() * .6) + "s";
    box.appendChild(c);
    setTimeout(() => c.remove(), 5400);
  }
}

/* sparkle trail behind the cursor */
if (FINE && !REDUCED){
  let last = 0;
  document.addEventListener("pointermove", e => {
    const now = performance.now();
    if (now - last < 55 || document.documentElement.classList.contains("gated")) return;
    last = now;
    const s = document.createElement("span");
    s.className = "trail";
    s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
    s.style.setProperty("--dx", (Math.random() * 30 - 15) + "px");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }, {passive: true});
}

/* light sweep on buttons */
document.addEventListener("pointerdown", e => {
  const b = e.target.closest(".btn, .submit, .copy");
  if (!b || REDUCED) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, k = document.createElement("span");
  k.className = "ripple";
  k.style.width = k.style.height = s + "px";
  k.style.left = (e.clientX - r.left - s / 2) + "px"; k.style.top = (e.clientY - r.top - s / 2) + "px";
  b.appendChild(k); setTimeout(() => k.remove(), 800);
});

/* scroll: gold thread on top, portrait parallax, story line that draws itself */
(function(){
  const bar = $("progress"), halo = document.querySelector(".portrait-wrap"), ol = $("story"), fillEl = $("tl-fill");
  let ticking = false;
  function update(){
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
    if (!REDUCED && halo) halo.style.transform = "translateY(" + Math.min(scrollY, 600) * .08 + "px)";
    if (ol && fillEl){
      const r = ol.getBoundingClientRect(), p = (innerHeight * .6 - r.top) / r.height;
      fillEl.style.transform = "scaleY(" + Math.min(1, Math.max(0, p)) + ")";
    }
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive: true});
  addEventListener("resize", update);
  update();
})();

/* scroll reveal: visible at rest; the animation plays when an element enters view */
const io = (!REDUCED && "IntersectionObserver" in window) ? new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
}), {threshold: .12}) : null;
function watch(list){
  if (!io) return;
  list.forEach(el => { el.classList.add("reveal"); if (el.getBoundingClientRect().top > innerHeight) io.observe(el); else el.classList.add("in"); });
}

/* ---------- RSVP ---------- */
let msg = "", count = 1;
const form = $("rsvp-form"), done = $("rsvp-done"), box = $("rsvp-box");
const nameIn = $("r-name"), note = $("r-note"), out = $("r-count"), minus = $("r-minus"), plus = $("r-plus");
const attending = () => form.querySelector('input[name="attend"]:checked').value === "yes";
const setCount = n => { count = Math.min(10, Math.max(1, n)); out.textContent = count; minus.disabled = count <= 1; plus.disabled = count >= 10; };
setCount(1);
minus.onclick = () => setCount(count - 1);
plus.onclick = () => setCount(count + 1);
form.addEventListener("change", e => { if (e.target.name === "attend") $("count-field").hidden = !attending(); });
nameIn.addEventListener("input", () => { $("r-name-err").hidden = true; });

function buildMessage(){
  const t = T(), n = nameIn.value.trim(), yes = attending(), note2 = note.value.trim();
  const couple = bride() + t.and + groom(), when = t.when(D, t.monthsDat[M - 1]);
  msg = yes ? t.msgYes(couple, n, when, count) : t.msgNo(couple, n, when);
  if (note2) msg += "\n\n" + note2;
  $("msg-preview").textContent = msg;
  $("done-title").textContent = yes ? t.thanks(n.split(" ")[0]) : t.thanksNo;
  const enc = encodeURIComponent(msg);
  $("send-wa").href = "https://wa.me/" + (C.whatsapp || "") + "?text=" + enc;
  $("send-tg").href = "https://t.me/share/url?url=" + encodeURIComponent(" ") + "&text=" + enc;
  $("copy-label").textContent = t.copy;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!nameIn.value.trim()){ $("r-name-err").hidden = false; nameIn.focus(); return; }
  buildMessage();
  form.hidden = true; done.hidden = false;
  box.scrollIntoView({behavior: REDUCED ? "auto" : "smooth", block: "start"});
  if (attending()){ burst(box, box.clientWidth / 2, 80, 30); confetti(); }
});
$("send-copy").addEventListener("click", () => {
  const ok = () => { $("copy-label").textContent = T().copied; };
  const fallback = () => {
    const sel = getSelection(), rng = document.createRange();
    rng.selectNodeContents($("msg-preview")); sel.removeAllRanges(); sel.addRange(rng);
    $("copy-label").textContent = T().selected;
  };
  try { navigator.clipboard.writeText(msg).then(ok, fallback); } catch(_) { fallback(); }
});
$("rsvp-again").addEventListener("click", () => { done.hidden = true; form.hidden = false; nameIn.focus(); });

/* ---------- language switch ---------- */
document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", e => {
  e.stopPropagation();
  if (b.dataset.lang === lang) return;
  lang = b.dataset.lang; store.set("maka-levani-lang", lang); fill();
}));

/* ---------- envelope: seal cracks, flap opens, letter rises, golden light, the page appears ---------- */
(function(){
  const gate = $("gate"), btn = $("music"), seal = $("seal"), M2 = window.Music;
  const sync = () => btn.classList.toggle("playing", M2.playing);
  const TM = REDUCED ? [0, 0, 100, 300, 600] : [0, 560, 1000, 2300, 4300];
  function open(){
    if (gate.classList.contains("cracking")) return;
    M2.start(); sync();
    gate.classList.add("cracking");
    setTimeout(() => {
      gate.classList.add("broken");
      const g = gate.getBoundingClientRect(), r = seal.getBoundingClientRect();
      burst(gate, r.left - g.left + r.width / 2, r.top - g.top + r.height / 2, 38);
    }, TM[1]);
    setTimeout(() => gate.classList.add("flap-open"), TM[2]);
    setTimeout(() => gate.classList.add("letter-out"), TM[3]);
    setTimeout(() => {
      document.documentElement.classList.remove("gated");
      gate.classList.add("open");
      document.documentElement.style.overflow = "";
      btn.hidden = false;
      setTimeout(() => { gate.hidden = true; }, 1300);
    }, TM[4]);
  }
  gate.addEventListener("click", open);
  gate.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); open(); } });
  btn.addEventListener("click", () => { M2.playing ? M2.pause() : M2.start(); sync(); });
})();

/* ---------- start ---------- */
fill();
glitter($("gate-glitter"), innerWidth < 600 ? 26 : 46);
glitter($("page-glitter"), innerWidth < 600 ? 14 : 26);
petals(innerWidth < 600 ? 7 : 12);
watch(document.querySelectorAll(".reveal"));
})();
