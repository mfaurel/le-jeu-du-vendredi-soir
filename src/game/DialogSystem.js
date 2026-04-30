const BOX_PADDING = 16;
const BOX_HEIGHT = 120;
const CHAR_DELAY = 30; // ms per character for typewriter effect

export class DialogSystem {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.isOpen = false;
        this.lines = [];
        this.lineIndex = 0;
        this.typewriterTimer = null;
        this.onClose = null;
    }

    show(lines, onClose) {
        if (this.isOpen) this.close();
        this.lines = Array.isArray(lines) ? lines : [lines];
        this.lineIndex = 0;
        this.onClose = onClose || null;
        this.isOpen = true;
        this._buildBox();
        this._showLine();
    }

    _buildBox() {
        const { width, height } = this.scene.cameras.main;
        const boxY = height - BOX_HEIGHT - 10;

        this.container = this.scene.add.container(0, 0).setDepth(100);

        // Background
        const bg = this.scene.add.rectangle(
            width / 2, boxY + BOX_HEIGHT / 2,
            width - 20, BOX_HEIGHT,
            0x0a0a1a, 0.92
        );
        bg.setStrokeStyle(2, 0x4fc3f7);

        // Speaker name bar
        this.nameText = this.scene.add.text(20, boxY + 8, '', {
            fontSize: '13px', color: '#4fc3f7', fontFamily: 'Courier New'
        });

        // Main text
        this.mainText = this.scene.add.text(20, boxY + 28, '', {
            fontSize: '15px', color: '#ffffff', fontFamily: 'Courier New',
            wordWrap: { width: width - 50 }
        });

        // Prompt indicator
        this.promptText = this.scene.add.text(
            width - 30, boxY + BOX_HEIGHT - 18, '▼',
            { fontSize: '14px', color: '#4fc3f7', fontFamily: 'Courier New' }
        ).setAlpha(0);

        this.container.add([bg, this.nameText, this.mainText, this.promptText]);

        // Blink the ▼ indicator
        this.blinkTween = this.scene.tweens.add({
            targets: this.promptText,
            alpha: { from: 0, to: 1 },
            duration: 400,
            yoyo: true,
            repeat: -1
        });
    }

    _showLine() {
        if (this.lineIndex >= this.lines.length) {
            this.close();
            return;
        }

        const entry = this.lines[this.lineIndex];
        let speakerName = '';
        let text = '';

        if (typeof entry === 'object' && entry.speaker) {
            speakerName = entry.speaker;
            text = entry.text;
        } else {
            text = entry;
        }

        this.nameText.setText(speakerName ? `[ ${speakerName} ]` : '');
        this.mainText.setText('');
        this.promptText.setAlpha(0);

        let charIndex = 0;
        this.typewriterTimer = this.scene.time.addEvent({
            delay: CHAR_DELAY,
            repeat: text.length - 1,
            callback: () => {
                this.mainText.setText(text.substring(0, ++charIndex));
                if (charIndex >= text.length) {
                    this.promptText.setAlpha(1);
                }
            }
        });
    }

    advance() {
        if (!this.isOpen) return;

        // If still typing, skip to full text
        if (this.typewriterTimer && this.typewriterTimer.getProgress() < 1) {
            this.typewriterTimer.remove();
            const entry = this.lines[this.lineIndex];
            const text = typeof entry === 'object' ? entry.text : entry;
            this.mainText.setText(text);
            this.promptText.setAlpha(1);
            return;
        }

        this.lineIndex++;
        this._showLine();
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        if (this.typewriterTimer) this.typewriterTimer.remove();
        if (this.blinkTween) this.blinkTween.stop();
        if (this.container) { this.container.destroy(); this.container = null; }
        if (this.onClose) this.onClose();
    }
}
