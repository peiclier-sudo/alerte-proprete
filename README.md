# MonMarché 🏛️

Marchés publics qualifiés par IA pour les PME françaises.

## Architecture

```
monmarche/
├── config/sectors/           # 1 fichier par secteur (~120 lignes chacun)
│   ├── proprete.ts           # ✨ Propreté & Nettoyage
│   ├── espaces-verts.ts      # 🌿 Espaces Verts & Paysage
│   └── gardiennage.ts        # 🛡️ Gardiennage & Sécurité
│
├── src/app/
│   ├── page.tsx              # Homepage (sélecteur de secteur)
│   ├── layout.tsx            # Layout global
│   ├── [sector]/page.tsx     # Landing page dynamique (1 page par secteur)
│   └── api/
│       ├── signup/route.ts   # Inscription (SIRET → API SIRENE → Supabase)
│       ├── cron/
│       │   ├── fetch-boamp/  # Cron 6h : fetch BOAMP tous secteurs
│       │   ├── score/        # Cron 6h30 : score par abonné
│       │   └── send-digest/  # Cron 7h : envoi emails
│       └── webhook/
│           └── stripe/       # Webhook Stripe (paiements)
│
├── src/components/
│   └── LandingTemplate.tsx   # Template landing partagé (reçoit config en props)
│
├── src/lib/
│   ├── types.ts              # Types TypeScript
│   ├── sectors.ts            # getSector(), getAllSectors(), getSectorByNaf()
│   ├── prompts.ts            # Prompts LLM dynamiques par secteur
│   └── supabase.ts           # Client Supabase
│
├── supabase/migrations/      # Schema SQL
└── vercel.json               # Crons Vercel
```

## Ajouter un nouveau secteur

1. Créer `config/sectors/mon-secteur.ts` (~120 lignes)
2. L'ajouter dans `config/sectors/index.ts`
3. L'ajouter dans `src/lib/sectors.ts` (registry)
4. `git push` → Vercel rebuild → nouvelle page live

C'est tout. La landing page, le SEO, les crons, les emails, tout est paramétré par le fichier config.

## Stack

- **Next.js 14** (App Router, SSG)
- **Supabase** (PostgreSQL, RLS)
- **Stripe** (paiements)
- **Resend** (emails transactionnels)
- **DeepSeek** (qualification LLM — ~0.002€/AO)
- **Vercel** (hosting + crons)
- **BOAMP API** (source des AO)
- **API SIRENE** (lookup SIRET → NAF)

## Setup

```bash
# 1. Clone
git clone <repo> && cd monmarche

# 2. Install
npm install

# 3. Env
cp .env.example .env.local
# Remplir les variables

# 4. Supabase
# Créer projet sur supabase.com
# Exécuter supabase/migrations/001_initial_schema.sql dans SQL Editor

# 5. Stripe
# Créer les price_id dans Stripe Dashboard
# Mettre à jour les stripe.essentialPriceId / proPriceId dans chaque config secteur

# 6. Dev
npm run dev

# 7. Deploy
vercel --prod
```

## URLs

| URL | Page |
|-----|------|
| `monmarche.fr` | Homepage (sélecteur secteur) |
| `monmarche.fr/proprete` | Landing propreté |
| `monmarche.fr/espaces-verts` | Landing espaces verts |
| `monmarche.fr/gardiennage` | Landing sécurité |

## Crons (Vercel)

| Heure | Cron | Action |
|-------|------|--------|
| 6h00 | `/api/cron/fetch-boamp` | Fetch BOAMP tous secteurs |
| 6h30 | `/api/cron/score` | Score par abonné |
| 7h00 | `/api/cron/send-digest` | Envoi emails |
