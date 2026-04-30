import { Scene, Math as PhaserMath } from 'phaser';
import { EventBus } from '../EventBus';
import { CHARACTERS } from '../CharacterData';
import { ENEMIES } from '../EnemiesData';
import { SKILLS, getTypeMultiplier } from '../SkillsData';
import { PlayerState } from '../PlayerState';
import { drawPixelSprite, getPlayerSprite, getEnemySprite } from '../SpriteData';

const SPRITE_SCALE = 6;
const SPRITE_H = 16 * SPRITE_SCALE; // 96px

export class BattleScene extends Scene
{
    constructor () { super('BattleScene'); }

    init (data)
    {
        this.characterId = data.characterId || 'assidu';
        this.enemyId = data.enemyId || 'flemme_vendredi';
        this.character = CHARACTERS[this.characterId];
        this.enemy = ENEMIES.find(e => e.id === this.enemyId);
        this.playerHP = data.playerHP ?? this.character.stats.maxHp;
        this.playerMaxHP = data.playerMaxHP ?? this.character.stats.maxHp;
        this.level = data.level ?? 1;
        this.enemyCurrentHP = this.enemy.maxHp;
        this.isPlayerTurn = true;
        this.actionLocked = false;
        this.skillMenuOpen = false;
        this.exposedBonus = false;
        this.boostMult = 1;
    }

    create ()
    {
        const { width, height } = this.cameras.main;
        const cx = width / 2;

        const theme = this._getBattleTheme();
        this.add.rectangle(cx, height / 2, width, height, theme.bg);
        this._drawBattleBackground(width, height, theme);

        // Sprites — bigger scale
        this.playerGroup = this._createCharacterDisplay(220, 430, this.character, false);
        this.enemyGroup  = this._createCharacterDisplay(780, 270, this.enemy, true);

        // HP bars above each character's head
        this.playerHPBar = this._createHPBar(220, 430 - SPRITE_H - 28, this.playerHP, this.playerMaxHP, `${this.character.name}  Lv.${this.level}`, 0x22c55e);
        this.enemyHPBar  = this._createHPBar(780, 270 - SPRITE_H - 28, this.enemyCurrentHP, this.enemy.maxHp, this.enemy.name, 0xef4444);

        // Battle log
        this.battleLogBg = this.add.rectangle(cx, height - 205, width - 20, 50, 0x0d1b2a, 0.9).setStrokeStyle(1, 0x374151);
        this.battleLog = this.add.text(20, height - 222, '', {
            fontSize: '13px', color: '#d1d5db', fontFamily: 'Courier New',
            wordWrap: { width: width - 40 }
        });

        this.add.rectangle(cx, height - 90, width - 20, 150, 0x0d1b2a, 0.9).setStrokeStyle(1, 0x374151);

        this._buildActionMenu();
        this._log(`💬 ${this.enemy.name}: "${this.enemy.dialogBefore.substring(0, 60)}..."`);

        EventBus.emit('current-scene-ready', this);
    }

    _getBattleTheme () {
        const themes = {
            flemme_vendredi:        { bg: 0x080814, grid: 0x4b5563, accent: 0x6b7280, tint: 0x374151 },
            netflix_endormant:      { bg: 0x120006, grid: 0x7f1d1d, accent: 0xe50914, tint: 0x450a0a },
            retardataire_chronique: { bg: 0x0e0a00, grid: 0x78350f, accent: 0xb45309, tint: 0x3d2000 },
        };
        return themes[this.enemyId] || { bg: 0x080818, grid: 0x1f2937, accent: 0x374151, tint: 0x0a0a1a };
    }

    _drawBattleBackground (width, height, theme) {
        this.add.rectangle(width / 2, 240, width, 480, theme.tint, 0.35);

        const g = this.add.graphics();
        g.lineStyle(1, theme.grid, 0.3);
        for (let i = 0; i < width; i += 40) g.lineBetween(i, 0, i, 480);
        for (let j = 0; j < 480; j += 40) g.lineBetween(0, j, width, j);

        g.lineStyle(2, theme.accent, 0.9);
        g.lineBetween(0, 480, width, 480);

        if (this.enemyId === 'flemme_vendredi')        this._drawFlemmeBg(width);
        else if (this.enemyId === 'netflix_endormant') this._drawNetflixBg(width);
        else if (this.enemyId === 'retardataire_chronique') this._drawRetardBg(width);
    }

