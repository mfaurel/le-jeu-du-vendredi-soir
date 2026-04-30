import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { ENEMIES } from '../EnemiesData';
import { NPC_DIALOGUES } from '../DialoguesData';
import { PlayerState } from '../PlayerState';
import { DialogSystem } from '../DialogSystem';
import { drawPixelSprite, getPlayerSprite, getEnemySprite, NPC_SPRITE, NPC_PALETTE } from '../SpriteData';

const TILE_W  = 52;
const TILE_H  = 26;
const COLS    = 16;
const ROWS    = 12;
const ORIGIN_X = 512;
const ORIGIN_Y = 108;

function isoToScreen(col, row) {
    return {
        x: ORIGIN_X + (col - row) * (TILE_W / 2),
        y: ORIGIN_Y + (col + row) * (TILE_H / 2)
    };
}

// 1=wall, 2=forest, 3=dungeon, 4=taverne, 5=start, 6=finish
const MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,5,2,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,2,2,2,2,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,2,3,3,3,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,3,3,3,3,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,3,3,3,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,3,4,4,4,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,4,6,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Zone colors
const ZONE = {
    floor: { base: 0x1e3a2f, hi: 0x2d5c45, lo: 0x0d1e18, edge: 0x14291f },
    forest: { base: 0x1a3d1a, hi: 0x2a5c2a, lo: 0x0d200d, edge: 0x122612 },
    dungeon: { base: 0x1e2240, hi: 0x2d3360, lo: 0x0e1128, edge: 0x141830 },
    taverne: { base: 0x3d2010, hi: 0x5c3218, lo: 0x1e0f08, edge: 0x2a1508 },
    start:   { base: 0x0d3320, hi: 0x0f4f30, lo: 0x071a10, edge: 0x0a2718 },
    finish:  { base: 0x2d0f5c, hi: 0x421880, lo: 0x170830, edge: 0x1f0a3d },
};

const WALL_TOP  = 0x2d3561;
const WALL_LEFT = 0x1a1f40;
const WALL_RIGHT= 0x0f1228;
const WALL_H    = 22;

function tileZone(type) {
    if (type === 2) return ZONE.forest;
    if (type === 3) return ZONE.dungeon;
    if (type === 4) return ZONE.taverne;
    if (type === 5) return ZONE.start;
    if (type === 6) return ZONE.finish;
    return ZONE.floor;
}

export class WorldScene extends Scene {
    constructor() { super('WorldScene'); }

    init(data) {
        this.characterId = data && data.characterId ? data.characterId : 'assidu';
    }

    preload() {}

    create() {
        this._drawBackground();
        this._buildTilemap();
        this._buildDecorations();
        this._spawnEnemies();
        this._spawnNPCs();
        this._createPlayer();
        this._createHighlights();
        this._createHUD();
        this._updateMovementHighlights();

        this.dialog = new DialogSystem(this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd    = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
        this.input.keyboard.on('keydown-SPACE', () => this._onInteract());
        this.moveDelay = 0;

        const battleResult = this.registry.get('battleResult');
        if (battleResult) {
            this.registry.remove('battleResult');
            this.time.delayedCall(300, () => {
                this.dialog.show([{ speaker: 'Discord', text: `Obstacle éliminé ! ${PlayerState.defeatedCount()}/${ENEMIES.length} vaincus.` }]);
            });
        }

        EventBus.emit('current-scene-ready', this);
    }

    // ── BACKGROUND GRADIENT ──────────────────────────────────────────────

    _drawBackground() {
        const { width, height } = this.cameras.main;
        this.add.rectangle(width/2, height * 0.25, width, height * 0.5, 0x0e1a0e);
        this.add.rectangle(width/2, height * 0.58, width, height * 0.36, 0x0e0e1a);
        this.add.rectangle(width/2, height * 0.84, width, height * 0.32, 0x1a100a);
    }

    // ── TILEMAP ──────────────────────────────────────────────────────────

    _buildTilemap() {
        const g = this.add.graphics();

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const type = MAP[row][col];
                const { x, y } = isoToScreen(col, row);
                const hw = TILE_W / 2;
                const hh = TILE_H / 2;

                if (type === 1) {
                    // Top face
                    g.fillStyle(WALL_TOP);
                    g.fillPoints([
                        { x, y: y - WALL_H },
                        { x: x + hw, y: y - WALL_H + hh },
                        { x, y: y + TILE_H - WALL_H },
                        { x: x - hw, y: y - WALL_H + hh }
                    ], true);
                    // Left face
                    g.fillStyle(WALL_LEFT);
                    g.fillPoints([
                        { x: x - hw, y: y - WALL_H + hh },
                        { x, y: y + TILE_H - WALL_H },
                        { x, y: y + TILE_H },
                        { x: x - hw, y: y + hh }
                    ], true);
                    // Right face
                    g.fillStyle(WALL_RIGHT);
                    g.fillPoints([
                        { x: x + hw, y: y - WALL_H + hh },
                        { x, y: y + TILE_H - WALL_H },
                        { x, y: y + TILE_H },
                        { x: x + hw, y: y + hh }
                    ], true);
                } else {
                    const z = tileZone(type);

                    // Base diamond
                    g.fillStyle(z.base);
                    g.fillPoints([
                        { x, y },
                        { x: x + hw, y: y + hh },
                        { x, y: y + TILE_H },
                        { x: x - hw, y: y + hh }
                    ], true);

                    // Highlight top-left edge
                    g.lineStyle(2, z.hi, 0.8);
                    g.beginPath();
                    g.moveTo(x, y);
                    g.lineTo(x - hw, y + hh);
                    g.lineTo(x, y + TILE_H);
                    g.strokePath();

                    // Shadow bottom-right edge
                    g.lineStyle(2, z.lo, 0.9);
                    g.beginPath();
                    g.moveTo(x, y);
                    g.lineTo(x + hw, y + hh);
                    g.lineTo(x, y + TILE_H);
                    g.strokePath();

                    // Subtle texture dots on forest/dungeon
                    if (type === 2 || type === 3) {
                        g.fillStyle(z.hi, 0.07);
                        g.fillRect(x - 6, y + hh - 2, 4, 3);
                        g.fillRect(x + 4, y + hh + 3, 3, 2);
                        g.fillRect(x - 2, y + TILE_H - 5, 4, 2);
                    }
                }
            }
        }

