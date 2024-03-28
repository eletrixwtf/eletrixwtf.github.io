// Set username
document.getElementById('set-username').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (username !== '') {
        localStorage.setItem('username', username);
        document.querySelector('.username').style.display = 'none';
        initChatApp();
    }
});

// Initialize chat app
function initChatApp() {
    const username = localStorage.getItem('username');
    const userlist = document.getElementById('user-list');
    const chatMessages = document.getElementById('chat-messages');

    // Add message to chat
    function addMessage(user, message) {
        const messageElement = document.createElement('div');
        messageElement.innerText = `${user}: ${message}`;
        chatMessages.appendChild(messageElement);
    }

    // Send message
    document.getElementById('send-btn').addEventListener('click', () => {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message !== '') {
            addMessage(username, message);
            messageInput.value = '';
        }
    });

    // Load messages
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    storedMessages.forEach(({ user, message }) => addMessage(user, message));

    // Store messages
    function storeMessage(user, message) {
        storedMessages.push({ user, message });
        localStorage.setItem('messages', JSON.stringify(storedMessages));
    }

    // Broadcast message to all users
    function broadcastMessage(message) {
        const userListItems = [...userlist.querySelectorAll('li')];
        userListItems.forEach(item => {
            const user = item.textContent.trim();
            if (user !== '# Global') {
                addMessage(user, message);
                storeMessage(user, message);
            }
        });
    }

    // Send message to specific user
    function sendMessageToUser(user, message) {
        addMessage(user, message);
        storeMessage(user, message);
    }

    // Add user to user list
    function addUser(user) {
        const listItem = document.createElement('li');
        listItem.textContent = user;
        userlist.appendChild(listItem);
    }

    // Add user to user list
    function removeUser(user) {
        const userListItems = [...userlist.querySelectorAll('li')];
        userListItems.forEach(item => {
            if (item.textContent.trim() === user) {
                item.remove();
            }
        });
    }

    // Add global channel
    addUser('# Global');

    // Handle sending messages
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const messageInput = document.getElementById('message-input');
            const message = messageInput.value.trim();
            if (message !== '') {
                if (message.startsWith('@')) {
                    const [recipient, ...messageParts] = message.substring(1).split(' ');
                    const recipientUser = userListItems.find(item => item.textContent.trim() === recipient);
                    if (recipientUser) {
                        sendMessageToUser(recipient, messageParts.join(' '));
                    }
                } else {
                    broadcastMessage(message);
                }
                messageInput.value = '';
            }
        }
    });

    // Handle adding new channels (users)
    userlist.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'LI') {
            const user = target.textContent.trim();
            if (user !== '# Global') {
                const messageInput = document.getElementById('message-input');
                messageInput.value = `@${user} `;
                messageInput.focus();
            }
        }
    });

    // Handle new users joining
    const channelList = document.getElementById('channel-list');
    channelList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const newChannel = prompt('Enter the name of the new channel:');
            if (newChannel) {
                addUser(newChannel);
            }
        }
    });

    // Handle users leaving
    window.addEventListener('beforeunload', () => {
        const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        const updatedMessages = storedMessages.filter(({ user }) => user !== username);
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
    });

    // Initial user setup
    addUser(username);
}

// Check if username is set
const username = localStorage.getItem('username');
if (username) {
    document.querySelector('.username').style.display = 'none';
    initChatApp();
}
