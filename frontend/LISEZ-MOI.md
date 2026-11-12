# Flora : guide complet du projet

Ce guide explique **où se trouve chaque chose** et **comment la modifier**, y compris pour ajouter des photos, des produits, des pages ou des infos.

---

## 1. Lancer le site

Dans le dossier `frontend/` (ouvert dans VS Code), dans le terminal :

> Pour voir les vrais produits, les commandes, etc., l'API (`../backend`) doit tourner aussi : voir le guide à la racine du projet. Sans elle, le site marche mais affiche ses données de secours.

```powershell
npm install      # une seule fois (ou si tu changes package.json)
npm run dev      # lance le site sur http://localhost:3000
```

- Le site se met à jour tout seul quand tu enregistres un fichier (Ctrl+S).
- **Si une image ne change pas** : arrête le site (Ctrl+C), supprime le dossier `.next`, relance `npm run dev`, puis recharge la page avec Ctrl+Maj+R.
- `npm run lint` vérifie le code, `npm run build` prépare la version de production.

---

## 2. Plan du projet

```
flora/
├─ public/
│  └─ images/                ← TES PHOTOS (rose-rouge.jpg, facade-flora.jpg…)
├─ src/
│  ├─ app/                   ← les PAGES (1 dossier = 1 adresse du site)
│  │  ├─ layout.tsx          ← structure commune : bandeau + menu + pied de page, titre du site (SEO)
│  │  ├─ globals.css         ← couleurs du site
│  │  ├─ page.tsx            ← accueil                    /
│  │  ├─ bouquets/           ← catalogue                  /bouquets
│  │  │  └─ [slug]/page.tsx  ← fiche d'un bouquet         /bouquets/la-rose-rouge
│  │  ├─ occasions/          ← page Occasions             /occasions
│  │  ├─ atelier/            ← page L'atelier             /atelier
│  │  ├─ journal/            ← liste + articles           /journal
│  │  ├─ commander/          ← panier + commande          /commander
│  │  ├─ contact/            ← page Contact               /contact
│  │  ├─ faq/                ← questions fréquentes       /faq
│  │  ├─ not-found.tsx       ← page 404
│  │  └─ api/                ← /api/revalidate (rafraîchit le site après une modif dans l'admin)
│  │
│  ├─ components/            ← les BRIQUES réutilisables
│  │  ├─ home/               ← les sections de l'accueil (voir §4)
│  │  ├─ layout/             ← AnnouncementBar (bandeau noir), Navbar (menu), Footer
│  │  ├─ bouquets/           ← BouquetCard (carte produit), BouquetCatalog (filtres)
│  │  ├─ cart/               ← panier (useCart), bouton « Ajouter », page commande
│  │  ├─ forms/              ← formulaires contact et newsletter
│  │  └─ ui/                 ← petits éléments : boutons, titres, photo, champs…
│  │
│  └─ lib/                   ← les DONNÉES (le plus souvent, c'est ici qu'on modifie)
│     ├─ site.ts             ← infos de la boutique + offre des 8 ans
│     ├─ bouquets.ts         ← la liste des produits
│     ├─ occasions.ts        ← les occasions
│     ├─ journal.ts          ← articles de secours (si l'API est injoignable)
│     ├─ faq.ts              ← questions / réponses
│     ├─ navigation.ts       ← liens du menu et du pied de page
│     ├─ fonts.ts            ← polices (Bodoni Moda + Hanken Grotesk)
│     ├─ format.ts           ← affichage des prix (« 2 000 F CFA »)
│     ├─ pricing.ts          ← calcul de la livraison
│     ├─ backend.ts, catalog.ts, articles.ts  ← lecture des données auprès de l'API
│     └─ api.ts              ← envoi des formulaires (ne pas toucher)
├─ next.config.ts, package.json, tsconfig.json… ← configuration (ne pas toucher)
```

**Règle d'or** : les infos qui reviennent à plusieurs endroits (téléphone, prix de l'offre…) sont dans `lib/`. Les textes propres à une section sont dans le fichier de cette section.

---

## 3. « Je veux changer… » : le tableau de référence

### Infos de la boutique → `src/lib/site.ts`

