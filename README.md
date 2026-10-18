# ამბავი · ციფრული მოსაწვევები

საიტი, სადაც კლიენტი ხედავს ჩვენს დიზაინებს და შეკვეთას აკეთებს, და თავად მოსაწვევები, რომლებსაც სტუმრები ხსნიან.
საიტი აწყობილია **Astro**-თი: მენიუ, ფეხი და `<head>` ერთხელ წერია და ყველა გვერდი მათ იყენებს.
შედეგი სუფთა HTML-ია, ამიტომ სერვერი და ბაზა არ სჭირდება.

---

## ბრძანებები (ტერმინალში, ამ საქაღალდეში)

| ბრძანება | რას აკეთებს |
|---|---|
| `npm install` | ერთხელ, პირველად: აყენებს Astro-ს (`node_modules/`) |
| `npm run dev` | საიტის ნახვა კომპიუტერზე: გახსენით ბმული, რომელსაც დაწერს (მაგ. http://localhost:4321). ცვლილებები მაშინვე ჩანს |
| `npm run build` | აწყობს მზა საიტს `dist/` საქაღალდეში |
| `git add .` → `git commit -m "..."` → `git push` | ატვირთვა GitHub-ზე. საიტი თავისით აიწყობა და გამოქვეყნდება |

---

## საქაღალდეები

```
ambavi-site/
│
├── src/                        ← საიტის გვერდები (Astro)
│   ├── layouts/Site.astro      ★ საერთო ჩარჩო: <head>, მენიუ, ფეხი, სკრიპტები
│   └── pages/                  თითო ფაილი = თითო გვერდი
│       ├── index.astro         მთავარი           → index.html
│       ├── designs.astro       დიზაინები         → designs.html
│       ├── features.astro      რა შედის          → features.html
│       ├── how.astro           როგორ მუშაობს     → how.html
│       ├── prices.astro        ფასები            → prices.html
│       ├── faq.astro           კითხვები          → faq.html
│       └── order.astro         შეკვეთის ფორმა     → order.html
│
├── public/                     ← ფაილები, რომლებიც საიტზე უცვლელად გადადის
│   ├── 404.html                „გვერდი ვერ მოიძებნა“
│   ├── assets/
│   │   ├── site/css/site.css   საიტის სტილი (ფერები — ზემოთ, :root-ში)
│   │   ├── site/js/data.js     ★ მონაცემები: კონტაქტები, ვადა, დიზაინები, პაკეტები, ფასები
│   │   ├── site/js/site.js     ლოგიკა: მენიუ, ანიმაციები, ბარათები, შეკვეთის ფორმა
│   │   ├── site/img/           ხატულა
│   │   ├── core/               მოსაწვევების საერთო ძრავა (ენა, მუსიკა, ეფექტები, უკუთვლა, RSVP)
│   │   └── 3d/                 3D ფარდა და ნაქარგი სცენები (Three.js)
│   └── invitations/            მოსაწვევები: თითო საქაღალდე თითოეულისთვის
│       └── wedding-kote-tako/
│           ├── index.html      მოსაწვევის გვერდი
│           ├── css/theme.css   ამ დიზაინის სტილი
│           ├── js/config.js    ★ ამ მოსაწვევის ტექსტები: სახელები, თარიღი, ისტორია, განრიგი
│           └── images/art/     ილუსტრაციები (ფოტოს ჩადებამდე ჩანს)
│
├── .github/workflows/deploy.yml   GitHub-ზე ავტომატური აწყობა და გამოქვეყნება
├── astro.config.mjs               Astro-ს პარამეტრები
├── package.json                   ბრძანებები (dev, build) და Astro-ს ვერსია
├── .editorconfig, .gitignore      რედაქტორის და GitHub-ის პარამეტრები
│
├── node_modules/   (ავტომატური, არ ეხებით)
└── dist/           (მზა საიტი `npm run build`-ის შემდეგ, არ ეხებით)
```

---

## ხშირი ცვლილებები

| რა გინდათ | სად | რა შეცვალოთ |
|---|---|---|
| კონტაქტები (WhatsApp, Instagram...) | `public/assets/site/js/data.js` | `contact` |
| ფასები | `public/assets/site/js/data.js` | `packages` → `price` (მაგ. `"150 ₾"`) |
| მზადების ვადა | `public/assets/site/js/data.js` | `days` |
| დიზაინის დამატება კატალოგში | `public/assets/site/js/data.js` | `designs` სიაში ახალი ჩანაწერი |
| მენიუ ან ფეხი | `src/layouts/Site.astro` | `menu` სია და `<footer>` |
| გვერდის ტექსტი | `src/pages/<გვერდი>.astro` | ჩვეულებრივი HTML |
| ფერები საიტზე | `public/assets/site/css/site.css` | ზემოთ, `:root` ბლოკში |
| მოსაწვევის ტექსტები | `public/invitations/<მოსაწვევი>/js/config.js` | სახელები, თარიღი, ადგილები |

## ახალი გვერდი

1. შექმენით `src/pages/about.astro` (დააკოპირეთ რომელიმე არსებული და შეცვალეთ შიგთავსი).
2. მენიუში დაამატეთ ხაზი `src/layouts/Site.astro`-ში: `{ id: "about", href: "about.html", label: "ჩვენ შესახებ" }`.

## ახალი მოსაწვევი

1. დააკოპირეთ მსგავსი დიზაინის საქაღალდე `public/invitations/`-ში ახალი **ინგლისური** სახელით, მაგ. `wedding-giorgi-ana`.
2. შეცვალეთ `js/config.js`: სახელები, თარიღი, ადგილები, WhatsApp ნომერი.
3. კლიენტს გაუგზავნეთ ბმული: `<საიტი>/invitations/wedding-giorgi-ana/`

> მოსაწვევების „დედანი“ ინახება `Procect wedding\მოსაწვევები\`-ში.
> იქ ცვლილების შემდეგ გაუშვით `build-site.ps1` და `public/invitations/` და `public/assets/core|3d` აქ განახლდება.

## მოსაწვევის ბმულის პარამეტრები

| მისამართი | რას აკეთებს |
|---|---|
| `.../wedding-kote-tako/` | ჩვეულებრივი გახსნა, კონვერტით |
| `...?lang=en` | ინგლისურად |
| `...?open` | კონვერტის გარეშე, პირდაპირ შიგთავსი |
| `...?preview` | მინი-ხედი კატალოგისთვის (მუსიკის და ღილაკების გარეშე) |

## გამოქვეყნება

GitHub → **Settings → Pages → Source: GitHub Actions** (ერთხელ).
ამის შემდეგ ყოველი `git push` საიტს თავისით ააწყობს და გამოაქვეყნებს: https://khetsu.github.io/ambavi-site/
პროცესი ჩანს GitHub-ზე, **Actions** ჩანართში.

## ტექნოლოგიები

- **Astro** — საიტის გვერდები (საერთო ჩარჩო, სუფთა HTML შედეგად)
- **HTML / CSS / JavaScript** — დიზაინები და მოსაწვევები
- **Three.js** — 3D სცენები · **Web Audio API** — მუსიკა · **Google Fonts** — შრიფტები
- **GitHub Actions** — ავტომატური გამოქვეყნება · **PowerShell** — `build-site.ps1`
