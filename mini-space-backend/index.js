const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {};


io.on('connection', (socket) => {
    console.log(`Jugador conectado: ${socket.id}`);


    socket.emit('currentPlayers', players);


    players[socket.id] = { x: 2000, y: 2000 };
    io.emit('newPlayer', { id: socket.id, x: 2000, y: 2000 });

    socket.on('move', (data) => {
        players[socket.id] = { x: data.x, y: data.y };
        io.emit('playerMoved', { id: socket.id, x: data.x, y: data.y });
    });


    socket.on('disconnect', () => {
        console.log(`Jugador desconectado: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});


app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
