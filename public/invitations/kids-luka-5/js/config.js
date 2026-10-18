/* =====================================================================
   ამბავი · საბავშვო დაბადების დღის მოსაწვევი · დიზაინი „ცის თავგადასავალი“
   ახალი ბავშვისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ===================================================================== */
window.CONFIG = {
  id: "luka-5",
  title: { ka: "ლუკა ხდება 5 წლის! · დაბადების დღე", en: "Luka is turning 5! · Birthday party" },
  host: { ka: "ლუკა", en: "Luka" },
  script: "Luka",
  age: "5",
  monogram: "5",
  headline: { ka: "ლუკა ხდება 5 წლის!", en: "Luka is turning 5!" },
  date: "2026-11-21",
  city: { ka: "თბილისი", en: "Tbilisi" },

  lead:  { ka: "ბუშტები, ჯადოქარი, ტორტი და ბევრი თამაში! მოდი და ერთად ვიზეიმოთ ლუკას დიდი დღე.",
           en: "Balloons, a magician, cake and lots of games! Come and celebrate Luka's big day with us." },
  toast: { ka: "გელოდებით! ლუკა და მისი ოჯახი", en: "See you there! Luka and his family" },

  hero: "images/hero.jpg",

  events: [
    { time: "13:00", title: { ka: "შეკრება და თამაშები", en: "Arrival & games" }, place: { ka: "გასართობი ცენტრი „ცისარტყელა“", en: "Rainbow play centre" }, icon: "game", photo: "images/playground.jpg", main: true },
    { time: "14:00", title: { ka: "ჯადოქრის შოუ", en: "Magic show" }, icon: "magic" },
    { time: "15:00", title: { ka: "ტორტი და სანთლები", en: "Cake & candles" }, icon: "cake" },
    { time: "15:30", title: { ka: "საჩუქრები და დისკოთეკა", en: "Presents & disco" }, icon: "gift" }
  ],

  details: [
    { icon: "magic", label: { ka: "კოსტიუმი", en: "Costume" }, value: { ka: "მოდით საყვარელი გმირის კოსტიუმით (თუ გინდათ!)", en: "Come dressed as your favourite hero (if you like!)" } },
    { icon: "users", label: { ka: "მშობლებისთვის", en: "For parents" }, value: { ka: "მშობლებს ცალკე მაგიდა და ყავა ელოდებათ", en: "A separate table with coffee awaits the parents" } },
    { icon: "car", label: { ka: "პარკინგი", en: "Parking" }, value: { ka: "უფასო პარკინგი ცენტრის წინ", en: "Free parking in front of the centre" } }
  ],

  photos: ["images/gallery-1.jpg", "images/gallery-2.jpg", "images/gallery-3.jpg", "images/gallery-4.jpg"],

  calTitle: { ka: "ლუკას დაბადების დღე", en: "Luka's birthday party" },
  rsvpTo: { ka: "დათო და ქეთი", en: "Dato & Keti" },
  rsvpEvent: { ka: "ლუკას დაბადების დღეზე", en: "Luka's birthday party" },
  shareText: { ka: "ლუკას დაბადების დღის მოსაწვევი", en: "Luka's birthday invitation" },
  whatsapp: "",
  maxGuests: 12,

  music: "kids",
  fx: ["balloons:0.7"],
  openFx: "confetti:160",
  rsvpFx: "confetti",
  trail: true,
  texts: {
    ka: { cdTitle: "დაბადების დღემდე დარჩა", dayTitle: "რა გველოდება", galTitle: "ლუკას 5 წელი", tapHint: "დააჭირე ბუშტს!", rsvpTitle: "მოდიხარ?",
          countLabel: "რამდენი იქნებით? (ბავშვები და მშობლები)" },
    en: { cdTitle: "Party starts in", dayTitle: "What's planned", galTitle: "Luka's 5 years", tapHint: "Tap the balloon!", rsvpTitle: "Are you coming?",
          countLabel: "How many of you? (kids and parents)" }
  }
};
