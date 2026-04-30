# Le Jeu du Vendredi Soir

> Créé en quelques heures lors d'un Code Game Jam · Phaser 4 + React

---

## Le concept

C'est vendredi soir. Il est 20h30. Un `@everyone` part sur Discord.

**"C'est pour ce soir ? On joue à 21h ?"**

Le problème : avant de pouvoir lancer la soirée, il faut surmonter tous les obstacles qui se dressent sur le chemin — la flemme, le retard, la mauvaise connexion, et bien d'autres ennemis bien connus du groupe. Bats-les tous pour débloquer le portail et lancer la session. Ce soir, c'est **First Class Trouble**.

---

## Comment jouer

### Déplacement

| Touche | Action |
|--------|--------|
| `↑ ↓ ← →` ou `WASD` | Déplacer le personnage |
| `ESPACE` | Interagir avec les PNJ adjacents |

Le jeu se joue en vue **isométrique** sur un chemin en zigzag. Déplace-toi de case en case jusqu'au portail violet au bout du chemin.

### Combats

Quand tu marches sur la case d'un ennemi, un **combat au tour par tour** se déclenche :

- Choisis une **compétence** parmi celles de ton personnage
- Chaque compétence a un **type** (Motivation, Fun, Charisme…) qui est plus ou moins efficace selon la faiblesse de l'ennemi
- L'ennemi contre-attaque, tu survives ou tu repars du début
- La victoire te rapporte de l'**XP** et te fait gagner des **niveaux**

Après le combat, tu restes sur la case où tu t'es battu.

### Victoire

Bats **tous les obstacles** du chemin, puis entre dans le **portail** (🎮 JOUER !) pour déclencher la cinématique de fin.

---

## Les personnages

### 🎯 L'Assidu
*Toujours là, fidèle au poste*
HP élevés, fort contre la flemme. Ne rate jamais un vendredi soir.
Compétences : GIF motivant · Rappel Discord · C'est mieux que Netflix

### 🎲 L'Occasionnel
*Présent quand la flemme recule*
Mise sur le fun et le charisme. Fort contre le retard.
Compétences : Allez j'viens · Fall Guys ce soir · Bonne ambiance

### 👻 Le Disparu
*Revient de loin, surprise garantie*
Absent des mois, mais redoutable en nostalgie. Fort contre la mauvaise ambiance.
Compétences : Retour surprise · T'as vu ce truc · C'était mieux avant

---

## Les zones

Le chemin traverse plusieurs zones thématiques :

| Zone | Ambiance |
|------|----------|
| **Départ** | Case verte de départ (col 0, row 10) |
| **Forêt** | Zone sombre avec arbres et particules de brume |
| **Donjon** | Couloirs sombres avec torches animées et chaînes |
| **Taverne** | Ambiance chaleureuse, lanternes et tonneaux |
| **Portail** | Destination finale — anneau violet pulsant |

---

## Les ennemis

Chaque ennemi bloque une case du chemin et a ses propres faiblesses, attaques et dialogues :

- **La Flemme du Vendredi** — l'obstacle classique du début de soirée
- **Le Retard Chronique** — toujours là mais jamais à l'heure
- **La Mauvaise Connexion** — lag, déco, chaos
- **Le "Je suis crevé"** — la fatigue qui guette
- …et d'autres surprises sur le chemin

---

## La cinématique de fin

Une fois tous les obstacles battus et le portail franchi, une cinématique en 3 actes se déclenche :

1. **YOUHOU !** — feux d'artifice et confettis
2. **Les 6 amis** — Deus, Claude, Fatmike, MKz, Tsunaze et toi apparaissent un par un, tous connectés
3. **First Class Trouble** — le jeu du soir est annoncé. Qui sera l'imposteur ?

---

## Lancer le projet

```bash
npm install
npm run dev
```

Le jeu tourne sur `http://localhost:8080` par défaut.

```bash
npm run build   # build de production dans /dist
```

---

## Stack technique

- **[Phaser 4](https://github.com/phaserjs/phaser)** — moteur de jeu 2D
- **[React 19](https://github.com/facebook/react)** — interface autour du jeu
- **[Vite 6](https://vitejs.dev/)** — bundler et serveur de dev
- Sprites en **pixel art procédural** (dessinés en code via `Graphics`)
- Vue **isométrique** calculée à la main (pas de tilemap externe)
- Système de combat **tour par tour** avec types et multiplicateurs
- Sauvegarde de l'état joueur via `PlayerState` (singleton en mémoire)
