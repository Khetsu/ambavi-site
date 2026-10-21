/* =====================================================================
   ამბავი · საქორწილო მოსაწვევი · რომა & ხატია · 8 ნოემბერი 2026 · ქუთაისი
   დიზაინი „მარგალიტი“: სპილოსძვლისფერი რელიეფური ქაღალდი, ატლასის ყვავილები მარგალიტებით (3D), 3D კონვერტი ბეჭდით.

   ფოტოები images/ საქაღალდეში: couple.jpg (თქვენი, ვერტიკალური), hotel.jpg (სასტუმრო „სოლომონი“), bagrati.jpg (ბაგრატის ტაძარი), kalakuri.jpg (რესტორანი „ქალაქური“).
   ===================================================================== */
window.CONFIG = {
  id: "roma-khatia",
  title: { ka: "რომა & ხატია · 8 ნოემბერი 2026", en: "Roma & Khatia · 8 November 2026" },
  host: { ka: "რომა & ხატია", en: "Roma & Khatia" },
  script: "Roma & Khatia",
  monogram: "რ ხ",
  date: "2026-11-08",
  city: { ka: "ქუთაისი", en: "Kutaisi" },

  heroLine: "Together towards our most beautiful tomorrow",
  dear: { ka: "ძვირფასო ოჯახო და მეგობრებო!", en: "Dear family and friends!" },
  lead: { ka: "ყველაზე ბედნიერი დღე მაშინაა სრული, როცა საყვარელი ადამიანები გვერდით გვყავს. გელოდებით ჩვენს ქორწილში!",
          en: "Our happiest day is only complete with our loved ones beside us. We can't wait to celebrate with you!" },

  /* სამი ადგილი: სახელი, დრო/აღწერა, ფოტო და რუკა (map: Google Maps-ის ძებნა ან ზუსტი https:// ბმული) */
  place1: { ka: "სასტუმრო „სოლომონი“", en: "Hotel Solomoni" },
  place1Note: { ka: "შეკრება და ფოტოსესია", en: "Gathering & photo session" },
  place1Photo: "images/hotel.jpg", place1Map: "Hotel Solomoni, Kutaisi",
  place2: { ka: "ბაგრატის ტაძარი", en: "Bagrati Cathedral" },
  place2Note: { ka: "ჯვრისწერა და ფოტოსესია", en: "Wedding ceremony & photos" },
  place2Photo: "images/bagrati.jpg", place2Map: "Bagrati Cathedral, Kutaisi",
  place3: { ka: "რესტორანი „ქალაქური“", en: "Kalakuri Restaurant" },
  place3Note: { ka: "დარბაზში დასხდომა", en: "Wedding feast" },
  place3Photo: "images/kalakuri.jpg", place3Map: "Kalakuri Restaurant, Nikea St, Kutaisi",

  couplePhoto: "images/couple.jpg",

  /* განრიგი (main: true — უკუთვლა ამ დრომდე ითვლის) */
  events: [
    { time: "10:00", title: { ka: "შეკრება და ფოტოსესია", en: "Gathering & photo session" }, note: { ka: "სასტუმრო „სოლომონი“", en: "Hotel Solomoni" } },
    { time: "13:00", title: { ka: "ჯვრისწერა", en: "Wedding ceremony" }, note: { ka: "ბაგრატის ტაძარი · შემდეგ ფოტოსესია ტაძართან", en: "Bagrati Cathedral · photos at the cathedral after" }, main: true },
    { time: "17:00", title: { ka: "დარბაზში დასხდომა", en: "Wedding feast" }, note: { ka: "რესტორანი „ქალაქური“ · ქართული სუფრა, მუსიკა და ცეკვა", en: "Kalakuri Restaurant · supra, music & dancing" } }
  ],

  dressCode: { ka: "კლასიკური, ლამაზი სამოსი", en: "Classic, elegant attire" },
  dressNote: { ka: "ძალიან გაგვახარებს, თუ სამოსის არჩევისას ამ ფერებს გაითვალისწინებთ. თეთრი ფერი, გთხოვთ, პატარძალს დაუტოვოთ.", en: "We would be delighted if you kept these colours in mind. Please leave white to the bride." },
  chokhaNote: { ka: "ჩვენ, წყვილი, ქართულ ჩოხებში ვიქნებით", en: "We, the couple, will wear Georgian chokhas" },
  palette: ["#D8A7A7", "#D2BC98", "#A8B89A", "#9EB3C9", "#B49AB8", "#8C6F66"],   // ფერფლისფერი ვარდისფერი, შამპანური, ზეთისხილისფერი, ცისფერი, ლავანდა, მოკა (თეთრის გარეშე)

  wishes: { ka: "ჩვენთვის ყველაზე ძვირფასი თქვენი მობრძანება, მხარდაჭერა და თბილი სიტყვებია ამ განსაკუთრებულ დღეს. თუ საჩუქრით გინდათ გაგვახაროთ, მადლობელი ვიქნებით წვლილისთვის ჩვენს საერთო მომავალში.",
            en: "Your presence, support and warm words are what matter most to us. If you would like to give a gift, we will be grateful for a contribution to our shared future." },
  wishesLine: "For us, the most important thing is to be surrounded by loved ones!",
  questions: { ka: "თუ რაიმე კითხვა გაქვთ, ყოველთვის შეგიძლიათ დაგვიკავშირდეთ.", en: "If you have any questions, you can always contact us." },
  thanks: { ka: "გმადლობთ, რომ ჩვენთან ხართ!", en: "Thank you for being with us!" },

  /* ჩვენი ისტორია: თითო თავი = ფოტო + სათაური + ტექსტი (year — ხელწერით ზემოთ, season — პატარა ასოებით) */
  storyIntro: { ka: "ორი გული, ერთი გზა", en: "Two hearts, one path" },
  story: [
    { year: "Us", season: { ka: "როგორ დაიწყო", en: "How it began" }, photo: "images/story-1.jpg",
      title: { ka: "ერთმანეთი ვიპოვეთ", en: "We found each other" },
      text: { ka: "ჩვენი ამბავი უბრალო გაცნობით დაიწყო, ისე, როგორც ბევრი ლამაზი ამბავი იწყება ყოველგვარი ხმაურისა და დიდი მოლოდინების გარეშე. ნელ-ნელა ერთმანეთის ყოველდღიურობის ნაწილი გავხდით, ერთმანეთში სიმშვიდე, სითბო და ის განსაკუთრებული სიახლოვე ვიპოვეთ, რომელიც სახლს ჰგავს.",
              en: "Our story began with a simple introduction, the way many beautiful stories begin, without any fuss or great expectations. Little by little we became part of each other's everyday lives, and found in each other calm, warmth and that special closeness that feels like home." } },
    { year: "Forever", season: { ka: "და ახლა", en: "And now" }, photo: "images/story-2.jpg",
      title: { ka: "სამუდამოდ ერთად", en: "Together, forever" },
      text: { ka: "დღეს კი, როცა უკან ვიყურებით, გვიხარია, რომ ჩვენი გზები ერთმანეთს შეხვდა. რადგან ზოგჯერ ყველაზე ლამაზი სიყვარული სწორედ ის არის, რომელიც ნელა იზრდება, პატარა მომენტებში იმალება და ბოლოს ყველაზე დიდ გადაწყვეტილებამდე მიგიყვანს: ერთად გაატარო მთელი ცხოვრება.",
              en: "Today, looking back, we are so glad our paths crossed. Because sometimes the most beautiful love is the one that grows slowly, hides in small moments and finally leads you to the biggest decision of all: to spend your whole life together." } }
  ],
  storyOutro: { ka: "ახლა გვინდა, ჩვენი ამბის ამ განსაკუთრებულ დღეს თქვენც იყოთ ჩვენთან, რადგან ყველაზე ლამაზი დღეები საყვარელ ადამიანებთან ერთად კიდევ უფრო ლამაზი ხდება.",
                en: "Now we want you to be with us on this special day of our story, because the most beautiful days become even more beautiful with the people we love." },
  photos: [],

  calTitle: { ka: "რომა და ხატიას ქორწილი", en: "Roma & Khatia's wedding" },
  rsvpTo: { ka: "რომა და ხატია", en: "Roma & Khatia" },
  rsvpEvent: { ka: "თქვენს ქორწილში", en: "your wedding" },
  shareText: { ka: "რომა და ხატიას საქორწილო მოსაწვევი", en: "Roma & Khatia's wedding invitation" },
  whatsapp: "995598808022",                               // თქვენი ნომერი, მაგ. "995599123456" — პასუხები და კითხვები აქ მოვა

  music: "music/song.mp3",                    // „შენ დაგეძებ“ (music/song.mp3). YouTube-ისთვის: "https://www.youtube.com/watch?v=..."
  musicFallback: "kartuli",
  fx: ["gold:0.22"],
  fxGate: ["gold:0.3"],
  openFx: "gold:36",
  rsvpFx: "petals",
  trail: false,
  /* 3D კონვერტი: სპილოსძვლისფერი ქაღალდი, შამპანურისფერი ყვავილოვანი სარჩული, მარგალიტისფერი ბეჭედი */
  envelope: {
    paper: ["#FCF9F3", "#EDE5D8"], flap: ["#FDFBF6", "#F0E9DD"], liner: ["#F1E8DC", "#E2D5C3"], pattern: "flowers",
    accent: "#B9A68C", metal: true, back: "#ECE4D6",
    card: ["#FFFDF8", "#F4EDE1"], cardAccent: "#B3A083", ink: "#5E5248", soft: "#8C7F72",
    cardTitle: { ka: "საქორწილო მოსაწვევი", en: "WEDDING INVITATION" }, cardLine: { ka: "ქუთაისი · 13:00 · ბაგრატის ტაძარი", en: "Kutaisi · 1 PM · Bagrati Cathedral" },
    seal: "#E2D6C6", sealSide: "#B8A68E", sealMetal: .35, sparks: "#FFF4DE",
    fontHead: '"Noto Serif Georgian", serif', fontScript: '"Great Vibes", cursive', fontNum: '"Cormorant Garamond", serif'
  },
  texts: {
    ka: { cdTitle: "შევხვდებით...", dayTitle: "დღის განრიგი", tapHint: "შეეხეთ ბეჭედს", gotInvite: "თქვენ მიიღეთ მოსაწვევი", rsvpTitle: "დაგვიდასტურეთ დასწრება", ask: "მოგვწერეთ", mapBtn: "მარშრუტი", placesTitle: "სად გელოდებით", dressTitle: "დრესკოდი", wishTitle: "სურვილები", toDay: "ჩვენს ბედნიერ დღემდე", invite1: "სიყვარულით გიწვევთ", invite2: "ჩვენს ქორწილში", askLine: "კითხვებისთვის მოგვწერეთ", dayTitle2: "ქორწილის დღე" },
    en: { cdTitle: "See you in...", dayTitle: "The day", tapHint: "Touch the seal", gotInvite: "You have received an invitation", rsvpTitle: "Kindly reply", ask: "Message us", mapBtn: "Directions", placesTitle: "Where", dressTitle: "Dress code", wishTitle: "Wishes", toDay: "until our happy day", invite1: "With love we invite you", invite2: "to our wedding", askLine: "For any questions, message us", dayTitle2: "The wedding day" }
  }
};