| Je veux changer | Champ dans `site.ts` | Où ça s'affiche |
| --- | --- | --- |
| Téléphone principal / second | `phone` (+ `phoneSecondary` : pied de page seulement) | pied de page, page Contact |
| Numéro WhatsApp | `whatsapp` (format international, **sans** + ni espaces : `22670484312`) | lien « Écrire sur WhatsApp » |
| E-mail | `email` | page Contact |
| Adresse | `address` | page Contact |
| Boutiques / points de vente | `locations` (une ligne par lieu : `area` + `name`) | pied de page « Nous trouver » |
| Horaires | `hours` | page Contact |
| Prix de la livraison | `deliveryFee` | panier, FAQ |
| Livraison offerte à partir de… | `freeDeliveryFrom` | panier, FAQ, fiche produit |
| Jours de livraison gratuite | `freeDeliveryDays` (0 = dimanche, 1 = lundi, 2 = mardi, 3 = mercredi … 6 = samedi) | calcul du panier |
| Heure limite « livraison le jour même » | `sameDayCutoff` | FAQ |
| Photo de la façade | `facadeImage` (chemin vers `public/images/…`) | accueil et page Atelier |
| Photo du hero / de la section « belle raison » | `heroImage`, `occasionsImage` | accueil |
| **Offre des 8 ans** : prix, ancien prix, période | `anniversary.price`, `anniversary.oldPrice`, `anniversary.period` | bandeau noir du haut, carte du hero, bandeau « 8 ans, ça se fête ! » |

> Attention : le texte « Livraison gratuite les mardis et mercredis » est écrit en dur dans `AnnouncementBar.tsx`, `SeasonBanner.tsx`, `Services.tsx`, `faq.ts` et la fiche produit (`app/bouquets/[slug]/page.tsx`). Si tu changes `freeDeliveryDays`, change aussi ces textes.

### Fin de l'offre des 8 ans (décembre)
1. `site.ts` : modifie ou supprime le bloc `anniversary`.
2. Supprime `<SeasonBanner />` dans `src/app/page.tsx` (et son `import`).
3. Dans l'administration (Produits), ouvre la rose, vide le champ « Ancien prix » et remets son prix normal.
4. Adapte `AnnouncementBar.tsx` (ou retire `<AnnouncementBar />` dans `layout.tsx`) et la carte « L'offre des 8 ans » dans `Hero.tsx`.

---

## 4. La page d'accueil, section par section

L'ordre est défini dans `src/app/page.tsx`. Pour déplacer ou retirer une section, déplace ou supprime sa ligne `<NomDeLaSection />`.

| Ordre | Section | Fichier (`src/components/…`) | Ce qu'on y modifie |
| --- | --- | --- | --- |
| – | Bandeau noir tout en haut | `layout/AnnouncementBar.tsx` | texte (les prix viennent de `site.ts`) |
| – | Menu | `layout/Navbar.tsx` + `lib/navigation.ts` | liens : `navigation.ts` ; look : `Navbar.tsx` |
| 1 | Hero (« Des fleurs. Des liens. De la vie. ») | `home/Hero.tsx` | pastille « Fleuriste à Ouagadougou », titre, sous-titre, boutons, phrase « À offrir. À chérir. », photo ronde, carte « L'offre des 8 ans », pastille « 8 ans » |
| 2 | Bande défilante | `home/Marquee.tsx` | liste `phrases` en haut du fichier |
| 3 | « Un bouquet, mille façons de dire » | `home/FeaturedBouquets.tsx` | titre et texte ; les cartes viennent de `lib/bouquets.ts` (**les 3 premiers** produits : `slice(0, 3)`) |
| 4 | « Il y a toujours une belle raison » | `home/OccasionsSection.tsx` | titre, pastille « Roses, chocolats, Baileys », photo ; la liste vient de `lib/occasions.ts` |
| 5 | « Des mains, du cœur… » | `home/AtelierSection.tsx` | paragraphes, citation, photo (`site.facadeImage`) |
| 6 | Bandeau sombre « 8 ans, ça se fête ! » | `home/SeasonBanner.tsx` | textes ; prix depuis `site.ts` |
| 7 | « De vos envies à ses mains » (3 cartes) | `home/Services.tsx` | liste `services` en haut du fichier (titre + texte de chaque carte) |
| 8 | Newsletter | `home/Newsletter.tsx` | titre et texte |
| – | Pied de page | `layout/Footer.tsx` | texte de présentation, colonnes ; coordonnées depuis `site.ts` |

### Changer la photo d'une section
Ces photos se règlent dans `src/lib/site.ts` (chemin vers `public/images/…`) :
- **Hero** (photo ronde) : `heroImage`.
- **Section « Il y a toujours une belle raison »** : `occasionsImage`.
- **Section « Des mains, du cœur » et page Atelier** : `facadeImage`.

---

## 5. Les photos : ajouter, remplacer, bien cadrer

### Où mettre les photos
Dans `public/images/`. Le chemin dans le code commence toujours par `/images/` (sans `public`) : `"/images/ma-photo.jpg"`.

