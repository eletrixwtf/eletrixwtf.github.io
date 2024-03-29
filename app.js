// Firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyAG-N5Vn9nw4MRfGg13gSOlTLAkjmpJU1I",
    authDomain: "randomchat1200.firebaseapp.com",
    databaseURL: "https://randomchat1200-default-rtdb.firebaseio.com",
    projectId: "randomchat1200",
    storageBucket: "randomchat1200.appspot.com",
    messagingSenderId: "388785710092",
    appId: "1:388785710092:web:037248699fd99f9b2ffa29"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Check if user is logged in
auth.onAuthStateChanged(user => {
    if (user) {
        const { uid, displayName } = user;
        const username = getCookie('username') || displayName || 'Anonymous';
        setCookie('username', username);
        document.getElementById('username').textContent = username;
        loadChatInterface(uid, username);
        loadSidebar(uid);
    } else {
        document.getElementById('username').textContent = 'Anonymous';
    }
});

// Sign out
document.getElementById('sign-out').addEventListener('click', () => {
    auth.signOut();
    setCookie('username', '', -1);
});

// Function to load the chat interface
function loadChatInterface(uid, username) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2>Welcome, ${username}!</h2>
        <div id="chat-messages"></div>
    `;
    const chatMessages = document.getElementById('chat-messages');
    db.collection('messages').orderBy('timestamp').onSnapshot(snapshot => {
        chatMessages.innerHTML = '';
        snapshot.forEach(doc => {
            const messageData = doc.data();
            chatMessages.innerHTML += `
                <div class="message">
                    <span class="username">${messageData.username}:</span> ${messageData.text}
                </div>
            `;
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    document.getElementById('send-message').addEventListener('click', sendMessage);
}

// Function to load the sidebar
function loadSidebar(uid) {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = `
        <h3>Global Chats</h3>
        <ul id="global-chats"></ul>
        <h3>Private Messages</h3>
        <ul id="private-messages"></ul>
    `;

    const globalChatsList = document.getElementById('global-chats');
    db.collection('globalChats').onSnapshot(snapshot => {
        globalChatsList.innerHTML = '';
        snapshot.forEach(doc => {
            const chatData = doc.data();
            globalChatsList.innerHTML += `
                <li><a href="#${doc.id}" onclick="goToGlobalChat('${doc.id}')">${chatData.name}</a></li>
            `;
        });
    });

    const privateMessagesList = document.getElementById('private-messages');
    db.collection('privateMessages').where('participants', 'array-contains', uid).onSnapshot(snapshot => {
        privateMessagesList.innerHTML = '';
        snapshot.forEach(doc => {
            const messageData = doc.data();
            const otherParticipant = messageData.participants.find(id => id !== uid);
            privateMessagesList.innerHTML += `
                <li><a href="#${otherParticipant}" onclick="goToGlobalChat('${otherParticipant}')">Private message with ${messageData.otherUsername}</a></li>
            `;
        });
    });
}

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();
    if (messageText) {
        const username = getCookie('username') || 'Anonymous';
        db.collection('messages').add({
            text: messageText,
            username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        messageInput.value = '';
    }
}

// Function to set a cookie
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

// Function to navigate to a global chat
function goToGlobalChat(chatId) {
    // Code to navigate to the global chat with ID 'chatId'
}
