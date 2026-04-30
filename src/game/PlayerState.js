const SAVE_KEY = 'vendredi_soir_save';

const defaultState = () => ({
    role: null,
    characterId: null,
    hp: 30,
    maxHp: 30,
    xp: 0,
    level: 1,
    skills: [],
    defeatedEnemyIds: [],
    boostTurns: 0,
    exposedEnemy: false
});

let state = defaultState();

export const PlayerState = {
    init(characterData) {
        state = {
            ...defaultState(),
            role: characterData.name,
            characterId: characterData.id,
            hp: characterData.stats.maxHp,
            maxHp: characterData.stats.maxHp,
            skills: [...characterData.skills]
        };
    },

    get() {
        return { ...state };
    },

    setHP(hp) {
        state.hp = Math.max(0, Math.min(state.maxHp, hp));
    },

    takeDamage(amount) {
        state.hp = Math.max(0, state.hp - amount);
        return state.hp;
    },

    heal(amount) {
        state.hp = Math.min(state.maxHp, state.hp + amount);
        return state.hp;
    },

    gainXP(amount) {
        state.xp += amount;
        const xpNeeded = state.level * 50;
        if (state.xp >= xpNeeded) {
            state.xp -= xpNeeded;
            state.level += 1;
            state.maxHp += 5;
            state.hp = Math.min(state.hp + 10, state.maxHp);
            return true; // leveled up
        }
        return false;
    },

    defeatEnemy(enemyId) {
        if (!state.defeatedEnemyIds.includes(enemyId)) {
            state.defeatedEnemyIds.push(enemyId);
        }
    },

    isEnemyDefeated(enemyId) {
        return state.defeatedEnemyIds.includes(enemyId);
    },

    defeatedCount() {
        return state.defeatedEnemyIds.length;
    },

    isAlive() {
        return state.hp > 0;
    },

    save() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(state));
        } catch (e) {
            // localStorage unavailable
        }
    },

    load() {
        try {
            const saved = localStorage.getItem(SAVE_KEY);
            if (saved) {
                state = { ...defaultState(), ...JSON.parse(saved) };
                return true;
            }
        } catch (e) {
            // ignore
        }
        return false;
    },

    reset() {
        state = defaultState();
        try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
    }
};