        // Start tile pulse glow
        const { x: sx, y: sy } = isoToScreen(1, 1);
        const startGlow = this.add.circle(sx, sy + TILE_H / 2, 24, 0x00ff88, 0.18);
        this.tweens.add({ targets: startGlow, alpha: 0.06, scaleX: 1.4, scaleY: 1.4, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // Start label
        this.add.text(sx, sy - 8, 'DÉPART', { fontSize: '9px', color: '#00ff88', fontFamily: 'Courier New' }).setOrigin(0.5).setDepth(10);

        // Finish portal
        this._buildPortal();
    }

    _buildPortal() {
        const { x: fx, y: fy } = isoToScreen(14, 10);
        const cy = fy + TILE_H / 2;

        // Pulsing rings
        for (let r = 0; r < 3; r++) {
            const ring = this.add.circle(fx, cy, 18 + r * 9, 0x9b59f7, 0).setDepth(5);
            ring.setStrokeStyle(2, 0x9b59f7);
            this.tweens.add({
                targets: ring,
                alpha: { from: 0.8, to: 0 },
                scaleX: { from: 0.5, to: 1.5 },
                scaleY: { from: 0.5, to: 1.5 },
                duration: 1400,
                repeat: -1,
                delay: r * 460,
                ease: 'Sine.easeOut'
            });
        }

        // Spinning arc (6 segments)
        const arcG = this.add.graphics().setDepth(6);
        let arcAngle = 0;
        this.time.addEvent({
            delay: 30, repeat: -1,
            callback: () => {
                arcG.clear();
                arcAngle += 0.06;
                for (let i = 0; i < 6; i++) {
                    const a = arcAngle + (i / 6) * Math.PI * 2;
                    const px = fx + Math.cos(a) * 14;
                    const py = cy + Math.sin(a) * 14;
                    arcG.fillStyle(0xd4a8ff, i % 2 === 0 ? 0.9 : 0.4);
                    arcG.fillCircle(px, py, 3);
                }
            }
        });

        // Core glow
        const core = this.add.circle(fx, cy, 10, 0x7c3aed, 0.6).setDepth(5);
        this.tweens.add({ targets: core, alpha: { from: 0.6, to: 0.2 }, scaleX: { from: 1, to: 0.7 }, scaleY: { from: 1, to: 0.7 }, duration: 700, yoyo: true, repeat: -1 });

        // Label
        const lbl = this.add.text(fx, fy - 12, '🎮 JOUER !', { fontSize: '10px', color: '#d4a8ff', fontFamily: 'Courier New' }).setOrigin(0.5).setDepth(7);
        this.tweens.add({ targets: lbl, y: fy - 18, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    // ── DECORATIONS ──────────────────────────────────────────────────────

    _buildDecorations() {
        // Walk all wall tiles and add zone-appropriate decorations
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (MAP[row][col] !== 1) continue;
                const zone = this._adjacentZone(col, row);
                if (zone === 0) continue;
                const { x, y } = isoToScreen(col, row);
                const screenY = y - WALL_H / 2;

                if (zone === 2) this._decorForest(x, screenY, col, row);
                else if (zone === 3) this._decorDungeon(x, screenY, col, row);
                else if (zone === 4) this._decorTaverne(x, screenY, col, row);
            }
        }

        // Mist particles for forest zone
        this._buildMist();
    }

    _adjacentZone(col, row) {
        const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
        for (const [dc, dr] of dirs) {
            const c = col + dc, r = row + dr;
            if (c >= 0 && r >= 0 && c < COLS && r < ROWS && MAP[r][c] >= 2) return MAP[r][c];
        }
        return 0;
    }

    _decorForest(x, y, col, row) {
        // Only place on every 2nd tile to avoid clutter
        if ((col + row) % 3 !== 0) return;
        const g = this.add.graphics().setDepth(y + 2);
        // Trunk
        g.fillStyle(0x5c3317);
        g.fillRect(x - 3, y - 22, 6, 14);
        // Foliage layers
        [[0, -30, 14], [0, -22, 11], [0, -14, 8]].forEach(([ox, oy, r]) => {
            g.fillStyle(0x1a4d1a);
            g.fillCircle(x + ox, y + oy, r);
            g.fillStyle(0x236b23, 0.5);
            g.fillCircle(x + ox - 3, y + oy - 2, r * 0.5);
        });
    }

    _decorDungeon(x, y, col, row) {
        if ((col + row) % 2 !== 0) return;

        if ((col * row) % 5 === 0) {
            // Torch
            const g = this.add.graphics().setDepth(y + 2);
            g.fillStyle(0x5c3317);
            g.fillRect(x - 2, y - 18, 4, 12);
            g.fillStyle(0x444);
            g.fillRect(x - 3, y - 6, 6, 3);
            // Flame
            const flame = this.add.graphics().setDepth(y + 3);
            flame.fillStyle(0xff8c00);
            flame.fillTriangle(x - 5, y - 6, x + 5, y - 6, x, y - 20);
            this.tweens.add({ targets: flame, scaleY: { from: 1, to: 0.7 }, scaleX: { from: 1, to: 1.3 }, duration: 120 + Math.random() * 100, yoyo: true, repeat: -1 });
            // Glow
            const glow = this.add.circle(x, y - 12, 20, 0xff6600, 0.08).setDepth(y + 1);
            this.tweens.add({ targets: glow, alpha: { from: 0.08, to: 0.18 }, duration: 200 + Math.random() * 150, yoyo: true, repeat: -1 });
        } else {
            // Chain links
            const g = this.add.graphics().setDepth(y + 2);
            g.lineStyle(2, 0x555577, 0.8);
            for (let i = 0; i < 3; i++) {
                g.strokeCircle(x, y - 8 - i * 7, 3);
            }
        }
    }

    _decorTaverne(x, y, col, row) {
        if ((col + row) % 3 !== 1) return;
        const g = this.add.graphics().setDepth(y + 2);

        if ((col * row) % 3 === 0) {
            // Lantern
            g.fillStyle(0x8b6914);
            g.fillRect(x - 5, y - 22, 10, 14);
            g.fillStyle(0xffd166, 0.6);
            g.fillRect(x - 3, y - 20, 6, 10);
            g.lineStyle(1, 0x8b6914);
            g.lineBetween(x, y - 22, x, y - 36);
            // Warm glow
            const glow = this.add.circle(x, y - 15, 18, 0xffa500, 0.07).setDepth(y + 1);
            this.tweens.add({ targets: glow, alpha: { from: 0.07, to: 0.18 }, duration: 600 + Math.random() * 300, yoyo: true, repeat: -1 });
        } else {
            // Barrel
            g.fillStyle(0x5c3d1e);
            g.fillEllipse(x, y - 10, 18, 8);
            g.fillStyle(0x7a5228);
            g.fillRect(x - 9, y - 18, 18, 10);
            g.fillStyle(0x5c3d1e);
            g.fillEllipse(x, y - 18, 18, 7);
            // Hoop
            g.lineStyle(2, 0x444, 0.9);
            g.lineBetween(x - 9, y - 14, x + 9, y - 14);
        }
    }

    _buildMist() {
        // Floating mist particles in forest zone tiles
        const forestTiles = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (MAP[r][c] === 2) forestTiles.push(isoToScreen(c, r));
            }
        }
        forestTiles.forEach(({ x, y }, i) => {
            if (i % 3 !== 0) return;
            const mist = this.add.circle(x + (Math.random() - 0.5) * 20, y + TILE_H / 2, 8 + Math.random() * 6, 0xaaffaa, 0.04).setDepth(y + 5);
            this.tweens.add({
                targets: mist,
                x: `+=${(Math.random() - 0.5) * 30}`,
                y: `-=${10 + Math.random() * 15}`,
                alpha: 0,
                duration: 2500 + Math.random() * 2000,
                delay: Math.random() * 3000,
                repeat: -1,
                repeatDelay: Math.random() * 1000
            });
        });
    }