    // ── Flemme: floating Zzz's + dim sofa outline ──────────────────────────────
    _drawFlemmeBg (width) {
        // Faint couch silhouette behind enemy
        const cg = this.add.graphics().setDepth(0).setAlpha(0.06);
        cg.fillStyle(0x6b7280, 1);
        cg.fillRoundedRect(550, 340, 320, 80, 16);
        cg.fillRoundedRect(540, 280, 40, 120, 8);
        cg.fillRoundedRect(830, 280, 40, 120, 8);
        cg.fillRoundedRect(550, 280, 320, 30, 8);

        const zPool = ['z', 'Z', 'z z', 'Z Z'];
        const spawnZ = () => {
            if (!this.scene.isActive('BattleScene')) return;
            const x = PhaserMath.Between(480, width - 60);
            const z = this.add.text(x, 370, zPool[PhaserMath.Between(0, zPool.length - 1)], {
                fontSize: `${PhaserMath.Between(14, 26)}px`,
                color: '#6b7280',
                fontFamily: 'Courier New',
            }).setDepth(2).setAlpha(0);
            this.tweens.add({
                targets: z,
                y: z.y - 130,
                alpha: { from: 0.65, to: 0 },
                duration: 3200 + PhaserMath.Between(0, 1800),
                ease: 'Sine.easeOut',
                onComplete: () => z.destroy(),
            });
        };
        this.time.addEvent({ delay: 900, callback: spawnZ, loop: true });
        spawnZ();
    }

