**Vue d’ensemble des épics (MVP 3h)** :

*   **Epic 1 : Structure de base & écrans de démarrage** – Préparer le squelette du jeu (page HTML + intégration Phaser), et mettre en place l’écran titre, suivi de l’écran de sélection des 3 rôles (*starters*).
*   **Epic 2 : Zone d’accueil & interactions** – Créer une petite zone isométrique « Accueil des nouveaux employés » avec le déplacement du joueur, 2 PNJ avec dialogues simples, et préparation des assets **placeholder** en pixel art (sol, personnages).
*   **Epic 3 : Système de combat (3 combats)** – Implémenter une scène de combat au tour par tour très simplifiée, et déclencher **3 combats** scriptés (ex : via des rencontres PNJ ou événements dans la zone d’accueil).

***

### **Epic 1 : Structure de base & écrans de démarrage**

**US 1 :** En tant que joueur, je veux pouvoir lancer le jeu depuis une simple page *web* afin de démarrer la partie facilement (sans installation).  
**Prompt IA :** *(pour générer le squelette de projet avec Phaser)* :

    Crée un fichier HTML minimal (index.html) qui intègre Phaser 3 via un CDN en <script> (JavaScript pur, sans TypeScript ni bundler). Ajoute un canevas de jeu plein écran. Initialise un objet `new Phaser.Game` avec une configuration minimale (largeur 800, hauteur 600, moteur Phaser.AUTO). Inclue un `<script>` inline vide (ou un fichier JS lié) où l’on pourra écrire le code du jeu.

**US 2 :** En tant que joueur, je veux voir un écran d’introduction avec le titre du jeu et un bouton « Commencer » pour démarrer la partie.  
**Prompt IA :** *(pour générer la scène d’intro)* :

    Dans un projet Phaser 3 en JavaScript, génère le code d’une scène "IntroScene" qui affiche en plein écran : le titre "ANS Adventure" (texte centré) et un bouton "Commencer". Lorsque le joueur clique sur "Commencer", la scène de sélection du personnage (`StarterScene`) démarre (utilise this.scene.start('StarterScene')).

**US 3 :** En tant que joueur, je veux choisir un personnage de départ parmi **3 rôles** (Chef de projets DSI, Responsable RH, Product Owner) afin de personnaliser mon aventure.  
**Prompt IA :** *(pour générer l’écran de sélection du personnage)* :

    Toujours en JavaScript avec Phaser 3, crée une scène "StarterScene" qui affiche trois boutons (ou images cliquables) correspondant aux 3 rôles de départ : "Chef de projets DSI", "Responsable RH", "Product Owner". Quand l’utilisateur clique sur l’un d’eux, stocke le choix (ex: dans une variable globale `selectedRole`) puis démarre la scène du monde principal (`WorldScene`).

***

### **Epic 2 : Zone d’accueil & interactions**

**US 1 :** En tant que joueur, je veux **déplacer mon personnage** dans une petite zone d’accueil en vue **isométrique** (quelques tuiles au sol, murs/obstacles) pour explorer le décor.  
**Prompt IA :** *(pour générer la scène du monde isométrique avec déplacement du joueur)* :

    Toujours en Phaser 3 (JS), génère une scène "WorldScene" avec :
    - Chargement des assets nécessaires (une image de tuile de sol isométrique, une image de personnage, une image de PNJ ennemi). Utilise des images simples (ex. un losange pour le sol, un sprite 32x32px pour les personnages – placeholders).
    - Création d’une petite carte isométrique (ex. 10 par 10 tuiles). Place des tuiles "sol" partout et éventuellement quelques tuiles "mur" en bordure comme obstacles.
    - Ajoute un sprite joueur (utilisant l’image personnage) positionné au centre de la zone. Permets le déplacement du joueur avec les flèches directionnelles (ou WASD) sur la grille isométrique (déplacement case par case, en diagonale pour rester aligné sur la grille isométrique).
    - Gère les collisions ou les limites : le joueur ne doit pas traverser les tuiles de mur ou les bords de la carte (on peut définir un calque de collision pour les murs).

