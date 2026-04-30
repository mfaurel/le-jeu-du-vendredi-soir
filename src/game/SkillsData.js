// Type advantage multipliers: attacker type → defender type → multiplier
const TYPE_CHART = {
    assidu:      { flemme: 2.0, distraction: 1.2, retard: 0.7 },
    occasionnel: { flemme: 0.6, distraction: 1.3, retard: 1.5 },
    disparu:     { flemme: 0.7, distraction: 1.5, retard: 0.8 }
};

export function getTypeMultiplier(attackerType, defenderType) {
    return TYPE_CHART[attackerType]?.[defenderType] ?? 1.0;
}

export const SKILLS = {
    // L'Assidu
    gif_motivant: {
        id: 'gif_motivant',
        name: 'GIF Motivant',
        type: 'assidu',
        damage: 10,
        boost: true,
        description: 'Envoie le GIF parfait — +30% dégâts sur la prochaine attaque',
        emoji: '📸'
    },
    rappel_discord: {
        id: 'rappel_discord',
        name: 'Rappel Discord',
        type: 'assidu',
        damage: 8,
        heal: 3,
        description: 'Ping en rafale — dégâts + récupère 3 HP de motivation',
        emoji: '🔔'
    },
    cest_mieux_que_netflix: {
        id: 'cest_mieux_que_netflix',
        name: 'C\'est mieux que Netflix',
        type: 'assidu',
        damage: 15,
        description: 'Argument imparable — super efficace contre la flemme',
        emoji: '🎮'
    },

    // L'Occasionnel
    allez_je_viens: {
        id: 'allez_je_viens',
        name: 'Allez, je viens !',
        type: 'occasionnel',
        damage: 14,
        expose: true,
        description: 'Surprise ! Attaque quand personne ne s\'y attend — révèle la faiblesse',
        emoji: '🎲'
    },
    fall_guys_ce_soir: {
        id: 'fall_guys_ce_soir',
        name: 'Fall Guys ce soir ?',
        type: 'occasionnel',
        damage: 8,
        heal: 5,
        description: 'Propose un jeu accessible — dégâts ET récupère 5 HP',
        emoji: '🫐'
    },
    bonne_ambiance: {
        id: 'bonne_ambiance',
        name: 'Bonne Ambiance',
        type: 'occasionnel',
        damage: 6,
        shield: true,
        description: 'Met l\'ambiance pour tout le monde — +5 défense ce tour',
        emoji: '🎉'
    },

    // Le Disparu
    retour_surprise: {
        id: 'retour_surprise',
        name: 'Retour Surprise',
        type: 'disparu',
        damage: 20,
        description: 'Réapparaît sans prévenir — dégâts massifs par l\'effet de surprise',
        emoji: '👻'
    },
    tas_vu_ce_truc: {
        id: 'tas_vu_ce_truc',
        name: 'T\'as vu ce truc ?',
        type: 'disparu',
        damage: 12,
        expose: true,
        description: 'Partage un jeu inconnu — expose la faiblesse (+20% dégâts suivants)',
        emoji: '👀'
    },
    cetait_mieux_avant: {
        id: 'cetait_mieux_avant',
        name: 'C\'était mieux avant',
        type: 'disparu',
        damage: 16,
        description: 'La nostalgie comme arme — touche universellement fort',
        emoji: '🕹️'
    }
};
