import { Scene, Math as PhaserMath } from 'phaser';
import { EventBus } from '../EventBus';
import { CHARACTERS } from '../CharacterData';
import { ENEMIES } from '../EnemiesData';
import { SKILLS, getTypeMultiplier } from '../SkillsData';
import { PlayerState } from '../PlayerState';
import { drawPixelSprite, getPlayerSprite, getEnemySprite } from '../SpriteData';

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

        // Background
        const theme = this._getBattleTheme();
        this.add.rectangle(cx, height / 2, width, height, theme.bg);
        this._drawBattleBackground(width, height, theme);

        // Sprites
        this.playerGroup = this._createCharacterDisplay(220, 420, this.character, false);
        this.enemyGroup  = this._createCharacterDisplay(780, 260, this.enemy, true);

        // HP Bars
        this.playerHPBar = this._createHPBar(60, 520, this.playerHP, this.playerMaxHP, `${this.character.name}  Lv.${this.level}`, 0x22c55e);
        this.enemyHPBar  = this._createHPBar(540, 100, this.enemyCurrentHP, this.enemy.maxHp, this.enemy.name, 0xef4444);

        // Battle log — sits above the action panel
        this.battleLogBg = this.add.rectangle(cx, height - 205, width - 20, 50, 0x0d1b2a, 0.9).setStrokeStyle(1, 0x374151);
        this.battleLog = this.add.text(20, height - 222, '', {
            fontSize: '13px', color: '#d1d5db', fontFamily: 'Courier New',
            wordWrap: { width: width - 40 }
        });

        // Action panel background
        this.add.rectangle(cx, height - 90, width - 20, 150, 0x0d1b2a, 0.9).setStrokeStyle(1, 0x374151);

        // Menu
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
        // Tinted enemy-side overlay
        this.add.rectangle(width / 2, 240, width, 480, theme.tint, 0.5);

        // Grid lines tinted to enemy color
        const g = this.add.graphics();
        g.lineStyle(1, theme.grid, 0.4);
        for (let i = 0; i < width; i += 40) g.lineBetween(i, 0, i, 480);
        for (let j = 0; j < 480; j += 40) g.lineBetween(0, j, width, j);

        // Divider in accent color
        g.lineStyle(2, theme.accent, 0.9);
        g.lineBetween(0, 480, width, 480);
    }

    _createCharacterDisplay (x, y, entity, isEnemy) {
        const container = this.add.container(x, y);
        const g = this.add.graphics();

        if (isEnemy) {
            this._drawBigEnemySprite(g, entity.color);
        } else {
            this._drawBigPlayerSprite(g, this.character.color);
        }

        // Shadow
        const shadow = this.add.ellipse(0, 30, 80, 20, 0x000000, 0.3);
        container.add(shadow);
        container.add(g);

        this.tweens.add({
            targets: container,
            y: y - 8,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return container;
    }

    _drawBigPlayerSprite (g, _color) {
        const { data, palette } = getPlayerSprite(this.characterId);
        const scale = 4;
        drawPixelSprite(g, data, palette, scale, -8 * scale, -16 * scale);
    }

    _drawBigEnemySprite (g, _color) {
        const { data, palette } = getEnemySprite(this.enemyId);
        const scale = 4;
        drawPixelSprite(g, data, palette, scale, -8 * scale, -16 * scale);
    }

    _createHPBar (x, y, hp, maxHp, label, color) {
        const container = this.add.container(x, y);

        const nameBgW = Math.min(label.length * 8 + 24, 300);
        const nameBg = this.add.rectangle(nameBgW / 2 - 4, 8, nameBgW, 22, 0x000000, 0.75);

        const nameTxt = this.add.text(0, 0, label, {
            fontSize: '13px', color: '#e5e7eb', fontFamily: 'Courier New'
        });
        const hpTxt = this.add.text(0, 18, `HP: ${hp} / ${maxHp}`, {
            fontSize: '11px', color: '#9ca3af', fontFamily: 'Courier New'
        });
        const trackBg = this.add.rectangle(90, 12, 180, 12, 0x1f2937);
        const fill = this.add.rectangle(
            90 - 90 + (hp / maxHp) * 90, 12,
            Math.max(2, (hp / maxHp) * 180), 10, color
        );

        container.add([nameBg, nameTxt, hpTxt, trackBg, fill]);
        container._hpTxt = hpTxt;
        container._fill = fill;
        container._maxHp = maxHp;
        container._color = color;
        container._label = nameTxt;

        return container;
    }

    _updateHPBar (bar, hp, maxHp) {
        const ratio = Math.max(0, hp / maxHp);
        bar._hpTxt.setText(`HP: ${Math.max(0, hp)} / ${maxHp}`);
        bar._fill.width = Math.max(2, ratio * 180);
        bar._fill.x = 90 - 90 + ratio * 90;
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

    _log (text) {
        this.battleLog.setText(text);
    }

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

        const typeMult = getTypeMultiplier(skill.type, this.enemy.type);
        const exposeMult = this.exposedBonus ? 1.2 : 1;
        const rawDmg = Math.round(skill.damage * typeMult * exposeMult * this.boostMult);
        this.exposedBonus = false;

        // Handle special effects
        if (skill.heal) {
            this.playerHP = Math.min(this.playerMaxHP, this.playerHP + skill.heal);
            this._updateHPBar(this.playerHPBar, this.playerHP, this.playerMaxHP);
        }
        if (skill.expose) {
            this.exposedBonus = true;
        }
        if (skill.boost) {
            this.boostMult = 1.3;
        }

        this.enemyCurrentHP -= rawDmg;
        this._updateHPBar(this.enemyHPBar, this.enemyCurrentHP, this.enemy.maxHp);

        const effLabel = typeMult >= 1.5 ? ' 🔥 SUPER EFFICACE !' : typeMult <= 0.5 ? ' 😴 Peu efficace...' : '';
        this._log(`${skill.emoji} ${skill.name} inflige ${rawDmg} dégâts !${effLabel}`);

        // Flash enemy
        this.tweens.add({
            targets: this.enemyGroup,
            alpha: { from: 1, to: 0.2 },
            duration: 80,
            yoyo: true,
            repeat: 2
        });

        if (this.enemyCurrentHP <= 0) {
            this.time.delayedCall(600, () => this._victory());
            return;
        }

        this.time.delayedCall(900, () => this._enemyAttack());
    }

    _enemyAttack () {
        const attacks = this.enemy.attacks;
        const attack = attacks[PhaserMath.Between(0, attacks.length - 1)];
        const dmg = attack.damage + Math.round(Math.random() * 3);

        this.playerHP -= dmg;
        this._updateHPBar(this.playerHPBar, this.playerHP, this.playerMaxHP);
        this._log(`${this.enemy.name} utilise ${attack.name} ! ${dmg} dégâts.`);

        // Flash player
        this.tweens.add({
            targets: this.playerGroup,
            alpha: { from: 1, to: 0.2 },
            duration: 80,
            yoyo: true,
            repeat: 2
        });

        if (this.playerHP <= 0) {
            this.time.delayedCall(600, () => this._defeat());
            return;
        }

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

        this.tweens.add({ targets: overlay, alpha: 0.7, duration: 400, delay: 0 });
        this.tweens.add({ targets: txt, alpha: 1, duration: 400, delay: 200 });

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
        this.tweens.add({ targets: txt, alpha: 1, duration: 400, delay: 200 });

        this.time.delayedCall(2500, () => {
            PlayerState.reset();
            this.scene.start('IntroScene');
        });
    }

    _flee () {
        PlayerState.setHP(this.playerHP);
        PlayerState.save();
        this._log('Tu fuis... La flemme gagne ce soir.');
        this.time.delayedCall(1000, () => {
            this.scene.start('WorldScene', { characterId: this.characterId });
        });
    }
}

