/* =====================================================================
   ამბავი · საიტის სკრიპტი (ყველა გვერდისთვის საერთო)
   მონაცემებს იღებს assets/site/js/data.js-დან (window.SITE). აქ ტექსტების შეცვლა არ არის საჭირო.

   სარჩევი:
     icons          ხატულები ერთ ადგილას (<svg><use href="#s-..."/>)
     navigation     მიმდინარე გვერდი მენიუში, მობილურის მენიუ
     contact links  WhatsApp / Instagram / Facebook / ელფოსტა, „5 დღე“, მზადობის თარიღი
     design cards   დიზაინების ბარათები და ფილტრები   (HTML-ში: data-designs="all|featured")
     features ...   ფუნქციები, დამატებითი სერვისები, პაკეტები (data-feats, data-extras, data-packs)
     order form     შეკვეთის ფორმა → WhatsApp შეტყობინება (order.html)
     phone screens  ტელეფონებში ცოცხალი მოსაწვევები: ზომა, ჩატვირთვა, ავტომატური სქროლი
   ===================================================================== */
(function(){
"use strict";
const S = window.SITE || {}, C = S.contact || {}, DAYS = S.days || 5;
const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const enc = encodeURIComponent;
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const MONTHS = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
const fmt = d => d.getDate() + " " + MONTHS[d.getMonth()];
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const txt = (e, t) => { e.textContent = t; return e; };

/* ---------- icons (one sprite for every page) ---------- */
const G = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  "s-env": '<g ' + G + '><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 8l9 6 9-6"/></g>',
  "s-note": '<path d="M9 18V5l12-2v13" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="18" cy="16" r="3" fill="currentColor"/>',
  "s-clock": '<g ' + G + '><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>',
  "s-wa": '<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/>',
  "s-map": '<g ' + G + '><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></g>',
  "s-cal": '<g ' + G + '><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></g>',
  "s-lang": '<g ' + G + '><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></g>',
  "s-photo": '<g ' + G + '><path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13.5" r="3.5"/></g>',
  "s-spark": '<path d="M12 2c.6 4.6 2.4 7.4 8 8-5.6.6-7.4 3.4-8 8-.6-4.6-2.4-7.4-8-8 5.6-.6 7.4-3.4 8-8z" fill="currentColor"/>',
  "s-link": '<g ' + G + '><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></g>',
  "s-eye": '<g ' + G + '><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></g>',
  "s-cube": '<g ' + G + '><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/></g>',
  "s-video": '<g ' + G + '><rect x="3" y="5" width="13" height="14" rx="2"/><path d="M16 10l5-3v10l-5-3"/></g>',
  "s-copy": '<g ' + G + '><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></g>',
  "s-check": '<path d="M5 12.5l4.5 4.5L19 7.5" ' + G + ' stroke-width="2.2"/>',
  "s-arrow": '<path d="M5 12h14M13 6l6 6-6 6" ' + G + ' stroke-width="1.8"/>',
  "s-insta": '<g ' + G + '><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></g>',
  "s-fb": '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z" fill="currentColor"/>',
  "s-mail": '<g ' + G + '><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></g>'
};
document.body.insertAdjacentHTML("afterbegin", '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
  Object.keys(ICONS).map(k => '<symbol id="' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>').join("") + '</svg>');
const icon = (id, cls) => '<svg class="' + (cls || "i") + '" aria-hidden="true"><use href="#' + id + '"/></svg>';

/* ---------- navigation: current page + mobile menu ---------- */
const page = document.body.dataset.page;
$$(".nav nav a").forEach(a => { if (a.dataset.page === page) a.setAttribute("aria-current", "page"); });
const burger = $(".burger");
if (burger) burger.addEventListener("click", () => { const o = document.body.classList.toggle("menu-open"); burger.setAttribute("aria-expanded", String(o)); });
$$(".nav nav a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

/* ---------- contact links, production time, year ---------- */
const waNum = String(C.whatsapp || "").replace(/\D/g, "");
const waLink = text => "https://wa.me/" + waNum + "?text=" + enc(text);
$$(".js-wa").forEach(a => { a.href = waLink(a.dataset.text || "გამარჯობა! მინდა ციფრული მოსაწვევის შეკვეთა."); a.target = "_blank"; a.rel = "noopener"; });
$$(".js-insta").forEach(a => { if (C.instagram){ a.href = "https://instagram.com/" + C.instagram; a.target = "_blank"; a.rel = "noopener"; } else a.hidden = true; });
$$(".js-fb").forEach(a => { if (C.facebook){ a.href = "https://facebook.com/" + C.facebook; a.target = "_blank"; a.rel = "noopener"; } else a.hidden = true; });
$$(".js-mail").forEach(a => { if (C.email){ a.href = "mailto:" + C.email; } else a.hidden = true; });
$$(".js-days").forEach(e => { e.textContent = DAYS; });
$$(".js-ready").forEach(e => { const d = new Date(); d.setDate(d.getDate() + DAYS); e.textContent = fmt(d); });
$$(".js-year").forEach(e => { e.textContent = new Date().getFullYear(); });
$$(".js-count").forEach(e => { e.textContent = (S.designs || []).length; });

/* ---------- design cards with live previews ---------- */
function card(d, i){
  const url = encodeURI(d.url), c = el("article", "card reveal");
  c.dataset.type = d.type; c.style.setProperty("--i", i % 3); c.style.setProperty("--tone", d.tone);
  c.innerHTML = '<div class="stage"><div class="phone"><div class="screen"><iframe tabindex="-1" loading="lazy"></iframe><div class="shade"></div></div></div></div>' +
    '<div class="body"><div class="tags"></div><h3></h3><p class="who"></p><p class="desc"></p>' +
    '<div class="acts"><a class="btn dark" target="_blank" rel="noopener">' + icon("s-eye") + 'ნახვა</a><a class="btn line">შეკვეთა</a></div></div>';
  const f = $("iframe", c); f.dataset.src = url + (d.noPreview ? "" : "?preview"); f.title = d.name;
  const tags = $(".tags", c); tags.appendChild(txt(el("span", "tag"), (S.types || {})[d.type] || ""));
  (d.tags || []).forEach(t => tags.appendChild(txt(el("span", "tag dim"), t)));
  txt($("h3", c), d.name); txt($(".who", c), d.who); txt($(".desc", c), d.desc);
  const [view, order] = $$(".acts a", c); view.href = url; order.href = "order.html?design=" + enc(d.id);
  return c;
}
$$("[data-designs]").forEach(grid => {
  const only = grid.dataset.designs, list = (S.designs || []).filter(d => only !== "featured" || d.featured);
  list.forEach((d, i) => grid.appendChild(card(d, i)));
  const fl = grid.dataset.filters && $(grid.dataset.filters);
  if (!fl) return;
  const used = new Set(list.map(d => d.type)), want = new URLSearchParams(location.search).get("type") || "all";
  const apply = type => { $$("button", fl).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.type === type))); $$(".card", grid).forEach(c => { c.hidden = type !== "all" && c.dataset.type !== type; }); };
  Object.keys(S.types || {}).filter(k => k === "all" || used.has(k)).forEach(k => { const b = txt(el("button"), S.types[k]); b.type = "button"; b.dataset.type = k; fl.appendChild(b); });
  fl.addEventListener("click", e => { const b = e.target.closest("button"); if (b) apply(b.dataset.type); });
  apply(used.has(want) ? want : "all");
});

/* ---------- features, extras, packages ---------- */
$$("[data-feats]").forEach(box => (S.feats || []).slice(0, +box.dataset.feats || 99).forEach(([ic, h, p], i) => {
  const f = el("div", "feat reveal", '<span class="ic">' + icon(ic, "") + '</span><h3></h3><p></p>'); f.style.setProperty("--i", i % 4);
  txt($("h3", f), h); txt($("p", f), p); box.appendChild(f);
}));
$$("[data-extras]").forEach(box => (S.extras || []).forEach(([ic, h, p], i) => {
  const f = el("div", "feat reveal", '<span class="ic">' + icon(ic, "") + '</span><h3></h3><p></p>'); f.style.setProperty("--i", i);
  txt($("h3", f), h); txt($("p", f), p); box.appendChild(f);
}));
$$("[data-packs]").forEach(box => (S.packages || []).forEach((p, i) => {
  const k = el("div", "pack reveal" + (p.popular ? " popular" : "")); k.style.setProperty("--i", i);
  k.innerHTML = (p.popular ? '<span class="flag"></span>' : "") + '<h3></h3><p class="note"></p><p class="price"></p><p class="time"></p><ul></ul><a class="btn"></a>';
  if (p.popular) txt($(".flag", k), p.note);
  txt($("h3", k), p.name); txt($(".note", k), p.popular ? "" : p.note);
  const pr = $(".price", k); if (p.price) pr.textContent = p.price; else { pr.textContent = "ფასი შეკვეთისას"; pr.classList.add("ask"); }
  txt($(".time", k), "მზადდება " + DAYS + " დღეში");
  p.items.forEach(t => $("ul", k).appendChild(txt(el("li"), t)));
  const b = $(".btn", k); b.href = "order.html?package=" + enc(p.id); b.textContent = "შეკვეთა"; b.classList.add(p.popular ? "gold" : "line");
  box.appendChild(k);
}));

/* ---------- order form → WhatsApp ---------- */
const form = $("#order-form");
if (form){
  const q = new URLSearchParams(location.search);
  const typeSel = $("#o-type"), designSel = $("#o-design"), packSel = $("#o-pack"), date = $("#o-date"), ready = $("#o-ready");
  Object.keys(S.types || {}).filter(k => k !== "all").forEach(k => { const o = txt(el("option"), S.types[k]); o.value = k; typeSel.appendChild(o); });
  (S.designs || []).forEach(d => { const o = txt(el("option"), d.name + " · " + d.who); o.value = d.id; designSel.appendChild(o); });
  (S.packages || []).forEach(p => { const o = txt(el("option"), p.name + (p.price ? " — " + p.price : "")); o.value = p.id; packSel.appendChild(o); });
  const pre = (S.designs || []).find(d => d.id === q.get("design"));
  if (pre){ designSel.value = pre.id; typeSel.value = pre.type; }
  if (q.get("package")) packSel.value = q.get("package");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const done = new Date(today); done.setDate(done.getDate() + DAYS);
  date.min = today.toISOString().slice(0, 10);
  const showReady = () => {
    ready.classList.remove("warn");
    let t = "თუ დღეს შეუკვეთავთ, მოსაწვევი მზად იქნება " + fmt(done) + "-ს (" + DAYS + " დღე).";
    if (date.value){
      const ev = new Date(date.value + "T00:00:00"), left = Math.round((ev - today) / 864e5);
      if (left < DAYS + 3){ ready.classList.add("warn"); t = "ღონისძიებამდე " + Math.max(0, left) + " დღეა, მოსაწვევს კი " + DAYS + " დღე სჭირდება და სტუმრებსაც დრო უნდათ. მოგვწერეთ და ერთად მოვიფიქრებთ."; }
      else t += " სტუმრებს მისი გაგზავნა შეგეძლებათ ღონისძიებამდე " + (left - DAYS) + " დღით ადრე.";
    }
    $("span", ready).textContent = t;
  };
  date.addEventListener("change", showReady); showReady();
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#o-name"), err = $("#o-err");
    if (!name.value.trim() || !typeSel.value){ err.hidden = false; (name.value.trim() ? typeSel : name).focus(); return; }
    err.hidden = true;
    const opt = s => s.value ? s.options[s.selectedIndex].text : "";
    const lines = ["გამარჯობა! მინდა ციფრული მოსაწვევის შეკვეთა.", "",
      "სახელი: " + name.value.trim(),
      $("#o-phone").value.trim() && "ტელეფონი: " + $("#o-phone").value.trim(),
      "ღონისძიება: " + opt(typeSel),
      date.value && "თარიღი: " + fmt(new Date(date.value + "T00:00:00")) + " " + date.value.slice(0, 4),
      designSel.value && "დიზაინი: " + opt(designSel),
      packSel.value && "პაკეტი: " + opt(packSel),
      $("#o-msg").value.trim() && "\n" + $("#o-msg").value.trim()].filter(Boolean);
    const msg = lines.join("\n"), link = waLink(msg);
    $("#o-send").href = link; $("#o-preview").textContent = msg;
    form.hidden = true; $("#o-done").hidden = false;
    window.open(link, "_blank", "noopener");
    $("#o-done").scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
  });
  $("#o-copy").addEventListener("click", () => { try { navigator.clipboard.writeText($("#o-preview").textContent).then(() => { $("#o-copy span").textContent = "დაკოპირდა ✓"; }); } catch (_) {} });
  $("#o-again").addEventListener("click", () => { $("#o-done").hidden = true; form.hidden = false; });
}

