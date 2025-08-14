# EconnectMobility (Light)

Cette archive ne contient **pas** les dépendances (`node_modules`) ni les dossiers de build.
Elle inclut uniquement le code source nécessaire.

## Pré-requis
- Node.js 18+
- npm 9+ (ou pnpm/yarn si tu préfères)

## Installation
```bash
npm install
npm run dev
```

## Variables d'environnement
Crée un fichier `.env` à la racine du projet (côté front Vite) :

```
VITE_API_BASE_URL=https://ton-backend/api/v1
VITE_API_KEY=ta_clef_api_si_nécessaire
```

## Structure ajoutée récemment
- React Query, axios (interceptors JWT/API_KEY), react-hook-form + zod
- Features: Recettes, Voitures, Opérations, Documents, Semaines
- Dashboard conservé + Addons (filtres semaine/voiture, exports CSV, donut)
- Router protégé + Auth réelle (authenticate + refresh)

> Généré le 2025-08-13 22:32:17
