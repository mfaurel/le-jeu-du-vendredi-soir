/**
 * Pixel art sprites – Game Boy Color style, 16×16 pixels.
 *
 * Each sprite is a 16×16 number array:
 *   0  = transparent
 *   1-4 = indices into the sprite's palette
 *
 * drawPixelSprite(g, data, palette, scale, ox, oy)
 *   g       – Phaser Graphics object
 *   data    – 16×16 number array
 *   palette – array of 4 hex colors [color1, color2, color3, color4]
 *   scale   – px per pixel (2 = small/world, 4 = big/battle)
 *   ox, oy  – top-left origin offset in graphics local coords
 *             use (-8*scale, -16*scale) to anchor at bottom-center
 */
export function drawPixelSprite(g, data, palette, scale, ox = 0, oy = 0) {
    for (let row = 0; row < data.length; row++) {
        for (let col = 0; col < data[row].length; col++) {
            const idx = data[row][col];
            if (idx === 0) continue;
            g.fillStyle(palette[idx - 1], 1);
            g.fillRect(ox + col * scale, oy + row * scale, scale, scale);
        }
    }
}

// ─── Player palettes ──────────────────────────────────────────────────────────
// [highlight/skin, main color, dark detail, outline]
export const PLAYER_PALETTES = {
    assidu:      [0xffd166, 0x4a90d9, 0x1a3a5c, 0x050a15],
    occasionnel: [0xffd166, 0xf89820, 0xc76d0a, 0x1a0a00],
    disparu:     [0xffd166, 0xa855f7, 0x5b21b6, 0x1a0a2a],
};

// ─── Enemy palettes ───────────────────────────────────────────────────────────
export const ENEMY_PALETTES = {
    flemme_vendredi:        [0xd4c5b0, 0x6b7280, 0x374151, 0x0a0a10],
    netflix_endormant:      [0xffe8d6, 0xe50914, 0x7a0009, 0x1a0000],
    retardataire_chronique: [0xc8a882, 0xb45309, 0x7c3d09, 0x1a0800],
};

// ─── NPC palette ──────────────────────────────────────────────────────────────
export const NPC_PALETTE = [0xffd166, 0x2dc653, 0x145a32, 0x0a1a0a];

// ─── JAVA DEV ──────────────────────────────────────────────────────────────────
// Orange hoodie, big glasses, coffee mug in right hand
// palette: [skin, orange, darkOrange, outline]
export const JAVA_DEV_SPRITE = [
    [0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,0], // 0  hair top
    [0,0,0,4,3,3,3,3,3,3,3,4,0,0,0,0], // 1  hair
    [0,0,4,3,3,1,1,1,1,1,3,3,4,0,0,0], // 2  face + hair sides
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 3  face
    [0,0,4,1,4,3,4,1,4,3,4,1,4,0,0,0], // 4  glasses (frame+lens)
    [0,0,4,1,4,3,3,4,4,3,3,4,4,0,0,0], // 5  glasses bottom bar
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 6  face
    [0,0,4,1,4,4,4,1,1,4,4,4,4,0,0,0], // 7  smile
    [0,0,0,4,1,1,1,1,1,1,1,4,0,0,0,0], // 8  chin
    [0,0,4,2,2,2,2,2,2,2,2,2,4,0,0,0], // 9  collar
    [0,4,2,2,2,2,2,2,2,2,2,2,2,4,0,0], // 10 shoulders
    [0,4,2,2,3,2,2,2,2,2,3,2,2,4,0,0], // 11 hoodie pocket seams
    [4,2,2,2,2,2,2,2,2,2,3,3,3,4,0,0], // 12 body + coffee mug (right)
    [0,4,2,2,2,2,2,2,2,4,3,1,1,4,0,0], // 13 body + mug interior
    [0,0,4,3,3,3,4,4,3,3,3,4,0,0,0,0], // 14 legs
    [0,0,4,3,4,0,0,0,0,4,3,4,0,0,0,0], // 15 boots
];

