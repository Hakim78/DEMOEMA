# EdRCF 6.0 — AI Origination Intelligence

Plateforme d'intelligence M&A propriétaire pour l'origination de cibles d'acquisition.
Stack : **FastAPI (Python 3.11)** + **Next.js 15 (TypeScript)** + **Supabase** — déployé sur Vercel.

---

## Statut actuel — 17 avril 2026

| Module | Statut | Notes |
|--------|--------|-------|
| Dashboard | ✅ Prod | Métriques temps réel, filtres sectoriels |
| Intelligence Targets | ✅ Prod | 200–300 cibles M&A, CSV export, import NAF on-demand |
| Feed Signaux | ✅ Prod | 103 signaux M&A, filtres sévérité + dimension |
| Graphe Réseau | ✅ Prod | ForceGraph2D glassmorphism, dirigeants + mandats croisés |
| Copilot IA | ✅ Prod | Streaming SSE, analyse propriétaire, PDF report |
| PWA / Mobile | ✅ Prod | Manifest + SW + splash screen + notifications push |
| Pipeline Data | ✅ Prod | 62 profils NAF + BODACC hot SIRENs = 300+ cibles |
| Sweep 16M INSEE | 🔧 Next | Voir [docs/ROADMAP_16M.md](docs/ROADMAP_16M.md) |

---

## Architecture

```
frontend/          Next.js 15 — React 19, TypeScript, Tailwind v4, Framer Motion
backend/           FastAPI — Python 3.11+, httpx async, Supabase
docs/              Documentation data, signaux M&A, roadmap
```

```
┌──────────────────────────────────────────────────────────┐
│               FRONTEND (Vercel — Next.js 15)              │
│  PWA: manifest.json + sw.js + notifications locales       │
│  Pages: Dashboard · Targets · Signals · Graph · Copilot   │
└──────────────────────┬───────────────────────────────────┘
                       │ /api/* rewrites
┌──────────────────────▼───────────────────────────────────┐
│              BACKEND (FastAPI — Python 3.11)              │
│  main.py           — 15+ endpoints REST + SSE             │
│  data_sources.py   — Pipeline APIs gouvernementales       │
│  pappers_loader.py — build_target() + scoring M&A         │
└───────────┬──────────────────────────┬────────────────────┘
            │                          │
┌───────────▼──────────┐  ┌────────────▼───────────────────┐
│  SUPABASE (cache)    │  │  APIS GOUVERNEMENTALES GRATUITES │
│  raw_targets + cache │  │  25 sources · 16 couches data    │
│  1 000 rows          │  │  16M entités INSEE SIRENE        │
└──────────────────────┘  └────────────────────────────────┘
```

---

## Ce qui a été livré (hakim → main)

### 1. Migration Pappers (payant) → Sources 100% gratuites
- **API Recherche Entreprises** (gouv.fr) : aucune auth, 7 req/s, 11M entreprises actives
- **BODACC OpenDataSoft** : 48.8M annonces légales (cessions, modifications, procédures)
- **INPI RNE** : dirigeants, comptes annuels, mandats (OAuth2 gratuit)
- Couverture **95%+** des données Pappers + 10 couches nouvelles gratuites

### 2. Pipeline 300+ cibles (data_sources.py)

```
Phase 1 : 62 profils NAF × 14 secteurs         → ~250 entreprises
Phase 2 : BODACC hot SIRENs (cessions récentes) → +50 cibles signal-élevé
Phase 3 : Enrichissement BODACC + INPI + mandats → build_target() + scoring
```

Endpoints admin opérationnels :
- `GET /api/admin/refresh-db?count=N` — rechargement pipeline complet
- `GET /api/admin/load-sector?naf=XX.XXX&count=N` — import on-demand secteur

### 3. Graphe Réseau Intelligence

