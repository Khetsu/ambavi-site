/* =====================================================================
   ამბავი · დაბადების დღის მოსაწვევი · დიზაინი „დისკო გლამი“
   ახალი იუბილარისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ===================================================================== */
window.CONFIG = {
  id: "salome-30",
  title: { ka: "სალომე 30 · დაბადების დღის წვეულება", en: "Salome turns 30 · Birthday party" },
  host: { ka: "სალომე", en: "Salome" },
  script: "Salome",
  age: "30",
  monogram: "30",
  date: "2026-12-12",
  city: { ka: "თბილისი", en: "Tbilisi" },
  ageLine: { ka: "30 წლის იუბილე", en: "30th birthday party" },

  lead:  { ka: "30 წელი სიცილის, მოგზაურობის და მეგობრობის. ეს დღე თქვენ გარეშე სრული არ იქნება, ამიტომ მოდით და ერთად ვიცეკვოთ!",
           en: "30 years of laughter, travel and friendship. This day won't be complete without you, so come and dance with me!" },
  toast: { ka: "შამპანური უკვე ცივდება. გელოდებით!", en: "The champagne is already chilling. See you there!" },
  marquee: { ka: "ვიცეკვოთ ✦ 30 ✦ შამპანური ✦ მეგობრები ✦ მუსიკა ✦ ", en: "LET'S DANCE ✦ 30 ✦ CHAMPAGNE ✦ FRIENDS ✦ MUSIC ✦ " },

  hero: "images/hero.jpg",

  events: [
    { time: "20:00", title: { ka: "შეხვედრა და მისასალმებელი კოქტეილი", en: "Welcome cocktails" }, place: { ka: "ლაუნჯ-ბარი „სატურნი“", en: "Saturn Lounge" }, icon: "glasses", photo: "images/party.jpg", main: true },
    { time: "21:00", title: { ka: "ვახშამი და სადღეგრძელოები", en: "Dinner & toasts" }, icon: "star" },
    { time: "22:30", title: { ka: "ტორტი და 30 სანთელი", en: "Cake & 30 candles" }, icon: "cake" },
    { time: "23:00", title: { ka: "DJ და ცეკვა გვიანობამდე", en: "DJ & dancing till late" }, icon: "dance" }
  ],

  details: [
    { icon: "dress", label: { ka: "ჩაცმის კოდი", en: "Dress code" }, value: { ka: "Disco Glam: ბრჭყვიალა, ფერადი, თამამი", en: "Disco Glam: sparkly, colourful, bold" } },
    { icon: "gift", label: { ka: "საჩუქარი", en: "Gifts" }, value: { ka: "საუკეთესო საჩუქარი თქვენი ცეკვაა", en: "Your dance moves are the best gift" } },
    { icon: "camera", label: { ka: "ფოტოები", en: "Photos" }, value: "#სალომე30" }
  ],

  photos: ["images/gallery-1.jpg", "images/gallery-2.jpg", "images/gallery-3.jpg", "images/gallery-4.jpg"],

  calTitle: { ka: "სალომეს 30 წლის იუბილე", en: "Salome's 30th birthday" },
  rsvpTo: { ka: "სალომე", en: "Salome" },
  rsvpEvent: { ka: "შენს დაბადების დღეზე", en: "your birthday party" },
  shareText: { ka: "სალომეს 30 წლის იუბილის მოსაწვევი", en: "Salome's 30th birthday invitation" },
  whatsapp: "",

  music: "party",
  fx: ["confetti:0.5", "bubbles:0.6"],
  openFx: "firework:5",
  rsvpFx: "confetti",
  texts: {
    ka: { cdTitle: "წვეულებამდე დარჩა", dayTitle: "წვეულების პროგრამა", galTitle: "ჩემი 30 წელი", tapHint: "გახსენი საჩუქარი",
          msgNo: (to, n, ev, w) => "გამარჯობა, " + to + "! მე ვარ " + n + ".\nსამწუხაროდ, " + w + " ვერ მოვალ " + ev + ", მაგრამ მთელი გულით გილოცავ!" },
    en: { cdTitle: "Party starts in", dayTitle: "Party programme", galTitle: "My 30 years", tapHint: "Open the gift" }
  }
};
