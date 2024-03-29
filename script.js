// script.js
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
const database = firebase.database();

let username = null;

function setUsername() {
  const usernameInput = document.getElementById('usernameInput');
  username = usernameInput.value;
  document.title = `Chat App - ${username}`;
}

function sendMessage(chatId) {
  const messageInput = document.getElementById(`${chatId}MessageInput`);
  const message = messageInput.value;
  messageInput.value = '';

  const chatRef = database.ref(`chats/${chatId}`);
  chatRef.push({
    username,
    message,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}

function sendPrivateMessage() {
  const privateChatUsernameInput = document.getElementById('privateChatUsernameInput');
  const recipientUsername = privateChatUsernameInput.value;
  const messageInput = document.getElementById('privateChatMessageInput');
  const message = messageInput.value;
  messageInput.value = '';

  const chatId = `${username}-${recipientUsername}`;
  const chatRef = database.ref(`chats/private/${chatId}`);
  chatRef.push({
    sender: username,
    recipient: recipientUsername,
    message,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}

function displayMessage(chatId, message) {
  const chatMessages = document.getElementById(`${chatId}Messages`);
  const messageElement = document.createElement('li');
  messageElement.textContent = `${message.username}: ${message.message}`;
  chatMessages.appendChild(messageElement);
}

function displayPrivateMessage(message) {
  const privateChatMessages = document.getElementById('privateChatMessages');
  const messageElement = document.createElement('li');
  messageElement.textContent = `${message.sender} (to ${message.recipient}): ${message.message}`;
  privateChatMessages.appendChild(messageElement);
}

function setupChatListener(chatId) {
  const chatRef = database.ref(`chats/${chatId}`);
  chatRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    displayMessage(chatId, message);
  });
}

function setupPrivateChatListener() {
  const privateChatRef = database.ref('chats/private');
  privateChatRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    if (message.recipient === username || message.sender === username) {
      displayPrivateMessage(message);
    }
  });
}

setupChatListener('globalChat1');
setupChatListener('globalChat2');
setupPrivateChatListener();
