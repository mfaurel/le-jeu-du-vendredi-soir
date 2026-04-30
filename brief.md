# Jeu RPG 2D isométrique – **Devoxx Quest** (Product Brief orienté *Delivery*)

**Résumé** : *« Devoxx Quest »* est un jeu vidéo **RPG 2D isométrique**, développé en JavaScript/TypeScript avec le moteur **Phaser 3** (framework HTML5 **WebGL/Canvas**). Visuellement inspiré des jeux **Pokémon** sur Game Boy, il offre une expérience ludique et rétro dans l'univers d'une grande conférence tech pour développeurs. Le joueur incarne un **développeur ou une développeuse** qui débarque à **Devoxx** et doit survivre aux joies (et aux épreuves) de la conférence : naviguer entre les keynotes, les stands, les ateliers et les after-parties, tout en maîtrisant les sujets chauds du moment — **IA, Platform Engineering, Java** — face à des antagonistes hauts en couleur. Ce jeu **non officiel et purement récréatif** célèbre la culture dev avec humour et nostalgie.

---

## 1. Vision produit & objectifs

**Vision** : *« Devoxx Quest »* est un **RPG 2D isométrique** où le joueur, en tant que développeur fraîchement arrivé à Devoxx, part à l'aventure dans les couloirs de la conférence. Le jeu marie **divertissement** et **clin d'œil à la culture tech** pour offrir à tout développeur (ou PO, chef de projet, SRE…) une expérience de jeu fun et reconnaissable, pleine de références à la vie de conférence.

**Objectifs concrets** :

*   **Offrir du plaisir et de l'engagement** : Le jeu doit avant tout être fun. Un gameplay inspiré des RPG classiques (exploration, combats au tour par tour) qui **suscite l'envie de progresser**. L'aspect nostalgique *« style Pokémon »* charm les joueurs et encourage la découverte du jeu, que l'on soit dev, PO ou commercial.
*   **Célébrer la culture Devoxx sans lourdeur** : Le jeu vise à **éveiller la nostalgie et le sourire** sur des thèmes comme Java, l'IA, le Platform Engineering, sans tomber dans le tutoriel. Des **éléments de culture dev** s'intègrent naturellement dans les dialogues, les noms d'attaques et les situations (une keynote rate, un stand donne des goodies, un collègue vous interpelle pour un retour d'expérience). *L'équilibre entre humour et gameplay est crucial.*
*   **Représenter la diversité des profils Devoxx** : L'univers reflète la réalité de la conférence — des devs, des POs, des chefs de projet côté participants ; des commerciaux, des RH, des équipes communication côté stands. Chacun a sa place dans le monde du jeu, avec son rôle et sa logique narrative.

---

## 2. Mécaniques de jeu clés

Le gameplay s'articule autour des mécaniques classiques d'un **RPG 2D** adaptées à la thématique conférence tech. Les quatre piliers : **l'exploration**, **les combats au tour par tour**, **la progression** du personnage et **la narration**.

*   **Exploration** : Le joueur parcourt le palais des congrès en vue **isométrique** (à ~30°) constitué de **tuiles 2D** en losanges. L'environnement représente un univers de conférence tech stylisé : grande salle keynote, allée des stands, salles de conférence, zone ateliers, couloir networking, speaker lounge, zone after-party. Le joueur se déplace au clavier (ou à la souris) pour explorer la carte. **Des PNJ** (personnages non-joueurs) peuplent les lieux : autres développeurs, orateurs, POs, RH, commerciaux de stands, offrant des dialogues, des indices ou des **quêtes**. L'exploration encourage la **découverte** (goodies cachés, easter eggs sur la culture dev, conférences secrètes) et confère un sentiment de liberté.\
    *Exemples de zones* : La **Grande Salle Keynote** (boss final accessible seulement en fin de jeu), **l'Allée des Stands** (zone de rencontres dense avec des commerciaux et des DRH), **les Salles de Conférence** (5 tracks : Java, IA, Platform Engineering, Architecture, Web), **la Zone Ateliers** (hands-on labs interactifs), **le Couloir Networking** (rencontres aléatoires riches), **la Speaker Lounge** (PNJ orateurs avec des quêtes spéciales), **l'After Party** (zone bonus débloquée en fin de journée).

