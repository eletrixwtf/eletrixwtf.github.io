// Firebase configuration
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

function setUsername() {
  const username = prompt("Enter your username:");
  if (!username) return;
  document.title = `Chat - ${username}`;
  localStorage.setItem("username", username);
}

function getUsername() {
  return localStorage.getItem("username");
}

function displayMessage(username, message, timestamp) {
  const messageContainer = document.getElementById("messageContainer");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  const usernameElement = document.createElement("span");
  usernameElement.classList.add("username");
  usernameElement.textContent = username;
  const messageContentElement = document.createElement("span");
  messageContentElement.classList.add("message-content");
  messageContentElement.textContent = message;
  const timestampElement = document.createElement("span");
  timestampElement.classList.add("timestamp");
  timestampElement.textContent = new Date(timestamp).toLocaleString();
  messageElement.appendChild(usernameElement);
  messageElement.appendChild(messageContentElement);
  messageElement.appendChild(timestampElement);
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

document.getElementById("messageForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;
  if (message.trim() === "") {
    alert("Please enter a message");
    return;
  }
  messageInput.value = "";
  const messageData = {
    username: getUsername(),
    message: message,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  };
  db.ref('messages').push(messageData);
});

db.ref('messages').on('child_added', function(snapshot) {
  const messageData = snapshot.val();
  displayMessage(messageData.username, messageData.message, messageData.timestamp);
});

