const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'Chat Bot';

//set static folder for the front end
app.use(express.static(path.join(__dirname, 'public')));


//run when a client connects
io.on('connection', socket => {
    socket.on('joinroom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // welcome current user
        socket.emit('message', formatMessage(botName,'Welcome to the chat app'));

        //Broadcast when a user connects for all users except the one who connected (broadcast)
        socket.broadcast.to(user.room).emit('message', `${user.username} has joined the chat`);
    });


    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});