*   **Combats au tour par tour** : S'inspirant du système Pokémon, les **affrontements** se déclenchent lors de rencontres avec les **antagonistes** ou lors de débats techniques. Le joueur affronte un antagoniste dans un **duel de conférence** (débat technique, whiteboard challenge, bingo des buzzwords). Chaque **personnage possède un type** (lié à sa spécialité) et un **répertoire de compétences/attaques**. Les combats alternent les tours : le joueur choisit une attaque ou action (ex. : utiliser une compétence Java, se défendre avec du refactoring, utiliser un objet « badge speaker » pour booster ses stats), puis l'adversaire réplique. Chaque attaque a des **effets distincts** et peut avoir un **avantage ou désavantage** selon le type de l'adversaire. Par exemple, une attaque *« Virtual Threads »* est particulièrement **efficace contre un défenseur du legacy** qui refuse de passer à Java 21, tandis qu'une attaque *« Platform Engineering »* peut **neutraliser un architecte over-engineer**.\
    *Interface combats* : En combat, l'écran bascule sur une **vue style JRPG** : l'avatar du joueur fait face à l'antagoniste. Un **menu de combat** permet de choisir (attaquer avec une compétence, utiliser un item « goodies », fuir vers la session suivante). Chaque compétence a un nom évocateur (ex. : *« Record Sealed »*, *« Kubernetes Apply »*, *« RAG Pipeline »*) et une courte description humoristique. Un symbole indique le type (☕ Java, ⚙️ Platform, 🤖 IA).

*   **Progression du personnage** : Système de niveaux (XP) permettant de renforcer les compétences du personnage, gain de **nouvelles attaques** au fil de l'aventure, récompenses sous forme de **badges de conférence**. Chaque victoire rapporte des **points d'expérience** et possiblement des **objets** (stickers, t-shirts de conf, livres techniques O'Reilly). La progression peut être **linéaire** (suivre la trame principale jusqu'au boss final) ou **secondaire** (quêtes annexes : assister à des talks, résoudre des live coding challenges, trouver des goodies cachés).\
    *Statistiques du personnage* : Selon son rôle de départ, le personnage aura des stats (ex. *Niveau Technique, Charisme, Scalabilité, Créativité*). Ces stats influencent les combats. Sauvegarde via localStorage.

*   **Narration** : Une trame narrative légère guide le joueur. Arrivé à Devoxx le matin avec son badge, le/la dev doit traverser la journée, assister à des talks, survivre aux stands commerciaux, et affronter le boss final lors de la keynote de clôture. Des dialogues humoristiques (références à Stack Overflow, GitHub, Jira, Confluence) enrichissent l'expérience.

---

## 3. Personnages de départ (« *starters* »)

Au lancement, le joueur choisit son **avatar de développeur** parmi trois profils de départ. Chaque profil a des stats différentes et des compétences initiales propres, influençant le style de jeu.

*   **☕ Le Java Dev (ou La Java Dev)** — *Archétype : Développeur senior expérimenté*\
    Solide, fiable, connait le langage sur le bout des doigts depuis Java 8 jusqu'à Java 21. Stats élevées en *Niveau Technique* et *Rigueur*, mais moins agile en *Créativité*. Compétences de départ : *Stream API*, *Records*, *Pattern Matching*. Point fort : très efficace contre les ennemis legacy et les architectures monolithiques vieillissantes. Point faible : parfois lent face aux tendances ultra-modernes.

*   **⚙️ Le Platform Engineer (ou La Platform Engineer)** — *Archétype : SRE / DevOps pragmatique*\
    Maître de l'infrastructure, des pipelines CI/CD et de l'observabilité. Stats élevées en *Scalabilité* et *Résistance*, mais plus faible en *Charisme* (préfère les terminaux aux slides). Compétences de départ : *Helm Chart*, *GitOps*, *Alerting Rules*. Point fort : excelle contre les systèmes fragiles et les architectures sans monitoring. Point faible : moins efficace face aux arguments purement business.

*   **🤖 L'IA Engineer (ou L'IA Engineeuse)** — *Archétype : Développeur à la frontière du ML et du dev*\
    Passionné(e) par les LLMs, le RAG, le fine-tuning et le prompt engineering. Stats élevées en *Créativité* et *Innovation*, mais plus fragile en *Rigueur*. Compétences de départ : *Prompt Chain*, *Embedding Search*, *Model Fine-tune*. Point fort : dévaste les ennemis rétrogrades et sceptiques de l'IA. Point faible : parfois victime de ses propres hallucinations (coups critiques ratés).

