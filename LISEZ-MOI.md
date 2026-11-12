# Flora : site, API et administration (3 projets séparés)

```
flora-platform/
├─ frontend/   Le site public (Next.js). Ce que voient les clients.
├─ backend/    L'API (Express + TypeScript + MongoDB). Tout le « cerveau » : base de données, commandes, e-mails, photos.
└─ admin/      L'administration (Vite + React). Un projet à part, qui parle à l'API.
```

Comment ils se parlent :

```
Client ── site (frontend) ──┐
                            ├──► API (backend) ──► MongoDB
Toi ───── admin ────────────┘
```

- Le **site** lit les produits et les articles auprès de l'API, et lui envoie les commandes, messages et inscriptions.
- L'**admin** se connecte à l'API avec ton mot de passe (jeton valable 7 jours) et gère tout : commandes, messages, images, produits, journal, abonnés.
- Seule l'**API** connaît MongoDB et ton mot de passe admin. Le site et l'admin n'ont aucun secret.
- Les trois peuvent être hébergés **à des endroits différents**.

---

## 1. Lancer le tout chez toi

Il faut **Node.js 20 ou plus**. Ouvre **trois terminaux** (un par dossier).

### Terminal 1 : l'API (`backend/`)

1. Crée un compte gratuit sur mongodb.com/atlas, un cluster gratuit (M0), un utilisateur de base, et autorise ton IP dans *Network Access*. Dans *Connect → Drivers*, copie l'adresse `mongodb+srv://…`.
2. Dans `backend/`, copie `.env.example` en `.env` et remplis au minimum `MONGODB_URI`, `ADMIN_PASSWORD` et `JWT_SECRET` (une longue suite de caractères au hasard).
3. Lance :
   ```
   npm install
   npm run dev
   ```
   Tu dois voir `✅ API Flora prête sur http://localhost:4000`. Au tout premier lancement, les 3 produits et 3 articles de départ sont copiés dans la base.

### Terminal 2 : le site (`frontend/`)

1. Copie `.env.example` en `.env.local` (par défaut, `API_URL=http://localhost:4000` convient).
2. ```
   npm install
   npm run dev
   ```
   Ouvre http://localhost:3000.

### Terminal 3 : l'administration (`admin/`)

1. Copie `.env.example` en `.env` (par défaut, les adresses locales conviennent).
2. ```
   npm install
   npm run dev
   ```
   Ouvre http://localhost:5173 et entre ton `ADMIN_PASSWORD`.

**Ordre conseillé : l'API d'abord**, puis le site et l'admin. Après chaque modification d'un fichier `.env`, arrête (Ctrl+C) et relance.

---

## 2. Mettre en ligne

Chaque projet se déploie séparément. Une organisation simple et gratuite au départ :

| Projet | Hébergeur possible | Commande de construction | Dossier à publier |
|---|---|---|---|
| `backend/` | Render, Railway, Fly.io (service Node) | `npm install && npm run build` | démarrage : `npm start` |
| `frontend/` | Vercel | automatique | automatique |
| `admin/` | Netlify, Vercel, Cloudflare Pages | `npm run build` | `dist` |

Dans l'ordre :

1. **API** : déploie `backend/` et renseigne ses variables (celles de `.env`) chez l'hébergeur. Note son adresse (ex. `https://flora-api.onrender.com`).
   - `CORS_ORIGINS` = les adresses de ton site **et** de ton admin, séparées par une virgule, sans `/` final (ex. `https://flora.bf,https://admin.flora.bf`).
   - `FRONTEND_URL` = l'adresse de ton site, et `REVALIDATE_SECRET` = un mot de passe au hasard (le même que côté site).
2. **Site** : variables `API_URL` = adresse de l'API, `REVALIDATE_SECRET` = le même mot de passe.
3. **Admin** : variables `VITE_API_URL` = adresse de l'API, `VITE_SITE_URL` = adresse du site. Elles sont lues **à la construction** : change-les, puis redéploie.

