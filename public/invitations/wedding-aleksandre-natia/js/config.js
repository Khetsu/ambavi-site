/* =====================================================================
   ამბავი · საქორწილო მოსაწვევი · დიზაინი „რედაქცია“
   (ჟურნალის სტილი: ქაღალდი, შავი სერიფი, ღვინისფერი აქცენტი, ხაზოვანი ილუსტრაციები)
   ახალი წყვილისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ფოტოები: images/-ში ჩადეთ story-1.jpg ... — სანამ არ არის, ჩანს ილუსტრაცია images/art-დან
   ===================================================================== */
window.CONFIG = {
  id: "aleksandre-natia",
  title: { ka: "ალექსანდრე & ნატია · 11 სექტემბერი 2027", en: "Aleksandre & Natia · 11 September 2027" },
  host: { ka: "ალექსანდრე & ნატია", en: "Aleksandre & Natia" },
  script: "Aleksandre & Natia",
  first: "Aleksandre", second: "Natia",
  monogram: "A&N",
  date: "2027-09-11",
  city: { ka: "თბილისი", en: "Tbilisi" },

  lead:  { ka: "ორი ისტორია, ერთი ფურცელი. გთხოვთ, იყოთ ჩვენი ახალი თავის პირველ გვერდზე.",
           en: "Two stories, one page. Please join us on the first page of our new chapter." },
  toast: { ka: "გელოდებით", en: "See you there" },

  venue: { ka: "სივრცე „ატელიე 21“", en: "Atelier 21" },
  address: { ka: "სივრცე „ატელიე 21“ · ძველი თბილისი", en: "Atelier 21 · Old Tbilisi" },
  mapUrl: "",
  issue: { ka: "გამოცემა №1 · შემოდგომა 2027", en: "Issue No. 1 · Autumn 2027" },

  storyIntro: { ka: "სამი თავი, რომლებიც ერთ ისტორიად იქცა.", en: "Three chapters that became one story." },
  story: [
    { year: "2018", season: { ka: "თავი I · გამოფენა", en: "Chapter I · The exhibition" }, photo: "images/story-1.jpg",
      title: { ka: "ერთი ნახატის წინ", en: "In front of one painting" },
      text: { ka: "გამოფენის გახსნაზე ორივე ერთი და იმავე ნახატის წინ გაჩერდა და ერთზე მეტხანს არცერთი არ წასულა. ალექსანდრემ ჰკითხა, რას ხედავდა, ნატიამ კი უპასუხა: „დასაწყისს“.",
              en: "At an exhibition opening they both stopped in front of the same painting and neither would leave first. Aleksandre asked what she saw. Natia answered: “a beginning”." } },
    { year: "2021", season: { ka: "თავი II · პარიზი", en: "Chapter II · Paris" }, photo: "images/story-2.jpg",
      title: { ka: "სენის ნაპირზე", en: "On the banks of the Seine" },
      text: { ka: "პირველი საერთო მოგზაურობა: წვიმიანი ბულვარები, ძველი წიგნების დახლები და ღამის სენა, სადაც მიხვდნენ, რომ ერთმანეთის გარეშე ქალაქი ცარიელია.",
              en: "Their first trip together: rainy boulevards, old book stalls and the Seine at night, where they realised no city felt full without the other." } },
    { year: "2026", season: { ka: "თავი III · სახურავი", en: "Chapter III · The rooftop" }, photo: "images/story-3.jpg",
      title: { ka: "„კი“ თბილისის თავზე", en: "A “yes” above Tbilisi" },
      text: { ka: "თბილისის სახურავზე, ნარიყალას შუქების ფონზე, ალექსანდრემ მუხლი მოიყარა. ნატიამ პასუხი კითხვის დასრულებამდე თქვა.",
              en: "On a Tbilisi rooftop, with Narikala glowing behind them, Aleksandre knelt. Natia said yes before he finished the question." } }
  ],

  events: [
    { time: "18:00", title: { ka: "ცერემონია", en: "Ceremony" }, place: { ka: "ატელიე 21 · ეზო", en: "Atelier 21 · Courtyard" }, icon: "rings", main: true, noCity: true },
    { time: "19:00", title: { ka: "კოქტეილი", en: "Cocktail hour" }, place: { ka: "გალერეის დარბაზი", en: "The gallery hall" }, icon: "glasses", noCity: true },
    { time: "20:00", title: { ka: "ვახშამი", en: "Dinner" }, place: { ka: "გრძელი სუფრა", en: "The long table" }, icon: "cake", noCity: true },
    { time: "23:00", title: { ka: "აფტერ-პარტი", en: "After party" }, place: { ka: "სახურავის ტერასა", en: "The rooftop terrace" }, icon: "dance", noCity: true }
  ],

  details: [
    { icon: "dress", label: { ka: "დრესკოდი", en: "Dress code" }, value: { ka: "Black tie optional: შავი, სპილოს ძვლის ფერი, ღვინისფერი", en: "Black tie optional: black, ivory, wine" } },
    { icon: "gift", label: { ka: "საჩუქრები", en: "Gifts" }, value: { ka: "თქვენი მობრძანება ჩვენთვის საუკეთესო საჩუქარია", en: "Your presence is the finest gift" } },
    { icon: "camera", label: { ka: "ფოტოები", en: "Photos" }, value: "#AleksandreAndNatia" }
  ],

  photos: [],

  calTitle: { ka: "ალექსანდრე და ნატიას ქორწილი", en: "Aleksandre & Natia's wedding" },
  rsvpTo: { ka: "ალექსანდრე და ნატია", en: "Aleksandre & Natia" },
  rsvpEvent: { ka: "თქვენს ქორწილში", en: "your wedding" },
  shareText: { ka: "ალექსანდრე და ნატიას საქორწილო მოსაწვევი", en: "Aleksandre & Natia's wedding invitation" },
  whatsapp: "",                            // მაგ. "995599123456"

  music: "romance",
  fx: [],
  fxGate: [],
  openFx: "",
  rsvpFx: "sparkle",
  trail: false,
  texts: {
    ka: { cdTitle: "ათვლა", storyTitle: "ჩვენი ისტორია", dayTitle: "საღამოს პროგრამა", detailsTitle: "დეტალები", locTitle: "ადგილი", mapBtn: "ნახე რუკაზე", rsvpTitle: "პასუხი", tapHint: "შეეხეთ, რომ გადაფურცლოთ",
          whenL: "როდის", whereL: "სად", timeL: "დრო", timeNote: "ცერემონიის დასაწყისი" },
    en: { cdTitle: "Countdown", storyTitle: "Our story", dayTitle: "The evening", detailsTitle: "Details", locTitle: "The venue", mapBtn: "View on map", rsvpTitle: "RSVP", tapHint: "Tap to turn the page",
          whenL: "When", whereL: "Where", timeL: "Time", timeNote: "Ceremony begins" }
  }
};
