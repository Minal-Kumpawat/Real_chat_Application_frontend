const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// function to append message in chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);  // left / right
    messageContainer.append(messageElement);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// show notifications
function showNotification(message) {
    const notifBox = document.getElementById('notifications');
    const div = document.createElement('div');
    div.classList.add('notification');
    div.textContent = message;
    notifBox.appendChild(div);

    // auto-remove after few seconds
    setTimeout(() => div.remove(), 5000);
}

// ask user name and send to server
const name = prompt("Enter your name to join");
socket.emit('new-user-join', name);

// when a new user joins
socket.on('user-join', (name) => {
    append(`${name} joined the chat`, 'right');
});

// when receiving a chat message
socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

// when a user leaves
socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});

// notifications
socket.on('notification', (notif) => {
    if (typeof notif === "object") {
        showNotification(notif.text);   // clean string
    } else {
        showNotification(notif);        // fallback
    }
});
