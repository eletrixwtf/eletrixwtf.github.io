const firebaseConfig = {
  apiKey: "AIzaSyAG-N5Vn9nw4MRfGg13gSOlTLAkjmpJU1I",
  authDomain: "randomchat1200.firebaseapp.com",
  databaseURL: "https://randomchat1200-default-rtdb.firebaseio.com",
  projectId: "randomchat1200",
  storageBucket: "randomchat1200.appspot.com",
  messagingSenderId: "388785710092",
  appId: "1:388785710092:web:037248699fd99f9b2ffa29"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Check if username is already set
let username = localStorage.getItem('username');
if (!username) {
    username = prompt('Please enter your username:');
    localStorage.setItem('username', username);
}

// Set username in the UI
document.querySelector('.username').textContent = `Username: ${username}`;

// Send message
document.getElementById('send-btn').addEventListener('click', () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message !== '') {
        db.ref('messages').push({
            from: username,
            text: message
        });
        messageInput.value = '';
    }
});

// Listen for new messages
db.ref('messages').on('child_added', (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.from}: ${message.text}`;
    document.getElementById('chat-messages').appendChild(messageElement);
});
