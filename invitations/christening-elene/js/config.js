/* =====================================================================
   ამბავი · ნათლობის მოსაწვევი · დიზაინი „ზეციური“
   ახალი ოჯახისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ===================================================================== */
window.CONFIG = {
  id: "elene-christening",
  title: { ka: "ელენეს ნათლობა · მოსაწვევი", en: "Elene's Christening · Invitation" },
  host: { ka: "ელენე", en: "Elene" },
  script: "Elene",
  monogram: "E",
  headline: { ka: "ელენეს ნათლობა", en: "Elene's Christening" },
  date: "2027-06-06",
  city: { ka: "თბილისი", en: "Tbilisi" },
  verse: { ka: "„ყოველი ბავშვი ნათლის სხივია, რომელიც ჩვენს სახლს ანათებს“", en: "“Every child is a ray of light that brightens our home”" },

  lead:  { ka: "სიყვარულით გიწვევთ ჩვენი პატარა ელენეს ნათლობაზე. გვინდა, ეს ნათელი დღე ჩვენთვის ძვირფას ადამიანებთან ერთად გავატაროთ.",
           en: "With love we invite you to our little Elene's christening. We would love to share this bright day with the people dear to us." },
  toast: { ka: "სიყვარულით, ირაკლი და სოფო", en: "With love, Irakli & Sopo" },

  hero: "images/hero.jpg",

  events: [
    { time: "12:00", title: { ka: "ნათლობის საიდუმლო", en: "Holy Baptism" }, place: { ka: "სიონის საკათედრო ტაძარი", en: "Sioni Cathedral" }, icon: "cross", photo: "images/church.jpg", main: true },
    { time: "13:30", title: { ka: "საოჯახო ფოტოსესია", en: "Family photo session" }, place: { ka: "ძველი თბილისი", en: "Old Tbilisi" }, icon: "camera", photo: "images/photo.jpg" },
    { time: "15:00", title: { ka: "სადღესასწაულო სუფრა", en: "Celebration lunch" }, place: { ka: "რესტორანი „თეთრი ბაღი“", en: "White Garden restaurant" }, icon: "glasses", photo: "images/restaurant.jpg" }
  ],

  details: [
    { icon: "users", label: { ka: "მშობლები", en: "Parents" }, value: { ka: "ირაკლი და სოფო", en: "Irakli & Sopo" } },
    { icon: "cross", label: { ka: "ნათლია", en: "Godfather" }, value: { ka: "ალექსანდრე", en: "Aleksandre" } },
    { icon: "heart", label: { ka: "ნათლიდედა", en: "Godmother" }, value: { ka: "ნათია", en: "Natia" } },
    { icon: "dress", label: { ka: "ჩაცმის კოდი", en: "Dress code" }, value: { ka: "ღია, ნაზი ფერები", en: "Light, soft colours" } }
  ],

  photos: ["images/gallery-1.jpg", "images/gallery-2.jpg", "images/gallery-3.jpg", "images/gallery-4.jpg"],

  calTitle: { ka: "ელენეს ნათლობა", en: "Elene's christening" },
  rsvpTo: { ka: "ირაკლი და სოფო", en: "Irakli & Sopo" },
  rsvpEvent: { ka: "ელენეს ნათლობაზე", en: "Elene's christening" },
  shareText: { ka: "ელენეს ნათლობის მოსაწვევი", en: "Elene's christening invitation" },
  whatsapp: "",

  music: "lullaby",
  fx: ["feathers:0.8", "gold:0.7"],
  fxGate: ["gold:0.6"],
  openFx: "feathers:16",
  rsvpFx: "sparkle",
  texts: {
    ka: { cdTitle: "ნათლობამდე დარჩა", detailsTitle: "ოჯახი და დეტალები", galTitle: "პატარა მომენტები", tapHint: "შეეხეთ ტაძრის კარს" },
    en: { cdTitle: "Counting down to the day", detailsTitle: "Family & details", galTitle: "Little moments", tapHint: "Touch the church doors" }
  }
};
