export class MouseController {
    constructor(app, sprite, viewport) {
        this.app = app;
        this.sprite = sprite;
        this.viewport = viewport;
        this.speed = 2;
        this.targetX = sprite.x;
        this.targetY = sprite.y;
        this.keys = {};
        this.isUsingKeys = false;

        window.addEventListener("keydown", (e) => {
            this.keys[e.code] = true;
            this.isUsingKeys = true;
        });

        this.app.stage.eventMode = "static";
        this.app.stage.on("pointerdown", (e) => {
            this.isUsingKeys = false;

            const position = this.viewport.toWorld(e.global.x, e.global.y);
            this.targetX = position.x;
            this.targetY = position.y;
        });
    }

    update() {
        if (this.isUsingKeys) return;

        let dx = this.targetX - this.sprite.x;
        let dy = this.targetY - this.sprite.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.speed) {
            let angle = Math.atan2(dy, dx);
            this.sprite.x += this.speed * Math.cos(angle);
            this.sprite.y += this.speed * Math.sin(angle);
        } else {
            this.sprite.x = this.targetX;
            this.sprite.y = this.targetY;
        }
    }
}
