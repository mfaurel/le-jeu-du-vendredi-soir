import { Scene } from 'phaser';
import { PlayerState } from '../PlayerState';

const FRIENDS = [
    { name: 'Deus',     color: 0x43b581, label: '🎮' },
    { name: 'Claude',   color: 0x7289da, label: '🧠' },
    { name: 'Fatmike',  color: 0xfaa61a, label: '🦁' },
    { name: 'MKz',      color: 0x8e9297, label: '🎲' },
    { name: 'Tsunaze',  color: 0xa29bfe, label: '⚡' },
    { name: 'Toi',      color: 0x4fc3f7, label: '⭐' },
];

export class VictoryScene extends Scene {
    constructor() { super('VictoryScene'); }

    init(data) {
        this.characterId = data && data.characterId ? data.characterId : 'assidu';
    }

    create() {
        const cam = this.cameras.main;
        this.W = cam.width;
        this.H = cam.height;
        cam.fadeIn(800, 0, 0, 0);
        this._act1_victoire();
    }

    // ── HELPERS ───────────────────────────────────────────────────────────

    _starBurst(cx, cy) {
        const colors = [0xffd166, 0xffffff, 0xff6b6b, 0x4fc3f7, 0xa29bfe, 0xffb347];
        for (let i = 0; i < 24; i++) {
            const star = this.add.circle(cx, cy, i % 3 === 0 ? 7 : 4, colors[i % colors.length])
                .setDepth(30).setAlpha(1);
            const angle = (i / 24) * Math.PI * 2;
            const dist = 150 + Math.random() * 140;
            this.tweens.add({
                targets: star,
                x: cx + Math.cos(angle) * dist,
                y: cy + Math.sin(angle) * dist,
                alpha: 0, scaleX: 0, scaleY: 0,
                duration: 1400, ease: 'Power2', delay: 200 + i * 15
            });
        }
    }

    _confetti(cx, cy, count = 20) {
        const colors = [0xff6b6b, 0xffd166, 0x4ecdc4, 0xa29bfe, 0xfd79a8, 0x00b894, 0x4fc3f7];
        for (let i = 0; i < count; i++) {
            const r = this.add.rectangle(cx, cy, 7, 12, colors[i % colors.length]).setDepth(25);
            const angle = (i / count) * Math.PI * 2;
            this.tweens.add({
                targets: r,
                x: cx + Math.cos(angle) * (120 + Math.random() * 80),
                y: cy + Math.sin(angle) * (120 + Math.random() * 80) - 60,
                alpha: 0, angle: 360 + Math.random() * 360,
                duration: 1100, ease: 'Power2', delay: i * 20
            });
        }
    }

