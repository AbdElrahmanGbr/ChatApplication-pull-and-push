const chatFrom = document.getElementById('chat-form');
const socket = io();
// message from server
socket.on('message', (message) => {
    console.log(message);
    outpurMessage(message);
});

//Message submit
chatFrom.addEventListener('submit', (e) => {
    e.preventDefault(); //prevent page refresh
    //get message text
    const msg = e.target.elements.msg.value;
    //Emitting a message to the server
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output message to dom
function outpurMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> Hlbessa <span>${message}</span></p>`;
    document.querySelector('.chat-messages').appendChild(div);
}