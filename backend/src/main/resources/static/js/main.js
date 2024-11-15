"use strict";

const customerIdPage = document.querySelector("#customerId-page");
const chatPage = document.querySelector("#chat-page");
const customerIdForm = document.querySelector("#customerIdForm");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#message");
const connectingElement = document.querySelector(".connecting");
const chatArea = document.querySelector("#chat-messages");
const logout = document.querySelector("#logout");

let stompClient = null;
let fullname = null;
let selectedUserId = null;

let customerId = null;

// Panggil fetchOnlineUsers ketika halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  fetchOnlineUsers();
});

// Panggil fetchOnlineUsers ketika halaman dimuat dan setiap 5 detik
document.addEventListener("DOMContentLoaded", () => {
  fetchOnlineUsers();
  setInterval(fetchOnlineUsers, 5000); // Perbarui daftar setiap 5 detik
});

document.addEventListener("DOMContentLoaded", () => {
  findAndDisplayConnectedUsers();
  setInterval(findAndDisplayConnectedUsers, 5000); // Perbarui daftar setiap 5 detik
});

function connect(event) {
  customerId = document.querySelector("#customerId").value.trim();

  if (customerId) {
    customerIdPage.classList.add("hidden");
    chatPage.classList.remove("hidden");

    const socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
  }
  event.preventDefault();
}

function onConnected() {
  // Subscribe ke topik publik dan private untuk user tertentu
  stompClient.subscribe(
    `/user/${customerId}/queue/messages`,
    onMessageReceived
  );
  stompClient.subscribe(`/customer/public`, onMessageReceived);

  // Permintaan untuk mengambil informasi pelanggan berdasarkan customerId
  stompClient.send(
    "/app/customer.searchCustomer",
    {},
    JSON.stringify({ customerId: customerId })
  );

  findAndDisplayConnectedUsers();
}

async function findAndDisplayConnectedUsers() {
  try {
    const connectedUsersResponse = await fetch(
      `/api/customers/status/${customerId}`
    );
    if (!connectedUsersResponse.ok) {
      throw new Error("Failed to fetch connected users");
    }

    let connectedUsers = await connectedUsersResponse.json();
    const connectedUsersList = document.getElementById("connectedUsers");
    connectedUsersList.innerHTML = "";

    connectedUsers.forEach((user) => {
      appendUserElement(user, connectedUsersList);
    });
  } catch (error) {
    console.error("Error fetching connected users:", error);
  }
}

function appendUserElement(user, connectedUsersList) {
  const listItem = document.createElement("li");
  listItem.classList.add("user-item");
  listItem.id = user.id;

  const userImage = document.createElement("img");
  userImage.src = "../img/user_icon.png";
  userImage.alt = user.username;

  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = user.username;

  const receivedMsgs = document.createElement("span");
  receivedMsgs.textContent = "0";
  receivedMsgs.classList.add("nbr-msg", "hidden");

  listItem.appendChild(userImage);
  listItem.appendChild(usernameSpan);
  listItem.appendChild(receivedMsgs);

  listItem.addEventListener("click", () => userItemClick(user.id));

  connectedUsersList.appendChild(listItem);
}

function userItemClick(userId) {
  if (!userId) {
    console.error("User ID not found");
    return;
  }

  // Menggunakan selector dengan tanda kutip di sekitar ID
  const clickedUser = document.querySelector(`li[id="${userId}"]`);
  if (!clickedUser) {
    console.error("User not found:", userId);
    return;
  }

  selectedUserId = userId;

  // Hapus kelas 'active' dari semua user-item
  document.querySelectorAll(".user-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Tambahkan kelas 'active' ke user yang diklik
  clickedUser.classList.add("active");
  messageForm.classList.remove("hidden");

  // Tampilkan chat untuk user yang diklik
  fetchAndDisplayUserChat().then();

  const nbrMsg = clickedUser.querySelector(".nbr-msg");
  if (nbrMsg) {
    nbrMsg.classList.add("hidden");
    nbrMsg.textContent = "0";
  }
}

function displayMessage(senderId, content) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message");
  if (senderId === customerId) {
    messageContainer.classList.add("sender");
  } else {
    messageContainer.classList.add("receiver");
  } 
  const message = document.createElement("p");
  message.textContent = content;
  messageContainer.appendChild(message);
  chatArea.appendChild(messageContainer);
}

async function fetchAndDisplayUserChat() {
  try {
    const userChatResponse = await fetch(
      `/messages/${customerId}/${selectedUserId}`
    );
    if (!userChatResponse.ok) {
      throw new Error(`Failed to fetch chats: ${userChatResponse.status}`);
    }

    const userChat = await userChatResponse.json();

    chatArea.innerHTML = "";
    userChat.forEach((chat) => {
      displayMessage(chat.senderId, chat.content);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
  } catch (error) {
    console.error("Error fetching user chat:", error);
  }
}

function onError() {
  connectingElement.textContent =
    "Could not connect to WebSocket server. Please refresh this page to try again!";
  connectingElement.style.color = "red";
}

function sendMessage(event) {
  const messageContent = messageInput.value.trim();
  if (messageContent && stompClient && selectedUserId) {
    const chatMessage = {
      senderId: customerId,
      recipientId: selectedUserId, // Pastikan recipient ID diisi
      content: messageContent,
      timestamp: new Date(),
    };

    // Kirim pesan ke endpoint '/app/chat'
    stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));

    // Tampilkan pesan di layar pengirim
    displayMessage(customerId, messageContent);
    messageInput.value = "";
  }
  chatArea.scrollTop = chatArea.scrollHeight;
  event.preventDefault();
}

async function onMessageReceived(payload) {
  await findAndDisplayConnectedUsers();
  console.log("Message received", payload);
  const message = JSON.parse(payload.body);
  if (selectedUserId && selectedUserId === message.senderId) {
    displayMessage(message.senderId, message.content);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  const notifiedUser = document.querySelector(`#${message.senderId}`);
  if (notifiedUser && !notifiedUser.classList.contains("active")) {
    const nbrMsg = notifiedUser.querySelector(".nbr-msg");
    nbrMsg.classList.remove("hidden");
    nbrMsg.textContent = "";
  }
}

// Fungsi untuk mendapatkan daftar pengguna yang sedang online
async function fetchOnlineUsers() {
  try {
    const response = await fetch(`/api/customers/status/${customerId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch online users");
    }
    const users = await response.json();
    displayOnlineUsers(users);
  } catch (error) {
    console.error("Error fetching online users:", error);
  }
}

function displayOnlineUsers(users) {
  const connectedUsersElement = document.getElementById("connectedUsers");
  connectedUsersElement.innerHTML = "";

  users.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.textContent = user.username;
    userItem.dataset.userId = user.id; // Simpan ID pengguna dalam atribut data
    userItem.classList.add("user-item");
    userItem.id = user.id; // Pastikan ID pengguna disetel di sini
    userItem.addEventListener("click", () => userItemClick(user.id));

    connectedUsersElement.appendChild(userItem);
  });
}

function onLogout() {
  stompClient.send(
    "/app/customer.disconnectCustomer",
    {},
    JSON.stringify({ customerId: customerId })
  );
  window.location.reload();
}

customerIdForm.addEventListener("submit", connect, true);
messageForm.addEventListener("submit", sendMessage, true);
logout.addEventListener("click", onLogout, true);
window.onbeforeunload = () => onLogout();
