/* =====================================================================
   ამბავი · საქორწილო მოსაწვევი · დიზაინი „მარგალიტის ფარდა“
   ახალი წყვილისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ===================================================================== */
window.CONFIG = {
  id: "natia-davit",
  title: { ka: "ნათია & დავითი · 18 სექტემბერი 2027", en: "Natia & Davit · 18 September 2027" },
  host: { ka: "ნათია & დავითი", en: "Natia & Davit" },
  script: "Natia & Davit",
  monogram: "N&D",
  date: "2027-09-18",
  shortDate: "18 · 09 · 27",
  city: { ka: "კახეთი", en: "Kakheti" },
  invite: { ka: "გეპატიჟებით ჩვენს ქორწილში", en: "invite you to celebrate our wedding" },

  lead:  { ka: "ორი გული, ერთი სუფრა და ძვირფასი ადამიანები ჩვენ გარშემო. გვიხარია, რომ ამ საღამოს ჩვენთან იქნებით.",
           en: "Two hearts, one long table and the people we love around us. We are so happy you will spend this evening with us." },
  toast: { ka: "გელოდებით სიყვარულით", en: "With love, we await you" },

  venue: { ka: "მამული „ოქროს ვაზი“", en: "Golden Vine Estate" },
  address: { ka: "მამული „ოქროს ვაზი“ · კახეთი, საქართველო", en: "Golden Vine Estate · Kakheti, Georgia" },
  mapUrl: "",                                  // Google Maps-ის ბმული; ცარიელი = მოძებნის მისამართით
  parking: { ka: "სტუმრებისთვის უფასო პარკინგი მამულის ეზოში", en: "Free guest parking in the estate courtyard" },

  dressCode: { ka: "კლასიკური, ელეგანტური", en: "Classic, elegant" },
  dressNote: { ka: "გთხოვთ, აირჩიოთ ღია, ნაზი ფერები", en: "Soft, light colours are warmly welcome" },
  palette: ["#F4EDE1", "#E7D8C3", "#D9C3A5", "#B9C4AE", "#8FA38A", "#C9B7CF"],

  storyIntro: { ka: "სამი ფურცელი ჩვენი ისტორიიდან.", en: "Three pages from our story." },
  story: [
    { year: "2019", season: { ka: "შემოდგომა", en: "Autumn" }, photo: "images/story-1.jpg",
      title: { ka: "წიგნების თაროსთან", en: "By the bookshelf" },
      text: { ka: "ძველი წიგნების მაღაზიაში ორივე ერთ თაროსთან გაჩერდა. დავითმა ნათიას საყვარელი რომანი ურჩია, ნათიამ კი მეორე დღეს დაურეკა, რომ ეთქვა, მოეწონა.",
              en: "In an old bookshop they both stopped at the same shelf. Davit recommended a novel, and the next day Natia called to say she loved it." } },
    { year: "2022", season: { ka: "ზაფხული", en: "Summer" }, photo: "images/story-2.jpg",
      title: { ka: "მთებში", en: "In the mountains" },
      text: { ka: "პირველი საერთო მოგზაურობა მთებში: ნისლი, კოშკები და ცეცხლთან გატარებული ღამე, როცა მიხვდნენ, რომ ერთად ყველგან სახლში არიან.",
              en: "Their first trip together to the mountains: mist, towers and a night by the fire when they knew that together they were home anywhere." } },
    { year: "2026", season: { ka: "გაზაფხული", en: "Spring" }, photo: "images/story-3.jpg",
      title: { ka: "ბეჭედი წიგნში", en: "A ring in a book" },
      text: { ka: "იმავე რომანის ფურცლებს შორის ნათიამ ბეჭედი იპოვა. პასუხი, რა თქმა უნდა, „კი“ იყო.",
              en: "Between the pages of that same novel Natia found a ring. The answer, of course, was “yes”." } }
  ],

  /* დღის განრიგი. note = მოკლე აღწერა */
  events: [
    { time: "17:00", title: { ka: "სტუმრების მიღება", en: "Welcome" }, note: { ka: "მისასალმებელი კოქტეილი ბაღში", en: "Cocktails in the garden" }, place: { ka: "მამული „ოქროს ვაზი“", en: "Golden Vine Estate" }, noCity: true, main: true },
    { time: "18:30", title: { ka: "საზეიმო ვახშამი", en: "Wedding dinner" }, note: { ka: "გრძელი სუფრა ვენახის ქვეშ", en: "A long table under the vines" } },
    { time: "21:00", title: { ka: "ტორტი და ცეკვა", en: "Cake & dancing" }, note: { ka: "მუსიკალური საღამო ციმციმა ნათურების ქვეშ", en: "Music under the string lights" } }
  ],

  photos: ["images/gallery-1.jpg", "images/gallery-2.jpg", "images/gallery-3.jpg", "images/gallery-4.jpg"],

  calTitle: { ka: "ნათია და დავითის ქორწილი", en: "Natia & Davit's wedding" },
  rsvpTo: { ka: "ნათია და დავით", en: "Natia & Davit" },
  rsvpEvent: { ka: "თქვენს ქორწილში", en: "your wedding" },
  shareText: { ka: "ნათია და დავითის საქორწილო მოსაწვევი", en: "Natia & Davit's wedding invitation" },
  whatsapp: "",                               // მაგ. "995599123456" (დასწრება და სურვილები აქ მოვა)

  music: "romance",
  fx: ["gold:0.7", "petals:0.35"],
  fxGate: [],
  openFx: "sparkle:50",
  rsvpFx: "sparkle",
  texts: {
    ka: { cdTitle: "ქორწილამდე დარჩა", dayTitle: "დღის განრიგი", galTitle: "ჩვენი მომენტები", tapHint: "შეეხეთ ფარდას",
          wishTitle: "სურვილების კონვერტი", wishSub: "გახსენით კონვერტი და დაგვიტოვეთ სურვილი", wishPh: "თქვენი სურვილი წყვილს...",
          wishName: "თქვენი სახელი", wishSend: "გაგზავნა WhatsApp-ით", wishCopy: "კოპირება", dressTitle: "დრესკოდი", locTitle: "ლოკაცია", mapBtn: "ნახე რუკაზე", next: "გაგრძელება" },
    en: { cdTitle: "Until the wedding", dayTitle: "Order of the day", galTitle: "Our moments", tapHint: "Touch the curtain",
          wishTitle: "Wishes envelope", wishSub: "Open the envelope and leave us a wish", wishPh: "Your wish for the couple...",
          wishName: "Your name", wishSend: "Send via WhatsApp", wishCopy: "Copy", dressTitle: "Dress code", locTitle: "Location", mapBtn: "View on map", next: "Continue" }
  }
};