// ─── PLATFORM ENGINEER ────────────────────────────────────────────────────────
// Yellow hard hat, blue coveralls, chest gear indicator lights
// palette: [skin, blue, darkBlue, outline]
export const PLATFORM_ENGINEER_SPRITE = [
    [0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,0], // 0  hard hat top
    [0,0,3,2,2,2,2,2,2,2,2,2,3,0,0,0], // 1  hard hat body
    [0,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0], // 2  hard hat brim
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 3  face
    [0,0,4,1,4,4,1,1,1,4,4,1,4,0,0,0], // 4  eyes
    [0,0,4,1,1,1,1,4,1,1,1,1,4,0,0,0], // 5  face + nose dot
    [0,0,4,1,4,4,1,1,4,4,1,1,4,0,0,0], // 6  grin
    [0,0,0,4,4,1,1,1,1,1,4,4,0,0,0,0], // 7  neck
    [0,0,4,2,2,2,2,2,2,2,2,2,4,0,0,0], // 8  collar
    [0,4,2,2,2,2,2,2,2,2,2,2,2,4,0,0], // 9  body
    [0,4,2,2,3,3,2,2,2,3,3,2,2,4,0,0], // 10 tech panels
    [0,4,2,2,3,1,3,2,3,1,3,2,2,4,0,0], // 11 glowing indicator lights
    [4,2,2,2,2,2,2,2,2,2,2,2,2,2,4,0], // 12 arms extended
    [0,4,2,2,2,2,2,2,2,2,2,2,2,4,0,0], // 13 body lower
    [0,0,4,3,3,3,4,4,3,3,3,4,0,0,0,0], // 14 legs
    [0,0,4,3,4,0,0,0,0,4,3,4,0,0,0,0], // 15 boots
];

// ─── IA ENGINEER ──────────────────────────────────────────────────────────────
// Spiky purple hair, glowing eyes, circuit board shirt pattern
// palette: [skin, purple, darkPurple, outline]
export const IA_ENGINEER_SPRITE = [
    [0,3,0,3,0,3,0,0,0,3,0,3,0,3,0,0], // 0  spiky hair tips
    [0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0], // 1  hair body
    [0,0,3,3,1,1,1,1,1,1,1,3,3,0,0,0], // 2  face + hair sides
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 3  face
    [0,0,4,1,2,2,1,1,1,2,2,1,4,0,0,0], // 4  glowing eyes (purple)
    [0,0,4,1,2,2,1,4,1,2,2,1,4,0,0,0], // 5  eyes + nose
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 6  face
    [0,0,4,1,4,1,4,1,4,1,4,1,4,0,0,0], // 7  circuit mouth (alternating)
    [0,0,0,4,4,4,4,4,4,4,4,4,0,0,0,0], // 8  neck
    [0,0,4,2,2,2,2,2,2,2,2,2,4,0,0,0], // 9  collar
    [0,4,2,2,3,2,3,2,3,2,3,2,2,4,0,0], // 10 circuit row A
    [0,4,2,3,2,3,2,3,2,3,2,3,2,4,0,0], // 11 circuit row B
    [4,2,2,2,3,2,3,2,3,2,3,2,2,2,4,0], // 12 arms + circuit
    [0,4,2,2,2,2,2,2,2,2,2,2,2,4,0,0], // 13 body lower
    [0,0,4,3,3,3,4,4,3,3,3,4,0,0,0,0], // 14 legs
    [0,0,4,3,4,0,0,0,0,4,3,4,0,0,0,0], // 15 boots
];

