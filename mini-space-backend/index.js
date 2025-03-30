import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = {};

io.on('connection', (socket) => {
    console.log(`Jugador conectado: ${socket.id}`);

    io.on('connection', (socket) => {
        console.log(`Jugador conectado: ${socket.id}`);
        players[socket.id] = { x: 2000, y: 2000 };
        socket.emit('currentPlayers', players);
        io.emit('newPlayer', { id: socket.id, x: 2000, y: 2000 });
    
        socket.on('move', (data) => {
            if (players[socket.id]) { 
                players[socket.id] = { x: data.x, y: data.y };
                io.emit('playerMoved', { id: socket.id, x: data.x, y: data.y });
            }
        });
    
        socket.on('disconnect', () => {
            console.log(`Jugador desconectado: ${socket.id}`);
            delete players[socket.id];
            io.emit('playerDisconnected', socket.id);
        });
    });
}, 3000);    

app.use(express.static('public'));

server.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
