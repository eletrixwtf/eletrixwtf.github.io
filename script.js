let username = null;

function setUsername() {
  const usernameInput = document.getElementById('usernameInput');
  username = usernameInput.value;
  document.getElementById('userInfo').textContent = `You are logged in as: ${username}`;
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

function goToGlobalChat(chatId) {
  window.location.href = `globalChat_${chatId}.html`;
}

function displayMessage(chatId, message) {
  const chatMessages = document.getElementById(`${chatId}Messages`);
  if (chatMessages) {
    const messageElement = document.createElement('li');
    messageElement.textContent = `${message.username}: ${message.message}`;
    chatMessages.appendChild(messageElement);
  }
}

function setupChatListener(chatId) {
  const chatRef = database.ref(`chats/${chatId}`);
  chatRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    displayMessage(chatId, message);
  });
}

setupChatListener('globalChat1');
setupChatListener('globalChat2');