// ─── CHASSEUR DE TÊTES ────────────────────────────────────────────────────────
// Slick dark hair, orange suit, tie, business cards fanned in hand
// palette: [skin, orange-suit, darkOrange, outline]
export const CHASSEUR_SPRITE = [
    [0,0,0,4,3,3,3,3,3,3,3,4,0,0,0,0], // 0  slicked hair
    [0,0,4,3,3,3,3,3,3,3,3,3,4,0,0,0], // 1  hair
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 2  face
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 3  face
    [0,0,4,1,4,4,1,1,1,4,4,1,4,0,0,0], // 4  determined eyes
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 5  face
    [0,0,4,1,4,1,1,1,1,1,1,4,4,0,0,0], // 6  wide salesman smile
    [0,0,4,1,4,4,4,4,4,4,4,4,4,0,0,0], // 7  teeth
    [0,0,0,4,1,1,3,3,1,1,4,0,0,0,0,0], // 8  neck + tie
    [0,0,4,2,2,3,3,3,3,2,2,2,4,0,0,0], // 9  suit + tie
    [0,4,2,2,2,3,1,1,3,2,2,2,2,4,0,0], // 10 suit + shirt collar
    [0,4,2,2,2,2,2,2,2,2,2,2,2,4,0,0], // 11 suit body
    [4,2,2,2,2,2,2,2,2,2,1,1,1,4,0,0], // 12 arm + business cards
    [0,4,2,2,2,2,2,2,2,4,1,4,1,4,0,0], // 13 body + cards fanned
    [0,0,4,3,3,3,4,4,3,3,3,4,0,0,0,0], // 14 legs
    [0,0,4,3,4,0,0,0,0,4,3,4,0,0,0,0], // 15 shoes
];

// ─── VENDEUR DE BUZZWORDS ─────────────────────────────────────────────────────
// Highlighted hair, hot-pink flashy suit, stars, laptop in hand
// palette: [skin, pink, darkPink, outline]
export const VENDEUR_SPRITE = [
    [0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0], // 0  styled hair
    [0,0,0,3,2,2,2,3,2,2,2,3,0,0,0,0], // 1  hair with highlights
    [0,0,4,3,3,1,1,1,1,1,3,3,4,0,0,0], // 2  face + hair sides
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 3  face
    [0,0,4,1,4,2,4,1,4,2,4,1,4,0,0,0], // 4  excited eyes (pink pupils)
    [0,0,4,1,1,1,4,1,4,1,1,1,4,0,0,0], // 5  face
    [0,0,4,1,4,4,1,1,1,4,4,4,4,0,0,0], // 6  mega salesman smile
    [0,0,4,1,4,4,4,4,4,4,4,4,4,0,0,0], // 7  teeth row
    [0,0,0,4,4,1,1,1,1,4,0,0,0,0,0,0], // 8  neck
    [0,0,4,2,2,2,2,2,2,2,2,2,4,0,0,0], // 9  flashy suit
    [0,4,2,2,3,2,1,2,1,2,3,2,2,4,0,0], // 10 suit stars ✦
    [0,4,2,2,2,3,3,2,3,3,2,2,2,4,0,0], // 11 more stars
    [4,2,2,2,2,2,2,2,2,2,3,3,3,4,0,0], // 12 arm + laptop edge
    [0,4,2,2,2,2,2,2,4,3,3,3,4,0,0,0], // 13 body + laptop screen
    [0,0,4,3,3,3,4,4,3,3,3,4,0,0,0,0], // 14 legs
    [0,0,4,3,4,0,0,0,0,4,3,4,0,0,0,0], // 15 shoes
];