- ForceGraph2D avec rendu canvas custom (glassmorphism, gradient, glow)
- Nœuds : cibles M&A (vert) + dirigeants (amber) + équipe EDR (indigo) + filiales (violet)
- Signaux visuels : mandats croisés (orange pulsant), dirigeants 60+ (rouge), holding (double ring)
- **Fix critique** : guard `isFinite()` sur coords NaN pendant warmup ForceGraph + `GraphErrorBoundary`

### 4. Frontend complet

- **Targets** : CSV export 19 colonnes, import NAF on-demand, scoring /100
- **Signaux** : 103 signaux, filtres dimension (Patrimoniaux / Stratégiques / Financiers / Gouvernance / Marché)
- **Copilot** : streaming SSE, PDF report, recherche SIREN, multi-turns
- **PWA** : manifest.json, sw.js, SplashScreen Lottie radar, notifications push

### 5. Infra & qualité

- Supabase cache 1 000 rows, cron refresh 3h du matin
- Test suite complète (vitest + pytest, 5 modules)
- Next.js CVE-2025-66478 patché (→ 15.2.3)
- ESLint config Vercel corrigé

---

## Roadmap — Sweep 16M entités INSEE

L'objectif suivant est de passer de ~300 cibles à **50 000+ PME/ETI** en base.
La stratégie complète est dans **[docs/ROADMAP_16M.md](docs/ROADMAP_16M.md)**.

Résumé des 4 tâches à implémenter :

1. **`backend/sirene_bulk.py`** — Téléchargement + parsing fichier SIRENE mensuel (~16M lignes, CSV data.gouv.fr)
2. **Table `sirene_index`** (Supabase) — Index ~50K PME/ETI après filtrage (actives, 10+ salariés, NAF cibles)
3. **`/api/admin/rebuild-index`** — Cron mensuel rebuild SIRENE + endpoint manuel
4. **`/api/admin/enrich-batch?n=50`** — Enrichissement progressif, priorité aux SIRENs BODACC-chauds

---

## Démarrage rapide

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install
npm run dev

# Peupler la DB (première fois)
curl "http://localhost:8000/api/admin/refresh-db?count=200&secret=edrcf-admin"
```

## Variables d'environnement

Copier `backend/.env.example` en `backend/.env` :

```bash
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJ...
INPI_USER=email@...           # Optionnel — enrichit les dirigeants
INPI_PASSWORD=...
ANTHROPIC_API_KEY=sk-ant-...  # Copilot IA
```

---

## Documentation

| Fichier | Contenu |
|---------|---------|
| [docs/ARCHITECTURE_DATA.md](docs/ARCHITECTURE_DATA.md) | 25 sources gratuites, 16 couches, mapping Pappers |
| [docs/ROADMAP_16M.md](docs/ROADMAP_16M.md) | Stratégie sweep 16M entités INSEE SIRENE |
| [docs/SIGNAUX_MA.md](docs/SIGNAUX_MA.md) | 103 signaux M&A, scoring /100, 12 dimensions |
| [docs/OSINT_DIRIGEANTS.md](docs/OSINT_DIRIGEANTS.md) | Cartographie relationnelle, OSINT, cadre RGPD |
| [docs/STACK_TECHNIQUE.md](docs/STACK_TECHNIQUE.md) | Librairies Python, MCP servers, projets référence |

---

## Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/targets` | Cibles M&A depuis Supabase |
| GET | `/api/signals` | Feed signaux scorés |
| GET | `/api/graph` | Graphe réseau (nodes + links) |
| GET | `/api/search?q=` | Recherche entreprise par nom/SIREN |
| POST | `/api/copilot` | Streaming SSE Copilot IA |
| GET | `/api/admin/refresh-db?count=N` | Rechargement pipeline complet |
| GET | `/api/admin/load-sector?naf=X&count=N&label=` | Import on-demand secteur NAF |
| GET | `/api/admin/rebuild-index` | *(roadmap)* Rebuild SIRENE 16M |
| GET | `/api/admin/enrich-batch?n=N` | *(roadmap)* Enrichissement batch depuis index |