    _next(fn, delay) {
        this.time.delayedCall(delay, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.children.removeAll(true);
                this.cameras.main.fadeIn(500, 0, 0, 0);
                fn.call(this);
            });
        });
    }

    // ── ACT 1 : Victoire ! ────────────────────────────────────────────────

    _act1_victoire() {
        const { W, H } = this;

        this.add.rectangle(W / 2, H / 2, W, H, 0x000011);

        for (let i = 0; i < 60; i++) {
            const s = this.add.circle(Math.random() * W, Math.random() * H, Math.random() * 1.8 + 0.5, 0xffffff, Math.random() * 0.5 + 0.1);
            this.tweens.add({ targets: s, alpha: 0.05, duration: 600 + Math.random() * 1800, yoyo: true, repeat: -1, delay: Math.random() * 1000 });
        }

        this._starBurst(W / 2, H / 2 - 30);
        this._confetti(W / 2, H / 2 - 30, 24);

        const title = this.add.text(W / 2, H / 2 - 80, 'YOUHOU !', {
            fontSize: '72px', color: '#ffd166', fontFamily: 'Courier New', fontStyle: 'bold',
            stroke: '#f72585', strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0).setScale(0.5);

        const sub = this.add.text(W / 2, H / 2 + 10, 'La soirée est sauvée !', {
            fontSize: '26px', color: '#ffffff', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        const ps = PlayerState.get();
        const stats = this.add.text(W / 2, H / 2 + 55, `Niveau ${ps.level}  •  ${ps.xp} XP`, {
            fontSize: '15px', color: '#6b7280', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: title, alpha: 1, scaleX: 1, scaleY: 1, duration: 700, delay: 300, ease: 'Back.easeOut' });
        this.tweens.add({ targets: sub, alpha: 1, duration: 500, delay: 900 });
        this.tweens.add({ targets: stats, alpha: 1, duration: 400, delay: 1300 });
        this.tweens.add({ targets: title, scaleX: { from: 1, to: 1.05 }, scaleY: { from: 1, to: 1.05 }, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 1200 });

        this._next(() => this._act2_amis(), 3600);
    }

    // ── ACT 2 : Les 6 amis ───────────────────────────────────────────────

    _act2_amis() {
        const { W, H } = this;

        this.add.rectangle(W / 2, H / 2, W, H, 0x05050f);

        this.add.text(W / 2, 55, 'Vous êtes tous là !', {
            fontSize: '28px', color: '#ffd166', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(5);

        this.add.text(W / 2, 94, '— 6 joueurs connectés —', {
            fontSize: '14px', color: '#4f545c', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(5);

        const cols = 3;
        const cardW = 230, cardH = 130;
        const startX = W / 2 - (cols - 1) * (cardW / 2 + 20);
        const startY = 220;

        FRIENDS.forEach((friend, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const cx = startX + col * (cardW + 40);
            const cy = startY + row * (cardH + 24);
            const delay = 300 + i * 220;

            const container = this.add.container(cx, cy).setAlpha(0).setScale(0.6).setDepth(4);

            const bg = this.add.graphics();
            bg.fillStyle(0x1a1a2e);
            bg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 14);
            bg.lineStyle(2, friend.color, 0.7);
            bg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 14);

            const avatar = this.add.circle(0, -18, 28, friend.color, 0.9);
            const avatarRing = this.add.circle(0, -18, 32, friend.color, 0);
            avatarRing.setStrokeStyle(2, friend.color, 0.5);

            const emoji = this.add.text(0, -18, friend.label, { fontSize: '20px' }).setOrigin(0.5);

            const nameText = this.add.text(0, 24, friend.name, {
                fontSize: '16px', color: '#ffffff', fontFamily: 'Courier New', fontStyle: 'bold'
            }).setOrigin(0.5);

            const readyText = this.add.text(0, 44, '✓ connecté', {
                fontSize: '11px', color: '#' + friend.color.toString(16).padStart(6, '0'), fontFamily: 'Courier New'
            }).setOrigin(0.5);

            container.add([bg, avatar, avatarRing, emoji, nameText, readyText]);

            this.tweens.add({
                targets: container, alpha: 1, scaleX: 1, scaleY: 1,
                duration: 350, delay, ease: 'Back.easeOut'
            });

            // Pulse the avatar ring
            this.time.delayedCall(delay + 400, () => {
                this.tweens.add({ targets: avatarRing, alpha: { from: 0.5, to: 0 }, scaleX: { from: 1, to: 1.8 }, scaleY: { from: 1, to: 1.8 }, duration: 900, repeat: -1, ease: 'Sine.easeOut' });
            });

            // Confetti burst on each card
            this.time.delayedCall(delay + 200, () => this._confetti(cx, cy, 8));
        });

        this._next(() => this._act3_firstclass(), 5500);
    }

    // ── ACT 3 : On va pouvoir jouer à First Class Trouble ───────────────────────────────────────

    _act3_firstclass() {
        const { W, H } = this;

        this.add.rectangle(W / 2, H / 2, W, H, 0x000000);

        // Multiple confetti waves
        this._starBurst(W / 2, H / 2 - 60);
        this._confetti(W / 2, H / 2, 30);
        this.time.delayedCall(400, () => this._confetti(W * 0.2, H * 0.3, 14));
        this.time.delayedCall(700, () => this._confetti(W * 0.8, H * 0.3, 14));

        const game = this.add.text(W / 2, H / 2 - 120, 'FIRST CLASS TROUBLE', {
            fontSize: '42px', color: '#ff6b6b', fontFamily: 'Courier New', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0).setScale(0.7);

        const who = this.add.text(W / 2, H / 2 - 52, 'Qui sont les imposteurs ?', {
            fontSize: '22px', color: '#ffd166', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        const sub = this.add.text(W / 2, H / 2 + 4, 'Innocents vs Troublemakers  ·  À vos manettes !', {
            fontSize: '15px', color: '#9ca3af', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        // 6 dots representing friends
        FRIENDS.forEach((f, i) => {
            const angle = (i / FRIENDS.length) * Math.PI * 2 - Math.PI / 2;
            const r = 70;
            const dx = Math.cos(angle) * r;
            const dy = Math.sin(angle) * r;
            const dot = this.add.circle(W / 2 + dx, H / 2 + 110 + dy, 14, f.color, 0.9).setAlpha(0).setScale(0);
            this.time.delayedCall(1200 + i * 130, () => {
                this.tweens.add({ targets: dot, alpha: 1, scaleX: 1, scaleY: 1, duration: 300, ease: 'Back.easeOut' });
            });
        });

        const ring = this.add.circle(W / 2, H / 2 + 110, 74, 0xffffff, 0).setStrokeStyle(2, 0x4f545c, 0.4).setAlpha(0);

        const replay = this.add.text(W / 2, H - 65, '▶  REJOUER', {
            fontSize: '22px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0).setDepth(10).setInteractive({ useHandCursor: true });
        replay.on('pointerover', () => replay.setColor('#ffffff'));
        replay.on('pointerout',  () => replay.setColor('#4fc3f7'));
        replay.on('pointerdown', () => { PlayerState.reset(); this.scene.start('IntroScene'); });

        this.tweens.add({ targets: game,   alpha: 1, scaleX: 1, scaleY: 1, duration: 700, delay: 300,  ease: 'Back.easeOut' });
        this.tweens.add({ targets: who,    alpha: 1,                        duration: 500, delay: 900  });
        this.tweens.add({ targets: sub,    alpha: 1,                        duration: 400, delay: 1400 });
        this.tweens.add({ targets: ring,   alpha: 1,                        duration: 400, delay: 1100 });
        this.tweens.add({ targets: replay, alpha: 1,                        duration: 400, delay: 2200 });

        this.tweens.add({
            targets: game,
            scaleX: { from: 1, to: 1.04 }, scaleY: { from: 1, to: 1.04 },
            duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 1200
        });

        // Flicker ring
        this.time.delayedCall(1200, () => {
            this.tweens.add({ targets: ring, alpha: { from: 0.4, to: 0.9 }, duration: 1200, yoyo: true, repeat: -1 });
        });
    }
}