// ─── DÉFENSEUR DU LEGACY ──────────────────────────────────────────────────────
// Grey side hair (balding), beige skin, grey sweater, floppy disk in hand
// palette: [oldSkin, greySweat, darkGrey, outline]
export const DEFENSEUR_SPRITE = [
    [0,0,0,3,3,1,1,1,1,1,3,3,0,0,0,0], // 0  grey hair sides, bald top
    [0,0,3,3,1,1,1,1,1,1,1,3,3,0,0,0], // 1  hair sides
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 2  face
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 3  face
    [0,0,4,1,3,4,1,1,1,4,3,1,4,0,0,0], // 4  furrowed brows + eyes
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 5  face
    [0,0,4,1,3,1,3,1,3,1,3,1,4,0,0,0], // 6  grumpy wrinkles
    [0,0,4,1,4,4,4,4,4,4,4,4,4,0,0,0], // 7  grumpy downturned mouth
    [0,0,0,4,1,1,1,1,1,1,1,4,0,0,0,0], // 8  thick neck
    [0,0,4,2,2,2,2,2,2,2,2,2,4,0,0,0], // 9  old sweater
    [0,4,2,2,2,3,2,2,2,3,2,2,2,4,0,0], // 10 sweater cable knit A
    [0,4,2,2,3,2,3,2,3,2,3,2,2,4,0,0], // 11 sweater cable knit B
    [4,2,2,2,2,2,2,2,2,2,3,3,3,4,0,0], // 12 arm + floppy disk (3.5")
    [0,4,2,2,2,2,2,2,4,3,1,3,4,0,0,0], // 13 body + floppy label
    [0,0,4,3,3,3,4,4,3,3,3,4,0,0,0,0], // 14 legs
    [0,0,4,3,4,0,0,0,0,4,3,4,0,0,0,0], // 15 shoes
];

// ─── GENERIC NPC ──────────────────────────────────────────────────────────────
// Friendly conference attendee with badge
// palette: [skin, green, darkGreen, outline]
export const NPC_SPRITE = [
    [0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,0], // 0  hair
    [0,0,0,4,3,3,3,3,3,3,3,4,0,0,0,0], // 1  hair
    [0,0,4,3,1,1,1,1,1,1,1,3,4,0,0,0], // 2  face
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 3  face
    [0,0,4,1,4,4,1,1,1,4,4,1,4,0,0,0], // 4  eyes
    [0,0,4,1,1,1,1,1,1,1,1,1,4,0,0,0], // 5  face
    [0,0,4,1,1,4,4,4,4,4,1,1,4,0,0,0], // 6  smile
    [0,0,0,4,1,1,1,1,1,1,4,0,0,0,0,0], // 7  chin
    [0,0,4,2,2,2,2,2,2,2,2,2,4,0,0,0], // 8  shirt
    [0,4,2,2,2,2,2,2,2,2,2,2,2,4,0,0], // 9  body
    [0,4,2,2,3,3,3,3,3,3,2,2,2,4,0,0], // 10 conference badge
    [0,4,2,2,3,1,1,1,1,3,2,2,2,4,0,0], // 11 badge content
    [4,2,2,2,2,2,2,2,2,2,2,2,2,2,4,0], // 12 arms
    [0,4,2,2,2,2,2,2,2,2,2,2,2,4,0,0], // 13 body lower
    [0,0,4,3,3,3,4,4,3,3,3,4,0,0,0,0], // 14 legs
    [0,0,4,3,4,0,0,0,0,4,3,4,0,0,0,0], // 15 shoes
];

// Helper: get player sprite + palette by characterId
export function getPlayerSprite(characterId) {
    const sprites = {
        assidu:      { data: PLATFORM_ENGINEER_SPRITE, palette: PLAYER_PALETTES.assidu },
        occasionnel: { data: JAVA_DEV_SPRITE,          palette: PLAYER_PALETTES.occasionnel },
        disparu:     { data: IA_ENGINEER_SPRITE,       palette: PLAYER_PALETTES.disparu },
    };
    return sprites[characterId] ?? sprites.assidu;
}

// Helper: get enemy sprite + palette by enemyId
export function getEnemySprite(enemyId) {
    const sprites = {
        flemme_vendredi:        { data: DEFENSEUR_SPRITE, palette: ENEMY_PALETTES.flemme_vendredi },
        netflix_endormant:      { data: VENDEUR_SPRITE,   palette: ENEMY_PALETTES.netflix_endormant },
        retardataire_chronique: { data: CHASSEUR_SPRITE,  palette: ENEMY_PALETTES.retardataire_chronique },
    };
    return sprites[enemyId] ?? sprites.flemme_vendredi;
}
