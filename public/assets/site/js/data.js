/* =====================================================================
   ამბავი · საიტის მონაცემები — აქ იცვლება ყველაფერი, რაც საიტზე ჩანს:
   კონტაქტები, მზადების ვადა, დიზაინები, „რა შედის“, პაკეტები და ფასები.
   ===================================================================== */
window.SITE = {
  /* ===== შეცვალეთ: თქვენი კონტაქტები ===== */
  contact: {
    whatsapp: "",            // მაგ. "995599123456" — შეკვეთები აქ მოვა
    instagram: "",           // მაგ. "ambavi.invitations"
    facebook: "",            // მაგ. "ambavi.invitations"
    email: ""                // მაგ. "hello@ambavi.ge"
  },

  /* მოსაწვევის დამზადების ვადა (დღეებში) */
  days: 5,

  types: { all: "ყველა", wedding: "ქორწილი", engagement: "ნიშნობა", birthday: "დაბადების დღე", kids: "საბავშვო", christening: "ნათლობა" },

  /* დიზაინები: url — საქაღალდე, tone — ბარათის ფონი, featured — მთავარ გვერდზე ჩანს, tags — „3D“ და სხვ. */
  designs: [
    { id: "natia-davit", type: "wedding", name: "მარგალიტის ფარდა", who: "Natia & Davit", url: "invitations/wedding-natia-davit/index.html", tone: "linear-gradient(160deg,#F1E9DA,#D9CBB0)", featured: true, tags: ["3D"],
      desc: "3D მარგალიტის ფარდა, რომელიც იღება, ბროლის ჭაღი, ნაქარგი ბაღი და სურვილების კონვერტი." },
    { id: "kote-tako", type: "wedding", name: "ლიმონის ზაფხული", who: "Kote & Tako", url: "invitations/wedding-kote-tako/index.html", tone: "linear-gradient(160deg,#FBF8F2,#BFD6F2)", featured: true,
      desc: "ცვილის ბეჭდით დალუქული კონვერტი, ლურჯი კაფელი, მოქანავე ლიმონები და ზღვის ტალღები." },
    { id: "aleksandre-natia", type: "wedding", name: "რედაქცია", who: "Aleksandre & Natia", url: "invitations/wedding-aleksandre-natia/index.html", tone: "linear-gradient(160deg,#F3EFE7,#121212)", featured: true,
      desc: "ჟურნალის გარეკანი, რომელიც ფურცლდება, დიდი სერიფი, მოძრავი ლენტი და ხაზით დახატული თბილისი." },
    { id: "revaz-ninutsi", type: "wedding", name: "ზეთისხილის ბაღი", who: "Revaz & Ninutsi", url: "invitations/wedding-revaz-ninutsi/index.html", tone: "linear-gradient(160deg,#FBFAF5,#C9D8C0)",
      desc: "ლენტით შეკრული ბარათი, მზარდი გვირგვინები, აკვარელის ლაქები და ყვავილის ფურცლები." },
    { id: "elene-beka", type: "wedding", name: "მარგალიტის ფარდა · ვარდი", who: "Elene & Beka", url: "invitations/wedding-elene-beka/index.html", tone: "linear-gradient(160deg,#FBF4EE,#E6C3BC)", tags: ["3D"],
      desc: "3D მარგალიტის ფარდა და ნაქარგი სცენები: ყვავილების თაღი, ძველი თბილისი, ზღვა და ბეჭდები." },
    { id: "luka-mari", type: "wedding", name: "ოქრო და თეთრი", who: "Luka & Mari", url: "invitations/wedding-luka-mari/index.html", tone: "linear-gradient(160deg,#FFFDF8,#E9CD86)",
      desc: "თეთრი არტ-დეკოს კარი, თავისით დახატული ოქროს ბეჭდები და რესტორნის ბარათი რუკით." },
    { id: "lasha-tamar", type: "wedding", name: "ზურმუხტის ღამე", who: "Lasha & Tamar", url: "invitations/wedding-lasha-tamar/index.html", tone: "linear-gradient(160deg,#0B231E,#1A4C3F)",
      desc: "არტ-დეკოს კარი ოქროს მედალიონით, ვარსკვლავები, ციცინათელები და ფორტეპიანოს ბალადა." },
    { id: "maka-levan", type: "wedding", name: "კლასიკური ოქრო", who: "Maka & Levan", url: "invitations/wedding-maka-levan/index.html", tone: "linear-gradient(160deg,#FBF6EC,#EBDDC3)", noPreview: true,
      desc: "სპილოსძვლისფერი კონვერტი ოქროს ბეჭდით, გაცნობის ისტორია და ცოცხალი მელოდია." },
    { id: "giorgi-nino", type: "engagement", name: "ვარდისფერი ოქრო", who: "Giorgi & Nino", url: "invitations/engagement-giorgi-nino/index.html", tone: "linear-gradient(160deg,#FCE4E4,#F2C4B8)",
      desc: "ხავერდის ბეჭდის ყუთი, რომელიც იხსნება, ვარდის ფურცლები, გულები და პოლაროიდის ისტორია." },
    { id: "salome-30", type: "birthday", name: "დისკო გლამი", who: "Salome · 30", url: "invitations/birthday-salome-30/index.html", tone: "linear-gradient(160deg,#2A1840,#7B5CE0)", featured: true,
      desc: "საჩუქრის ყუთი, რომელიც იხსნება, ფეიერვერკი, ჰოლოგრაფიული ციფრები და საცეკვაო მელოდია." },
    { id: "luka-5", type: "kids", name: "ცის თავგადასავალი", who: "Luka · 5", url: "invitations/kids-luka-5/index.html", tone: "linear-gradient(160deg,#6CC6FF,#D7F0FF)",
      desc: "ბუშტი, რომელიც უნდა გასკდეს, ღრუბლები, ფერადი პროგრამა და მხიარული მელოდია." },
    { id: "elene-baptism", type: "christening", name: "ზეციური", who: "Elene · Holy Baptism", url: "invitations/christening-elene/index.html", tone: "linear-gradient(160deg,#CFE3F7,#FBF6EC)",
      desc: "ტაძრის კარი, რომელიც იღება, მტრედი, ბუმბულები და მუსიკალური ყუთის მელოდია." }
  ],

  /* „რა შედის“: ხატულა, სათაური, ტექსტი */
  feats: [
    ["s-env", "ეფექტური გახსნა", "კონვერტი, საჩუქარი, ბეჭდის ყუთი, ჟურნალის გარეკანი ან მარგალიტის ფარდა: სტუმარი თავად ხსნის."],
    ["s-note", "ორიგინალური მუსიკა", "საკუთარი მელოდიები, რომლებიც ცოცხლად უკრავს და ირთვება გახსნისას."],
    ["s-clock", "უკუთვლა", "დღეები, საათები, წუთები და წამები დიდ დღემდე."],
    ["s-map", "განრიგი და რუკა", "ყველა ადგილი ერთი შეხებით Google Maps-ზე."],
    ["s-wa", "დასწრების დადასტურება", "პასუხი პირდაპირ WhatsApp-ში ან Telegram-ში: სახელი, რაოდენობა და მილოცვა."],
    ["s-cal", "კალენდარი", "Google, iPhone და Outlook კალენდარში დამატება ერთი ღილაკით."],
    ["s-photo", "თქვენი ფოტოები", "ისტორია, გალერეა და ადგილების ფოტოები ლამაზ ჩარჩოებში, ან ილუსტრაციები."],
    ["s-lang", "ორი ენა", "ქართული და ინგლისური, ერთი ღილაკით, უცხოელი სტუმრებისთვის."],
    ["s-cube", "3D და ანიმაციები", "3D სცენები, ფეიერვერკი, ფურცლები, ვარსკვლავები და გლუვი გადასვლები."],
    ["s-link", "ერთი ბმული", "აპლიკაციის გარეშე, იხსნება ნებისმიერ ტელეფონზე და კომპიუტერზე."]
  ],

  /* პაკეტები. price: ჩაწერეთ ფასი (მაგ. "150 ₾"); ცარიელი = „ფასი შეკვეთისას“ */
  packages: [
    { id: "classic", name: "კლასიკა", price: "", note: "ლამაზი, სწრაფი და მარტივი",
      items: ["ნებისმიერი დიზაინი ჩვენი კოლექციიდან", "თქვენი სახელები, თარიღი და ტექსტები", "განრიგი და რუკის ღილაკები", "უკუთვლა და კალენდარში დამატება", "დასწრების დადასტურება WhatsApp-ით", "მუსიკა და ორი ენა", "ერთი რაუნდი შესწორება"] },
    { id: "premium", name: "პრემიუმი", price: "", note: "ყველაზე პოპულარული", popular: true,
      items: ["ყველაფერი „კლასიკიდან“", "თქვენი ისტორია და ფოტოები", "ფერების და შრიფტების მორგება", "სურვილების კონვერტი და დრესკოდი", "Instagram-ის ვიდეო მოსაწვევიდან", "ორი რაუნდი შესწორება"] },
    { id: "exclusive", name: "3D ექსკლუზივი", price: "", note: "დასამახსოვრებელი სანახაობა",
      items: ["ყველაფერი „პრემიუმიდან“", "3D მარგალიტის ფარდა და ბროლის ჭაღი", "ნაქარგი 3D სცენები თქვენი ისტორიით", "უნიკალური ილუსტრაციები თქვენთვის", "Instagram-ის ვიდეო", "შესწორებები, სანამ არ მოგეწონებათ"] }
  ],
  extras: [
    ["s-video", "Instagram / Reels ვიდეო", "ვერტიკალური ვიდეო მოსაწვევიდან, მუსიკით, დასადებად და გასაგზავნად."],
    ["s-copy", "მეორე ღონისძიება", "იგივე დიზაინი ნიშნობისთვის, წვეულებისთვის ან სხვა დღისთვის."],
    ["s-spark", "ინდივიდუალური დიზაინი", "სრულიად ახალი დიზაინი თქვენი იდეით, ფერებით და ილუსტრაციებით."]
  ]
};
