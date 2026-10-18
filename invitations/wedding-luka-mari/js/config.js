/* =====================================================================
   ამბავი · საქორწილო მოსაწვევი · ოქრო და თეთრი
   ლუკა & მარი · 28 ოქტომბერი 2026, 18:00
   შესაცვლელია: venue / address (რესტორნის ზუსტი სახელი და მისამართი),
                mapUrl (Google Maps-ის ბმული, სურვილისამებრ), whatsapp (წყვილის ნომერი)
   ===================================================================== */
window.CONFIG = {
  id: "luka-mari",
  title: { ka: "ლუკა & მარი · საქორწილო მოსაწვევი", en: "Luka & Mari · Wedding invitation" },
  host: { ka: "ლუკა & მარი", en: "Luka & Mari" },
  script: "Luka & Mari",
  monogram: "L&M",
  date: "2026-10-28",                      // წელი-თვე-დღე
  city: { ka: "თბილისი", en: "Tbilisi" },

  lead:  { ka: "ჩვენი ცხოვრების ყველაზე ლამაზ საღამოს გვინდა, რომ თქვენც ჩვენ გვერდით იყოთ.",
           en: "On the most beautiful evening of our lives we would love to have you by our side." },
  toast: { ka: "გელოდებით სიყვარულით", en: "With love, we await you" },

  /* რესტორანი — ჩაწერეთ ზუსტი სახელი და მისამართი. რუკის ღილაკი ამ მისამართს მოძებნის */
  venue: { ka: "რესტორანი „ლისი“", en: "Lisi Restaurant" },
  address: { ka: "ლისის ტბა, თბილისი", en: "Lisi Lake, Tbilisi" },
  mapUrl: "",                              // თუ გაქვთ Google Maps-ის ზუსტი ბმული, ჩასვით აქ
  seatTime: "18:00",

  story: [],
  events: [
    { time: "18:00", title: { ka: "სუფრასთან დაჯდომა", en: "Dinner is served" },
      place: { ka: "რესტორანი „ლისი“", en: "Lisi Restaurant" }, map: "რესტორანი ლისი, ლისის ტბა, თბილისი", noCity: true, icon: "glasses", main: true }
  ],
  details: [],
  photos: [],

  calTitle: { ka: "ლუკა და მარის ქორწილი", en: "Luka & Mari's wedding" },
  rsvpTo: { ka: "ლუკა და მარი", en: "Luka & Mari" },          // ვის მიემართება სტუმრის პასუხი
  rsvpEvent: { ka: "თქვენს ქორწილში", en: "your wedding" },
  shareText: { ka: "ლუკა და მარის საქორწილო მოსაწვევი", en: "Luka & Mari's wedding invitation" },
  whatsapp: "",                            // წყვილის ნომერი, მაგ. "995599123456" — სტუმრების პასუხი აქ მოვა

  music: "romance",
  fx: ["gold:0.7"],
  fxGate: ["gold:0.5"],
  openFx: "sparkle:60",
  rsvpFx: "sparkle",
  texts: {
    ka: { cdTitle: "ქორწილამდე დარჩა", dayTitle: "საქორწილო საღამო", locTitle: "სად გელოდებით", seatLabel: "სუფრასთან დაჯდომა", mapBtn: "ნახე რუკაზე",
          rsvpTitle: "დაგვიდასტურეთ დასწრება", tapHint: "შეეხეთ ოქროს მედალიონს" },
    en: { cdTitle: "Until we say yes", dayTitle: "The wedding evening", locTitle: "Where we'll be", seatLabel: "Dinner at", mapBtn: "View on map",
          rsvpTitle: "Kindly let us know", tapHint: "Touch the golden medallion" }
  }
};
