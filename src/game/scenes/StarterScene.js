import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { CHARACTER_LIST } from '../CharacterData';
import { PlayerState } from '../PlayerState';
import { drawPixelSprite, getPlayerSprite } from '../SpriteData';

const STAT_LABELS = ['motivation', 'ponctualite', 'fun', 'charisme'];
const STAT_COLORS = { motivation: 0xf89820, ponctualite: 0x4a90d9, fun: 0xa855f7, charisme: 0x2dc653 };

export class StarterScene extends Scene
{
    constructor () { super('StarterScene'); }

    create ()
    {
        const { width, height } = this.cameras.main;
        const cx = width / 2;

        // Background
        this.add.rectangle(cx, height / 2, width, height, 0x080818);

        // Header
        this.add.rectangle(cx, 50, width, 80, 0x0d1b2a);
        this.add.text(cx, 30, 'QUI ES-TU CE VENDREDI SOIR ?', {
            fontSize: '22px', color: '#ffd166', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.add.text(cx, 58, 'Ton profil définit tes stats et tes compétences de départ', {
            fontSize: '13px', color: '#6b7280', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Render 3 character cards
        const cardWidth = 280;
        const cardHeight = 420;
        const spacing = 330;
        const startX = cx - spacing;
        const cardY = height / 2 + 40;

        CHARACTER_LIST.forEach((char, i) => {
            this._createCard(startX + i * spacing, cardY, cardWidth, cardHeight, char, i);
        });

        // Back hint
        this.add.text(cx, height - 20, '← BACK to return', {
            fontSize: '12px', color: '#374151', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.input.keyboard.once('keydown-ESC', () => this.scene.start('IntroScene'));

        EventBus.emit('current-scene-ready', this);
    }

    _createCard(x, y, w, h, char, cardIndex)
    {
        const container = this.add.container(x, y);

        // Card background
        const bg = this.add.rectangle(0, 0, w, h, 0x0d1b2a).setStrokeStyle(2, 0x2d3748);
        container.add(bg);

        // Color accent bar at top
        const bar = this.add.rectangle(0, -h / 2 + 4, w, 6, char.color);
        container.add(bar);

        // Character sprite (programmatic)
        const sprite = this._makeCharSprite(char.id);
        sprite.setPosition(0, -h / 2 + 50);
        container.add(sprite);

        // Name
        const nameText = this.add.text(0, -h / 2 + 95, char.name, {
            fontSize: '16px', color: '#ffffff', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        container.add(nameText);

        // Subtitle
        const subText = this.add.text(0, -h / 2 + 118, char.subtitle, {
            fontSize: '11px', color: '#9ca3af', fontFamily: 'Courier New',
            wordWrap: { width: w - 20 }, align: 'center'
        }).setOrigin(0.5);
        container.add(subText);

        // Description
        const desc = this.add.text(0, -h / 2 + 158, char.description, {
            fontSize: '11px', color: '#d1d5db', fontFamily: 'Courier New',
            wordWrap: { width: w - 24 }, align: 'center'
        }).setOrigin(0.5);
        container.add(desc);

        // Stats bars
        STAT_LABELS.forEach((stat, si) => {
            const statY = -h / 2 + 220 + si * 28;
            const val = char.stats[stat];
            const barColor = STAT_COLORS[stat];

            const label = this.add.text(-w / 2 + 12, statY - 6, stat.toUpperCase(), {
                fontSize: '10px', color: '#9ca3af', fontFamily: 'Courier New'
            });
            container.add(label);

            const trackBg = this.add.rectangle(w / 2 - 70, statY - 6, 100, 10, 0x1f2937);
            const fill = this.add.rectangle(w / 2 - 120 + (val / 10) * 50, statY - 6, (val / 10) * 100, 8, barColor);
            container.add(trackBg);
            container.add(fill);

            const valText = this.add.text(w / 2 - 12, statY - 6, `${val}/10`, {
                fontSize: '9px', color: '#6b7280', fontFamily: 'Courier New'
            }).setOrigin(1, 0.5);
            container.add(valText);
        });

        // Skills header
        const skillHeader = this.add.text(0, h / 2 - 100, '⚔ COMPÉTENCES DE DÉPART', {
            fontSize: '10px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        container.add(skillHeader);

        // Skills list (compact)
        char.skills.forEach((skillId, si) => {
            const skillText = this.add.text(0, h / 2 - 82 + si * 16, `• ${skillId.replace(/_/g, ' ')}`, {
                fontSize: '10px', color: '#d1d5db', fontFamily: 'Courier New'
            }).setOrigin(0.5);
            container.add(skillText);
        });

        // Select button
        const selBg = this.add.rectangle(0, h / 2 - 22, w - 20, 36, 0x4fc3f7, 0).setStrokeStyle(2, 0x4fc3f7);
        const selText = this.add.text(0, h / 2 - 22, 'CHOISIR', {
            fontSize: '16px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5);
        container.add(selBg);
        container.add(selText);

        selBg.setInteractive({ useHandCursor: true });
        selBg.on('pointerover', () => {
            bg.setStrokeStyle(2, char.color);
            selBg.setFillStyle(0x4fc3f7, 0.2);
            selText.setColor('#ffffff');
            bar.setFillStyle(char.color, 1);
        });
        selBg.on('pointerout', () => {
            bg.setStrokeStyle(2, 0x2d3748);
            selBg.setFillStyle(0x4fc3f7, 0);
            selText.setColor('#4fc3f7');
        });
        selBg.on('pointerdown', () => {
            PlayerState.init(char);
            PlayerState.save();
            this.scene.start('WorldScene', { characterId: char.id });
        });

        // Entrance animation
        container.setAlpha(0).setY(y + 30);
        this.tweens.add({
            targets: container,
            alpha: 1,
            y,
            duration: 400,
            delay: cardIndex * 150 + 80,
            ease: 'Back.easeOut'
        });
    }

    _makeCharSprite(charId)
    {
        const g = this.add.graphics();
        const { data, palette } = getPlayerSprite(charId);
        const scale = 3;
        drawPixelSprite(g, data, palette, scale, -8 * scale, -16 * scale);
        return g;
    }
}

