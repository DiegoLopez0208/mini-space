export class KeyController {
    constructor(sprite) {
        this.sprite = sprite;
        this.speed = 2;
        this.keys = {};

        window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
        window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
    }

    update() {
        if (this.keys["ArrowUp"] || this.keys["KeyW"]) {
            this.sprite.y -= this.speed;
        }
        if (this.keys["ArrowDown"] || this.keys["KeyS"]) {
            this.sprite.y += this.speed;
        }
        if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
            this.sprite.x -= this.speed;
        }
        if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
            this.sprite.x += this.speed;
        }
    }
}
