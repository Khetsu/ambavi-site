/* ამბავი · ორიგინალური მელოდიები, Web Audio-თი ცოცხლად სინთეზირებული (ფაილი არ სჭირდება).
   config.js → music: "romance" (ფორტეპიანოს ბალადა) | "waltz" (გიტარა-არფა) | "party" (საცეკვაო)
                       "kids" (ქსილოფონი და უკულელე) | "lullaby" (მუსიკალური ყუთი)
                       "kartuli" (ქართული: ფანდური, დუდუკი, მრავალხმიანი ბანი და დოლი — ორიგინალური მელოდია)
   საკუთარი სიმღერა: music: "music/song.mp3" (mp3 / m4a / ogg / wav, დგება მოსაწვევის music/ საქაღალდეში).
   YouTube: music: "https://www.youtube.com/watch?v=..." — უკრავს YouTube-ის ოფიციალური პატარა ფლეერით (ქვედა კუთხეში).
   თუ ფაილი ან ვიდეო ვერ ჩაიტვირთა, ჟღერს musicFallback-ის მელოდია (მაგ. musicFallback: "kartuli"). */
window.Music = (function(){
"use strict";
let ctx = null, out = null, bus = null, wet = null, dest = null, timer = null, EV = [], LOOP = 0, STEP = .25, loopStart = 0, idx = 0, playing = false, noiseBuf = null, warned = false;
let audio = null;
const isFile = n => /\.(mp3|m4a|aac|ogg|oga|wav|webm)(\?|$)/i.test(String(n || ""));
/* your own song from a file: loops, fades in; falls back to a built-in melody if the file is missing */
function startFile(src){
  if (!audio){
    audio = new Audio(src); audio.loop = true; audio.preload = "auto"; audio.volume = 0;
    audio.addEventListener("error", () => { audio = null; playing = false; const fb = (window.CONFIG || {}).musicFallback; if (fb && !isFile(fb)) start(fb); }, { once: true });
  }
  playing = true;
  const p = audio.play(); if (p && p.catch) p.catch(() => {});
  const a = audio, t0 = performance.now(), up = () => { if (!a || a !== audio || !playing) return; const k = Math.min(1, (performance.now() - t0) / 1500); a.volume = .85 * k; if (k < 1) requestAnimationFrame(up); }; up();
  return true;
}
/* ---------- YouTube: the official embedded player in a small card; loaded early so a tap can start it ---------- */
const ytId = n => { const m = String(n || "").match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; };
let yt = null, ytReady = false, ytWant = false, ytCard = null;
function ytFail(){ ytWant = false; playing = false; if (ytCard) ytCard.hidden = true; yt = null; const fb = (window.CONFIG || {}).musicFallback; if (fb && !isFile(fb) && !ytId(fb)) start(fb); }
function ytPrepare(id){
  if (ytCard) return;
  const css = document.createElement("style");
  css.textContent = ".yt-card{position:fixed;left:14px;bottom:calc(max(16px,env(safe-area-inset-bottom)) + 58px);z-index:171;width:200px;border-radius:14px;overflow:hidden;background:#000;box-shadow:0 12px 30px rgba(0,0,0,.28);transition:opacity .4s,transform .4s}" +
    ".yt-card iframe{display:block;width:200px;height:113px;border:0}.yt-x{position:absolute;top:4px;right:4px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font:16px/26px system-ui;text-align:center}" +
    ".preview .yt-card{display:none!important}";
  document.head.appendChild(css);
  ytCard = document.createElement("div"); ytCard.className = "yt-card"; ytCard.hidden = true;
  ytCard.innerHTML = '<div id="yt-player"></div><button type="button" class="yt-x" aria-label="✕">✕</button>';
  document.body.appendChild(ytCard);
  ytCard.querySelector(".yt-x").addEventListener("click", e => { e.stopPropagation(); pause(); ytCard.hidden = true; const b = document.getElementById("music"); if (b) b.classList.remove("playing"); });
  const make = () => { yt = new YT.Player("yt-player", { videoId: id, width: 200, height: 113,
    playerVars: { playsinline: 1, loop: 1, playlist: id, rel: 0, modestbranding: 1 },
    events: {
      onReady: () => { ytReady = true; if (ytWant){ yt.playVideo(); } },
      onStateChange: e => { if (e.data === 1) playing = true; if (e.data === 2 && !ytWant) playing = false; const b = document.getElementById("music"); if (b) b.classList.toggle("playing", playing); },
      onError: ytFail } }); };
  if (window.YT && window.YT.Player) make();
  else { const prev = window.onYouTubeIframeAPIReady; window.onYouTubeIframeAPIReady = () => { if (prev) prev(); make(); };
    const sc = document.createElement("script"); sc.src = "https://www.youtube.com/iframe_api"; sc.onerror = ytFail; document.head.appendChild(sc); }
}
function startYT(id){ ytPrepare(id); ytWant = true; playing = true; ytCard.hidden = false; if (yt && ytReady) yt.playVideo(); return true; }
(function(){ const id = ytId((window.CONFIG || {}).music); if (!id || location.protocol === "file:") return; if (document.body) ytPrepare(id); else document.addEventListener("DOMContentLoaded", () => ytPrepare(id)); })();
const hz = m => 440 * Math.pow(2, (m - 69) / 12), rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- songs: chords = one per bar {b: bass, n: chord}, mel = [bar, step, midi, length] ---------- */
const G = {b: 43, n: [55, 59, 62]}, Dj = {b: 50, n: [57, 62, 66]}, Em = {b: 40, n: [55, 59, 64]}, Cg = {b: 48, n: [55, 60, 64]};
const C1 = {b: 48, n: [60, 64, 67]}, G1 = {b: 43, n: [59, 62, 67]}, Am = {b: 45, n: [60, 64, 69]}, F1 = {b: 41, n: [60, 65, 69]};
const KD = {b: 38, n: [62, 66, 69]}, KC = {b: 36, n: [60, 64, 67]}, KG = {b: 43, n: [62, 67, 71]}, KDc = {b: 38, n: [62, 69, 74]};
const SONGS = {
  romance: { bpm: 72, div: 2, bar: 8, wet: .42, gain: 1.4, lead: "piano", leadVel: 1.15,
    chords: [{b: 38, n: [62, 66, 69]}, {b: 49, n: [61, 64, 69]}, {b: 47, n: [62, 66, 71]}, {b: 43, n: [62, 67, 71]}, {b: 38, n: [62, 66, 69]}, {b: 45, n: [61, 64, 69]}, {b: 43, n: [62, 67, 71]}, {b: 45, n: [61, 64, 69]}],
    mel: [[0,0,78,3],[0,3,76,1],[0,4,74,2],[0,6,69,2],[1,0,73,3],[1,3,74,1],[1,4,76,4],[2,0,74,3],[2,3,73,1],[2,4,71,2],[2,6,78,2],[3,0,79,3],[3,3,78,1],[3,4,76,4],
          [4,0,81,3],[4,3,78,1],[4,4,74,2],[4,6,78,2],[5,0,76,3],[5,3,73,1],[5,4,69,2],[5,6,73,2],[6,0,71,2],[6,2,74,2],[6,4,79,2],[6,6,78,1],[6,7,76,1],[7,0,76,4],[7,4,73,2],[7,6,76,2]],
    parts: [
      { i: "piano", s: [0], note: c => c.b, v: .8 },
      { i: "piano", s: [4], note: c => c.b + 7, v: .55 },
      { i: "piano", s: [1, 2, 3, 5, 6, 7], note: (c, s, k) => c.n[[0, 1, 2, 2, 1, 0][k]], v: .3 },
      { i: "pad", s: [0], chord: true, v: .8, d: 8 }
    ] },
  waltz: { bpm: 112, div: 2, bar: 8, wet: .3, gain: 1.4, lead: "lead",
    chords: [G, Dj, Em, Cg, G, Dj, Cg, Dj],
    mel: [[0,0,71,2],[0,2,74,1],[0,3,79,1],[0,4,78,2],[0,6,74,2],[1,0,69,2],[1,2,74,1],[1,3,78,1],[1,4,76,2],[1,6,74,2],[2,0,76,2],[2,2,74,1],[2,3,71,1],[2,4,67,2],[2,6,71,2],
          [3,0,72,2],[3,2,76,1],[3,3,79,1],[3,4,76,4],[4,0,74,2],[4,2,71,1],[4,3,74,1],[4,4,79,2],[4,6,78,2],[5,0,76,2],[5,2,78,1],[5,3,81,1],[5,4,78,2],[5,6,74,2],
          [6,0,76,1],[6,1,74,1],[6,2,72,2],[6,4,74,2],[6,6,76,2],[7,0,74,2],[7,2,78,2],[7,4,81,2],[7,6,78,2]],
    parts: [
      { i: "lowpluck", s: [0, 4], note: (c, s) => s ? c.b + 7 : c.b },
      { i: "pluck", s: [1, 2, 3, 5, 6, 7], note: (c, s, k) => c.n[[0, 1, 2, 1, 2, 1][k]] + 12, v: .45 },
      { i: "pad", s: [0], chord: true, v: .9, d: 8 },
      { i: "shaker", s: [1, 3, 5, 7] }
    ] },
  party: { bpm: 120, div: 4, bar: 16, wet: .2, gain: .85, lead: "synth",
    chords: [{b: 41, n: [65, 69, 72]}, {b: 48, n: [64, 67, 72]}, {b: 50, n: [65, 69, 74]}, {b: 46, n: [65, 70, 74]}, {b: 41, n: [65, 69, 72]}, {b: 48, n: [64, 67, 72]}, {b: 50, n: [65, 69, 74]}, {b: 46, n: [65, 70, 74]}],
    mel: [[0,0,81,2],[0,2,81,2],[0,4,79,2],[0,6,77,2],[0,8,81,4],[0,12,84,4],[1,0,79,2],[1,2,79,2],[1,4,77,2],[1,6,76,2],[1,8,79,6],[1,14,72,2],
          [2,0,77,2],[2,2,77,2],[2,4,76,2],[2,6,74,2],[2,8,77,4],[2,12,81,4],[3,0,79,4],[3,4,77,2],[3,6,74,2],[3,8,77,4],[3,12,79,4],
          [4,0,81,2],[4,2,84,2],[4,4,81,2],[4,6,77,2],[4,8,81,2],[4,10,84,2],[4,12,86,4],[5,0,84,4],[5,4,79,2],[5,6,76,2],[5,8,79,4],[5,12,84,4],
          [6,0,86,2],[6,2,84,2],[6,4,81,2],[6,6,77,2],[6,8,81,4],[6,12,79,4],[7,0,77,4],[7,4,79,4],[7,8,81,4],[7,12,79,4]],
    parts: [
      { i: "kick", s: [0, 4, 8, 12] },
      { i: "clap", s: [4, 12] },
      { i: "hat", s: [2, 6, 10, 14], v: .8, d: 2 },
      { i: "hat", s: [1, 3, 5, 7, 9, 11, 13, 15], v: .35 },
      { i: "bass", s: [0, 3, 6, 8, 11, 14], note: (c, s, k) => c.b + [0, 12, 0, 0, 12, 0][k], d: 2, v: .9 },
      { i: "stab", s: [2, 6, 10, 14], chord: true, v: .7 },
      { i: "pad", s: [0], chord: true, v: .55, d: 16 }
    ] },
  kids: { bpm: 126, div: 2, bar: 8, wet: .18, lead: "marimba",
    chords: [C1, G1, Am, F1, C1, F1, G1, C1],
    mel: [[0,0,76,1],[0,1,79,1],[0,2,84,2],[0,4,79,1],[0,5,76,1],[0,6,79,2],[1,0,74,1],[1,1,79,1],[1,2,83,2],[1,4,79,1],[1,5,74,1],[1,6,79,2],
          [2,0,72,1],[2,1,76,1],[2,2,81,2],[2,4,79,1],[2,5,76,1],[2,6,72,2],[3,0,77,1],[3,1,81,1],[3,2,84,2],[3,4,81,2],[3,6,79,2],
          [4,0,76,2],[4,2,76,1],[4,3,77,1],[4,4,79,2],[4,6,76,2],[5,0,77,2],[5,2,81,1],[5,3,79,1],[5,4,77,2],[5,6,81,2],
          [6,0,79,1],[6,1,81,1],[6,2,79,1],[6,3,77,1],[6,4,76,1],[6,5,74,1],[6,6,71,2],[7,0,72,2],[7,2,76,2],[7,4,79,1],[7,5,76,1],[7,6,72,2]],
    parts: [
      { i: "strum", s: [0, 2, 3, 5, 6], chord: true, v: .5 },
      { i: "bass", s: [0, 4, 6], note: (c, s, k) => c.b + [0, 0, 7][k], v: .8, d: 2 },
      { i: "clap", s: [2, 6], v: .6 },
      { i: "kick", s: [0, 4], v: .55 },
      { i: "shaker", s: [0, 1, 2, 3, 4, 5, 6, 7], v: .7 }
    ] },
  /* original melody in the manner of Georgian folk polyphony: 6/8, D mixolydian, drone bass,
     panduri strums, a duduk-like lead and a cadence on the open fifth */
  kartuli: { bpm: 92, div: 2, bar: 6, wet: .36, gain: 1.35, lead: "duduk",
    chords: [KD, KC, KD, KG, KD, KC, KG, KDc, KD, KC, KD, KG, KD, KC, KG, KDc],
    mel: [[0,0,69,2],[0,2,71,1],[0,3,69,1],[0,4,66,2],[1,0,67,2],[1,2,64,1],[1,3,67,1],[1,4,72,2],[2,0,69,3],[2,3,67,1],[2,4,66,1],[2,5,64,1],
          [3,0,62,2],[3,2,67,2],[3,4,71,2],[4,0,74,2],[4,2,72,1],[4,3,71,1],[4,4,69,2],[5,0,72,1],[5,1,71,1],[5,2,67,2],[5,4,64,2],
          [6,0,67,2],[6,2,69,1],[6,3,71,1],[6,4,69,1],[6,5,67,1],[7,0,66,1],[7,1,64,1],[7,2,62,4],
          [8,0,74,2],[8,2,76,1],[8,3,74,1],[8,4,69,2],[9,0,72,2],[9,2,67,1],[9,3,72,1],[9,4,76,2],[10,0,74,3],[10,3,72,1],[10,4,69,2],
          [11,0,71,2],[11,2,74,2],[11,4,79,2],[12,0,78,2],[12,2,76,1],[12,3,74,1],[12,4,72,1],[12,5,69,1],[13,0,67,2],[13,2,72,2],[13,4,76,2],
          [14,0,74,1],[14,1,72,1],[14,2,71,2],[14,4,69,2],[15,0,69,2],[15,2,64,1],[15,3,62,3]],
    parts: [
      { i: "bani", s: [0], note: c => c.b + 12, v: 1, d: 6 },
      { i: "choir", s: [0], note: c => c.n[1], v: 1, d: 6 },
      { i: "pstrum", s: [0, 3], chord: true, v: .8 },
      { i: "panduri", s: [1, 2, 4, 5], note: (c, s, k) => c.n[[2, 1, 2, 0][k]] + 12, v: .36 },
      { i: "doli", s: [0, 3], v: .7 },
      { i: "doli", s: [5], v: .3 }
    ] },
  lullaby: { bpm: 96, div: 2, bar: 6, wet: .45, gain: 1.6, lead: "bell",
    chords: [C1, F1, C1, G1, C1, F1, G1, C1],
    mel: [[0,0,76,2],[0,2,79,2],[0,4,84,2],[1,0,81,3],[1,3,79,1],[1,4,77,2],[2,0,76,2],[2,2,79,1],[2,3,76,1],[2,4,72,2],[3,0,74,4],[3,4,67,2],
          [4,0,76,2],[4,2,79,2],[4,4,84,2],[5,0,86,3],[5,3,84,1],[5,4,81,2],[6,0,79,2],[6,2,71,1],[6,3,74,1],[6,4,77,2],[7,0,76,4],[7,4,72,2]],
    parts: [
      { i: "bell", s: [0], note: c => c.b + 12, v: .6 },
      { i: "bell", s: [2, 4], note: (c, s, k) => c.n[k + 1], v: .38 },
      { i: "pad", s: [0], chord: true, v: .6, d: 6 }
    ] }
};

/* ---------- instruments ---------- */
function env(gn, at, peak, a, tail){ gn.gain.setValueAtTime(0, at); gn.gain.linearRampToValueAtTime(peak, at + a); gn.gain.exponentialRampToValueAtTime(.0003, at + tail); }
function voice(m, at, o){
  const f = hz(m), gn = ctx.createGain(), lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.setValueAtTime(o.cut, at); lp.frequency.exponentialRampToValueAtTime(Math.max(300, o.cut * (o.close || .3)), at + o.tail * .8);
  env(gn, at, o.peak, o.a || .004, o.tail);
  lp.connect(gn); gn.connect(bus); gn.connect(wet);
  o.p.forEach(([k, amp, type]) => {
    const osc = ctx.createOscillator(), og = ctx.createGain();
    osc.type = type || "sine"; osc.frequency.value = f * k; if (o.det) osc.detune.value = rnd(-o.det, o.det);
    og.gain.value = amp; osc.connect(og); og.connect(lp); osc.start(at); osc.stop(at + o.tail + .05);
  });
}
function noise(){
  if (!noiseBuf){ noiseBuf = ctx.createBuffer(1, ctx.sampleRate | 0, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; return s;
}
function hit(at, o){
  const s = noise(), f = ctx.createBiquadFilter(), gn = ctx.createGain();
  f.type = o.type; f.frequency.value = o.f; f.Q.value = o.q || .7;
  env(gn, at, o.peak, o.a || .002, o.tail);
  s.connect(f); f.connect(gn); gn.connect(bus); if (o.wet) gn.connect(wet);
  s.start(at, rnd(0, .5)); s.stop(at + o.tail + .05);
}
function sustained(m, at, len, o){
  const gn = ctx.createGain(), lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = o.cut; if (o.q) lp.Q.value = o.q;
  gn.gain.setValueAtTime(0, at); gn.gain.linearRampToValueAtTime(o.peak, at + o.a);
  gn.gain.setValueAtTime(o.peak, at + Math.max(o.a, len * .85)); gn.gain.linearRampToValueAtTime(0, at + len + o.r);
  lp.connect(gn); gn.connect(bus); if (o.wet) gn.connect(wet);
  o.osc.forEach(([type, k, det]) => { const osc = ctx.createOscillator(); osc.type = type; osc.frequency.value = hz(m) * k; osc.detune.value = det || 0; osc.connect(lp); osc.start(at); osc.stop(at + len + o.r + .05); });
}
/* a reed voice like the duduk: soft attack, a little scoop into the note, slow vibrato */
function reed(m, at, len, v){
  const f = hz(m), gn = ctx.createGain(), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain(), r = .25, peak = .085 * v;
  lp.type = "lowpass"; lp.frequency.value = 1700; lp.Q.value = 2.2;
  gn.gain.setValueAtTime(0, at); gn.gain.linearRampToValueAtTime(peak, at + .07); gn.gain.setValueAtTime(peak * .92, at + Math.max(.07, len * .8)); gn.gain.linearRampToValueAtTime(0, at + len + r);
  lfo.frequency.value = 5.2; lg.gain.setValueAtTime(0, at); lg.gain.linearRampToValueAtTime(12, at + Math.min(.4, len)); lfo.connect(lg);
  lp.connect(gn); gn.connect(bus); gn.connect(wet);
  [["sawtooth", 1, .5], ["triangle", 1, .7], ["sine", 2, .1]].forEach(([type, k, amp]) => {
    const o = ctx.createOscillator(), og = ctx.createGain(); o.type = type; o.frequency.value = f * k;
    o.detune.setValueAtTime(-45, at); o.detune.linearRampToValueAtTime(0, at + .09); lg.connect(o.detune);
    og.gain.value = amp; o.connect(og); og.connect(lp); o.start(at); o.stop(at + len + r + .05);
  });
  lfo.start(at); lfo.stop(at + len + r + .05);
}
const INST = {
  piano: (m, at, d, v) => voice(m, at, { peak: .15 * v, tail: Math.max(.9, 2.8 - (m - 50) * .04), cut: 2600 + (m - 60) * 40, close: .35, det: 4, p: [[1, 1, "triangle"], [2, .45], [3, .2], [4, .1], [5, .05]] }),
  pluck: (m, at, d, v) => voice(m, at, { peak: .15 * v, tail: 1.1, cut: 3200, p: [[1, 1, "triangle"], [2, .4], [3, .16], [4, .07]] }),
  lowpluck: (m, at, d, v) => voice(m, at, { peak: .14 * v, tail: 1.2, cut: 900, p: [[1, 1, "triangle"], [2, .4], [3, .16]] }),
  lead: (m, at, d, v) => voice(m, at, { peak: .17 * v, tail: Math.max(.7, d * STEP * 1.8), cut: 4200, p: [[1, 1, "triangle"], [2, .4], [3, .16], [4, .07]] }),
  bell: (m, at, d, v) => voice(m, at, { peak: .11 * v, tail: 2.4, cut: 9000, close: .5, a: .002, p: [[1, 1], [2, .18], [3, .32], [5.4, .1], [8.9, .04]] }),
  marimba: (m, at, d, v) => voice(m, at, { peak: .2 * v, tail: .6, cut: 6000, a: .002, p: [[1, 1], [4, .3], [9.9, .05]] }),
  synth: (m, at, d, v) => sustained(m, at, d * STEP, { peak: .065 * v, a: .01, r: .18, cut: 2400, q: 2, wet: true, osc: [["square", 1, 0], ["sawtooth", 1, 7], ["sine", .5, 0]] }),
  stab: (ns, at, d, v) => ns.forEach(m => voice(m, at, { peak: .05 * v, tail: .28, cut: 2400, close: .4, p: [[1, 1, "sawtooth"], [2, .2]] })),
  strum: (ns, at, d, v) => ns.forEach((m, k) => voice(m, at + k * .018, { peak: .1 * v, tail: .7, cut: 2800, p: [[1, 1, "triangle"], [2, .5], [3, .2]] })),
  pad: (ns, at, d, v) => ns.forEach(m => sustained(m, at, d * STEP, { peak: .018 * v, a: .8, r: .6, cut: 1100, wet: true, osc: [["sawtooth", 1, -5], ["sawtooth", 1, 5]] })),
  bass: (m, at, d, v) => sustained(m, at, Math.max(.12, d * STEP * .9), { peak: .2 * v, a: .008, r: .08, cut: 650, osc: [["triangle", 1, 0], ["sine", .5, 0]] }),
  kick: (m, at, d, v) => { const o = ctx.createOscillator(), gn = ctx.createGain(); o.frequency.setValueAtTime(150, at); o.frequency.exponentialRampToValueAtTime(45, at + .13); gn.gain.setValueAtTime(.55 * v, at); gn.gain.exponentialRampToValueAtTime(.001, at + .32); o.connect(gn); gn.connect(bus); o.start(at); o.stop(at + .35); },
  clap: (m, at, d, v) => [0, .012, .024].forEach((o, k) => hit(at + o, { type: "bandpass", f: 1400, q: .9, peak: (k === 2 ? .22 : .14) * v, tail: k === 2 ? .16 : .03, wet: true })),
  hat: (m, at, d, v) => hit(at, { type: "highpass", f: 7500, peak: .06 * v, tail: d > 1 ? .2 : .045 }),
  shaker: (m, at, d, v) => hit(at, { type: "highpass", f: 6000, peak: .028 * v, a: .004, tail: .07 }),
  /* Georgian instruments for "kartuli" */
  panduri: (m, at, d, v) => voice(m, at, { peak: .12 * v, tail: .9, cut: 3600, close: .25, a: .002, det: 3, p: [[1, 1, "sawtooth"], [2, .35], [3, .18], [5, .06]] }),
  pstrum: (ns, at, d, v) => ns.forEach((m, k) => INST.panduri(m, at + k * .022, d, .7 * v)),
  duduk: (m, at, d, v) => reed(m, at, d * STEP, v),
  choir: (m, at, d, v) => sustained(m, at, d * STEP, { peak: .028 * v, a: .5, r: .5, cut: 1300, wet: true, osc: [["triangle", 1, -4], ["sawtooth", 1, 4]] }),
  bani: (m, at, d, v) => sustained(m, at, d * STEP, { peak: .05 * v, a: .4, r: .5, cut: 600, wet: true, osc: [["triangle", 1, 0], ["sine", 2, 0]] }),
  doli: (m, at, d, v) => { const o = ctx.createOscillator(), gn = ctx.createGain(); o.frequency.setValueAtTime(115, at); o.frequency.exponentialRampToValueAtTime(62, at + .18); gn.gain.setValueAtTime(.3 * v, at); gn.gain.exponentialRampToValueAtTime(.001, at + .3); o.connect(gn); gn.connect(bus); o.start(at); o.stop(at + .32); hit(at, { type: "bandpass", f: 900, q: 1.2, peak: .05 * v, tail: .08 }); }
};

function build(S){
  const ev = [];
  S.mel.forEach(([b, s, m, d]) => ev.push({ t: b * S.bar + s, i: S.lead, m, d, v: S.leadVel || 1 }));
  S.chords.forEach((c, b) => S.parts.forEach(p => p.s.forEach((s, k) =>
    ev.push({ t: b * S.bar + s, i: p.i, m: p.chord ? c.n : p.note ? p.note(c, s, k) : 0, d: p.d || 1, v: p.v || 1 }))));
  return ev.sort((a, b) => a.t - b.t);
}
function impulse(sec){
  const len = (ctx.sampleRate * sec) | 0, buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++){ const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
  return buf;
}
function schedule(){
  const ahead = ctx.currentTime + .3;
  while (true){
    const e = EV[idx], at = loopStart + e.t * STEP;
    if (at > ahead) break;
    if (at >= ctx.currentTime - .02){ try { INST[e.i](e.m, at, e.d, e.v); } catch(err) { if (!warned){ warned = true; console.warn("Music:", e.i, err); } } }
    if (++idx >= EV.length){ idx = 0; loopStart += LOOP * STEP; }
  }
}
function start(name){
  if (isFile(name)) return startFile(name);
  const yid = ytId(name); if (yid){ if (location.protocol === "file:"){ const fb = (window.CONFIG || {}).musicFallback; return fb ? start(fb) : false; } return startYT(yid); }
  try {
    if (!ctx){
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      const S = SONGS[name] || SONGS.romance;
      EV = build(S); LOOP = S.chords.length * S.bar; STEP = 60 / S.bpm / S.div;
      ctx = new AC();
      out = ctx.createGain(); out.gain.setValueAtTime(0, ctx.currentTime); out.gain.linearRampToValueAtTime(.9 * (S.gain || 1), ctx.currentTime + 2.2);
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = .005; comp.release.value = .2;
      bus = ctx.createGain(); bus.gain.value = .8; bus.connect(comp); comp.connect(out); out.connect(ctx.destination);
      const conv = ctx.createConvolver(); conv.buffer = impulse(2.6);
      wet = ctx.createGain(); wet.gain.value = S.wet; wet.connect(conv); conv.connect(comp);
      try { dest = ctx.createMediaStreamDestination(); out.connect(dest); } catch(_) {}
      loopStart = ctx.currentTime + .15; idx = 0;
      timer = setInterval(schedule, 40);
    }
    ctx.resume(); playing = true; return true;
  } catch(e){ return false; }
}
function pause(){ ytWant = false; if (yt && ytReady) yt.pauseVideo(); if (audio) audio.pause(); if (ctx) ctx.suspend(); playing = false; }
function fadeOut(sec){ if (yt && ytReady){ ytWant = false; yt.pauseVideo(); } if (audio){ const a = audio, v0 = a.volume, t0 = performance.now(), d = (sec || 1.5) * 1000; const dn = () => { const k = Math.min(1, (performance.now() - t0) / d); a.volume = v0 * (1 - k); if (k < 1) requestAnimationFrame(dn); else a.pause(); }; dn(); } if (!ctx) return; const t = ctx.currentTime; out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.linearRampToValueAtTime(0, t + (sec || 1.5)); }
document.addEventListener("visibilitychange", () => { if (audio){ if (document.hidden) audio.pause(); else if (playing) audio.play().catch(() => {}); } if (!ctx) return; if (document.hidden) ctx.suspend(); else if (playing) ctx.resume(); });
return { start, pause, fadeOut, songs: Object.keys(SONGS), get playing(){ return playing; }, get stream(){ return dest && dest.stream; } };
})();
