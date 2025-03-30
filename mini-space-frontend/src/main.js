import { Application, Assets, Sprite } from "pixi.js";
import { KeyController, MouseController } from "./controllers";
import { Viewport } from "pixi-viewport";
import { PlayerName } from "./player";
import { io } from "socket.io-client";

(async () => {
    const socket = io("http://localhost:3001", { transports: ["websocket"] });

    const players = {};
    const app = new Application();
    await app.init({ resizeTo: window });

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

    function createPlayer(x, y, id) {
        const player = Object.assign(Sprite.from("assets/man.png"), {
            width: 400,
            height: 400,
        });
        player.anchor.set(0.5);
        player.position.set(x, y);
        
        const name = new PlayerName(id, player);
        player.addChild(name);
        viewport.addChild(player);
        return player;
    }
    socket.on("newPlayer", (data) => {
        if (!players[data.id]) {
            players[data.id] = createPlayer(data.x, data.y, data.id);
        }
    });

    socket.on("currentPlayers", (serverPlayers) => {
        console.log("Jugadores actuales recibidos:", serverPlayers);
        Object.keys(players).forEach((id) => {
            if (!serverPlayers[id]) {
                if (players[id] && typeof players[id].destroy === "function") {
                    players[id].destroy();
                }
                delete players[id];
            }
        });
    
        // 🔥 Agregamos los jugadores desde el servidor
        Object.keys(serverPlayers).forEach((id) => {
            if (!players[id]) { 
                players[id] = createPlayer(serverPlayers[id].x, serverPlayers[id].y, id);
            }
        });
    
        // 🔥 Asegurar que el jugador local siempre se agregue
        if (!players[socket.id]) {
            players[socket.id] = createPlayer(2000, 2000, socket.id);
        }
    });

    socket.on("playerMoved", (data) => {
        if (players[data.id]) {
            players[data.id].position.set(data.x, data.y);
        }
    });

    socket.on("playerDisconnected", (id) => {
        if (players[id]) {
            if (typeof players[id].destroy === "function") {
                players[id].destroy();
            }
            delete players[id];
        }
    });

    ground.y = 0;
    three.x = 490;
    three.y = 600;

    const avatar = createPlayer(2000, 2000, socket.id);
    viewport.addChild(ground);
    viewport.addChild(three);
    viewport.addChild(avatar);

    viewport.fit();
    viewport.follow(avatar, { speed: 5 });

    const keyController = new KeyController(avatar);
    const mouseController = new MouseController(app, avatar, viewport);

    app.ticker.add(() => {
        keyController.update();
        mouseController.update();
        socket.emit("move", { x: avatar.x, y: avatar.y });
    });

})();
