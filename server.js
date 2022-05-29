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

    // welcome current user
    socket.emit('message', 'Welcome to the chat app');

    //Broadcast when a user connects for all users except the one who connected (broadcast)
    socket.broadcast.emit('message', 'A new user has joined the chat');

    //Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });
    //listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});