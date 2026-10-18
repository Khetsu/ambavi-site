/* =====================================================================
   ამბავი · საქორწილო მოსაწვევი · დიზაინი „ზურმუხტის ღამე“
   ახალი წყვილისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ფოტოები: images საქაღალდეში ჩააგდე იგივე სახელით (hero.jpg, story-1.jpg ...),
   სანამ ფაილი არ არის, ჩანს მზა ილუსტრაცია images/art-დან.
   ===================================================================== */
window.CONFIG = {
  id: "lasha-tamar",
  title: { ka: "ლაშა და თამარი · საქორწილო მოსაწვევი", en: "Lasha & Tamar · Wedding invitation" },
  host: { ka: "ლაშა & თამარი", en: "Lasha & Tamar" },
  script: "Lasha & Tamar",
  monogram: "L&T",
  date: "2027-05-22",                      // წელი-თვე-დღე
  city: { ka: "თბილისი", en: "Tbilisi" },

  lead:  { ka: "სიყვარული, რომელიც ჯაზის ერთ ღამეს დაიწყო, ახლა ერთ ცხოვრებად იქცევა. გვიხარია, რომ ამ საღამოს ჩვენთან იქნებით.",
           en: "A love that began on one jazz night is becoming one life. We are so glad you will spend this evening with us." },
  toast: { ka: "გელოდებით სიყვარულით, მუსიკით და დიდი სიხარულით", en: "We await you with love, music and great joy" },

  hero: "images/hero.jpg",

  storyIntro: { ka: "სამი ღამე, რომლებმაც ყველაფერი შეცვალა.", en: "Three nights that changed everything." },
  story: [
    { year: "2018", season: { ka: "ზაფხული", en: "Summer" }, photo: "images/story-1.jpg",
      title: { ka: "ჯაზი ძველ ქალაქში", en: "Jazz in the old town" },
      text: { ka: "თამარი სცენაზე ფორტეპიანოზე უკრავდა, ლაშა კი პირველ რიგში იჯდა და ბოლო ნოტამდე თვალს არ აშორებდა. კონცერტის შემდეგ ვარდი აჩუქა, რომელიც იქვე, ქუჩის კუთხეში იყიდა.",
              en: "Tamar was playing the piano on stage, and Lasha sat in the front row, unable to look away until the very last note. After the concert he gave her a rose he had bought on the street corner." } },
    { year: "2021", season: { ka: "შემოდგომა", en: "Autumn" }, photo: "images/story-2.jpg",
      title: { ka: "რთველი კახეთში", en: "Harvest in Kakheti" },
      text: { ka: "პირველი საერთო რთველი სიღნაღის ახლოს: ყურძნით სავსე კალათები, მეგობრები და გრძელი სუფრა. იმ დღეს მიხვდნენ, რომ ერთმანეთის ოჯახი უკვე საკუთარივით უყვარდათ.",
              en: "Their first harvest together near Sighnaghi: baskets full of grapes, friends and a long supra. That day they realised they already loved each other's families as their own." } },
    { year: "2025", season: { ka: "ახალი წლის ღამე", en: "New Year's Eve" }, photo: "images/story-3.jpg",
      title: { ka: "„კი“ ნარიყალაზე", en: "A “yes” on Narikala" },
      text: { ka: "როცა მთელი ქალაქი ფეიერვერკებით ანათებდა, ნარიყალას კედელთან ლაშამ ბეჭედი ამოიღო. თამარმა „კი“ ჯერ ჩურჩულით თქვა, მერე კი ისე, რომ გვერდით მდგომებმაც ტაში დაუკრეს.",
              en: "While the whole city glowed with fireworks, Lasha took out a ring by the walls of Narikala. Tamar whispered “yes”, then said it so loudly that everyone around them applauded." } }
  ],

  /* დღის განრიგი. icon: rings | church | camera | glasses | dance | cake | hotel | star | heart ...
     main: true = უკუთვლა ამ დრომდე ითვლის. photo: პატარა ფოტო ადგილის. */
  events: [
    { time: "16:00", title: { ka: "ჯვრისწერა", en: "Wedding ceremony" }, place: { ka: "სამების საკათედრო ტაძარი", en: "Holy Trinity Cathedral" }, icon: "rings", photo: "images/church.jpg", main: true },
    { time: "17:30", title: { ka: "ფოტოსესია", en: "Photo session" }, place: { ka: "მთაწმინდის პარკი", en: "Mtatsminda Park" }, icon: "camera", photo: "images/photo.jpg" },
    { time: "19:00", title: { ka: "საქორწილო სუფრა", en: "Wedding dinner" }, place: { ka: "სასახლე „ზურმუხტი“", en: "Emerald Palace" }, icon: "glasses", photo: "images/restaurant.jpg" },
    { time: "22:00", title: { ka: "პირველი ცეკვა და ტორტი", en: "First dance & cake" }, place: { ka: "სასახლე „ზურმუხტი“", en: "Emerald Palace" }, icon: "dance" }
  ],

  details: [
    { icon: "dress", label: { ka: "ჩაცმის კოდი", en: "Dress code" }, value: { ka: "საღამოს ელეგანტური სტილი, ზურმუხტისფერი ან ოქროსფერი აქცენტით", en: "Black tie, with an emerald or gold accent" } },
    { icon: "car", label: { ka: "ტრანსპორტი", en: "Transport" }, value: { ka: "ტაძრიდან სასახლემდე 18:30-ზე ავტობუსი გაგიყვანთ", en: "A shuttle leaves the cathedral for the palace at 18:30" } },
    { icon: "camera", label: { ka: "გაგვიზიარეთ ფოტოები", en: "Share your photos" }, value: "#ლაშადათამარი" }
  ],

  photos: ["images/gallery-1.jpg", "images/gallery-2.jpg", "images/gallery-3.jpg", "images/gallery-4.jpg"],

  calTitle: { ka: "ლაშა და თამარის ქორწილი", en: "Lasha & Tamar's wedding" },
  rsvpTo: { ka: "ლაშა და თამარ", en: "Lasha & Tamar" },        // ვის მიემართება სტუმრის პასუხი
  rsvpEvent: { ka: "თქვენს ქორწილში", en: "your wedding" },
  shareText: { ka: "ლაშა და თამარის საქორწილო მოსაწვევი", en: "Lasha & Tamar's wedding invitation" },
  whatsapp: "",                            // მაგ. "995599123456"

  music: "romance",
  fx: ["stars", "fireflies:0.8"],
  fxGate: ["stars:0.6"],
  openFx: "sparkle:60",
  rsvpFx: "sparkle",
  texts: {
    ka: { cdTitle: "ქორწილამდე დარჩა", galTitle: "ჩვენი მომენტები", tapHint: "შეეხეთ ოქროს მედალიონს" },
    en: { cdTitle: "Until we say yes", galTitle: "Our moments", tapHint: "Touch the golden medallion" }
  }
};