    // ── ENEMIES ──────────────────────────────────────────────────────────

    _spawnEnemies() {
        this.enemySprites = [];
        ENEMIES.forEach((enemy, i) => {
            if (PlayerState.isEnemyDefeated(enemy.id)) return;
            const { x, y } = isoToScreen(enemy.position.col, enemy.position.row);
            const g = this.add.graphics();
            this._drawEnemySprite(g, enemy.id);
            g.setPosition(x, y - 16).setDepth(y);

            const label = this.add.text(x, y - 42, enemy.name, {
                fontSize: '9px', color: '#ff6b6b', fontFamily: 'Courier New',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(y + 1);

            // Bounce
            this.tweens.add({
                targets: [g, label], y: `-=6`, duration: 700,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: i * 220
            });

            this.enemySprites.push({ enemy, sprite: g, label, col: enemy.position.col, row: enemy.position.row });
        });
    }

    // ── NPCs ─────────────────────────────────────────────────────────────

    _spawnNPCs() {
        this.npcList = [];
        NPC_DIALOGUES.forEach(npc => {
            const { x, y } = isoToScreen(npc.position.col, npc.position.row);
            const g = this.add.graphics();
            this._drawNPCSprite(g, npc.color);
            g.setPosition(x, y - 16).setDepth(y);

            const label = this.add.text(x, y - 42, npc.name, {
                fontSize: '9px', color: '#a8dadc', fontFamily: 'Courier New',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(y + 1);

            this.npcList.push({ npc, sprite: g, label, col: npc.position.col, row: npc.position.row });
        });
    }

    // ── PLAYER ───────────────────────────────────────────────────────────

    _createPlayer() {
        this.playerCol = 1;
        this.playerRow = 1;
        const { x, y } = isoToScreen(this.playerCol, this.playerRow);

        this.playerSprite = this.add.graphics();
        this._drawPlayerSprite(this.playerSprite);
        this.playerSprite.setPosition(x, y - 16).setDepth(500);

        // Shadow under player
        this.playerShadow = this.add.ellipse(x, y + TILE_H / 2 - 4, 28, 10, 0x000000, 0.25).setDepth(499);

        // Arrow
        this.playerArrow = this.add.text(x, y - 50, '▼', {
            fontSize: '14px', color: '#ffd166', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(501);
        this.tweens.add({ targets: this.playerArrow, y: '+=7', duration: 480, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    _drawPlayerSprite(g) {
        g.clear();
        const { characterId } = PlayerState.get();
        const { data, palette } = getPlayerSprite(characterId || 'assidu');
        drawPixelSprite(g, data, palette, 2, -8 * 2, -16 * 2);
    }

    _drawEnemySprite(g, enemyId) {
        g.clear();
        const { data, palette } = getEnemySprite(enemyId);
        drawPixelSprite(g, data, palette, 2, -8 * 2, -16 * 2);
    }

    _drawNPCSprite(g, tintColor) {
        g.clear();
        const palette = [0xffd166, tintColor, Math.floor(tintColor * 0.6), 0x0a1a0a];
        drawPixelSprite(g, NPC_SPRITE, palette, 2, -8 * 2, -16 * 2);
    }

    // ── MOVEMENT HIGHLIGHTS ──────────────────────────────────────────────

    _createHighlights() {
        this.highlightGraphics = [];
        for (let i = 0; i < 4; i++) {
            const g = this.add.graphics().setDepth(50);
            this.highlightGraphics.push(g);
        }
    }

    _updateMovementHighlights() {
        const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
        dirs.forEach(([dc, dr], i) => {
            const nc = this.playerCol + dc;
            const nr = this.playerRow + dr;
            const g  = this.highlightGraphics[i];
            g.clear();

            if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) return;
            if (MAP[nr][nc] === 1) return;

            const { x, y } = isoToScreen(nc, nr);
            const hw = TILE_W / 2;
            const hh = TILE_H / 2;

            g.fillStyle(0xffffff, 0.10);
            g.fillPoints([
                { x, y },
                { x: x + hw, y: y + hh },
                { x, y: y + TILE_H },
                { x: x - hw, y: y + hh }
            ], true);
            g.lineStyle(1, 0xffffff, 0.30);
            g.strokePoints([
                { x, y },
                { x: x + hw, y: y + hh },
                { x, y: y + TILE_H },
                { x: x - hw, y: y + hh }
            ], true);
        });
    }

    // ── HUD ──────────────────────────────────────────────────────────────

    _createHUD() {
        const ps = PlayerState.get();
        this.hudContainer = this.add.container(10, 10).setDepth(200);

        const hudBg = this.add.rectangle(115, 55, 230, 100, 0x0a0a1a, 0.88).setStrokeStyle(1, 0x374151);
        this.hudRoleText = this.add.text(10, 10, ps.role || 'Héros', { fontSize: '12px', color: '#ffd166', fontFamily: 'Courier New' });
        this.hudLvlText  = this.add.text(10, 28, `Niv. ${ps.level}  XP: ${ps.xp}/${ps.level*50}`, { fontSize: '11px', color: '#9ca3af', fontFamily: 'Courier New' });
        this.hudHpLabel  = this.add.text(10, 46, `HP: ${ps.hp}/${ps.maxHp}`, { fontSize: '11px', color: '#ef4444', fontFamily: 'Courier New' });
        this.hudHpBg     = this.add.rectangle(120, 62, 150, 10, 0x1f2937);
        this.hudHpFill   = this.add.rectangle(45 + (ps.hp/ps.maxHp)*75, 62, (ps.hp/ps.maxHp)*150, 8, 0x22c55e);
        this.hudEnemyText= this.add.text(10, 76, `Obstacles: ${PlayerState.defeatedCount()}/${ENEMIES.length}`, { fontSize: '10px', color: '#6b7280', fontFamily: 'Courier New' });

        this.hudContainer.add([hudBg, this.hudRoleText, this.hudLvlText, this.hudHpLabel, this.hudHpBg, this.hudHpFill, this.hudEnemyText]);

        // Controls hint — bottom left
        this.add.text(10, 742, '↑↓←→ : déplacer   ESPACE : interagir', {
            fontSize: '11px', color: '#374151', fontFamily: 'Courier New'
        }).setDepth(200);
    }

    _updateHUD() {
        const ps = PlayerState.get();
        this.hudLvlText.setText(`Niv. ${ps.level}  XP: ${ps.xp}/${ps.level*50}`);
        this.hudHpLabel.setText(`HP: ${ps.hp}/${ps.maxHp}`);
        const ratio = ps.hp / ps.maxHp;
        this.hudHpFill.width = Math.max(2, ratio * 150);
        this.hudHpFill.x = 45 + ratio * 75;
        this.hudHpFill.setFillStyle(ratio > 0.5 ? 0x22c55e : ratio > 0.25 ? 0xf59e0b : 0xef4444);
        this.hudEnemyText.setText(`Obstacles: ${PlayerState.defeatedCount()}/${ENEMIES.length}`);
    }

    // ── MOVEMENT ─────────────────────────────────────────────────────────

    _isWalkable(col, row) {
        if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return false;
        return MAP[row][col] !== 1;
    }

    _movePlayer(dc, dr) {
        const nc = this.playerCol + dc;
        const nr = this.playerRow + dr;
        if (!this._isWalkable(nc, nr)) return;

        this.playerCol = nc;
        this.playerRow = nr;
        const { x, y } = isoToScreen(nc, nr);

        this.tweens.add({
            targets: [this.playerSprite, this.playerArrow],
            x,
            y: (t) => t === this.playerSprite ? y - 16 : y - 50,
            duration: 110,
            ease: 'Linear',
            onComplete: () => {
                this.playerSprite.setDepth(y);
                this.playerShadow.setPosition(x, y + TILE_H / 2 - 4);
                this._updateMovementHighlights();
                this._checkTileInteraction();
            }
        });
    }

    // ── INTERACTIONS ─────────────────────────────────────────────────────

    _checkTileInteraction() {
        const type = MAP[this.playerRow][this.playerCol];

        // Portal / finish
        if (type === 6) {
            if (PlayerState.defeatedCount() < ENEMIES.length) {
                this.dialog.show([{ speaker: 'Portail', text: `Il reste des obstacles sur le chemin ! Bats-les tous d'abord. (${PlayerState.defeatedCount()}/${ENEMIES.length})` }]);
                return;
            }
            this.time.delayedCall(400, () => this._showVictory());
            return;
        }

        // Enemy collision
        for (let i = 0; i < this.enemySprites.length; i++) {
            const es = this.enemySprites[i];
            if (es.col === this.playerCol && es.row === this.playerRow) {
                this._startBattle(es.enemy, i);
                return;
            }
        }
    }

    _onInteract() {
        if (this.dialog.isOpen) {
            this.dialog.advance();
            return;
        }

        const adj = [
            [this.playerCol,   this.playerRow],
            [this.playerCol+1, this.playerRow],
            [this.playerCol-1, this.playerRow],
            [this.playerCol,   this.playerRow+1],
            [this.playerCol,   this.playerRow-1]
        ];

        for (const npcData of this.npcList) {
            for (const [c, r] of adj) {
                if (npcData.col === c && npcData.row === r) {
                    const lines = npcData.npc.lines.map(l => ({ speaker: npcData.npc.name, text: l }));
                    this.dialog.show(lines);
                    return;
                }
            }
        }
    }

    _startBattle(enemy, spriteIndex) {
        const es = this.enemySprites[spriteIndex];
        es.sprite.destroy();
        es.label.destroy();
        this.enemySprites.splice(spriteIndex, 1);

        this.dialog.show(
            [{ speaker: enemy.name, text: enemy.dialogBefore }],
            () => {
                const ps = PlayerState.get();
                this.scene.start('BattleScene', {
                    characterId: ps.characterId,
                    enemyId: enemy.id,
                    playerHP: ps.hp,
                    playerMaxHP: ps.maxHp,
                    level: ps.level
                });
            }
        );
    }

    // ── VICTORY ──────────────────────────────────────────────────────────

    _showVictory() {
        const { width, height } = this.cameras.main;
        const cx = width / 2, cy = height / 2;

        this.add.rectangle(cx, cy, width, height, 0x080818, 0.88).setDepth(300);

        this.add.text(cx, cy - 80, '🎮 LA SOIRÉE EST LANCÉE !', {
            fontSize: '32px', color: '#ffd166', fontFamily: 'Courier New', stroke: '#f72585', strokeThickness: 3
        }).setOrigin(0.5).setDepth(301);

        this.add.text(cx, cy - 35, 'Tout le monde est connecté à 21h00 !', {
            fontSize: '18px', color: '#ffffff', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(301);

        const ps = PlayerState.get();
        this.add.text(cx, cy + 5, `Niveau final : ${ps.level}  •  XP total : ${ps.xp}`, {
            fontSize: '14px', color: '#9ca3af', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(301);

        this.add.text(cx, cy + 32, 'Au programme ce soir :', {
            fontSize: '13px', color: '#6b7280', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(301);

        this.add.text(cx, cy + 54, 'Fall Guys  •  Pummel Party  •  Golf With Your Friends', {
            fontSize: '13px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(301);

        const btn = this.add.text(cx, cy + 100, '▶ REJOUER', {
            fontSize: '20px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(301).setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setColor('#ffffff'));
        btn.on('pointerout',  () => btn.setColor('#4fc3f7'));
        btn.on('pointerdown', () => { PlayerState.reset(); this.scene.start('IntroScene'); });
    }

    // ── UPDATE ───────────────────────────────────────────────────────────

    update(time, delta) {
        if (this.dialog.isOpen) return;

        this.moveDelay -= delta;
        if (this.moveDelay > 0) return;

        const left  = this.cursors.left.isDown  || this.wasd.left.isDown;
        const right = this.cursors.right.isDown || this.wasd.right.isDown;
        const up    = this.cursors.up.isDown    || this.wasd.up.isDown;
        const down  = this.cursors.down.isDown  || this.wasd.down.isDown;

        if      (left)  { this._movePlayer(-1, 0); this.moveDelay = 145; }
        else if (right) { this._movePlayer(1,  0); this.moveDelay = 145; }
        else if (up)    { this._movePlayer(0, -1); this.moveDelay = 145; }
        else if (down)  { this._movePlayer(0,  1); this.moveDelay = 145; }
    }
}
