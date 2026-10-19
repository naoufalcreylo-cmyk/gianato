# GIANATO — Mise en ligne du thème « Gianato Maison » (Shopify OS 2.0)

Le thème s’installe **à côté** du thème actuel (non publié), se règle, se teste, puis se publie. Aucune URL produit ou collection ne change.

## 1. Installer
1. Boutique en ligne › Thèmes › Ajouter un thème › Importer le fichier `gianato-maison-theme.zip`.
2. Ne pas publier tout de suite.

## 2. Métachamps (Paramètres › Données personnalisées › Produits)
Créer les définitions, espace de noms `gianato` :

| Clé | Type | Rôle |
|---|---|---|
| model | Texte (une ligne) | Nom du modèle affiché (« Monte Cristo ») |
| colorway | Texte (une ligne) | Coloris (« Cocoa ») |
| color_family | Texte (une ligne) | Famille de couleur en français — **filtre « Couleur »** |
| swatch | Couleur | Pastille |
| style | Texte (une ligne) | Mocassin, Derby… |
| siblings | Liste de références produit | Les autres coloris du même modèle (pastilles, sélecteur de couleur) |
| material, construction, lining, sole, dimensions | Texte (une ligne) | Fiche « Matières & fabrication » — uniquement les faits présents dans la description |

Collections : `gianato.intro` (texte multiligne) et, facultatif, `gianato.hero` (fichier image).

Puis importer avec **Matrixify** : `migration/products-metafields.csv` (160 lignes) et `migration/collections-metafields.csv`.

## 3. Filtres (application Search & Discovery)
Activer : Disponibilité · Prix · Pointure (option de variante) · **Couleur** (métachamp gianato.color_family) · Style (gianato.style ou type de produit) · Matière (gianato.material).
Harmoniser au préalable le nom d’option « Choisir la pointure : » / « Taille » → « Pointure » (voir `migration/rapport-donnees.md`).

## 4. Menus

**Par défaut, le thème affiche directement les menus de la maquette** (en-tête, méga-menus, menu mobile, colonnes du pied de page, mentions légales), générés depuis `prototype/data/site.js` par `tools/gen-nav.js` → `snippets/nav-maison.liquid`. Aucun menu Shopify n’est nécessaire. Pour reprendre la main dans l’admin : En-tête › *Source du menu* = « Menu Shopify », Pied de page › *Colonnes de liens* = « Menus Shopify ». Pages « La Maison » et « Service client » : tant qu’elles ne sont pas créées (réglages du thème), les liens ouvrent `/pages/cordonnerie?view=maison` et `/pages/contact?view=service`.

### Menus Shopify (facultatif — Boutique en ligne › Navigation)
- `main-menu` — 3 niveaux. Niveau 2 = titres de colonnes ; un lien de niveau 2 **sans** enfants devient un lien discret (ex. « Fin de collection »).
  - **Souliers** (`/collections/meilleures-ventes`) › *Les styles* (mocassin, richelieu, derby, bottines, sneaker, boucles) › *Les collections* (nouveautes, meilleures-ventes, richelieu-derby, chaussures-sans-lacets, chaussures-a-laces, chaussures-grandes-pointures) › *Fin de collection* (destockage)
  - **Nouveautés** (`/collections/nouveautes`)
  - **Occasions** › *Par occasion* (classic-professionnel, chaussures-ville, esprit-libre, selection-marriage, confort) › *Pour le bureau* (chaussures-ville-confortables, essential-business)
  - **Maroquinerie** (`/collections/essential-business`)
  - **La Maison** (placé à droite du logo) › *La Maison* (Notre histoire, Savoir-faire, Entretien) › *Services* (Guide des pointures, Livraison, Échanges, Paiement, Garantie, Contact)
- `styles` — barre de styles des pages collection : Tous les souliers, Mocassins, Richelieu, Derby, Bottes & bottines, Baskets cuir, À boucles, Maroquinerie.
- `occasions` — liens de l’édition business : Business, Ville, Mariage, Ultra confort, Détente.
- `footer-maison`, `footer-service`, `footer-souliers`, `footer-legal` — colonnes et mentions du pied de page.

## 5. Pages
- **La Maison** : handle `la-maison`, modèle `page.maison`.
- **Service client** : handle `service-client`, modèle `page.service`.
- Les pages existantes (guide-des-tailles, conseils-dexperts, cordonnerie, contact, CGV…) restent en place ; les nouveaux liens y renvoient.

## 6. Réglages du thème
- **Identité** : logotype espresso + ivoire (fichiers livrés par défaut), favicon (monogramme à fournir).
- **Service client** : téléphones, WhatsApp, horaires, réseaux — préremplis avec les données de gianato.ma.
- **Promesses de service** : textes uniques réutilisés partout (fiche, panier, pages).
- **Prix & promotions** : prix barré (oui), taux sur fiche (oui), taux sur cartes (non) ; collection « Nouveautés » pour l’étiquette *Nouveau*.
- **Fiche produit** : ajout rapide, bouton « Acheter maintenant » (ajoute la pointure choisie et ouvre directement le paiement Shopify), seuil « Dernières pointures », collections Business / Accessoires pour « Complétez votre style ».
- **Format monétaire** (Paramètres › Général › Devise) : recommandé `{{amount_no_decimals_with_space_separator}} DH`.

## 7. Suivi — à vérifier avant publication
| Balise | Ancien thème | Nouveau thème |
|---|---|---|
| Google Tag Manager GTM-PGWWD2HC | codée en dur | réglage *Suivi* (prérempli) |
| Google Ads AW-696565317 (gtag config) | codée en dur | réglage *Suivi* (prérempli) |
| Extrait « conversion PURCHASE » Google Ads | sur **toutes** les pages, valeur vide → erreur JS | **retiré** : à configurer dans l’app Google & YouTube ou en Événements clients (checkout) |
| Pixel TikTok CETC91JC77U87C9MQG6G | chargé **deux fois** | une fois (réglage *Suivi*) ; vider si l’app TikTok le charge déjà |
| GA4 G-1VQ5Q6VELE, Meta, Judge.me, Omnisend, WhatsApp, autres apps | applications / pixels web | inchangés (passent par `content_for_header`) |

Événements e-commerce poussés dans `dataLayer` (schéma GA4) : `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `search`, `filter_apply`, `whatsapp_click`. `purchase` reste suivi par Shopify (checkout).

Applications à repositionner dans l’éditeur : bloc Judge.me (étoiles / avis) dans la section *Fiche produit*, intégrations d’apps (WhatsApp, Omnisend) dans *Paramètres du thème › Intégrations d’applications*.

## 8. Recette avant publication
Aperçu du thème : accueil, 3 collections (filtres, tri, « voir plus »), 3 fiches (pointure épuisée, coloris, ajout au panier, WhatsApp), panier → checkout (CMI + paiement à la livraison), recherche, compte client, carte cadeau, 404, mobile 375 px. Vérifier GTM en mode Aperçu et Pixel Helper.

## 9. Ce que le prototype ne remplace pas
Le prototype (`prototype/`) sert à présenter et valider l’expérience sur les vraies données ; « Finaliser ma commande » y ouvre le **vrai** panier gianato.ma avec les vrais identifiants de variantes. La boutique, elle, tourne sur le thème.
