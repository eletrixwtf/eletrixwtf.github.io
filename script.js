// Initialize Firebase
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

// Set up Firebase database
const database = firebase.database();

// Function to set the username
function setUsername() {
  const username = document.getElementById("usernameInput").value;
  if (username.trim() === "") {
    alert("Please enter a valid username");
    return;
  }
  document.getElementById("userInfo").innerText = `You are logged in as: ${username}`;
}

// Function to navigate to a global chat
function goToGlobalChat(chatNumber) {
  window.location.href = `globalChat${chatNumber}.html`;
}

// Function to send a message
function sendMessage(chatType) {
  const messageInput = document.getElementById("privateChatMessageInput");
  const message = messageInput.value;
  messageInput.value = "";
  const messagesRef = database.ref(chatType + "Messages");
  messagesRef.push({
    sender: "user",
    message: message
  });
}

// Function to display messages
function displayMessage(messageData) {
  const { sender, message } = messageData.val();
  const messagesList = document.getElementById("privateChatMessages");
  const messageElement = document.createElement("li");
  messageElement.innerText = `${sender}: ${message}`;
  messagesList.appendChild(messageElement);
}

// Set up message listener
const privateChatMessagesRef = database.ref("privateChatMessages");
privateChatMessagesRef.on("child_added", displayMessage);
