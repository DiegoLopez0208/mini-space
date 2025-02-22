import { Text, Container, Graphics } from "pixi.js";

export class PlayerName extends Container {
    constructor(name, target) {
        super();

        this.target = target;

        this.nameText = new Text({
            text: name,
            style: {
                fontFamily: "Arial",
                fontSize: 24,
                fill: 0xffffff,
                align: "center",
                fontWeight: "bold",
                stroke: 0x000000,
                strokeThickness: 4,
                dropShadow: true,
                dropShadowColor: "#000000",
                dropShadowBlur: 4,
                dropShadowDistance: 2,
            },
        });

        this.nameText.anchor.set(0.5);

        this.background = new Graphics();
        this.drawBackground();

        this.addChild(this.background);
        this.addChild(this.nameText);
    }

    drawBackground() {
        const padding = 10;
        const radius = 10;

        this.background.clear();
        this.background.fill(0x1a1a1a, 0.6);
        this.background.roundRect(
            -this.nameText.width / 2 - padding,
            -this.nameText.height / 2 - padding,
            this.nameText.width + padding * 2,
            this.nameText.height + padding * 2,
            radius,
        );
        this.background.endFill();
    }

    update() {
        this.position.x = this.target.x;
        this.position.y = this.target.y - this.target.height / 2 - 4;
    }
}
