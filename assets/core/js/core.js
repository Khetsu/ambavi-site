/* =====================================================================
   ამბავი · ციფრული მოსაწვევები — საერთო ძრავა (ერთნაირია ყველა დიზაინში).
   მონაცემები: js/config.js · ტექსტები: js/i18n.js · ეფექტები: js/fx.js · მუსიკა: js/music.js
   URL პარამეტრები: ?lang=en · ?open (კონვერტის გარეშე) · ?preview (კატალოგის მინი-ხედი)
   ===================================================================== */
(function(){
"use strict";
const C = window.CONFIG || {}, I = window.I18N, FX = window.FX, MU = window.Music;
const root = document.documentElement;
const $ = id => document.getElementById(id);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const Q = new URLSearchParams(location.search);
const PREVIEW = Q.has("preview"), SKIP = Q.has("open");
const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = window.matchMedia && matchMedia("(pointer: fine)").matches;
const TZ = C.tz == null ? 4 : C.tz;
const [Y, M, D] = String(C.date || "2027-01-01").split("-").map(Number);
const WD = new Date(Date.UTC(Y, M - 1, D)).getUTCDay();
const pad = n => String(n).padStart(2, "0");
const enc = encodeURIComponent;
const store = { get(k){ try { return localStorage.getItem(k); } catch(_) { return null; } }, set(k, v){ try { localStorage.setItem(k, v); } catch(_) {} } };
const KEY = "ambavi:" + (C.id || location.pathname);
let lang = Q.get("lang") || store.get(KEY + ":lang") || "ka";
if (!I[lang]) lang = "ka";
let t = I[lang], V = {};
const L = v => v == null ? "" : (typeof v === "object" && !Array.isArray(v)) ? String(v[lang] != null ? v[lang] : (v.ka != null ? v.ka : "")) : String(v);
const unset = v => { const s = L(v); return !s || /\[.*\]/.test(s); };
const events = () => C.events || [];
const mainEvent = () => events().find(e => e.main) || events()[0] || { time: "12:00" };
if (PREVIEW) root.classList.add("preview");

/* ---------- shared UI injected into every design ---------- */
const RSVP_HTML =
  '<form id="rsvp-form" novalidate>' +
  '<p class="intro" data-i18n="rsvpIntro"></p>' +
  '<div class="field"><label for="r-name" data-i18n="nameLabel"></label><input class="input" id="r-name" name="name" type="text" autocomplete="name" data-i18n-ph="namePh"><p class="err" id="r-name-err" data-i18n="nameErr" hidden></p></div>' +
  '<fieldset class="choices"><legend class="legend" data-i18n="attend"></legend>' +
  '<div class="choice"><input type="radio" id="r-yes" name="attend" value="yes" checked><label for="r-yes"><svg><use href="#i-yes"/></svg><span data-i18n="yes"></span></label></div>' +
  '<div class="choice"><input type="radio" id="r-no" name="attend" value="no"><label for="r-no"><svg><use href="#i-no"/></svg><span data-i18n="no"></span></label></div></fieldset>' +
  '<div class="field" id="count-field"><span class="legend" id="r-count-label" data-i18n="countLabel"></span><div class="stepper" role="group" aria-labelledby="r-count-label"><button type="button" id="r-minus" aria-label="−1">−</button><output id="r-count" aria-live="polite">1</output><button type="button" id="r-plus" aria-label="+1">+</button><span class="unit" data-i18n="guests"></span></div></div>' +
  '<div class="field"><label for="r-note"><span data-i18n="noteLabel"></span> <span class="opt" data-i18n="optional"></span></label><textarea class="textarea" id="r-note" name="note" data-i18n-ph="notePh"></textarea></div>' +
  '<button class="btn solid submit" type="submit"><svg><use href="#i-send"/></svg><span data-i18n="submit"></span></button>' +
  '</form>' +
  '<div class="done" id="rsvp-done" hidden><div class="badge"><svg><use href="#i-heart"/></svg></div><h3 id="done-title"></h3><p data-i18n="doneText"></p><div class="preview" id="msg-preview"></div>' +
  '<div class="send"><a class="btn wa" id="send-wa" href="#" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg>WhatsApp</a><a class="btn tg" id="send-tg" href="#" target="_blank" rel="noopener"><svg><use href="#i-tg"/></svg>Telegram</a>' +
  '<button type="button" class="btn copy" id="send-copy"><svg><use href="#i-copy"/></svg><span id="copy-label" data-i18n="copy"></span></button></div>' +
  '<button type="button" class="again" id="rsvp-again" data-i18n="again"></button></div>';

function chrome(){
  document.body.insertAdjacentHTML("afterbegin",
    '<div class="progress" id="progress" aria-hidden="true"></div>' +
    '<div class="lang" role="group" aria-label="ენა / Language"><button type="button" data-lang="ka">ქარ</button><button type="button" data-lang="en">EN</button></div>');
  document.body.insertAdjacentHTML("beforeend",
    '<button type="button" class="music" id="music" data-i18n-aria="musicAria" hidden><svg class="on"><use href="#i-note"/></svg>' +
    '<svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="18" cy="16" r="3" fill="currentColor"/><path d="M3 3l18 18"/></svg></button>');
  const ctas = document.querySelector("[data-ctas]");
  if (ctas) ctas.innerHTML =
    '<a class="btn solid" id="cal" href="#" target="_blank" rel="noopener"><svg><use href="#i-cal"/></svg><span data-i18n="addCal"></span></a>' +
    '<a class="btn ghost" href="#rsvp"><svg><use href="#i-heart"/></svg><span data-i18n="rsvpCta"></span></a>' +
    '<div class="mini"><button type="button" id="ics"><svg><use href="#i-cal"/></svg><span data-i18n="ics"></span></button>' +
    '<button type="button" id="share"><svg><use href="#i-share"/></svg><span id="share-label" data-i18n="share"></span></button></div>';
  const cnt = $("count");
  if (cnt){
    const rings = cnt.hasAttribute("data-rings"), names = { d: "days", h: "hours", m: "minutes", s: "seconds" };
    cnt.innerHTML = Object.keys(names).map(k => '<div class="cd cd-' + k + '">' +
      (rings ? '<svg class="cd-ring" viewBox="0 0 100 100" aria-hidden="true"><circle class="tr" cx="50" cy="50" r="44"/><circle class="pg" id="ring-' + k + '" cx="50" cy="50" r="44"/></svg>' : "") +
      '<b id="cd-' + k + '">–</b><small data-i18n="' + names[k] + '"></small></div>').join("");
    cnt.insertAdjacentHTML("afterend", '<p class="count-done" id="count-done" data-i18n="countDone" hidden></p>');
  }
  const box = $("rsvp-box");
  if (box) box.insertAdjacentHTML("beforeend", RSVP_HTML);
}

/* ---------- photo: shows a frame until the file exists, then the real photo or the ready-made illustration ---------- */
function photo(src, alt){
  const d = document.createElement("div");
  d.className = "photo";
  d.innerHTML = '<div class="ph"><svg><use href="#i-camera"/></svg><b></b><small></small></div>';
  d.querySelector("b").textContent = t.photoHere;
  d.querySelector("small").textContent = src || "";
  if (src){
    const img = new Image();
    img.alt = alt || ""; img.decoding = "async";
    img.onload = () => d.classList.add("has");
    img.onerror = () => {
      if (!img.dataset.fb && !/\.svg$/i.test(src)){ img.dataset.fb = "1"; img.src = "images/art/" + src.split("/").pop().replace(/\.\w+$/, "") + ".svg"; }
      else img.remove();
    };
    img.src = src;
    d.appendChild(img);
  }
  return d;
}

/* ---------- text ---------- */
function fill(){
  t = Object.assign({}, I[lang], (C.texts && C.texts[lang]) || {});
  root.lang = lang;
  document.title = L(C.title) || L(C.host);
  const city = L(C.city);
  V = {
    host: L(C.host), script: L(C.script), monogram: C.monogram || "",
    day: pad(D), dayNum: String(D), month: t.months[M - 1], year: String(Y), weekday: t.weekdays[WD],
    dots: pad(D) + " · " + pad(M) + " · " + Y,
    dateLong: t.when(D, t.months[M - 1]) + ", " + Y,
    city, weekdayCity: t.weekdays[WD] + (city ? " · " + city : ""),
    time: mainEvent().time || ""
  };
  $$("[data-t]").forEach(el => { const k = el.dataset.t; el.textContent = k in V ? V[k] : L(C[k]); });
  $$("[data-i18n]").forEach(el => { const v = t[el.dataset.i18n]; if (typeof v === "string") el.textContent = v; });
  $$("[data-i18n-ph]").forEach(el => { el.placeholder = t[el.dataset.i18nPh] || ""; });
  $$("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t[el.dataset.i18nAria] || ""));
  $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  const gate = $("gate"); if (gate) gate.setAttribute("aria-label", t.openAria);
  letters();
  $$("[data-photo]").forEach(el => { el.textContent = ""; el.appendChild(photo(C[el.dataset.photo], V.host)); });
  lists();
  calendar();
  const done = $("rsvp-done");
  if (done && !done.hidden) buildMessage();
}

/* split a line into letters for staggered entrance animations */
function letters(){
  $$("[data-letters]").forEach(el => {
    const k = el.dataset.letters, txt = k in V ? V[k] : L(C[k]);
    el.textContent = ""; el.setAttribute("aria-label", txt);
    let i = 0;
    txt.split(/(\s+)/).forEach(part => {
      if (/^\s+$/.test(part)){ el.appendChild(document.createTextNode(" ")); return; }
      const w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
      [...part].forEach(ch => { const s = document.createElement("span"); s.className = "ch"; s.textContent = ch; s.style.setProperty("--i", i++); w.appendChild(s); });
      el.appendChild(w);
    });
  });
}

/* ---------- lists rendered from <template> elements of each design ---------- */
const F = (n, f) => n.querySelector('[data-f="' + f + '"]');
function setText(n, f, v){ const el = F(n, f); if (!el) return; if (v) el.textContent = v; else el.remove(); }
function render(boxId, tplId, items, fn){
  const box = $(boxId), tpl = $(tplId);
  if (!box || !tpl) return;
  box.textContent = "";
  (items || []).forEach((it, i) => {
    const n = tpl.content.firstElementChild.cloneNode(true);
    n.style.setProperty("--i", i);
    fn(n, it, i);
    box.appendChild(n);
  });
  observe(box.querySelectorAll("[data-anim]"));
}
function mapUrl(ev){
  if (/^https?:/.test(ev.map || "")) return ev.map;
  const q = ev.map || (L(ev.place) + (L(C.city) ? ", " + L(C.city) : ""));
  return "https://www.google.com/maps/search/?api=1&query=" + enc(q);
}
function lists(){
  $$("[data-section]").forEach(s => { const a = C[s.dataset.section]; s.hidden = !(a && a.length); });
  render("story", "tpl-story", C.story, (n, s, i) => {
    if (i % 2) n.classList.add("flip");
    setText(n, "year", L(s.year)); setText(n, "season", L(s.season)); setText(n, "title", L(s.title)); setText(n, "text", L(s.text));
    const ps = F(n, "photo"); if (ps) ps.appendChild(photo(s.photo, L(s.title)));
  });
  render("day", "tpl-event", events(), (n, ev) => {
    if (ev.main) n.classList.add("main");
    setText(n, "time", ev.time); setText(n, "title", L(ev.title));
    const place = unset(ev.place) ? "" : L(ev.place);
    setText(n, "place", place + (place && L(C.city) && !ev.noCity ? ", " + L(C.city) : ""));
    setText(n, "note", L(ev.note));
    const ic = n.querySelector('[data-f="icon"] use'); if (ic) ic.setAttribute("href", "#i-" + (ev.icon || "star"));
    const ps = F(n, "photo"); if (ps){ if (ev.photo) ps.appendChild(photo(ev.photo, L(ev.title))); else ps.remove(); }
    const a = F(n, "map");
    if (a){ if (!place) a.remove(); else { a.href = mapUrl(ev); a.target = "_blank"; a.rel = "noopener"; const s = a.querySelector("[data-f=maptext]") || a; s.textContent = t.map; } }
  });
  render("details", "tpl-detail", C.details, (n, d) => {
    const ic = n.querySelector('[data-f="icon"] use'); if (ic) ic.setAttribute("href", "#i-" + (d.icon || "star"));
    setText(n, "label", L(d.label)); setText(n, "value", L(d.value));
  });
  render("gallery", "tpl-photo", C.photos, (n, src, i) => {
    n.classList.add("g" + (i + 1));
    const ps = F(n, "photo") || n; ps.appendChild(photo(src, V.host + " · " + (i + 1)));
  });
}

/* ---------- calendar: Google link + .ics file for iPhone / Outlook ---------- */
let ics = "";
function utc(hm, addH){
  const [h, m] = String(hm || "12:00").split(":").map(Number);
  return new Date(Date.UTC(Y, M - 1, D, h - TZ + (addH || 0), m || 0)).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
function calendar(){
  const evs = events(), first = (evs[0] || mainEvent()).time, lastT = (evs[evs.length - 1] || mainEvent()).time;
  const title = L(C.calTitle) || L(C.title);
  const loc = (unset(mainEvent().place) ? "" : L(mainEvent().place) + ", ") + L(C.city);
  const details = evs.map(e => e.time + " " + L(e.title) + (unset(e.place) ? "" : ", " + L(e.place))).join("\n");
  const start = utc(first), end = utc(lastT, 3);
  const cal = $("cal");
  if (cal) cal.href = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + enc(title) + "&dates=" + start + "/" + end + "&location=" + enc(loc) + "&details=" + enc(details + "\n\n" + location.href.split("?")[0]);
  const esc = s => String(s).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ambavi//Invitation//KA", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    "UID:" + start + "-" + (C.id || "ambavi") + "@ambavi", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""),
    "DTSTART:" + start, "DTEND:" + end, "SUMMARY:" + esc(title), "LOCATION:" + esc(loc), "DESCRIPTION:" + esc(details),
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:" + esc(title), "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}

/* ---------- countdown to the main event (Tbilisi time by default) ---------- */
function countdown(){
  const box = $("count"); if (!box) return;
  const [hh, mm] = String(mainEvent().time || "12:00").split(":").map(Number);
  const target = Date.UTC(Y, M - 1, D, hh - TZ, mm || 0, 0);
  const CIRC = 2 * Math.PI * 44, rings = {};
  ["d", "h", "m", "s"].forEach(k => { const r = $("ring-" + k); if (r){ r.style.strokeDasharray = CIRC; r.style.strokeDashoffset = CIRC; rings[k] = r; } });
  const set = (k, v, frac) => {
    const el = $("cd-" + k); if (!el) return;
    if (el.textContent !== String(v)){ el.textContent = v; if (!REDUCED){ el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } }
    if (rings[k]) rings[k].style.strokeDashoffset = CIRC * (1 - Math.max(0, Math.min(1, frac)));
  };
  function tick(){
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    if (!s){ box.hidden = true; const dn = $("count-done"); if (dn) dn.hidden = false; return; }
    const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    set("d", d, d / 365); set("h", pad(h), h / 24); set("m", pad(m), m / 60); set("s", pad(sec), sec / 60);
  }
  tick(); setInterval(tick, 1000);
}

/* ---------- scroll reveals, parallax, progress ---------- */
const io = (!REDUCED && "IntersectionObserver" in window) ? new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; el.classList.remove("pre"); io.unobserve(el);
  setTimeout(() => el.classList.add("shown"), 2400);
}), { threshold: .12, rootMargin: "0px 0px -6% 0px" }) : null;
function observe(list){
  if (!io) return;
  Array.from(list).forEach(el => {
    if (el.dataset.seen) return; el.dataset.seen = "1";
    if (el.getBoundingClientRect().top > innerHeight * .9){ el.classList.add("pre"); io.observe(el); }
  });
}
function scrollFx(){
  const bar = $("progress"), px = $$("[data-parallax]");
  let ticking = false;
  function upd(){
    const h = root.scrollHeight - innerHeight, p = h > 0 ? scrollY / h : 0;
    if (bar) bar.style.transform = "scaleX(" + p + ")";
    root.style.setProperty("--sp", p.toFixed(4));
    if (!REDUCED) px.forEach(el => {
      const r = (el.parentElement || el).getBoundingClientRect();
      if (r.bottom < -300 || r.top > innerHeight + 300) return;
      el.style.translate = "0 " + (-((r.top + r.height / 2) - innerHeight / 2) * (+el.dataset.parallax || .1)).toFixed(1) + "px";
    });
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking){ ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  addEventListener("resize", upd);
  upd();
}

/* ---------- RSVP ---------- */
let msg = "", count = 1;
function buildMessage(){
  const nameIn = $("r-name"), note = $("r-note"), form = $("rsvp-form");
  const n = nameIn.value.trim(), yes = form.querySelector('input[name="attend"]:checked').value === "yes", note2 = note.value.trim();
  const to = L(C.rsvpTo) || V.host, ev = L(C.rsvpEvent) || "", when = t.when(D, t.monthsDat[M - 1]);
  msg = yes ? t.msgYes(to, n, ev, when, count) : t.msgNo(to, n, ev, when);
  if (note2) msg += "\n\n" + note2;
  $("msg-preview").textContent = msg;
  $("done-title").textContent = yes ? t.thanks(n.split(" ")[0]) : t.thanksNo;
  const e = enc(msg), wa = String(C.whatsapp || "").replace(/\D/g, "");
  $("send-wa").href = "https://wa.me/" + wa + "?text=" + e;
  $("send-tg").href = "https://t.me/share/url?url=" + enc(location.href.split("?")[0]) + "&text=" + e;
  $("copy-label").textContent = t.copy;
}
function rsvp(){
  const form = $("rsvp-form"); if (!form) return;
  const done = $("rsvp-done"), box = $("rsvp-box"), nameIn = $("r-name"), out = $("r-count"), minus = $("r-minus"), plus = $("r-plus");
  const max = C.maxGuests || 10;
  const attending = () => form.querySelector('input[name="attend"]:checked').value === "yes";
  const setCount = n => { count = Math.min(max, Math.max(1, n)); out.textContent = count; minus.disabled = count <= 1; plus.disabled = count >= max; };
  setCount(1);
  minus.onclick = () => setCount(count - 1);
  plus.onclick = () => setCount(count + 1);
  form.addEventListener("change", e => { if (e.target.name === "attend") $("count-field").hidden = !attending(); });
  nameIn.addEventListener("input", () => { $("r-name-err").hidden = true; });
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!nameIn.value.trim()){ $("r-name-err").hidden = false; nameIn.focus(); return; }
    buildMessage();
    form.hidden = true; done.hidden = false;
    box.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
    if (attending() && FX){
      setTimeout(() => { const r = box.getBoundingClientRect(); FX.burst(C.rsvpFx || "confetti", r.left + r.width / 2, Math.max(80, r.top + 90)); }, 450);
      if (C.rsvpFx === "firework") FX.fireworks(4);
    }
  });
  $("send-copy").addEventListener("click", () => {
    const ok = () => { $("copy-label").textContent = t.copied; };
    const fallback = () => { const sel = getSelection(), rng = document.createRange(); rng.selectNodeContents($("msg-preview")); sel.removeAllRanges(); sel.addRange(rng); $("copy-label").textContent = t.selected; };
    try { navigator.clipboard.writeText(msg).then(ok, fallback); } catch(_) { fallback(); }
  });
  $("rsvp-again").addEventListener("click", () => { done.hidden = true; form.hidden = false; nameIn.focus(); });
}

