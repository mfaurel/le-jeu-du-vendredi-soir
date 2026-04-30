import { Scene, Math as PhaserMath } from 'phaser';
import { EventBus } from '../EventBus';

export class IntroScene extends Scene
{
    constructor () { super('IntroScene'); }

    create ()
    {
        const { width, height } = this.cameras.main;
        const cx = width / 2;
        const cy = height / 2;

        // Starfield background
        this.add.rectangle(cx, cy, width, height, 0x080818);
        this._createStars(width, height);

        // Decorative lines
        this.add.rectangle(cx, 90, width * 0.8, 2, 0x4fc3f7, 0.5);
        this.add.rectangle(cx, height - 90, width * 0.8, 2, 0x4fc3f7, 0.5);

        // Label
        this.add.text(cx, 60, '▸ VENDREDI SOIR — 21H00 ◂', {
            fontSize: '14px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Main title
        const title = this.add.text(cx, cy - 80, 'LE JEU DU\nVENDREDI SOIR', {
            fontSize: '48px', color: '#ffd166',
            fontFamily: 'Courier New',
            stroke: '#f72585', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);

        // Subtitle
        const subtitle = this.add.text(cx, cy - 10, 'Pouvoir jouer à la soirée', {
            fontSize: '20px', color: '#a8dadc', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        // Tagline
        const tagline = this.add.text(cx, cy + 25, 'RPG 2D isométrique • Combat au tour par tour • Discord & Amis', {
            fontSize: '13px', color: '#6b7280', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        // Start button
        const btnBg = this.add.rectangle(cx, cy + 90, 260, 46, 0x4fc3f7, 0).setStrokeStyle(2, 0x4fc3f7);
        const btnText = this.add.text(cx, cy + 90, '▶  COMMENCER', {
            fontSize: '22px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        btnBg.setInteractive({ useHandCursor: true });
        btnBg.on('pointerover', () => { btnBg.setFillStyle(0x4fc3f7, 0.15); btnText.setColor('#ffffff'); });
        btnBg.on('pointerout', () => { btnBg.setFillStyle(0x4fc3f7, 0); btnText.setColor('#4fc3f7'); });
        btnBg.on('pointerdown', () => this.scene.start('StarterScene'));

        // Space key shortcut
        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('StarterScene'));
        this.input.keyboard.once('keydown-ENTER', () => this.scene.start('StarterScene'));

        // Fade-in sequence
        this.tweens.add({ targets: title, alpha: 1, duration: 800, delay: 200 });
        this.tweens.add({ targets: subtitle, alpha: 1, duration: 600, delay: 700 });
        this.tweens.add({ targets: tagline, alpha: 1, duration: 600, delay: 1000 });
        this.tweens.add({ targets: [btnBg, btnText], alpha: 1, duration: 600, delay: 1300 });

        // Pulse the title
        this.tweens.add({
            targets: title,
            scaleX: { from: 1, to: 1.02 },
            scaleY: { from: 1, to: 1.02 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            delay: 2000,
            ease: 'Sine.easeInOut'
        });

        EventBus.emit('current-scene-ready', this);
    }

    _createStars(width, height) {
        for (let i = 0; i < 80; i++) {
            const x = PhaserMath.Between(0, width);
            const y = PhaserMath.Between(0, height);
            const size = PhaserMath.FloatBetween(0.5, 2);
            const alpha = PhaserMath.FloatBetween(0.3, 0.9);
            const star = this.add.circle(x, y, size, 0xffffff).setAlpha(alpha);
            // Twinkle
            this.tweens.add({
                targets: star,
                alpha: { from: alpha, to: alpha * 0.2 },
                duration: PhaserMath.Between(800, 3000),
                yoyo: true,
                repeat: -1,
                delay: PhaserMath.Between(0, 2000)
            });
        }
    }
}