Conseils : mets l'admin sur une adresse que tu ne partages pas (ex. `admin.flora.bf`). Dans MongoDB Atlas, *Network Access* doit autoriser l'hébergeur de l'API (`0.0.0.0/0` si tu ne connais pas son adresse, avec un mot de passe de base solide).

---

## 3. Ce que fait chaque partie

### `backend/` : l'API

| Fichier | Rôle |
|---|---|
| `src/index.ts`, `src/app.ts` | démarrage du serveur, sécurité (CORS, en-têtes), erreurs |
| `src/config.ts` | lecture du fichier `.env` |
| `src/db.ts` | connexion MongoDB et index (références uniques, pas de doublons) |
| `src/routes/public.ts` | ce que le **site** utilise : produits, articles, photos, commandes, contact, newsletter |
| `src/routes/admin.ts` | ce que l'**admin** utilise (protégé par mot de passe) : tout gérer |
| `src/middleware/` | connexion (jeton), limite anti-spam |
| `src/lib/pricing.ts` | règles de livraison (⚠️ à garder identiques à `frontend/src/lib/site.ts`) |
| `src/lib/notify.ts` | e-mail à chaque commande / message (Resend, facultatif) |
| `src/data/seed.ts` | produits et articles de départ (copiés une seule fois) |

Sécurité : les **prix ne viennent jamais du navigateur** (l'API les recalcule), les formulaires sont limités par visiteur (anti-spam), le formulaire de contact a un champ piège invisible, et l'admin exige un jeton.

### `admin/` : l'administration

Tableau de bord, **Commandes** (filtre par statut), **Messages**, **Images** (envoi multiple, où chaque photo est utilisée, suppression bloquée si elle sert encore), **Produits**, **Journal** (brouillons possibles), **Abonnés** (export CSV).

### `frontend/` : le site

Voir `frontend/LISEZ-MOI.md` : textes, photos, pages, apparence, etc. Si l'API est injoignable, le site affiche des données de secours au lieu de planter.

---

## 4. Ce qui reste à savoir

- **Photos du dossier `frontend/public/images/`** : celles du site (accueil, façade…) ; l'admin peut les afficher mais pas les modifier. Les photos envoyées depuis l'admin sont stockées dans MongoDB et servies par l'API (4 Mo maximum).
- **Photos envoyées depuis l'admin** : le site les affiche telles quelles (sans réduction automatique). Réduis-les avant envoi (environ 1600 px de large) pour que le site reste rapide sur téléphone.
- **Prix de livraison** : à changer à deux endroits (`backend/src/lib/pricing.ts` et `frontend/src/lib/site.ts`).
- **Aucun de ces projets n'a pu être lancé ni testé pendant leur création** (pas d'accès à npm ni à une base MongoDB). Lance-les dans l'ordre ci-dessus et signale-moi la moindre erreur affichée.

## 5. Erreurs fréquentes

| Problème | Solution |
|---|---|
| L'API s'arrête avec « Réglages manquants » | Complète `backend/.env` (voir `.env.example`) |
| `MongoServerSelectionError` | `MONGODB_URI` faux, ou ton IP n'est pas autorisée dans Atlas (*Network Access*) |
| L'admin dit « Impossible de joindre l'API » | L'API ne tourne pas, ou `VITE_API_URL` est faux (relance l'admin) |
| L'admin, en ligne : erreur réseau / CORS | Ajoute l'adresse exacte de l'admin dans `CORS_ORIGINS` de l'API |
| Les photos de l'admin n'apparaissent pas | Vérifie `VITE_SITE_URL` (photos du site) et `VITE_API_URL` (photos envoyées) |
| Le site ne montre pas les changements de l'admin | Attends 30 secondes, ou règle `FRONTEND_URL` + `REVALIDATE_SECRET` sur l'API et `REVALIDATE_SECRET` sur le site |
| Le site montre des produits « de secours » | Le site ne joint pas l'API : vérifie `API_URL` dans `frontend/.env.local` |