/* ---------- small actions: .ics, share, language, ripple, taps, cursor trail ---------- */
function actions(){
  const icsBtn = $("ics");
  if (icsBtn) icsBtn.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    a.download = (C.id || "invitation") + ".ics"; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });
  const sh = $("share");
  if (sh) sh.addEventListener("click", () => {
    const url = location.href.split("?")[0], data = { title: document.title, text: L(C.shareText) || document.title, url };
    if (navigator.share) navigator.share(data).catch(() => {});
    else { try { navigator.clipboard.writeText(url).then(() => { $("share-label").textContent = t.shared; }); } catch(_) {} }
  });
  $$(".lang button").forEach(b => b.addEventListener("click", e => {
    e.stopPropagation();
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang; store.set(KEY + ":lang", lang); fill();
  }));
  document.addEventListener("pointerdown", e => {
    const b = e.target.closest(".btn"); if (!b || REDUCED) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, k = document.createElement("span");
    k.className = "ripple"; k.style.width = k.style.height = s + "px";
    k.style.left = (e.clientX - r.left - s / 2) + "px"; k.style.top = (e.clientY - r.top - s / 2) + "px";
    b.appendChild(k); setTimeout(() => k.remove(), 800);
  });
  document.addEventListener("click", e => {
    const sb = e.target.closest("[data-scroll]");
    if (sb){ const el = $(sb.dataset.scroll); if (el) el.scrollBy({ left: (+sb.dataset.dir || 1) * el.clientWidth * .8, behavior: REDUCED ? "auto" : "smooth" }); return; }
    const el = e.target.closest("[data-tap]");
    if (el && FX && root.classList.contains("opened")) FX.burst(el.dataset.tap, e.clientX, e.clientY, 24);
  });
  if (FX && FINE && !REDUCED && !PREVIEW && C.trail !== false){
    let lt = 0;
    addEventListener("pointermove", e => { const n = performance.now(); if (n - lt < 40 || !root.classList.contains("opened")) return; lt = n; FX.trail(e.clientX, e.clientY); }, { passive: true });
  }
}