**US 2 :** En tant que joueur, je veux **discuter avec 2 PNJ amicaux** dans la zone d’accueil, pour recevoir des informations de base.  
**Prompt IA :** *(pour ajouter des PNJ et dialogues)* :

    Dans "WorldScene", ajoute au moins deux PNJ (sprites utilisant l’image PNJ ou réutilisant le sprite personnage avec une couleur différente). Positionne-les sur la carte (ex: à des coordonnées spécifiques). Implémente une interaction : lorsque le joueur s’approche (collision ou touche la PNJ) et appuie sur la touche [Espace], affiche un texte de dialogue de bienvenue (ex: "Bienvenue à l’ANS ! ...") pendant quelques secondes ou jusqu’à une nouvelle pression de touche. Le dialogue peut être affiché avec `this.add.text` en haut de l’écran ou via un simple UI.

**US 3 :** En tant que développeur, je veux **obtenir rapidement des assets visuels** (tuiles et sprites en pixel art minimaliste) afin que le jeu ait une apparence cohérente sans perdre de temps.  
**Prompt IA :** *(pour générer ou trouver des images placeholders)* :

    Suggère des moyens rapides d’obtenir des images pixel art simples pour :
    1. une tuile de sol isométrique (ex: losange 64×32 px, couleur neutre ou texture basique),
    2. un sprite de personnage/joueur 32×32 px (style RPG rétro vu de 3/4 face, ex: type Pokémon),
    3. un sprite de hacker ennemi 32×32 px (distinguable, ex: vêtement sombre).  

    Les images peuvent être générées via une IA d’image (ex. prompt Stable Diffusion : "pixel art isométrique 32x32 [description]") ou récupérées sur un site d’assets libres (ex: Kenney, OpenGameArt). Donne le *prompt* pour générer chaque image en IA **ou** une source d’asset libre appropriée.

***

### **Epic 3 : Système de combat (3 combats)**

**US 1 :** En tant que joueur, je veux qu’un **combat au tour par tour** se lance lorsqu’un ennemi est rencontré dans la zone, afin de pouvoir affronter les hackers.  
**Prompt IA :** *(pour déclencher le passage en mode combat depuis la WorldScene)* :

    Dans "WorldScene", lorsque le joueur atteint certaines conditions (exemple : collision avec un sprite ennemi ou position spécifique), arrête le mouvement du joueur et lance la scène de combat (`BattleScene`). Assure-toi de passer les informations nécessaires (par ex. le rôle choisi, points de vie du joueur) à la `BattleScene` via `this.scene.start('BattleScene', { ... })`.

**US 2 :** En tant que joueur, je veux un **écran de combat** qui me permette de choisir au moins une action d’attaque et de voir la réponse de l’ennemi, afin de **vaincre l’adversaire** si je prends les bonnes décisions.  
**Prompt IA :** *(pour générer le code de la BattleScene avec un système de tour par tour simple)* :

    En Phaser 3 (JS), crée une scène "BattleScene" avec :
    - Une interface simple affichant les **PV** du joueur et de l’ennemi (par ex. `this.add.text` pour "Joueur PV: X" et "Ennemi PV: Y").
    - Une option d’attaque basique pour le joueur (par ex. un bouton ou la touche [Espace] qui inflige un montant fixe de dégâts à l’ennemi).
    - Une logique de **tour par tour** : le joueur peut attaquer, puis l’ennemi réplique (réduisant les PV du joueur d’un montant fixe). 
    - Gère la fin de combat : si les PV de l’ennemi ≤ 0, affiche un message de victoire et retourne à la WorldScene (ex: `this.scene.start('WorldScene')`); si les PV du joueur ≤ 0, affiche un message de défaite (par ex. "Game Over") et redémarre le jeu (retour menu ou reset WorldScene).

**US 3 :** En tant que joueur, je veux **trois combats distincts** au cours de l’introduction, pour avoir un aperçu de la variété des défis.  
**Prompt IA :** *(pour scénariser 3 combats successifs dans le MVP)* :

    Propose une manière simple d’intégrer 3 combats scriptés dans l’expérience :
    1. Par exemple, après le dialogue avec un des PNJ de l’accueil, lancer un premier combat contre un hacker débutant (ennemi faible, PV bas).
    2. Après la victoire, permettre de se déplacer vers une autre case ou PNJ qui déclenche un **deuxième combat** (ennemi intermédiaire).
    3. Après le deuxième combat, déclencher un **troisième combat** plus difficile (par ex. boss final de l’intro, PV plus élevés). 

    Décris comment enchaîner ces combats (utiliser des drapeaux/variables d’état pour savoir quel combat lancer, ou plusieurs ennemis avec identifiants différents et propriétés distinctes).
