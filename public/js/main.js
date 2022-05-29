const chatFrom = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const switchRoom = document.getElementById('switch-room');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// console.log(username,room);

const socket = io();
// join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});


// message from server
socket.on('message', (message) => {
    console.log(message);
    outpurMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatFrom.addEventListener('submit', (e) => {
    e.preventDefault(); //prevent page refresh
    //get message text
    const msg = e.target.elements.msg.value;
    //Emitting a message to the server
    socket.emit('chatMessage', msg);

    //clear input field after submit
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output message to dom
function outpurMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span>${message.time}</span></p>
    <p class="text"> ${message.text} </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Switching to another room
switchRoom.addEventListener('click', () => {
    const room = prompt('Enter room name');
    if (room !== '') {
        location.href = `/chat.html?username=${username}&room=${room}`;
    }
});


// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}