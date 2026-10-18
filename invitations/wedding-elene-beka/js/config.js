/* =====================================================================
   ამბავი · საქორწილო მოსაწვევი · „მარგალიტის ფარდა“ 3D
   ელენე & ბექა · 19 ივნისი 2027 · ძველი თბილისი
   ახალი წყვილისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   scenes3d — რომელი 3D ნაქარგი სურათი ჩანს თითოეულ ადგილას
   ===================================================================== */
window.CONFIG = {
  id: "elene-beka",
  title: { ka: "ელენე & ბექა · 19 ივნისი 2027", en: "Elene & Beka · 19 June 2027" },
  host: { ka: "ელენე & ბექა", en: "Elene & Beka" },
  script: "Elene & Beka",
  monogram: "E&B",
  date: "2027-06-19",
  shortDate: "19 · 06 · 27",
  city: { ka: "თბილისი", en: "Tbilisi" },
  invite: { ka: "გეპატიჟებით ჩვენს ქორწილში", en: "invite you to celebrate our wedding" },

  lead:  { ka: "ერთი ფინჯანი ყავით დაწყებული ისტორია ახლა ერთ ოჯახად იქცევა. გვიხარია, რომ ამ დღეს ჩვენთან ერთად იქნებით.",
           en: "A story that began with one cup of coffee is becoming one family. We are so happy you will share this day with us." },
  toast: { ka: "გელოდებით სიყვარულით", en: "With love, we await you" },

  venue: { ka: "რესტორანი „ძველი აივანი“", en: "Old Balcony Restaurant" },
  address: { ka: "რესტორანი „ძველი აივანი“ · ძველი თბილისი", en: "Old Balcony Restaurant · Old Tbilisi" },
  mapUrl: "",                                  // Google Maps-ის ბმული; ცარიელი = მოძებნის მისამართით
  parking: { ka: "სტუმრებისთვის პარკინგი რესტორნის გვერდით", en: "Guest parking next to the restaurant" },

  dressCode: { ka: "ელეგანტური, ღია ფერებში", en: "Elegant, in soft colours" },
  dressNote: { ka: "ვარდისფერი, შამპანური და ნაზი მწვანე ძალიან მოგვეწონება", en: "Blush, champagne and soft green are warmly welcome" },
  palette: ["#FBF4EE", "#F1DCD6", "#E6C3BC", "#E9D5B0", "#B9C4AE", "#C9B7CF"],

  storyIntro: { ka: "სამი ფურცელი ჩვენი ისტორიიდან.", en: "Three pages from our story." },
  story: [
    { year: "2020", season: { ka: "ზამთარი", en: "Winter" }, photo: "images/story-1.jpg",
      title: { ka: "ერთი ფინჯანი ყავა", en: "One cup of coffee" },
      text: { ka: "წვიმიან დღეს ბექამ კაფეში ბოლო თავისუფალი მაგიდა ელენეს დაუთმო. ელენემ მადლობის ნიშნად ყავაზე დაპატიჟა, ის ყავა კი სამ საათს გაგრძელდა.",
              en: "On a rainy day Beka gave Elene the last free table in a café. She thanked him with a coffee, and that coffee lasted three hours." } },
    { year: "2023", season: { ka: "ზაფხული", en: "Summer" }, photo: "images/story-2.jpg",
      title: { ka: "ზღვასთან", en: "By the sea" },
      text: { ka: "პირველი საერთო ზაფხული ბათუმში: მზის ჩასვლა, იალქნიანი ნავი და დაპირება, რომ ყოველ ზაფხულს ზღვასთან ერთად დაბრუნდებიან.",
              en: "Their first summer together in Batumi: a sunset, a sailboat and a promise to come back to the sea together every summer." } },
    { year: "2026", season: { ka: "გაზაფხული", en: "Spring" }, photo: "images/story-3.jpg",
      title: { ka: "იმავე მაგიდასთან", en: "At the same table" },
      text: { ka: "ბექამ ბეჭედი იმავე კაფეში, იმავე მაგიდასთან ამოიღო. ელენემ „კი“ ყავის დალევამდე უთხრა.",
              en: "Beka took out a ring in the same café, at the same table. Elene said “yes” before her coffee was finished." } }
  ],

  /* დღის განრიგი. note = მოკლე აღწერა */
  events: [
    { time: "16:00", title: { ka: "ცერემონია", en: "Ceremony" }, note: { ka: "ყვავილების თაღის ქვეშ, რესტორნის ბაღში", en: "Under the flower arch in the restaurant garden" }, place: { ka: "რესტორანი „ძველი აივანი“", en: "Old Balcony Restaurant" }, noCity: true, main: true },
    { time: "17:30", title: { ka: "მისასალმებელი კოქტეილი", en: "Welcome drinks" }, note: { ka: "შამპანური და ცოცხალი მუსიკა აივანზე", en: "Champagne and live music on the balcony" } },
    { time: "19:00", title: { ka: "საზეიმო ვახშამი", en: "Wedding dinner" }, note: { ka: "სუფრა ძველი ქალაქის ხედით", en: "Dinner with a view of the old town" } },
    { time: "22:00", title: { ka: "ტორტი და ცეკვა", en: "Cake & dancing" }, note: { ka: "პირველი ცეკვა და დიდი ზეიმი", en: "The first dance and a big celebration" } }
  ],

  photos: ["images/gallery-1.jpg", "images/gallery-2.jpg", "images/gallery-3.jpg", "images/gallery-4.jpg"],

  calTitle: { ka: "ელენე და ბექას ქორწილი", en: "Elene & Beka's wedding" },
  rsvpTo: { ka: "ელენე და ბექა", en: "Elene & Beka" },
  rsvpEvent: { ka: "თქვენს ქორწილში", en: "your wedding" },
  shareText: { ka: "ელენე და ბექას საქორწილო მოსაწვევი", en: "Elene & Beka's wedding invitation" },
  whatsapp: "",                               // მაგ. "995599123456" (დასწრება და სურვილები აქ მოვა)

  music: "romance",
  fx: ["gold:0.6", "petals:0.45"],
  fxGate: [],
  openFx: "sparkle:50",
  rsvpFx: "sparkle",

  /* 3D: ვარდისფერი ყვავილები და სცენები ამ წყვილისთვის */
  theme3d: { blush: ["#efc6bf", "#f6ddd7", "#e8b5ab", "#fae9e4"], bloom: ["#f3d2cc", "#fbf4ee", "#e9cfe6", "#f2dcc0", "#f8e6e1"] },
  scenes3d: { arch: "arbor", venue: "tbilisi", story: ["coffee", "sea", "ringbox"], gallery: ["rings", "g1", "g3", "g4"] },

  texts: {
    ka: { cdTitle: "ქორწილამდე დარჩა", dayTitle: "დღის განრიგი", galTitle: "ჩვენი მომენტები", tapHint: "შეეხეთ ფარდას",
          wishTitle: "სურვილების კონვერტი", wishSub: "გახსენით კონვერტი და დაგვიტოვეთ სურვილი", wishPh: "თქვენი სურვილი წყვილს...",
          wishName: "თქვენი სახელი", wishSend: "გაგზავნა WhatsApp-ით", wishCopy: "კოპირება", dressTitle: "დრესკოდი", locTitle: "ლოკაცია", mapBtn: "ნახე რუკაზე", next: "გაგრძელება" },
    en: { cdTitle: "Until the wedding", dayTitle: "Order of the day", galTitle: "Our moments", tapHint: "Touch the curtain",
          wishTitle: "Wishes envelope", wishSub: "Open the envelope and leave us a wish", wishPh: "Your wish for the couple...",
          wishName: "Your name", wishSend: "Send via WhatsApp", wishCopy: "Copy", dressTitle: "Dress code", locTitle: "Location", mapBtn: "View on map", next: "Continue" }
  }
};
