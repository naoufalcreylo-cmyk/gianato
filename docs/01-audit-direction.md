# GIANATO — Audit, direction et architecture

## 1. Audit express de gianato.ma (octobre 2026)

**À conserver** — le catalogue (160 produits, 67 modèles déclinés en coloris), les collections et leurs URL, les promesses de service réelles (livraison offerte au Maroc, échange sous 30 jours avec collecte, paiement à la livraison, CMI, garantie 1 an), le guide des pointures FR/UK, les témoignages réels, les pages « L’Atelier Lozano » et « Conseils d’experts », le suivi marketing (GTM, Google Ads, TikTok, GA4/Meta via applications), Judge.me, Omnisend.

**Ce qui nuit à la valeur perçue**
- Prix barré sur 152 produits sur 160, « jusqu’à −60 % », bandeau « J’en profite » rouge : la marque paraît en liquidation permanente.
- Discours de grossiste (« 3000 DH pour moins de 1500 DH »), superlatifs, points d’exclamation.
- Trois récits d’origine concurrents ; italianité de façade ; ancien blason.
- Fautes visibles : « Richilieu », « Séléction », « Préstige », « Offerez ».
- Thème standard : cartes chargées, icônes Material, badges « Économiser 536 dh ».
- Fins de série, soldes, promotions et collection au même niveau dans le menu.

**Ce qui nuit à la conversion**
- Coloris dispersés (chaque couleur est un produit distinct, sans lien entre eux sur la fiche).
- Aucune information de matière structurée ; descriptions inégales, emojis.
- Filtres absents, collections redondantes (« Soldes », « Happy Friday », « Soldes d’automne » contiennent tout le catalogue).
- Doublons de suivi : pixel TikTok chargé deux fois, extrait de conversion Google Ads cassé (`'value': ,`) sur toutes les pages.

**Opportunités** — le détail réel de la doublure vert émeraude (Monte Cristo), le cousu Blake à la main mentionné sur 25 fiches, la garantie d’un an sous-exploitée, les photographies éditoriales haute définition déjà présentes dans les galeries (DSC, CLD) et les visuels de campagne existants.

## 2. Direction créative

Concept retenu : **« La Doublure »** (Brand Book 2026) — sobriété architecturale dehors, récompense dedans.
- Palette : porcelaine/ivoire/pierre (≈ 55 %), espresso (≈ 28 %), tabac/marine nuit en accompagnement, **vert doublure < 5 %**, révélé « à l’ouverture » : filet vert au déploiement du méga-menu, des tiroirs (panier, recherche, guide des pointures), repère de la campagne Monte Cristo, détail « doublure » du savoir-faire.
- Typographie : Newsreader (serif éditorial, titres et lecture) + Belleza (repli web d’Optima nova, voulu par le Brand Book) pour la navigation, les prix, les boutons. Capitales réservées aux petites étiquettes fonctionnelles.
- Photographie : les packshots de Gianato sont « multipliés » sur un fond pierre unique — toutes les cartes partagent la même lumière sans retouche. Les photos éditoriales (DSC/CLD) passent en pleine image.
- Signature : « L’assurance, cousue main. » ; campagne : « Ce qui ne se voit pas se ressent. »
- Promotions : prix barré discret (gris, petit corps), taux affiché seulement sur la fiche, aucune couleur d’alerte, aucun compte à rebours. Les fins de collection restent accessibles mais discrètes (bas du méga-menu, pied de page).
- Maroc sans folklore : la mosaïque du visuel d’ouverture, le vert profond, le service à la marocaine (WhatsApp, paiement à la livraison, collecte à domicile).

## 3. Architecture

```
Bandeau de service (3 promesses)
En-tête : Souliers ▾ · Nouveautés · Occasions ▾ · Maroquinerie — GIANATO — La Maison ▾ · Recherche · Compte · Panier
  Souliers ▾   Les styles (Mocassins, Richelieu, Derby, Bottes & bottines, Baskets cuir, À boucles)
               Les collections (Nouveautés, Signatures, Richelieu & Derby, Sans lacets, À lacets, Grandes pointures)
               Tous les souliers · Fin de collection (discret) · visuel « La nouvelle collection »
  Occasions ▾  Business, Ville, Détente, Sélection mariage, Ultra confort · Ville confortables, Essential Business
  La Maison ▾  Notre histoire, Savoir-faire, Entretien · Guide des pointures, Livraison, Échanges, Paiement, Garantie, Contact
Accueil : Ouverture (diptyque) → Nouveautés → Les essentiels (mosaïque) → Campagne Monte Cristo → Signatures
          → La Maison → Savoir-faire → Le business contemporain → Ils portent GIANATO → Le carnet → Services → Lettre
Collection (PLP) : en-tête éditorial + navigation par style, barre d’outils collante, filtres (latéral / feuille mobile), grille 2-3-4
Produit (PDP) : galerie 7/12 + colonne d’achat 5/12 collante ; couleurs = produits frères ; pointures ; accordéons ;
                Complétez votre style (mallettes, souliers business) ; Vous aimerez aussi ; Récemment consultés
Recherche : surcouche plein écran instantanée + page de résultats filtrable
Panier : tiroir droit (lignes, quantités, 2 suggestions pertinentes, Finaliser ma commande)
La Maison · Service client · Compte · Journal · Pied de page (lettre, 3 menus, réseaux, mentions, paiements)
```

**Composants** : bandeau, en-tête/méga-menu, navigation mobile, surcouche de recherche, tiroirs (panier, filtres, guide des pointures), carte produit, pastilles couleur, rail + progression, mosaïque, campagne, fiches signatures, chiffres de service, grille savoir-faire, édition par occasion, témoignages, carnet, services, accordéons, fiche technique, tableau des pointures, barre d’achat mobile, visionneuse/zoom, pied de page.
