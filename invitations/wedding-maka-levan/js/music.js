/* მაკა და ლევანი · ორიგინალური ცოცხალი მელოდია (Web Audio), ფაილი არ სჭირდება.
   მხიარული, მსუბუქი ვალსისმაგვარი მოძრაობა სოლ მაჟორში: ნაზი გიტარა-არფის არპეჯიო,
   ხალისიანი მთავარი მელოდია, ბასი, ჩაფიქრებული "სიმების" ფონი და მსუბუქი შეიკერი. */
window.Music = (function(){
  let ctx = null, master = null, wet = null, timer = null, loopStart = 0, idx = 0, playing = false, noiseBuf = null, streamDest = null, outNode = null;
  const BPM = 112, STEP = 60 / BPM / 2, BARS = 8, LOOP = BARS * 8;   // ნაბიჯი = მერვედი
  // აკორდები (G D Em C G D C D): [ბასი, არპეჯიოს ბგერები, ფონის სამხმოვანება]
  const CH = {
    G:  [43, [55, 59, 62], [55, 59, 62, 67]],
    D:  [50, [57, 62, 66], [54, 57, 62, 66]],
    Em: [40, [55, 59, 64], [52, 55, 59, 64]],
    C:  [48, [55, 60, 64], [55, 60, 64, 67]]
  };
  const prog = ["G", "D", "Em", "C", "G", "D", "C", "D"];
  // მელოდია: [ბარი, საწყისი მერვედი, ბგერა, ხანგრძლივობა მერვედებში]
  const mel = [
    [0,0,71,2],[0,2,74,1],[0,3,79,1],[0,4,78,2],[0,6,74,2],
    [1,0,69,2],[1,2,74,1],[1,3,78,1],[1,4,76,2],[1,6,74,2],
    [2,0,76,2],[2,2,74,1],[2,3,71,1],[2,4,67,2],[2,6,71,2],
    [3,0,72,2],[3,2,76,1],[3,3,79,1],[3,4,76,4],
    [4,0,74,2],[4,2,71,1],[4,3,74,1],[4,4,79,2],[4,6,78,2],
    [5,0,76,2],[5,2,78,1],[5,3,81,1],[5,4,78,2],[5,6,74,2],
    [6,0,76,1],[6,1,74,1],[6,2,72,2],[6,4,74,2],[6,6,76,2],
    [7,0,74,2],[7,2,78,2],[7,4,81,2],[7,6,78,2]
  ];
  const events = [];
  mel.forEach(([b, s, m, d]) => events.push({t: b * 8 + s, m, d, k: "lead"}));
  prog.forEach((name, b) => {
    const [root, arp, pad] = CH[name], t0 = b * 8;
    events.push({t: t0, m: root, k: "bass"}, {t: t0 + 4, m: root + 7, k: "bass"});
    [[1, 0], [2, 1], [3, 2], [5, 1], [6, 2], [7, 1]].forEach(([s, i]) => events.push({t: t0 + s, m: arp[i] + 12, k: "arp"}));
    events.push({t: t0, pad, k: "pad"});
    for (let s = 1; s < 8; s += 2) events.push({t: t0 + s, k: "shake"});
  });
  events.sort((a, b) => a.t - b.t);

  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function impulse(){
    const len = ctx.sampleRate * 2.6, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++){ const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    return buf;
  }
  function env(g, time, peak, attack, tail){
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(peak, time + attack);
    g.gain.exponentialRampToValueAtTime(.0004, time + tail);
  }
  // მოწყვეტილი სიმი (გიტარა/არფა)
  function pluck(m, time, peak, tail, bright){
    const g = ctx.createGain(); env(g, time, peak, .004, tail);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(bright, time); lp.frequency.exponentialRampToValueAtTime(900, time + tail * .6);
    lp.connect(g); g.connect(master); g.connect(wet);
    [[1, 1, "triangle"], [2, .4, "sine"], [3, .16, "sine"], [4, .07, "sine"]].forEach(([k, a, type]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.value = hz(m) * k; og.gain.value = a;
      o.connect(og); og.connect(lp); o.start(time); o.stop(time + tail + .1);
    });
  }
  // ნაზი სიმების ფონი
  function pad(notes, time){
    notes.forEach(m => {
      const g = ctx.createGain(); g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(.022, time + .9); g.gain.linearRampToValueAtTime(.014, time + 3.2); g.gain.linearRampToValueAtTime(0, time + 4.1);
      g.connect(master); g.connect(wet);
      [-4, 4].forEach(det => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = hz(m); o.detune.value = det;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1100; o.connect(lp); lp.connect(g); o.start(time); o.stop(time + 4.2); });
    });
  }
  function shake(time){
    if (!noiseBuf){ noiseBuf = ctx.createBuffer(1, ctx.sampleRate * .2, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 6500;
    const g = ctx.createGain(); env(g, time, .03, .003, .07);
    s.connect(hp); hp.connect(g); g.connect(master); s.start(time); s.stop(time + .12);
  }
  function play(ev, at){
    if (ev.k === "lead"){ pluck(ev.m, at, .17, Math.max(.7, ev.d * STEP * 1.8), 4200); }
    else if (ev.k === "arp"){ pluck(ev.m, at, .07, 1.1, 3000); }
    else if (ev.k === "bass"){ pluck(ev.m, at, .13, 1.2, 900); }
    else if (ev.k === "pad"){ pad(ev.pad, at); }
    else if (ev.k === "shake"){ shake(at); }
  }
  function schedule(){
    const ahead = ctx.currentTime + .25;
    while (true){
      const ev = events[idx], at = loopStart + ev.t * STEP;
      if (at > ahead) break;
      if (at >= ctx.currentTime - .02) play(ev, at);
      idx++;
      if (idx >= events.length){ idx = 0; loopStart += LOOP * STEP; }
    }
  }
  function start(){
    try{
      if (!ctx){
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
        ctx = new AC();
        const out = outNode = ctx.createGain(); out.gain.setValueAtTime(0, ctx.currentTime); out.gain.linearRampToValueAtTime(.85, ctx.currentTime + 2.5);
        out.connect(ctx.destination);
        streamDest = ctx.createMediaStreamDestination(); out.connect(streamDest);   // ვიდეოს ჩასაწერად
        master = ctx.createGain(); master.gain.value = .6; master.connect(out);
        const conv = ctx.createConvolver(); conv.buffer = impulse();
        wet = ctx.createGain(); wet.gain.value = .3; wet.connect(conv); conv.connect(out);
        loopStart = ctx.currentTime + .15; idx = 0;
        timer = setInterval(schedule, 40);
      }
      ctx.resume(); playing = true; return true;
    }catch(e){ return false; }
  }
  function fadeOut(sec){ if (!ctx || !outNode) return; const t = ctx.currentTime; outNode.gain.cancelScheduledValues(t); outNode.gain.setValueAtTime(outNode.gain.value, t); outNode.gain.linearRampToValueAtTime(0, t + sec); }
  function pause(){ if (ctx) ctx.suspend(); playing = false; }
  document.addEventListener("visibilitychange", () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (playing) ctx.resume(); });
  return { start, pause, fadeOut, get playing(){ return playing; }, get stream(){ return streamDest && streamDest.stream; } };
})();
