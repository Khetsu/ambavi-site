/* =====================================================================
   ამბავი · ნიშნობის მოსაწვევი · დიზაინი „ვარდისფერი ოქრო“
   ახალი წყვილისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ფოტოები: images საქაღალდეში იგივე სახელით (hero.jpg, story-1.jpg ...).
   ===================================================================== */
window.CONFIG = {
  id: "giorgi-nino",
  title: { ka: "გიორგი და ნინო · ნიშნობის მოსაწვევი", en: "Giorgi & Nino · Engagement party" },
  host: { ka: "გიორგი & ნინო", en: "Giorgi & Nino" },
  script: "Giorgi & Nino",
  monogram: "G&N",
  ringText: "GIORGI & NINO · WE'RE ENGAGED · 14 · 02 · 2027 · ",
  date: "2027-02-14",
  city: { ka: "თბილისი", en: "Tbilisi" },

  lead:  { ka: "ჩვენ ვიწინდებით! გვინდა, ეს ნათელი საღამო ყველაზე ახლობელ ადამიანებთან ერთად გავატაროთ.",
           en: "We're getting engaged! We'd love to share this bright evening with the people closest to us." },
  toast: { ka: "გელოდებით ვარდებით, სიცილით და ბევრი ცეკვით", en: "We'll be waiting with roses, laughter and lots of dancing" },

  hero: "images/hero.jpg",

  storyIntro: { ka: "ერთი არეული შეკვეთა, ერთი ზღვა და ერთი კითხვა.", en: "One mixed-up order, one sea and one question." },
  story: [
    { year: "2021", season: { ka: "გაზაფხული", en: "Spring" }, photo: "images/story-1.jpg",
      title: { ka: "ყავა ორისთვის", en: "Coffee for two" },
      text: { ka: "ვაკის პატარა კაფეში ბარისტამ შეკვეთები აურია: ნინოს ლატე გიორგის მიუტანეს, გიორგის ესპრესო კი ნინოს. ჭიქები გაცვალეს, მერე კი ტელეფონის ნომრებიც.",
              en: "In a little café in Vake the barista mixed up the orders: Nino's latte went to Giorgi and his espresso to her. They swapped cups, and then phone numbers." } },
    { year: "2023", season: { ka: "ზაფხული", en: "Summer" }, photo: "images/story-2.jpg",
      title: { ka: "ზღვა და ველოსიპედები", en: "The sea and two bicycles" },
      text: { ka: "ბათუმის ბულვარზე მზის ჩასვლამდე. ნინომ თქვა, რომ ზღვა არასდროს ყოფილა ასეთი ლამაზი, გიორგიმ კი აღიარა, რომ ზღვისთვის საერთოდ არ შეუხედავს.",
              en: "Riding along the Batumi boulevard until sunset. Nino said the sea had never looked so beautiful; Giorgi admitted he hadn't looked at the sea at all." } },
    { year: "2026", season: { ka: "შემოდგომა", en: "Autumn" }, photo: "images/story-3.jpg",
      title: { ka: "ვარდები და ერთი კითხვა", en: "Roses and one question" },
      text: { ka: "ქალაქის ხედით, ვარდებით მორთულ ტერასაზე, გიორგიმ ერთი მარტივი კითხვა დასვა. პასუხი უკვე ყველამ იცის.",
              en: "On a terrace full of roses overlooking the city, Giorgi asked one simple question. Everyone already knows the answer." } }
  ],

  events: [
    { time: "18:00", title: { ka: "სტუმრების მიღება", en: "Welcome drinks" }, place: { ka: "რესტორანი „ვარდების ბაღი“", en: "Rose Garden restaurant" }, icon: "glasses", photo: "images/restaurant.jpg", main: true },
    { time: "19:00", title: { ka: "ბეჭდების ცერემონია", en: "Ring ceremony" }, icon: "rings" },
    { time: "20:00", title: { ka: "ვახშამი და ცოცხალი მუსიკა", en: "Dinner & live music" }, icon: "note" },
    { time: "22:00", title: { ka: "ტორტი და ცეკვა", en: "Cake & dancing" }, icon: "cake" }
  ],

  details: [
    { icon: "dress", label: { ka: "ჩაცმის კოდი", en: "Dress code" }, value: { ka: "ღია და ვარდისფერი ტონები", en: "Soft blush and pastel tones" } },
    { icon: "gift", label: { ka: "საჩუქრები", en: "Gifts" }, value: { ka: "თქვენი მოსვლა უკვე ყველაზე დიდი საჩუქარია", en: "Your presence is the greatest gift" } },
    { icon: "car", label: { ka: "პარკინგი", en: "Parking" }, value: { ka: "უფასო პარკინგი რესტორნის ეზოში", en: "Free parking in the restaurant courtyard" } }
  ],

  photos: ["images/gallery-1.jpg", "images/gallery-2.jpg", "images/gallery-3.jpg", "images/gallery-4.jpg"],

  calTitle: { ka: "გიორგი და ნინოს ნიშნობა", en: "Giorgi & Nino's engagement" },
  rsvpTo: { ka: "გიორგი და ნინო", en: "Giorgi & Nino" },
  rsvpEvent: { ka: "თქვენს ნიშნობაზე", en: "your engagement party" },
  shareText: { ka: "გიორგი და ნინოს ნიშნობის მოსაწვევი", en: "Giorgi & Nino's engagement invitation" },
  whatsapp: "",

  music: "waltz",
  fx: ["petals", "hearts:0.6"],
  fxGate: ["petals:0.5"],
  openFx: "hearts:40",
  rsvpFx: "hearts",
  texts: {
    ka: { cdTitle: "ნიშნობამდე დარჩა", storyTitle: "როგორ დაიწყო", galTitle: "ჩვენი მომენტები", dayTitle: "საღამოს პროგრამა", tapHint: "შეეხეთ ყუთს" },
    en: { cdTitle: "Counting down to the party", storyTitle: "How it began", galTitle: "Our moments", dayTitle: "The evening", tapHint: "Tap the ring box" }
  }
};
