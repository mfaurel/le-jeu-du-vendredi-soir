export const ENEMIES = [
    {
        id: 'flemme_vendredi',
        name: 'La Flemme du Vendredi',
        subtitle: 'Le canapé est tellement confortable ce soir...',
        type: 'flemme',
        color: 0x6b7280,
        hp: 18,
        maxHp: 18,
        xpReward: 30,
        attacks: [
            { name: 'Canapé Confortable', damage: 4, description: 'Te paralyse avec l\'envie de rester vautré' },
            { name: 'Binge-watching', damage: 5, description: 'Lance une série addictive, dégâts continus' },
            { name: '"J\'suis fatigué"', damage: 3, description: 'Se met en mode défense, soupir profond' }
        ],
        dialogBefore: 'Ce soir... j\'ai vraiment pas l\'énergie. Le canapé m\'appelle. Peut-être la semaine prochaine ?',
        dialogAfter: 'Bon... OK, j\'arrive dans 5 minutes. Mais je reste pas longtemps.',
        position: { col: 3, row: 8 }
    },
    {
        id: 'netflix_endormant',
        name: 'Le Netflix Endormant',
        subtitle: 'Un épisode de plus... juste un...',
        type: 'distraction',
        color: 0xe50914,
        hp: 28,
        maxHp: 28,
        xpReward: 50,
        attacks: [
            { name: 'Autoplay Infernal', damage: 6, description: 'Impossible de s\'arrêter, perd un tour' },
            { name: 'Série Addictive', damage: 4, description: 'Le cliffhanger te retient sur le canapé' },
            { name: '"Un épisode de plus"', damage: 5, description: 'Stall de 2 tours, la soirée avance sans toi' }
        ],
        dialogBefore: 'Mais attends... il reste juste un épisode. Je peux pas laisser ça en plan là !',
        dialogAfter: 'OK OK, j\'ai mis en pause. J\'arrive sur Discord maintenant.',
        position: { col: 7, row: 3 }
    },
    {
        id: 'retardataire_chronique',
        name: 'Le Retardataire Chronique',
        subtitle: '"J\'arrive dans 10 min" — dit-il depuis 45 min',
        type: 'retard',
        color: 0xb45309,
        hp: 40,
        maxHp: 40,
        xpReward: 80,
        attacks: [
            { name: '"J\'arrive dans 10 min"', damage: 8, description: 'Mensonge absolu, fait attendre tout le monde' },
            { name: 'Problème Technique', damage: 6, description: 'Mon PC plante, mon casque marche pas...' },
            { name: 'Excuse Inédite', damage: 9, description: 'Une excuse si créative qu\'on peut même pas s\'énerver' }
        ],
        dialogBefore: 'Ouais ouais, je suis presque prêt. Mon PC reboot juste. Et je mange. Et je cherche mon casque...',
        dialogAfter: 'Voilà, je suis là ! C\'était quoi le jeu déjà ?',
        position: { col: 12, row: 0 }
    }
];