### Bonnes pratiques
- Format **JPG** (ou PNG/WebP), **1200 px de large minimum**, idéalement < 500 Ko.
- Nom de fichier **sans espaces, sans accents, en minuscules** : `bouquet-saint-valentin.jpg`.
- Pour **remplacer** une photo : garde exactement le même nom de fichier, puis vide le cache (voir §1).
- Next.js redimensionne et compresse les photos automatiquement : inutile de les réduire à la main.
- Une photo sur Internet (`https://…`) ne marchera pas tant que son site n'est pas autorisé dans `next.config.ts` : mets plutôt le fichier dans `public/images/`.

### Cadrer une photo (`position`)
Chaque produit a un champ `position` (ex. `"50% 60%"`) : c'est le point de la photo qui reste visible quand elle est recadrée. Premier chiffre = gauche/droite, second = haut/bas. `"50% 0%"` garde le haut, `"50% 100%"` garde le bas.

### Photo d'un article du journal
Dans l'administration (Journal, ou Images), tu envoies directement la photo. Seule la liste de secours `lib/journal.ts` utilise `image: "/images/xxx.jpg"`.

---

## 6. Ajouter ou modifier un produit

> **Les produits se gèrent dans l'administration** (projet `../admin`). La méthode ci-dessous (fichier `lib/bouquets.ts`) ne sert que pour la liste de secours, affichée si l'API est injoignable.

1. Mets la photo dans `public/images/` et déclare-la dans l'objet `photos` en haut du fichier :
   ```ts
   const photos = {
     rose: "/images/rose-rouge.jpg",
     // …
     fraises: "/images/panier-fraises.jpg",
   };
   ```
2. Copie un bloc existant dans la liste `bouquets` et modifie-le :
   ```ts
   {
     slug: "panier-fraises-roses",      // adresse de la fiche : /bouquets/panier-fraises-roses (minuscules, tirets, unique)
     title: "Panier fraises & roses",   // nom affiché
     description: "Roses, fraises et gypsophile dans un panier en osier",  // phrase courte sur la carte
     details: "Texte plus long affiché sur la fiche du produit…",
     price: 25000,                       // en F CFA, SANS espace ni « F »
     oldPrice: 30000,                    // optionnel : affiche l'ancien prix barré (supprime la ligne sinon)
     tag: "Fait main",                   // petite étiquette blanche sur la photo
     category: "bouquet",                // "rose", "coffret" ou "bouquet" (voir ci-dessous)
     occasions: ["amour", "anniversaire"], // slugs de lib/occasions.ts
     flowers: ["Roses rouges", "Fraises", "Gypsophile"], // liste « composition » sur la fiche
     image: photos.fraises,
     position: "50% 50%",
   },
   ```
3. **L'ordre compte** : les 3 premiers produits de la liste apparaissent sur l'accueil.
4. Le produit apparaît tout seul dans le catalogue, avec fiche, panier et filtres.

### Ajouter une catégorie (filtre du catalogue)
Dans `bouquets.ts` : ajoute-la dans le type `Category` (ex. `| "panier"`) et dans la liste `categoryFilters` (`{ id: "panier", label: "Paniers" }`).

### Supprimer un produit
Supprime son bloc dans `bouquets.ts`.

### Prix
Les prix s'affichent automatiquement en « 2 000 F CFA » grâce à `lib/format.ts`. Le serveur recalcule toujours le prix à partir de `bouquets.ts` (rien n'est pris du navigateur).

---

## 7. Occasions → `src/lib/occasions.ts`

Chaque occasion a un `slug` (identifiant), un `title` et un `text`. Elles alimentent la liste de l'accueil, la page `/occasions` et le filtre du catalogue. Pour en ajouter une : copie un bloc, choisis un `slug` unique, puis ajoute ce slug dans le champ `occasions` des produits concernés.

---

## 8. Les autres pages

| Page | Où modifier |
| --- | --- |
| L'atelier (`/atelier`) | `app/atelier/page.tsx` : tableau `values` (3 cartes) + textes. La photo est `site.facadeImage`. |
| Occasions (`/occasions`) | titres dans `app/occasions/page.tsx`, contenu dans `lib/occasions.ts` |
| Journal (`/journal`) | `lib/journal.ts` : un bloc par article (`slug`, `title`, `excerpt`, `date` AAAA-MM-JJ, `image`, `position`, `body` = liste de paragraphes). Les articles actuels sont des exemples à réécrire. |
| FAQ (`/faq`) | `lib/faq.ts` : paires `question` / `answer` |
| Contact (`/contact`) | coordonnées depuis `site.ts`, formulaire dans `components/forms/ContactForm.tsx` |
| Commander (`/commander`) | `components/cart/Checkout.tsx` (champs du formulaire, textes) |
| Page 404 | `app/not-found.tsx` |

