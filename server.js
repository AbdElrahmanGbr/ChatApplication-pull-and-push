const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder for the front end
app.use(express.static(path.join(__dirname, 'public')));


//run when a client connects
io.on('connection', socket => {
    console.log('New WebSocket connection');
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});