**Logique de forces/faiblesses** : Les trois types forment un triangle d'interactions :
- ☕ **Java** > ⚙️ Platform Engineering (le socle du code prime sur l'infra)
- ⚙️ **Platform** > 🤖 IA (l'infra maîtrise le déploiement des modèles)
- 🤖 **IA** > ☕ Java (l'innovation bouscule les pratiques établies)

---

## 4. Types d'attaques & compétences

Les attaques sont classées en **3 grands types thématiques**, chacun avec des sous-catégories :

**☕ Java** : attaques basées sur les fonctionnalités modernes du langage.
- *Virtual Threads* (haute cadence, brise la résistance des ennemis bloquants)
- *Sealed Classes* (invulnérabilité temporaire)
- *Pattern Matching Switch* (attaque multiple sur plusieurs cibles)
- *Records Immutables* (défense renforcée)
- *GraalVM Native* (vitesse d'exécution maximale, coup dévastateur)

**⚙️ Platform Engineering** : attaques basées sur l'infra, l'observabilité et les pipelines.
- *Kubernetes Rolling Update* (régénération progressive de la santé)
- *OpenTelemetry Trace* (révèle les faiblesses cachées de l'ennemi)
- *GitOps Push* (annule les effets négatifs du dernier tour)
- *Chaos Engineering* (dégâts aléatoires mais potentiellement massifs)
- *Pipeline CI/CD* (attaque automatique sur plusieurs tours)

**🤖 IA** : attaques basées sur les LLMs, le RAG et le fine-tuning.
- *RAG Pipeline* (recherche la vulnérabilité exacte de l'ennemi)
- *Fine-tune Ciblé* (augmente les dégâts contre un type spécifique)
- *Prompt Injection* (retourne une attaque ennemie contre lui-même)
- *Hallucination Contrôlée* (attaque aléatoire, parfois dévastatrice, parfois nulle)
- *MCP Tool Call* (invoque un outil externe pour un bonus situationnel)

**Interactions entre types** : Certains ennemis sont vulnérables à des types spécifiques. Le *Défenseur du Legacy* prend x2 dégâts des attaques Java modernes. Le *Vendor Buzzword* prend x2 des attaques IA factuelles. L'*Architecte Complexifiant* prend x2 des attaques Platform Engineering.

---

## 5. Antagonistes et défis

Les antagonistes sont des **archétypes humoristiques** bien connus de tout participant à une conférence tech. Ils servent de fil rouge au scénario, montant en puissance à mesure que le joueur progresse dans la journée Devoxx.

*   **Le Chasseur de Têtes Agressif** *(Ennemi basique, zone : Allée des Stands)*\
    Armé d'une pile de cartes de visite et d'un pitch LinkedIn, il vous intercepte à chaque carrefour. Spécialité : *Connexion LinkedIn Forcée* (paralyse le joueur pendant un tour), *Mission en Régie Avantageuse* (réduit les stats de Créativité). Faiblesse : Toute attaque technique qu'il ne comprend pas le déroute complètement.

*   **Le Vendeur de Buzzwords** *(Ennemi intermédiaire, zone : Allée des Stands)*\
    Représentant d'une solution « AI-powered, cloud-native, blockchain-enabled, quantum-ready ». Spécialité : *Slide Deck de 80 Pages* (attaque de confusion massive), *ROI Inventé* (réduit la confiance du joueur). Faiblesse : Les attaques IA factuelles le démasquent instantanément.

*   **Le Défenseur du Legacy** *(Ennemi redoutable, zone : Salles de Conférence)*\
    Convaincu que Java 8 est suffisant pour tout, que les lambdas sont inutiles et que le XML de configuration est un chef-d'œuvre. Spécialité : *ClassNotFoundException* (bug aléatoire), *StackOverflow Copy-Paste* (attaque puissante mais instable), *Refus du Merge Request* (bloque l'avancement pendant 2 tours). Immunité : résistant aux arguments de mode, vulnérable aux benchmarks factuels.

*   **L'Architecte Over-Engineer** *(Ennemi élite, zone : Speaker Lounge)*\
    A transformé un CRUD en 47 microservices avec event sourcing, CQRS, saga pattern, service mesh, et une file de messages pour afficher "Hello World". Spécialité : *Diagramme d'Architecture Incompréhensible* (confusion pendant 3 tours), *Nouveau Framework Recommandé* (force le joueur à changer de stratégie). Faiblesse : Les attaques Platform Engineering qui démontrent la complexité opérationnelle.

*   **Le Talk Marketing Déguisé en Conférence Technique** *(Boss intermédiaire, zone : Salle Conférence Track Bizness)*\
    45 minutes de slides sur "Comment notre produit résout tous vos problèmes" présenté comme un retour d'expérience technique. Spécialité : *Démo qui ne Fonctionne Pas en Live* (attaque d'embarras collectif), *Questions/Réponses Biaisées* (contre-attaques manipulatrices). Vulnérable aux questions techniques précises.

*   **Boss Final : Le COBOL Zombie (The Legacy Awakens)** *(Boss ultime, zone : Grande Salle Keynote)*\
    Un système vieux de 40 ans qui refuse de mourir, personnifié en boss gigantesque. Maintenu par des dev retraités rappelés en urgence. Plusieurs phases de combat : phase 1 (lent mais résistant), phase 2 (invoque des mainframes alliés), phase 3 (attaque *Year 2000 Bug Reload* dévastatrice). Nécessite de maîtriser les trois types d'attaques pour le vaincre.

---

## 6. Features principales : MVP vs évolutions futures

**MVP (Version jouable pour le Hackathon Devoxx)** :

| Feature | Priorité | Description |
|---|---|---|
| Carte isométrique jouable | Must Have | Allée des Stands + 1 Salle de Conférence + zone Networking |
| 3 personnages jouables (starters) | Must Have | Java Dev, Platform Engineer, IA Engineer |
| Système de combat au tour par tour | Must Have | 3 attaques par perso, 3 types ennemis basiques |
| 3 antagonistes basiques | Must Have | Chasseur de têtes, Vendeur de Buzzwords, Défenseur du Legacy |
| Dialogue et PNJ | Should Have | 5-8 PNJ avec dialogues courts et humoristiques |
| Système d'XP et de niveau | Should Have | Montée de niveau avec gain de compétences |
| Sauvegarde locale (localStorage) | Should Have | Conserver la progression |
| Ecran de sélection du starter | Must Have | Avec description humoristique de chaque profil |
| Ecran titre thème Devoxx | Must Have | Ambiance conférence tech |

**Evolutions futures (post-hackathon)** :

*   Boss intermédiaires et boss final (COBOL Zombie)
*   5 zones complètes (Keynote, Stands, Conférences x3 tracks, Workshop, After Party)
*   Système de badges de conférence (achievements)
*   Quêtes annexes (assister à des talks, résoudre des live coding challenges)
*   Mode multijoueur local (2 devs coopèrent contre les antagonistes)
*   Mini-jeux intégrés (quiz Java trivia, Kubernetes puzzle, LLM prompt challenge)
*   Easter eggs (références à des conférenciers Devoxx célèbres, à des frameworks connus)

---

## 7. Choix techniques & architecture du jeu (Phaser, JS/TS)

**Framework : Phaser 3**

Phaser 3 est le framework HTML5 de référence pour les jeux 2D côté navigateur. Ses atouts pour ce projet :
- **Tilemaps isométriques** : support natif des cartes isométriques exportées depuis **Tiled** (format JSON)
- **Scènes modulaires** : chaque zone (Stands, Conférence, etc.) est une scène Phaser indépendante, facilitant l'organisation du code
- **WebGL/Canvas** : rendu fluide même pour les navigateurs mobiles
- **Grande communauté** : tutoriels, exemples, et support actifs

**Stack technique** :
- Language : **TypeScript** (typage fort, maintenabilité)
- Bundler : **Vite** (hot reload rapide, build optimisé)
- Assets : sprites isométriques (style pixel art Game Boy), tilesets (Tiled)
- Cartes : créées avec **Tiled** en mode isométrique, exportées en JSON
- Données de jeu : externalisées en JSON (personnages, compétences, ennemis, dialogues) pour faciliter les modifications sans recompiler
- Sauvegarde : **localStorage** pour la progression du joueur

**Architecture du code** :

```
src/
  scenes/
    BootScene.ts          # chargement assets
    TitleScene.ts         # écran titre Devoxx
    StarterSelectScene.ts # sélection du personnage
    ExploreScene.ts       # exploration isométrique (principale)
    BattleScene.ts        # combat au tour par tour
    DialogScene.ts        # dialogues PNJ
  entities/
    Player.ts             # avatar joueur, stats, inventaire
    Enemy.ts              # antagoniste, compétences, comportement IA
    NPC.ts                # personnages non joueurs
  data/
    characters.json       # définition des starters
    skills.json           # toutes les compétences et attaques
    enemies.json          # tous les antagonistes et leurs stats
    dialogues.json        # textes de dialogues PNJ
    maps/                 # cartes Tiled exportées en JSON
  utils/
    BattleEngine.ts       # logique de combat (calcul dégâts, types)
    SaveManager.ts        # localStorage save/load
    EventBus.ts           # communication entre scènes
```

**Rendu isométrique** : Les tuiles sont dessinées à ~30° d'inclinaison (projection isométrique). L'ordre de rendu des sprites est géré par profondeur (depth sorting) pour donner l'illusion de la 3D. Tiled + Phaser gèrent nativement ce cas d'usage.

---

## 8. Contraintes non fonctionnelles

*   **Performance** : Le jeu doit tourner à 60 fps sur un laptop standard de développeur. Les assets seront compressés (sprites en PNG optimisés, atlas de textures). Le chargement initial doit être inférieur à 5 secondes sur une connexion conference (wifi de conf = souvent limité).

*   **Accessibilité** : Contrôles clavier complets (pas de souris obligatoire). Contraste suffisant pour la lisibilité des menus. Textes en français (public Devoxx France).

*   **Compatibilité** : Navigateurs modernes (Chrome, Firefox, Edge). Résolution 1280x720 minimum (laptop en mode présentation). Pas de dépendances backend — full client-side.

*   **Neutralité & humour bienveillant** : Le jeu caricature des *archétypes* (le vendeur de buzzwords, le chasseur de têtes) et non des individus réels. Pas de marque réelle citée, pas de contenu offensant. Un **disclaimer** au lancement précise que le jeu est un projet purement récréatif et non officiel. L'humour doit être reconnaissable et bienveillant — tout dev doit sourire en se reconnaissant dans au moins une situation.

*   **Maintenance & évolutivité** : Architecture TypeScript modulaire, données externalisées en JSON. Un développeur qui rejoint le projet doit pouvoir ajouter un ennemi ou une zone en modifiant uniquement les fichiers JSON de data, sans toucher au code moteur. README clair avec instructions d'installation et de contribution.

*   **Déploiement** : Build statique (Vite) hébergeable sur GitHub Pages, Netlify ou tout serveur web statique. Pas de backend, pas de base de données.

---

## 9. Bonnes pratiques & inspiration game design

Pour garantir le succès de ce jeu de conférence, on s'appuie sur les **bonnes pratiques en game design** :

*   **Prioriser le fun et la simplicité** : Le jeu doit d'abord être divertissant. On évite les mécaniques trop complexes ou les tutoriels interminables. Les éléments de culture dev sont intégrés de façon **contextuelle et amusante**. La règle d'or : si ça ne fait pas sourire un dev en 10 secondes, on simplifie.

*   **Mécaniques familières** : S'inspirer de Pokémon (combat), Zelda (exploration), Animal Crossing (PNJ attachants) permet une **prise en main quasi immédiate**. Tout dev des années 90-2000 reconnaît immédiatement le style et comprend les règles.

*   **Boucles de feedback positive & récompenses** : Gain d'XP visible, badges de conférence débloqués, dialogues valorisants des PNJ. Les **récompenses** soulignent la progression et peuvent faire référence à de vrais concepts tech (badge *« Java Champion »*, badge *« CNCF Certified »*).

*   **Références culturelles dev** : Easter eggs ciblés — une salle avec un PNJ nommé « James Gosling », une attaque nommée d'après un RFC, un ennemi dont la barre de vie s'appelle « Technical Debt ». Ces clins d'œil créent un sentiment d'appartenance et de complicité.

*   **Itérations courtes, tests utilisateurs devs** : Approche agile. Premières versions testées par des devs Devoxx (public cible = lui-même). Ajuster la difficulté des combats, la densité des dialogues, l'humour des descriptions d'attaques selon les retours.

*   **Références et ressources** : Documentation Phaser 3, tutoriels isométriques (Tiled + Phaser), assets pixel art open source (itch.io), tileset style Game Boy. Pour le game design serious/fun : les principes d'engagement de Jesse Schell (*The Art of Game Design*), en appliquant la règle de Jesse Schell n°1 — « Experience First ».

---

**Conclusion** : *« Devoxx Quest »* est un RPG 2D isométrique fun et référentiel qui transforme une journée de conférence tech en aventure ludique. Le héros (ou l'héroïne) développeur(se) affronte les chasseurs de têtes, les vendeurs de buzzwords et les défenseurs du legacy, armé(e) de ses compétences Java, Platform Engineering et IA. Le tout dans un style Pokémon pixel art qui parle directement au cœur de chaque dev nostalgique. Build statique, full TypeScript/Phaser 3, données en JSON, déployable en 5 minutes — c'est aussi un hommage à l'artisanat du code. **Have fun at Devoxx !** 🚀
