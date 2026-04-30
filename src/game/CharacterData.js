export const CHARACTERS = {
    assidu: {
        id: 'assidu',
        name: '🎯 L\'Assidu',
        subtitle: 'Toujours là, fidèle au poste',
        description: 'Jamais en retard, jamais absent. Il envoie le GIF motivant à 20h30 et est connecté à 21h pile. Redoutable contre la flemme.',
        color: 0x4a90d9,
        type: 'assidu',
        stats: {
            hp: 35,
            maxHp: 35,
            motivation: 9,
            ponctualite: 9,
            fun: 6,
            charisme: 7
        },
        skills: ['gif_motivant', 'rappel_discord', 'cest_mieux_que_netflix'],
        weakness: 'retard',
        strength: 'flemme'
    },
    occasionnel: {
        id: 'occasionnel',
        name: '🎲 L\'Occasionnel',
        subtitle: 'Présent quand la flemme recule',
        description: 'Il vient parfois, mais quand il est là, il met l\'ambiance. Propose toujours le bon jeu au bon moment. Fort contre le retard.',
        color: 0xf89820,
        type: 'occasionnel',
        stats: {
            hp: 30,
            maxHp: 30,
            motivation: 6,
            ponctualite: 5,
            fun: 9,
            charisme: 8
        },
        skills: ['allez_je_viens', 'fall_guys_ce_soir', 'bonne_ambiance'],
        weakness: 'flemme',
        strength: 'retard'
    },
    disparu: {
        id: 'disparu',
        name: '👻 Le Disparu',
        subtitle: 'Revient de loin, surprise garantie',
        description: 'Absent depuis des mois, il resurgit un vendredi sans prévenir. Sa nostalgie est une arme dévastatrice contre la mauvaise ambiance.',
        color: 0xa855f7,
        type: 'disparu',
        stats: {
            hp: 25,
            maxHp: 25,
            motivation: 5,
            ponctualite: 4,
            fun: 8,
            charisme: 9
        },
        skills: ['retour_surprise', 'tas_vu_ce_truc', 'cetait_mieux_avant'],
        weakness: 'retard',
        strength: 'mauvaise_ambiance'
    }
};

export const CHARACTER_LIST = Object.values(CHARACTERS);
