// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAG-N5Vn9nw4MRfGg13gSOlTLAkjmpJU1I",
    authDomain: "randomchat1200.firebaseapp.com",
    projectId: "randomchat1200",
    storageBucket: "randomchat1200.appspot.com",
    messagingSenderId: "388785710092",
    appId: "1:388785710092:web:037248699fd99f9b2ffa29",
    measurementId: "G-DB89E19HSE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let currentUser = localStorage.getItem('username');
if (!currentUser) {
    document.getElementById('username-modal').style.display = 'block';

    document.getElementById('username-submit').addEventListener('click', () => {
        const username = document.getElementById('username-input').value.trim();
        if (username !== '') {
            currentUser = username;
            localStorage.setItem('username', currentUser);
            document.getElementById('username-modal').style.display = 'none';
        }
    });
}

function displayMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    db.ref('messages').limitToLast(50).on('child_added', (snapshot) => {
        const message = snapshot.val();
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<span class="user">${message.user}</span>: ${message.text}`;
        chatMessages.appendChild(messageElement);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const text = messageInput.value.trim();

    if (text !== '') {
        db.ref('messages').push({
            user: currentUser,
            text: text
        });
        messageInput.value = '';
    }
}

document.getElementById('send-btn').addEventListener('click', sendMessage);

// Display initial messages
displayMessages();

// Update messages when storage changes (new message sent)
window.addEventListener('storage', (event) => {
    if (event.key && event.key.startsWith('message_')) {
        displayMessages();
    }
});