/* ---------- opening: the design's gate plays its stages, then the page appears ---------- */
function gate(){
  const g = $("gate"), btn = $("music");
  const sync = () => { if (btn && MU) btn.classList.toggle("playing", MU.playing); };
  if (btn) btn.addEventListener("click", () => { if (!MU) return; MU.playing ? MU.pause() : MU.start(C.music); sync(); });
  function opened(){
    root.classList.remove("gated"); root.classList.add("opened"); root.style.overflow = "";
    if (btn && !PREVIEW) btn.hidden = false;
    $$("[data-anim]").forEach(el => observe([el]));
    if (FX && gatedFx) FX.setModes(C.fx || []);
    if (FX && C.openFx){ const [k, n] = String(C.openFx).split(":"); if (k === "firework") FX.fireworks(+n || 5); else FX.burst(k, innerWidth / 2, innerHeight * .4, +n || 0); }
  }
  if (!g || SKIP){ if (g) g.hidden = true; opened(); return; }
  g.hidden = false; root.classList.add("gated");
  const stages = (g.dataset.stages || "").split(",").filter(Boolean).map(s => { const [c, ms] = s.split(":"); return [c.trim(), +ms]; });
  const bursts = (g.dataset.burst || "").split(";").filter(Boolean).map(s => s.split(":"));
  const openAt = +(g.dataset.open || 3000), k = REDUCED ? .2 : 1;
  let started = false;
  function go(){
    if (started || PREVIEW) return; started = true;
    if (MU){ MU.start(C.music); sync(); }
    g.classList.add("go");
    stages.forEach(([c, ms]) => setTimeout(() => g.classList.add(c), ms * k));
    if (FX) bursts.forEach(([ms, kind, sel, n]) => setTimeout(() => {
      const el = sel && g.querySelector(sel), r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
      if (kind === "fireworks") FX.fireworks(+n || 4); else FX.burst(kind, r.left + r.width / 2, r.top + r.height / 2, +n || 0);
    }, +ms * k));
    setTimeout(() => { g.classList.add("open"); opened(); setTimeout(() => { g.hidden = true; }, 1500); }, openAt * k);
  }
  g.addEventListener("click", go);
  g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); go(); } });
  window.Ambavi = { open: go };
}

/* ---------- start ---------- */
chrome();
fill();
/* while the gate is closed only the design's gate effects run (config: fxGate); the page effects start after opening */
const gatedFx = !!$("gate") && !SKIP;
if (FX) FX.init({ modes: gatedFx ? (C.fxGate || []) : (C.fx || []), density: PREVIEW ? .55 : (C.fxDensity || 1) });
actions();
rsvp();
countdown();
scrollFx();
gate();
$$("[data-anim]").forEach(el => observe([el]));
})();