/* ---------- phone screens: scale the 390px page into the frame, load when visible ---------- */
const fit = s => s.style.setProperty("--s", (s.clientWidth / 390).toFixed(4));
const screens = $$(".screen");
if ("ResizeObserver" in window){ const ro = new ResizeObserver(es => es.forEach(e => fit(e.target))); screens.forEach(s => ro.observe(s)); } else screens.forEach(fit);
const load = f => { if (!f.src && f.dataset.src) f.src = f.dataset.src; };
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  if (e.target.tagName === "IFRAME") load(e.target); else e.target.classList.add("in");
  io.unobserve(e.target);
}), { rootMargin: "200px 0px" }) : null;
$$("iframe[data-src]").forEach(f => io ? io.observe(f) : load(f));
$$(".reveal").forEach(r => io ? io.observe(r) : r.classList.add("in"));

/* slowly scroll through an opened invitation inside a phone */
$$("iframe[data-autoscroll]").forEach(f => {
  if (REDUCED) return;
  f.addEventListener("load", () => {
    let w; try { w = f.contentWindow; w.document.documentElement.style.scrollBehavior = "auto"; } catch (_) { return; }
    let y = 0, dir = 1, pause = 120;
    (function step(){
      try {
        const max = w.document.documentElement.scrollHeight - w.innerHeight;
        if (pause > 0) pause--; else { y += dir * 1.1; if (y >= max || y <= 0){ dir = -dir; pause = 150; y = Math.max(0, Math.min(max, y)); } w.scrollTo(0, y); }
      } catch (_) { return; }
      requestAnimationFrame(step);
    })();
  });
});
})();
