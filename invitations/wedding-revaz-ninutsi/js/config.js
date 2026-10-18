/* =====================================================================
   ამბავი · საქორწილო მოსაწვევი · დიზაინი „ზეთისხილის ბაღი“
   (ბოტანიკური აკვარელი: სალბისფერი, მტვრისფერი ცისფერი, ვარდისფერი, მზარდი ტოტები)
   ახალი წყვილისთვის მხოლოდ ეს ფაილი შეცვალე. ტექსტები ორ ენაზეა: { ka: "...", en: "..." }
   ფოტოები: images/-ში ჩადეთ story-1.jpg ... — სანამ არ არის, ჩანს ილუსტრაცია images/art-დან
   ===================================================================== */
window.CONFIG = {
  id: "revaz-ninutsi",
  title: { ka: "რევაზ & ნინუცი · 15 მაისი 2027", en: "Revaz & Ninutsi · 15 May 2027" },
  host: { ka: "რევაზ & ნინუცი", en: "Revaz & Ninutsi" },
  script: "Revaz & Ninutsi",
  monogram: "R&N",
  date: "2027-05-15",
  city: { ka: "მცხეთა", en: "Mtskheta" },

  lead:  { ka: "გაზაფხული, ზეთისხილის ჩრდილი და ჩვენი საყვარელი ადამიანები. გვიხარია, რომ ამ დღეს ჩვენთან ერთად გაიზიარებთ.",
           en: "Spring, the shade of olive trees and the people we love. We are so happy you will share this day with us." },
  toast: { ka: "გელოდებით ბაღში, სიყვარულით", en: "See you in the garden, with love" },

  venue: { ka: "ბაღი „ზეთისხილის ჩრდილი“", en: "Olive Shade Garden" },
  address: { ka: "ბაღი „ზეთისხილის ჩრდილი“ · მცხეთა", en: "Olive Shade Garden · Mtskheta" },
  mapUrl: "",

  storyIntro: { ka: "ჩვენი ისტორია სამ გაზაფხულში.", en: "Our story in three springs." },
  story: [
    { year: "2017", season: { ka: "გაზაფხული", en: "Spring" }, photo: "images/story-1.jpg",
      title: { ka: "ბოტანიკურ ბაღში", en: "In the botanical garden" },
      text: { ka: "ორივე ერთი და იმავე ყვავილს უღებდა ფოტოს. რევაზმა თქვა, რომ ყვავილი ლამაზი იყო, მაგრამ უკვე სხვას უყურებდა.",
              en: "They were both photographing the same flower. Revaz said the flower was lovely, though he was already looking at someone else." } },
    { year: "2020", season: { ka: "ზაფხული", en: "Summer" }, photo: "images/story-2.jpg",
      title: { ka: "ჩვენი პირველი ხე", en: "Our first tree" },
      text: { ka: "პირველ საერთო აივანზე პატარა ზეთისხილის ხე დარგეს. ხე გაიზარდა, მათი სიყვარულიც.",
              en: "On their first shared balcony they planted a small olive tree. The tree grew, and so did their love." } },
    { year: "2026", season: { ka: "გაზაფხული", en: "Spring" }, photo: "images/story-3.jpg",
      title: { ka: "ბეჭედი თაიგულში", en: "A ring in the bouquet" },
      text: { ka: "რევაზმა ნინუცის თაიგული აჩუქა. ყვავილებს შორის ლენტით დაბმული ბეჭედი იმალებოდა. „კი“ ცრემლებით და სიცილით ერთად ითქვა.",
              en: "Revaz gave Ninutsi a bouquet with a ring tied by a ribbon among the flowers. The “yes” came with tears and laughter at once." } }
  ],

  events: [
    { time: "15:00", title: { ka: "ჯვრისწერა", en: "Wedding ceremony" }, place: { ka: "სვეტიცხოვლის ტაძარი", en: "Svetitskhoveli Cathedral" }, icon: "church", main: true },
    { time: "17:00", title: { ka: "მიღება ბაღში", en: "Garden reception" }, place: { ka: "ბაღი „ზეთისხილის ჩრდილი“", en: "Olive Shade Garden" }, icon: "glasses", noCity: true },
    { time: "18:30", title: { ka: "ვახშამი ზეთისხილის ქვეშ", en: "Dinner under the olives" }, place: { ka: "გრძელი სუფრა ბაღში", en: "The long garden table" }, icon: "cake", noCity: true },
    { time: "22:00", title: { ka: "ტორტი და ცეკვა", en: "Cake & dancing" }, place: { ka: "ფარნების ქვეშ", en: "Under the lanterns" }, icon: "dance", noCity: true }
  ],

  details: [
    { icon: "dress", label: { ka: "დრესკოდი", en: "Dress code" }, value: { ka: "ბაღის ელეგანტური: სალბისფერი, ცისფერი, ნაზი ვარდისფერი", en: "Garden formal: sage, dusty blue, soft blush" } },
    { icon: "sun", label: { ka: "ბაღში", en: "In the garden" }, value: { ka: "ბალახზე ფართოქუსლიანი ფეხსაცმელი უფრო კომფორტულია", en: "Block heels are kinder to the lawn" } },
    { icon: "car", label: { ka: "პარკინგი", en: "Parking" }, value: { ka: "უფასო პარკინგი ბაღის შესასვლელთან", en: "Free parking at the garden gate" } }
  ],

  photos: [],

  calTitle: { ka: "რევაზ და ნინუცის ქორწილი", en: "Revaz & Ninutsi's wedding" },
  rsvpTo: { ka: "რევაზ და ნინუცი", en: "Revaz & Ninutsi" },
  rsvpEvent: { ka: "თქვენს ქორწილში", en: "your wedding" },
  shareText: { ka: "რევაზ და ნინუცის საქორწილო მოსაწვევი", en: "Revaz & Ninutsi's wedding invitation" },
  whatsapp: "",                            // მაგ. "995599123456"

  music: "romance",
  fx: ["petals:0.45"],
  fxGate: ["petals:0.25"],
  openFx: "petals:60",
  rsvpFx: "petals",
  texts: {
    ka: { cdTitle: "ქორწილამდე დარჩა", dayTitle: "დღის განრიგი", detailsTitle: "კარგია იცოდეთ", locTitle: "სად გელოდებით", mapBtn: "ნახე რუკაზე", tapHint: "შეეხეთ ბაფთას" },
    en: { cdTitle: "Until the wedding", dayTitle: "The day", detailsTitle: "Good to know", locTitle: "Where", mapBtn: "View on map", tapHint: "Untie the ribbon" }
  }
};