### Ajouter une nouvelle page
1. Crée `src/app/ma-page/page.tsx` (copie `app/faq/page.tsx` comme modèle).
2. Ajoute un lien dans `lib/navigation.ts` pour qu'elle apparaisse dans le menu / pied de page.

---

## 9. Apparence

- **Couleurs** : `src/app/globals.css`, bloc `@theme`. Les noms : `cream` (fond de page), `sand` (pêche très clair), `peach` (pêche, couleur du papier d'emballage), `ink` (texte, bordeaux très foncé), `bloom` (rouge rose, boutons), `sky` (bleu ciel), `yolk` (jaune gerbera), `clay` (prix). Changer une valeur change tout le site. Dans le code : `bg-bloom`, `text-ink`, `bg-peach`…
- **Polices** : `src/lib/fonts.ts`. Titres : **Bodoni Moda** (classe `font-display`). Texte : **Hanken Grotesk** (classe `font-sans`). Pour en changer, remplace-les par une autre police Google Fonts de `next/font/google`.
- **Titres en deux rythmes** : `<Em>…</Em>` met un passage en italique (même couleur).
- **Sceau « 8 ans » qui tourne** : `components/home/Seal.tsx` ; **étiquette à fil** : bloc « Offre des 8 ans » dans `components/home/Hero.tsx`.
- **Animation du titre** : classes `.line-mask` et `.seal-spin` dans `globals.css` (désactivées automatiquement si le visiteur a réglé « réduire les animations »).
- **Boutons** : styles dans `components/ui/buttons.ts` (`primary`, `dark`, `outline`, `light`).
- **Mise en page** : le site utilise Tailwind (classes comme `py-24` = marge verticale, `text-[17px]` = taille du texte, `md:grid-cols-3` = 3 colonnes à partir de la taille tablette). Tu peux changer ces classes directement dans les fichiers.

### Titre du site et référencement Google
`src/app/layout.tsx` : `title`, `description` et `keywords` (ce que Google affiche).

---

## 10. Base de données, API et administration

Le site (ce dossier `frontend/`) **ne contient plus de base de données ni d'administration**. Tout est séparé :

- `../backend/` : l'API (Express + MongoDB), qui reçoit les commandes, messages et inscriptions, et fournit produits et articles.
- `../admin/` : l'administration, une application à part (commandes, messages, images, produits, journal, abonnés).

Le site lit ses produits et articles auprès de l'API (réglage `API_URL` dans `.env.local`), et lui envoie les formulaires. Si l'API est injoignable, il affiche des données de secours (`lib/bouquets.ts` et `lib/journal.ts`). Tout est expliqué dans le `LISEZ-MOI.md` à la racine du projet.

---

## 11. Ce qu'il reste à brancher plus tard

- Paiement en ligne (Orange Money, Moov Money, carte…).

---

## 12. Les erreurs fréquentes

| Problème | Solution |
| --- | --- |
| Photo qui ne change pas / reste floue | Vider `.next`, relancer, Ctrl+Maj+R |
| Page blanche ou erreur rouge après une modification | Lire le message dans le terminal : il indique le fichier et la ligne. Souvent une virgule ou un guillemet oublié dans `bouquets.ts` ou `site.ts` |
| « Image … hostname not configured » | Tu utilises une adresse `https://…` pour une photo. Mets la photo dans `public/images/` à la place |
| Un produit n'apparaît pas sur l'accueil | Seuls les 3 premiers de la liste sont affichés |
| Le site s'affiche sans style | Vérifie que `postcss.config.mjs` existe et relance `npm install` |
| Le site affiche d'anciens produits / pas ceux de l'admin | L'API ne tourne pas ou `API_URL` est faux dans `.env.local` : le site affiche alors ses données de secours. Relance après toute modif de `.env.local` |
| Une modification dans l'admin n'apparaît pas tout de suite | Elle apparaît en 30 secondes (ou aussitôt si `REVALIDATE_SECRET` est réglé des deux côtés) |
| Ça marche chez toi mais pas ailleurs | Pense à copier aussi le dossier `public/images/` |

---

## 13. Valeurs à vérifier

Ces informations ont été déchiffrées ou ajoutées à partir d'une capture : relis-les dans `lib/site.ts` : numéros de téléphone, numéro WhatsApp, e-mail (`bonjour@flora.bf` est un exemple), horaires, frais et seuil de livraison, prix des produits.
