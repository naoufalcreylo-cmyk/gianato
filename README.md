# Maison GIANATO — refonte e-commerce

Refonte complète de gianato.ma : audit, direction artistique « La Doublure » (Brand Book 2026), design system, **prototype navigable** sur le vrai catalogue et **thème Shopify Online Store 2.0** prêt à installer.

| Dossier | Contenu |
|---|---|
| `prototype/` | Site navigable : accueil, collections (filtres, tri, densité), recherche instantanée, fiche produit, panier, La Maison, Service client — **160 vrais produits**, vrais prix, vraies pointures et disponibilités |
| `theme/` | Thème « Gianato Maison » : layout, 35 sections (+ 2 groupes), 15 snippets, 20 modèles JSON + 2 Liquid, réglages, locale FR — Theme Check : 0 erreur, 0 avertissement |
| `gianato-maison-theme.zip` | Le thème, prêt à importer |
| `migration/` | Métachamps produits/collections (Matrixify) + rapport qualité catalogue |
| `docs/` | 01 audit & architecture · 02 design system · 03 mise en ligne Shopify · 04 contenus vérifiés & contradictions |
| `tools/` | Pipeline de données, génération des modèles, captures, audits (axe, débordement, performance, Theme Check) |
| `qa/` | Captures de recette |

## Lancer le prototype
```bash
npm install
node tools/serve.js         # → http://localhost:4180
```
Pages : `/` · `/collection.html?c=mocassin` · `/collection.html?q=monte` · `/product.html?p=monte-cristo` · `/maison.html` · `/service.html`

« Finaliser ma commande » ouvre le **vrai panier gianato.ma** (permalien `/cart/variante:quantité`).

## Régénérer
```bash
node tools/build-catalog.js      # catalogue normalisé depuis research/ (exports publics gianato.ma)
node tools/gen-templates.js      # theme/templates/*.json depuis prototype/data/site.js (source de contenu unique)
node tools/export-migration.js   # migration/*.csv + rapport
node tools/theme-check.js        # Shopify Theme Check
node tools/a11y.js               # axe-core WCAG 2.1 AA (serveur lancé)
node tools/sweep.js              # débordement horizontal 375 → 1920 px
node tools/perf.js               # LCP / CLS / poids
```
Les CSS se modifient dans `prototype/assets/css/` puis se recopient dans `theme/assets/` (seul le chemin des polices change).

## Recette (prototype)
- **Accessibilité** : axe-core, 0 violation — 6 gabarits × 1440 / 390 px.
- **Responsive** : 0 débordement, 0 erreur JS — 7 pages × 8 largeurs (375 → 1920 px).
- **Performance** (mobile 4G, CPU ×4) : LCP 1,7–2,0 s · CLS ≤ 0,024. Bureau : LCP 0,2–0,7 s.
- **Theme Check** : 0.

## Principe de vérité
Produits, prix, remises, pointures, coloris, matières, services, coordonnées et témoignages viennent de gianato.ma ou du Brand Book. Aucune date, certification ou avis n’a été inventé ; les contradictions du site actuel sont listées dans `docs/04-contenus-verifies.md`.
