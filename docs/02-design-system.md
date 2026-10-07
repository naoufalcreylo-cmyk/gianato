# GIANATO — Design system

Source unique : `prototype/assets/css/base.css` (jetons) — copié tel quel dans `theme/assets/` (seuls les chemins de polices changent).

## Couleurs (Brand Book 2026)
| Jeton | Valeur | Usage |
|---|---|---|
| `--espresso` | #2B1F19 | Logo, titres, boutons, pied de page |
| `--charcoal` | #3A3836 | Texte courant |
| `--porcelain` / `--ivory` / `--stone` | #F6F3EE / #F1EDE6 / #DDD7CD | Fonds (page, sections alternées, « La Maison ») |
| `--bg-media` | #EFEBE4 | Fond des packshots (image en `mix-blend-mode: multiply`) |
| `--muted` | #6C635B (5,3:1) — #554D46 sur pierre | Texte secondaire |
| `--lining` | #1F4B3E | Vert doublure : filets d’ouverture, repères — < 5 % de surface |
| `--tabac` `--oxblood` `--navy` `--brass` | #8A5A35 #5E1F22 #1D2633 #A8915F | Accompagnement ; laiton jamais en texte sur fond clair |

## Typographie
- **Newsreader** (variable 300–500, italique) : `display` (44→104 px), `h1`–`h4`, chapeaux, corps 17/27 px.
- **Belleza** : navigation, prix, boutons, étiquettes (11–15 px, capitales espacées `.16em`).
- Titres en casse normale, poids 300 ; l’italique porte l’émotion (« *cousue main.* »). Pas de gras.

## Espace & grille
- Grille 12 colonnes, conteneur 1600 px, marges `clamp(16px → 64px)`, gouttière `clamp(16px → 28px)`.
- Rythme : 8 / 16 / 24–32 px ; sections `clamp(72 → 120 px)` ; éditorial `clamp(88 → 176 px)`.
- Ratios : packshot 7:8 (format natif des photos Gianato), éditorial 4:5 / 3:4 / 2:3.

## Forme, profondeur, mouvement
- Rayon 0 (architectural) ; ombre unique `--shadow-panel` pour tiroirs et méga-menu.
- Durées 200 / 320 / 500 ms, zoom d’image 900 ms (1 → 1,02–1,03) ; courbes `--ease`, `--ease-out`.
- Apparition au défilement (18 px, 0,8 s), soulignements animés, rideau des boutons, filet vert d’ouverture.
- `prefers-reduced-motion` : toutes les animations neutralisées.

## Composants clés
Boutons (plein espresso, fantôme, clair) ≥ 52 px de haut · lien souligné animé · champs à libellé flottant · pastilles couleur 14 px (cible tactile élargie) · carte produit (image dominante, 2ᵉ vue au survol, ajout rapide par pointure au survol desktop) · tiroirs avec piège de focus et Échap · accordéons natifs `<details>` · « La Piqûre » : filet pointillé (écho du cousu Blake) pour séparer les informations.

## Accessibilité
Contrastes AA vérifiés (axe-core : 0 violation, 6 gabarits × 2 largeurs), focus visible vert doublure, lien d’évitement, landmarks, libellés ARIA en français, cibles ≥ 44 px, navigation clavier complète (méga-menu, tiroirs, visionneuse).