    // ── Netflix: scanlines + giant N glow + autoplay bar ───────────────────────
    _drawNetflixBg (width) {
        // Scanlines
        const sl = this.add.graphics().setDepth(1).setAlpha(0.12);
        sl.fillStyle(0x000000, 1);
        for (let y = 0; y < 480; y += 4) sl.fillRect(0, y, width, 2);

        // Giant N in background
        const nLetter = this.add.text(width / 2, 210, 'N', {
            fontSize: '260px',
            color: '#e50914',
            fontFamily: 'Arial Black',
        }).setOrigin(0.5).setDepth(0).setAlpha(0.06);

        this.tweens.add({
            targets: nLetter,
            alpha: { from: 0.04, to: 0.12 },
            duration: 1400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Autoplay progress bar at battle divider
        this.add.rectangle(width / 2, 476, width, 6, 0x7f1d1d, 0.9).setDepth(3);
        const progFill = this.add.rectangle(0, 476, 4, 6, 0xe50914, 1).setOrigin(0, 0.5).setDepth(4);
        this.tweens.add({
            targets: progFill,
            width: width,
            duration: 9000,
            ease: 'Linear',
            repeat: -1,
        });

        // Occasional screen flicker
        const flickerOverlay = this.add.rectangle(width / 2, 240, width, 480, 0xff0000, 0).setDepth(5);
        const flicker = () => {
            if (!this.scene.isActive('BattleScene')) return;
            this.tweens.add({
                targets: flickerOverlay,
                alpha: { from: 0.08, to: 0 },
                duration: 80,
                ease: 'Linear',
            });
        };
        this.time.addEvent({ delay: PhaserMath.Between(3000, 6000), callback: flicker, loop: true });
    }

    // ── Retard: animated clock + flying alarm clocks ───────────────────────────
    _drawRetardBg (width) {
        const cx = width / 2;
        const cy = 210;
        const R = 160;

        // Static clock face
        const clockG = this.add.graphics().setDepth(0).setAlpha(0.1);
        clockG.lineStyle(4, 0xb45309, 1);
        clockG.strokeCircle(cx, cy, R);
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const isMajor = i % 3 === 0;
            const r1 = R;
            const r2 = isMajor ? R - 22 : R - 12;
            clockG.lineBetween(
                cx + Math.cos(a) * r2, cy + Math.sin(a) * r2,
                cx + Math.cos(a) * r1, cy + Math.sin(a) * r1,
            );
        }

        // Animated hands
        const handG = this.add.graphics().setDepth(1).setAlpha(0.18);
        let minuteAngle = -Math.PI / 2;
        let hourAngle   = -Math.PI / 2 + Math.PI / 6;
        const drawHands = () => {
            if (!this.scene.isActive('BattleScene')) return;
            handG.clear();
            handG.lineStyle(3, 0xb45309, 1);
            handG.lineBetween(cx, cy, cx + Math.cos(minuteAngle) * (R - 20), cy + Math.sin(minuteAngle) * (R - 20));
            handG.lineStyle(5, 0xf59e0b, 1);
            handG.lineBetween(cx, cy, cx + Math.cos(hourAngle) * (R - 50), cy + Math.sin(hourAngle) * (R - 50));
            minuteAngle += 0.018;
            hourAngle   += 0.0015;
        };
        this.time.addEvent({ delay: 40, callback: drawHands, loop: true });
        drawHands();

        // Floating alarm clocks
        const spawnAlarm = () => {
            if (!this.scene.isActive('BattleScene')) return;
            const x = PhaserMath.Between(60, width - 60);
            const alarm = this.add.text(x, 400, '⏰', { fontSize: '18px' }).setDepth(2).setAlpha(0);
            this.tweens.add({
                targets: alarm,
                y: alarm.y - 100,
                alpha: { from: 0.75, to: 0 },
                duration: 2200,
                ease: 'Sine.easeOut',
                onComplete: () => alarm.destroy(),
            });
        };
        this.time.addEvent({ delay: 1600, callback: spawnAlarm, loop: true });
    }

    _createCharacterDisplay (x, y, entity, isEnemy) {
        const container = this.add.container(x, y);
        const g = this.add.graphics();

        if (isEnemy) {
            this._drawBigEnemySprite(g, entity.color);
        } else {
            this._drawBigPlayerSprite(g, this.character.color);
        }

        const shadow = this.add.ellipse(0, 35, 110, 26, 0x000000, 0.3);
        container.add(shadow);
        container.add(g);

        this.tweens.add({
            targets: container,
            y: y - 10,
            duration: 1600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        return container;
    }

    _drawBigPlayerSprite (g, _color) {
        const { data, palette } = getPlayerSprite(this.characterId);
        drawPixelSprite(g, data, palette, SPRITE_SCALE, -8 * SPRITE_SCALE, -16 * SPRITE_SCALE);
    }

    _drawBigEnemySprite (g, _color) {
        const { data, palette } = getEnemySprite(this.enemyId);
        drawPixelSprite(g, data, palette, SPRITE_SCALE, -8 * SPRITE_SCALE, -16 * SPRITE_SCALE);
    }

    _createHPBar (cx, y, hp, maxHp, label, color) {
        const BAR_W = 210;
        const container = this.add.container(cx, y).setDepth(20);

        const nameBgW = Math.min(label.length * 7 + 20, 240);
        const nameBg = this.add.rectangle(0, -8, nameBgW, 20, 0x000000, 0.82);
        const nameTxt = this.add.text(0, -16, label, {
            fontSize: '12px', color: '#e5e7eb', fontFamily: 'Courier New',
        }).setOrigin(0.5, 0);

        const trackBg = this.add.rectangle(0, 6, BAR_W, 12, 0x1f2937);
        const fillW = Math.max(2, (hp / maxHp) * BAR_W);
        const fill = this.add.rectangle(-BAR_W / 2 + fillW / 2, 6, fillW, 10, color);

        const hpTxt = this.add.text(0, 14, `${hp} / ${maxHp}`, {
            fontSize: '10px', color: '#9ca3af', fontFamily: 'Courier New',
        }).setOrigin(0.5, 0);

        container.add([nameBg, nameTxt, trackBg, fill, hpTxt]);
        container._hpTxt = hpTxt;
        container._fill  = fill;
        container._maxHp = maxHp;
        container._color = color;
        container._label = nameTxt;
        container._barW  = BAR_W;

        return container;
    }

    _updateHPBar (bar, hp, maxHp) {
        const ratio  = Math.max(0, hp / maxHp);
        const barW   = bar._barW || 210;
        const newW   = Math.max(2, ratio * barW);
        bar._hpTxt.setText(`${Math.max(0, hp)} / ${maxHp}`);
        bar._fill.width = newW;
        bar._fill.x     = -barW / 2 + newW / 2;
        const color = ratio > 0.5 ? bar._color : ratio > 0.25 ? 0xf59e0b : 0xef4444;
        bar._fill.setFillStyle(color);
    }

    _buildActionMenu () {
        const { width, height } = this.cameras.main;
        this.menuContainer = this.add.container(0, 0).setDepth(50);

        const skills = (CHARACTERS[this.characterId]?.skills || []).map(id => SKILLS[id]).filter(Boolean);

        const buttons = [];
        const actions = [
            ...skills.map(sk => ({ label: `${sk.emoji} ${sk.name}`, skillId: sk.id })),
            { label: '🏃 Fuir', skillId: null }
        ];

        actions.forEach((action, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const bx = 20 + col * 220;
            const by = height - 155 + row * 34;

            const btn = this.add.text(bx, by, action.label, {
                fontSize: '13px', color: '#e5e7eb', fontFamily: 'Courier New',
                backgroundColor: '#0d1b2a', padding: { x: 8, y: 4 }
            }).setInteractive({ useHandCursor: true });

            btn.on('pointerover', () => btn.setColor('#4fc3f7'));
            btn.on('pointerout', () => btn.setColor('#e5e7eb'));
            btn.on('pointerdown', () => {
                if (!this.isPlayerTurn || this.actionLocked) return;
                if (action.skillId === null) {
                    this._flee();
                } else {
                    this._playerAttack(SKILLS[action.skillId]);
                }
            });

            this.menuContainer.add(btn);
            buttons.push(btn);
        });

        this._menuButtons = buttons;
    }

    _log (text) { this.battleLog.setText(text); }

    _lockActions () {
        this.actionLocked = true;
        this._menuButtons.forEach(b => b.setColor('#374151'));
    }

    _unlockActions () {
        this.actionLocked = false;
        this.isPlayerTurn = true;
        this._menuButtons.forEach(b => b.setColor('#e5e7eb'));
    }

    _playerAttack (skill) {
        if (!skill) return;
        this._lockActions();
        this.isPlayerTurn = false;

        const typeMult  = getTypeMultiplier(skill.type, this.enemy.type);
        const exposeMult = this.exposedBonus ? 1.2 : 1;
        const rawDmg    = Math.round(skill.damage * typeMult * exposeMult * this.boostMult);
        this.exposedBonus = false;

        if (skill.heal)   { this.playerHP = Math.min(this.playerMaxHP, this.playerHP + skill.heal); this._updateHPBar(this.playerHPBar, this.playerHP, this.playerMaxHP); }
        if (skill.expose) { this.exposedBonus = true; }
        if (skill.boost)  { this.boostMult = 1.3; }

        this.enemyCurrentHP -= rawDmg;
        this._updateHPBar(this.enemyHPBar, this.enemyCurrentHP, this.enemy.maxHp);

        const effLabel = typeMult >= 1.5 ? ' 🔥 SUPER EFFICACE !' : typeMult <= 0.5 ? ' 😴 Peu efficace...' : '';
        this._log(`${skill.emoji} ${skill.name} inflige ${rawDmg} dégâts !${effLabel}`);

        this.tweens.add({ targets: this.enemyGroup, alpha: { from: 1, to: 0.2 }, duration: 80, yoyo: true, repeat: 2 });

        if (this.enemyCurrentHP <= 0) { this.time.delayedCall(600, () => this._victory()); return; }
        this.time.delayedCall(900, () => this._enemyAttack());
    }

    _enemyAttack () {
        const attacks = this.enemy.attacks;
        const attack  = attacks[PhaserMath.Between(0, attacks.length - 1)];
        const dmg     = attack.damage + Math.round(Math.random() * 3);

        this.playerHP -= dmg;
        this._updateHPBar(this.playerHPBar, this.playerHP, this.playerMaxHP);
        this._log(`${this.enemy.name} utilise ${attack.name} ! ${dmg} dégâts.`);

        this.tweens.add({ targets: this.playerGroup, alpha: { from: 1, to: 0.2 }, duration: 80, yoyo: true, repeat: 2 });

        if (this.playerHP <= 0) { this.time.delayedCall(600, () => this._defeat()); return; }
        this.time.delayedCall(700, () => this._unlockActions());
    }

    _victory () {
        PlayerState.setHP(this.playerHP);
        const leveled = PlayerState.gainXP(this.enemy.xpReward);
        PlayerState.defeatEnemy(this.enemyId);
        PlayerState.save();

        this._log(`Victoire ! +${this.enemy.xpReward} XP. ${leveled ? '⬆ NIVEAU SUPÉRIEUR !' : ''}`);

        const { width, height } = this.cameras.main;
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0).setDepth(200);
        const txt = this.add.text(width / 2, height / 2, `VICTOIRE !\n+${this.enemy.xpReward} XP${leveled ? '\n⬆ Niveau supérieur !' : ''}`, {
            fontSize: '32px', color: '#ffd166', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5).setAlpha(0).setDepth(201);

        this.add.text(width / 2, height / 2 + 80, this.enemy.dialogAfter, {
            fontSize: '14px', color: '#9ca3af', fontFamily: 'Courier New', align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5).setAlpha(0.8).setDepth(201);

        this.tweens.add({ targets: overlay, alpha: 0.7, duration: 400 });
        this.tweens.add({ targets: txt,     alpha: 1,   duration: 400, delay: 200 });

        this.time.delayedCall(2500, () => {
            this.registry.set('battleResult', 'victory');
            this.scene.start('WorldScene', { characterId: this.characterId });
        });
    }

    _defeat () {
        const { width, height } = this.cameras.main;
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0).setDepth(200);
        const txt = this.add.text(width / 2, height / 2, 'DÉFAITE...', {
            fontSize: '40px', color: '#ef4444', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0).setDepth(201);

        this.tweens.add({ targets: overlay, alpha: 0.8, duration: 400 });
        this.tweens.add({ targets: txt,     alpha: 1,   duration: 400, delay: 200 });

        this.time.delayedCall(2500, () => { PlayerState.reset(); this.scene.start('IntroScene'); });
    }

    _flee () {
        PlayerState.setHP(this.playerHP);
        PlayerState.save();
        this._log('Tu fuis... La flemme gagne ce soir.');
        this.time.delayedCall(1000, () => { this.scene.start('WorldScene', { characterId: this.characterId }); });
    }
}
