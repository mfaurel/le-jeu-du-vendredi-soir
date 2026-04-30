import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        const { width, height } = this.cameras.main;
        const cx = width / 2;
        const cy = height / 2;

        this.cameras.main.setBackgroundColor(0x0a0a1a);

        this.add.text(cx, cy - 60, '😴 SOIRÉE RATÉE', {
            fontFamily: 'Courier New', fontSize: '48px', color: '#ef4444',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(cx, cy, 'La flemme a eu le dernier mot...', {
            fontFamily: 'Courier New', fontSize: '20px', color: '#9ca3af',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(cx, cy + 50, 'Prochain vendredi, peut-être ?', {
            fontFamily: 'Courier New', fontSize: '16px', color: '#6b7280',
        }).setOrigin(0.5);

        const btn = this.add.text(cx, cy + 120, '▶ RÉESSAYER', {
            fontFamily: 'Courier New', fontSize: '22px', color: '#4fc3f7'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#ffffff'));
        btn.on('pointerout',  () => btn.setColor('#4fc3f7'));
        btn.on('pointerdown', () => this.scene.start('IntroScene'));

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('IntroScene');
    }
}
