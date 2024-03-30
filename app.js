const firebaseConfig = {
    apiKey: "AIzaSyAG-N5Vn9nw4MRfGg13gSOlTLAkjmpJU1I",
    authDomain: "randomchat1200.firebaseapp.com",
    databaseURL: "https://randomchat1200-default-rtdb.firebaseio.com",
    projectId: "randomchat1200",
    storageBucket: "randomchat1200.appspot.com",
    messagingSenderId: "388785710092",
    appId: "1:388785710092:web:037248699fd99f9b2ffa29",
    measurementId: "G-MEASUREMENT_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const modalContainer = document.getElementById("modal-container");
const modal = document.querySelector(".modal");
const usernameLink = document.getElementById("username-link");
const usernameInput = document.getElementById("username-input");
const usernameSubmit = document.getElementById("username-submit");

let username = localStorage.getItem("username");

if (!username) {
    showModal();
} else {
    setupChat();
}

function showModal() {
    modalContainer.style.display = "flex";
}

function hideModal() {
    modalContainer.style.display = "none";
}

function setupChat() {
    db.collection("messages")
        .orderBy("timestamp")
        .onSnapshot((snapshot) => {
            chatMessages.innerHTML = "";
            snapshot.forEach((doc) => {
                const data = doc.data();
                const message = document.createElement("div");
                message.classList.add("message");
                const messageContent = `
                    <p class="meta">${data.username} <span>${formatDate(
                    data.timestamp
                )}</span></p>
                    <p class="text">${data.message}</p>
                `;
                message.innerHTML = messageContent;
                chatMessages.appendChild(message);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}`;
}

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = chatForm.msg.value.trim();
    if (message) {
        db.collection("messages").add({
            message,
            username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        chatForm.reset();
    }
});

usernameLink.addEventListener("click", () => {
    showModal();
});

usernameSubmit.addEventListener("click", () => {
    const newUsername = usernameInput.value.trim();
    if (newUsername) {
        username = newUsername;
        localStorage.setItem("username", username);
        hideModal();
        setupChat();
    }
});
