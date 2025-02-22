import { Application, Assets, Sprite } from "pixi.js";
import { KeyController, MouseController } from "./controllers";
import { Viewport } from "pixi-viewport";
import { PlayerName } from "./player";
import { io } from "socket.io-client";

(async () => {
    const socket = io("http://localhost:3000");

    const players = {};
    const app = new Application();
    await app.init({ resizeTo: window });

    socket.on("currentPlayers", (serverPlayers) => {
        Object.keys(serverPlayers).forEach((id) => {
            if (!players[id]) {
                players[id] = createPlayer(
                    serverPlayers[id].x,
                    serverPlayers[id].y,
                    id,
                );
            }
        });
    });

    socket.on("newPlayer", (data) => {
        players[data.id] = createPlayer(data.x, data.y, data.id);
    });

    socket.on("playerMoved", (data) => {
        if (players[data.id]) {
            players[data.id].x = data.x;
            players[data.id].y = data.y;
        }
    });

    socket.on("playerDisconnected", (id) => {
        if (players[id]) {
            players[id].destroy();
            delete players[id];
        }
    });

    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 4000,
        worldHeight: 4000,
        events: app.renderer.events,
    });

    app.stage.addChild(viewport);
    viewport.drag().pinch().wheel().decelerate();

    document.body.appendChild(app.canvas);

    await Assets.load([
        "assets/ground.png",
        "assets/three.png",
        "assets/man.png",
    ]);

    const ground = Object.assign(Sprite.from("assets/ground.png"), {
        width: 6000,
        height: 6000,
    });

    const three = Object.assign(Sprite.from("assets/three.png"), {
        width: 250,
        height: 250,
    });

    const avatar = Object.assign(Sprite.from("assets/man.png"), {
        width: 400,
        height: 400,
    });

    const playerName = new PlayerName("ByCheat", avatar);

    ground.y = 0;
    three.x = 490;
    three.y = 600;

    avatar.anchor.set(0.5);
    avatar.x = 2000;
    avatar.y = 2000;

    viewport.addChild(ground);
    viewport.addChild(three);
    viewport.addChild(avatar);
    viewport.addChild(playerName);

    viewport.fit();

    viewport.follow(avatar, { speed: 5 });

    const keyController = new KeyController(avatar);
    const mouseController = new MouseController(app, avatar, viewport);

    app.ticker.add(() => {
        keyController.update();
        mouseController.update();
        playerName.update();

        socket.emit("move", { x: avatar.x, y: avatar.y });
    });

    function createPlayer(x, y, id) {
        const player = Object.assign(Sprite.from("assets/man.png"), {
            width: 100,
            height: 100,
        });
        player.anchor.set(0.5);
        player.x = x;
        player.y = y;

        const name = new PlayerName(id, player);
        player.addChild(name);

        viewport.addChild(player);

        return player;
    }
})();
