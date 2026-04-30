import { Scene } from 'phaser';

export class CinematicScene extends Scene {
    constructor() { super('CinematicScene'); }

    create() {
        const cam = this.cameras.main;
        this.W = cam.width;
        this.H = cam.height;
        this._skipping = false;
        cam.fadeIn(600, 0, 0, 0);

        this._skipHandler = () => this._goToIntro();
        this.input.keyboard.on('keydown-ESCAPE', this._skipHandler);
        this._skipHint();
        this._act1_vendredi();
    }

    // ── NAVIGATION ────────────────────────────────────────────────────────

    _goToIntro() {
        if (this._skipping) return;
        this._skipping = true;
        this.input.keyboard.off('keydown-ESCAPE', this._skipHandler);
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('IntroScene'));
    }

    _next(fn, delay) {
        this.time.delayedCall(delay, () => {
            this.cameras.main.fadeOut(450, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.children.removeAll(true);
                this._skipHint();
                this.cameras.main.fadeIn(450, 0, 0, 0);
                fn.call(this);
            });
        });
    }

    _skipHint() {
        const btn = this.add.text(this.W - 16, 14, 'PASSER  ▶', {
            fontSize: '12px', color: '#ffffff55', fontFamily: 'Courier New'
        }).setOrigin(1, 0).setDepth(50).setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setColor('#ffffffcc'));
        btn.on('pointerout',  () => btn.setColor('#ffffff55'));
        btn.on('pointerdown', () => this._goToIntro());
    }

    // ── HELPERS ───────────────────────────────────────────────────────────

    _caption(text) {
        const { W, H } = this;
        this.add.rectangle(W/2, H - 30, W, 48, 0x000000, 0.65).setDepth(9);
        this.add.text(W/2, H - 30, text, {
            fontSize: '18px', color: '#fff', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(10);
    }

    _bubble(text, bx, by, color = 0xffffff, textColor = '#222') {
        const lines = text.split('\n');
        const bw = Math.max(200, Math.max(...lines.map(l => l.length)) * 11 + 24);
        const bh = lines.length * 26 + 20;

        const container = this.add.container(bx, by).setDepth(20).setScale(0);

        const g = this.add.graphics();
        g.fillStyle(color);
        g.fillRoundedRect(-bw/2, -bh/2, bw, bh, 10);
        g.lineStyle(2, 0x444444);
        g.strokeRoundedRect(-bw/2, -bh/2, bw, bh, 10);

        const txt = this.add.text(0, 0, text, {
            fontSize: '14px', color: textColor, fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);

        container.add([g, txt]);
        this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 220, ease: 'Back.easeOut' });
        return container;
    }

    _confetti(x, y) {
        const colors = [0xff6b6b, 0xffd166, 0x4ecdc4, 0xa29bfe, 0xfd79a8, 0x00b894];
        for (let i = 0; i < 14; i++) {
            const r = this.add.rectangle(x, y, 6, 10, colors[i % colors.length]).setDepth(25);
            const angle = (i / 14) * Math.PI * 2;
            this.tweens.add({
                targets: r,
                x: x + Math.cos(angle) * 110,
                y: y + Math.sin(angle) * 110 - 70,
                alpha: 0, angle: 360,
                duration: 950, ease: 'Power2', delay: i * 25
            });
        }
    }

    _starBurst(cx, cy) {
        const colors = [0xffd166, 0xffffff, 0xff6b6b, 0x4fc3f7, 0xa29bfe, 0xffb347];
        for (let i = 0; i < 18; i++) {
            const star = this.add.circle(cx, cy, i % 3 === 0 ? 6 : 4, colors[i % colors.length])
                .setDepth(30).setAlpha(1);
            const angle = (i / 18) * Math.PI * 2;
            const dist  = 140 + Math.random() * 120;
            this.tweens.add({
                targets: star,
                x: cx + Math.cos(angle) * dist,
                y: cy + Math.sin(angle) * dist,
                alpha: 0, scaleX: 0, scaleY: 0,
                duration: 1300, ease: 'Power2',
                delay: 250 + i * 18
            });
        }
    }

    // Dessine un téléphone simple centré en (x, y)
    _phone(x, y) {
        const g = this.add.graphics();
        const W = 90, H = 160, R = 12;
        // Corps
        g.fillStyle(0x1a1a2e);
        g.fillRoundedRect(x - W/2, y - H/2, W, H, R);
        g.lineStyle(3, 0x4a4e69);
        g.strokeRoundedRect(x - W/2, y - H/2, W, H, R);
        // Écran
        g.fillStyle(0x0d1b2a);
        g.fillRoundedRect(x - W/2 + 5, y - H/2 + 14, W - 10, H - 28, 6);
        // Bouton home
        g.fillStyle(0x4a4e69);
        g.fillCircle(x, y + H/2 - 9, 5);
        return g;
    }

    // Dessine le logo Discord simplifié
    _discordLogo(x, y, size = 30) {
        const g = this.add.graphics();
        g.fillStyle(0x5865f2);
        g.fillCircle(x, y, size);
        // Yeux
        g.fillStyle(0xffffff);
        g.fillCircle(x - size*0.28, y - size*0.1, size*0.14);
        g.fillCircle(x + size*0.28, y - size*0.1, size*0.14);
        // Sourire
        g.lineStyle(size*0.1, 0xffffff);
        g.beginPath();
        g.arc(x, y + size*0.05, size*0.3, 0.2, Math.PI - 0.2);
        g.strokePath();
        return g;
    }

    // ── ACT 1 : Vendredi 20h30 — le ping Discord ──────────────────────────

    _act1_vendredi() {
        const { W, H } = this;

        // Fond sombre — soirée
        this.add.rectangle(W/2, H/2, W, H, 0x0d1117);

        // Étoiles de fond
        for (let i = 0; i < 40; i++) {
            const sx = Math.random() * W;
            const sy = Math.random() * H * 0.6;
            const star = this.add.circle(sx, sy, Math.random() * 1.5 + 0.5, 0xffffff, Math.random() * 0.6 + 0.2);
            this.tweens.add({
                targets: star, alpha: 0.1,
                duration: 800 + Math.random() * 2000,
                yoyo: true, repeat: -1, delay: Math.random() * 1000
            });
        }

        this._caption('Vendredi soir... 20h30');

        // Téléphone
        const phone = this._phone(W * 0.38, H * 0.5);

        // Logo Discord sur l'écran du téléphone
        const logo = this._discordLogo(W * 0.38, H * 0.46, 18);

        // Notification ping
        this.time.delayedCall(800, () => {
            const notif = this.add.container(W * 0.38, H * 0.38).setScale(0).setDepth(15);
            const nb = this.add.graphics();
            nb.fillStyle(0x5865f2);
            nb.fillRoundedRect(-95, -18, 190, 36, 8);
            const nt = this.add.text(0, 0, '🔔  @everyone', {
                fontSize: '13px', color: '#ffffff', fontFamily: 'Courier New'
            }).setOrigin(0.5);
            notif.add([nb, nt]);
            this.tweens.add({ targets: notif, scaleX: 1, scaleY: 1, duration: 250, ease: 'Back.easeOut' });

            // Vibration du téléphone
            this.tweens.add({
                targets: [phone, logo],
                x: '+=4', duration: 50, yoyo: true, repeat: 5, ease: 'Linear'
            });
        });

        // Message principal
        this.time.delayedCall(1600, () => {
            this._bubble('C\'est pour ce soir ?\nOn joue à 21h ?', W * 0.65, H * 0.38, 0x5865f2, '#ffffff');
        });

        this._next(() => this._act2_reponses(), 4200);
    }

    // ── ACT 2 : Les réponses arrivent ─────────────────────────────────────

    _act2_reponses() {
        const { W, H } = this;

        this.add.rectangle(W/2, H/2, W, H, 0x0d1117);

        // Interface Discord stylisée
        const sidebar = this.add.rectangle(W * 0.12, H/2, W * 0.22, H, 0x1e2124).setDepth(1);
        const main    = this.add.rectangle(W * 0.61, H/2, W * 0.74, H, 0x36393f).setDepth(1);

        // Header du channel
        this.add.rectangle(W * 0.61, 28, W * 0.74, 54, 0x2f3136).setDepth(2);
        this.add.text(W * 0.26, 28, '# soirée-vendredi', {
            fontSize: '14px', color: '#8e9297', fontFamily: 'Courier New'
        }).setOrigin(0, 0.5).setDepth(3);

        // Sidebar : serveur
        this._discordLogo(W * 0.07, 45, 20);
        this.add.text(W * 0.07, 90, '🎮', { fontSize: '22px' }).setOrigin(0.5).setDepth(2);
        ['# général', '# soirée-jeux', '🔊 vocal'].forEach((ch, i) => {
            const active = i === 1;
            if (active) this.add.rectangle(W*0.22, 150 + i*28, W*0.2, 24, 0x40444a).setDepth(2);
            this.add.text(W * 0.13, 150 + i*28, ch, {
                fontSize: '12px', color: active ? '#dcddde' : '#8e9297', fontFamily: 'Courier New'
            }).setOrigin(0, 0.5).setDepth(3);
        });

        this._caption('Les réponses arrivent...');

        // Messages dans le channel
        const messages = [
            { delay: 500,  text: 'Kevin : Je suis là ! 🎮',           color: '#43b581' },
            { delay: 1200, text: 'Thomas : Ouais, on joue quoi ?',     color: '#7289da' },
            { delay: 2000, text: 'Romain : Bof... j\'suis crevé 😴',   color: '#faa61a' },
            { delay: 2800, text: 'Clément : ...',                       color: '#8e9297' },
            { delay: 3500, text: 'Alexis : (pas de réponse)',           color: '#4f545c', italic: true },
        ];

        messages.forEach(({ delay, text, color, italic }) => {
            this.time.delayedCall(delay, () => {
                const msgY = 90 + messages.indexOf(messages.find(m => m.delay === delay)) * 58 + 55;
                const msgContainer = this.add.container(W * 0.26, msgY).setAlpha(0).setDepth(4);
                const bg = this.add.rectangle(W*0.27, 0, W * 0.65, 46, 0x2f3136);
                const dot = this.add.circle(-10, 0, 14, parseInt(color.replace('#',''), 16) || 0x7289da);
                const t = this.add.text(12, 0, text, {
                    fontSize: '13px', color, fontFamily: 'Courier New',
                    fontStyle: italic ? 'italic' : 'normal'
                }).setOrigin(0, 0.5);
                msgContainer.add([bg, dot, t]);
                this.tweens.add({ targets: msgContainer, alpha: 1, x: W * 0.28, duration: 300, ease: 'Power1' });
            });
        });

        this._next(() => this._act3_quete(), 5500);
    }

    // ── ACT 3 : La quête commence ─────────────────────────────────────────

    _act3_quete() {
        const { W, H } = this;
        this.add.rectangle(W/2, H/2, W, H, 0x000000);

        // Éclat d'étoiles
        this._starBurst(W/2, H/2);
        this._confetti(W/2, H/2);

        const title = this.add.text(W/2, H/2 - 60, 'LE JEU DU\nVENDREDI SOIR', {
            fontSize: '54px', color: '#ffd166', fontFamily: 'Courier New', fontStyle: 'bold',
            stroke: '#f72585', strokeThickness: 5, align: 'center'
        }).setOrigin(0.5).setAlpha(0);

        const sub = this.add.text(W/2, H/2 + 50, '"Qui sera au rendez-vous ?"', {
            fontSize: '22px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        const clock = this.add.text(W/2, H/2 + 95, '21:00', {
            fontSize: '16px', color: '#6b7280', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: title, alpha: 1, scaleX: { from: 0.7, to: 1 }, scaleY: { from: 0.7, to: 1 }, duration: 600, delay: 300, ease: 'Back.easeOut' });
        this.tweens.add({ targets: sub,   alpha: 1, duration: 500, delay: 900 });
        this.tweens.add({ targets: clock, alpha: 1, duration: 400, delay: 1400 });

        this.tweens.add({
            targets: title,
            scaleX: { from: 1, to: 1.04 }, scaleY: { from: 1, to: 1.04 },
            duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 1200
        });

        this.time.delayedCall(3400, () => this._goToIntro());
    }
}
