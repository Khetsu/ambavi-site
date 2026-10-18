/* =====================================================================
   ამბავი · საქორწილო მოსაწვევი · დიზაინი „ლიმონის ზაფხული“
   (ხმელთაშუა ზღვის სტილი: ლურჯი კაფელი, ლიმონები, თეთრი)
   ახალი წყვილისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ფოტოები: images/-ში ჩადეთ story-1.jpg ... — სანამ არ არის, ჩანს ილუსტრაცია images/art-დან
   ===================================================================== */
window.CONFIG = {
  id: "kote-tako",
  title: { ka: "კოტე & თაკო · 10 ივლისი 2027", en: "Kote & Tako · 10 July 2027" },
  host: { ka: "კოტე & თაკო", en: "Kote & Tako" },
  script: "Kote & Tako",
  monogram: "K&T",
  date: "2027-07-10",
  city: { ka: "ციხისძირი", en: "Tsikhisdziri" },

  lead:  { ka: "ზღვა, ლიმონის ბაღი და ჩვენთვის ყველაზე ძვირფასი ადამიანები. გელოდებით ზაფხულის ყველაზე ლამაზ საღამოზე.",
           en: "The sea, a lemon garden and the people dearest to us. Join us for the most beautiful evening of the summer." },
  toast: { ka: "გელოდებით ზღვასთან, სიყვარულით", en: "See you by the sea, with love" },

  venue: { ka: "ვილა „ლიმონის ბაღი“", en: "Lemon Garden Villa" },
  address: { ka: "ვილა „ლიმონის ბაღი“ · ციხისძირი, აჭარა", en: "Lemon Garden Villa · Tsikhisdziri, Adjara" },
  mapUrl: "",

  storyIntro: { ka: "სამი ზაფხული, რომლებმაც ყველაფერი შეცვალა.", en: "Three summers that changed everything." },
  story: [
    { year: "2019", season: { ka: "ზაფხული", en: "Summer" }, photo: "images/story-1.jpg",
      title: { ka: "ლიმონათი სანაპიროზე", en: "Lemonade on the beach" },
      text: { ka: "სანაპიროს კაფეში კოტემ თაკოს ლიმონათი შემთხვევით გადაუქცია. ახალი ლიმონათი იყიდა, მეორეც და იმ საღამოს მზის ჩასვლამდე ერთად ისხდნენ.",
              en: "At a beach café Kote knocked over Tako's lemonade. He bought a new one, then another, and they sat together until sunset." } },
    { year: "2022", season: { ka: "გაზაფხული", en: "Spring" }, photo: "images/story-2.jpg",
      title: { ka: "იტალია ორისთვის", en: "Italy for two" },
      text: { ka: "პირველი საერთო მოგზაურობა: ფერადი სახლები კლდეზე, ლიმონის ბაღები და ზღვა, რომელიც სახლს ახსენებდათ.",
              en: "Their first trip together: colourful houses on the cliffs, lemon groves and a sea that reminded them of home." } },
    { year: "2026", season: { ka: "შემოდგომა", en: "Autumn" }, photo: "images/story-3.jpg",
      title: { ka: "ბეჭედი ლიმონის ხეზე", en: "A ring on the lemon tree" },
      text: { ka: "ბებიის ბაღში, ლიმონის ხის ტოტზე, თაკომ ლენტით დაკიდებული ბეჭედი იპოვა. პასუხი ზღვამდეც გაიგონეს.",
              en: "In grandma's garden Tako found a ring tied with a ribbon to a lemon branch. Her answer was heard all the way to the sea." } }
  ],

  events: [
    { time: "17:00", title: { ka: "ცერემონია", en: "Ceremony" }, place: { ka: "ტერასა ზღვის პირას", en: "Seaside terrace" }, icon: "rings", main: true, noCity: true },
    { time: "18:30", title: { ka: "აპერიტივო", en: "Aperitivo" }, place: { ka: "ლიმონის ბაღი", en: "The lemon garden" }, icon: "glasses", noCity: true },
    { time: "19:30", title: { ka: "საზეიმო ვახშამი", en: "Wedding dinner" }, place: { ka: "ვილა „ლიმონის ბაღი“", en: "Lemon Garden Villa" }, icon: "cake", noCity: true },
    { time: "22:00", title: { ka: "ცეკვა ვარსკვლავების ქვეშ", en: "Dancing under the stars" }, place: { ka: "ტერასა", en: "The terrace" }, icon: "dance", noCity: true }
  ],

  details: [
    { icon: "dress", label: { ka: "დრესკოდი", en: "Dress code" }, value: { ka: "ზაფხულის ელეგანტური: თეთრი, ლურჯი, ლიმონისფერი", en: "Summer elegant: white, blue, lemon" } },
    { icon: "sun", label: { ka: "ამინდი", en: "Weather" }, value: { ka: "საღამო ზღვასთან გრილია, წამოიღეთ თხელი შალი", en: "Evenings by the sea are breezy, bring a light shawl" } },
    { icon: "car", label: { ka: "ტრანსპორტი", en: "Transport" }, value: { ka: "ბათუმიდან 16:00-ზე ავტობუსი გაგიყვანთ", en: "A shuttle leaves Batumi at 16:00" } }
  ],

  photos: [],

  calTitle: { ka: "კოტე და თაკოს ქორწილი", en: "Kote & Tako's wedding" },
  rsvpTo: { ka: "კოტე და თაკო", en: "Kote & Tako" },
  rsvpEvent: { ka: "თქვენს ქორწილში", en: "your wedding" },
  shareText: { ka: "კოტე და თაკოს საქორწილო მოსაწვევი", en: "Kote & Tako's wedding invitation" },
  whatsapp: "",                            // მაგ. "995599123456"

  music: "waltz",
  fx: ["petals:0.35"],
  fxGate: [],
  openFx: "confetti:70",
  rsvpFx: "confetti",
  texts: {
    ka: { cdTitle: "ქორწილამდე დარჩა", dayTitle: "დღის განრიგი", detailsTitle: "კარგია იცოდეთ", locTitle: "სად გელოდებით", mapBtn: "ნახე რუკაზე", tapHint: "შეეხეთ ცვილის ბეჭედს" },
    en: { cdTitle: "Until the wedding", dayTitle: "The day", detailsTitle: "Good to know", locTitle: "Where", mapBtn: "View on map", tapHint: "Touch the seal" }
  }
};
