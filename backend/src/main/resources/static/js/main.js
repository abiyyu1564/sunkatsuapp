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

// // Panggil fetchOnlineUsers ketika halaman dimuat
// document.addEventListener("DOMContentLoaded", () => {
//   fetchOnlineUsers();
// });

// // Panggil fetchOnlineUsers ketika halaman dimuat dan setiap 5 detik
// document.addEventListener("DOMContentLoaded", () => {
//   fetchOnlineUsers();
//   setInterval(fetchOnlineUsers, 5000); // Perbarui daftar setiap 5 detik
// });

document.addEventListener("DOMContentLoaded", () => {
  findAndDisplayConnectedUsers();
  setInterval(findAndDisplayConnectedUsers, 5000); // Perbarui daftar setiap 5 detik
});

// Mulai pengambilan pesan otomatis setiap detik setelah DOM dimuat
document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    if (selectedUserId) {
      fetchAndDisplayUserChat();
    }
  }, 1000); // 1000 ms = 1 detik
});

document.addEventListener("DOMContentLoaded", async function () {
  function getCookieValue(cookieName) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const [name, value] = cookies[i].split("=");
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  }

  function parseJwt(token) {
    if (!token) {
      return null;
    }
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  // Auto connect function
  async function autoConnect() {
    const token = getCookieValue("token");
    const decodedToken = parseJwt(token);

    if (decodedToken && decodedToken.id) {
      customerId = decodedToken.id; // Set customerId dari token

      // Sembunyikan halaman login dan tampilkan chat
      customerIdPage.classList.add("hidden");
      chatPage.classList.remove("hidden");

      // Buat koneksi WebSocket
      const socket = new SockJS("/ws");
      stompClient = Stomp.over(socket);

      stompClient.connect({}, onConnected, onError);
    } else {
      console.error("Token tidak valid atau tidak ditemukan");
      // Optional: redirect ke halaman login
      // window.location.href = '/login';
    }
  }

  // Jalankan auto connect
  await autoConnect();

  // Set interval untuk update daftar user dan chat
  findAndDisplayConnectedUsers();
  setInterval(findAndDisplayConnectedUsers, 5000);

  setInterval(() => {
    if (selectedUserId) {
      fetchAndDisplayUserChat();
    }
  }, 1000);
});

function connect(userId = null) {
  try {
    // Jika userId tidak diberikan, ambil dari token
    if (!userId) {
      const token = getCookieValue("token");
      const decodedToken = parseJwt(token);
      if (!decodedToken || !decodedToken.id) {
        throw new Error("Invalid token or user ID not found");
      }
      userId = decodedToken.id;
    }

    // Set customerId
    customerId = userId;

    // Tampilkan chat page
    if (customerIdPage) {
      customerIdPage.classList.add("hidden");
    }
    chatPage.classList.remove("hidden");

    // Buat koneksi WebSocket
    const socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);

    // Connect ke WebSocket server
    stompClient.connect({}, onConnected, onError);

    return true;
  } catch (error) {
    console.error("Connection error:", error);
    onError(error);
    return false;
  }
}

function getCookieValue(cookieName) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [name, value] = cookies[i].split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}

// Fungsi helper untuk parse JWT token
function parseJwt(token) {
  if (!token) {
    return null;
  }
  const payload = token.split(".")[1];
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
}

// Event listener untuk auto-connect saat halaman dimuat
document.addEventListener("DOMContentLoaded", async function () {
  // Coba connect otomatis
  const connected = connect();

  if (connected) {
    // Set interval untuk update data
    findAndDisplayConnectedUsers();
    setInterval(findAndDisplayConnectedUsers, 5000);

    setInterval(() => {
      if (selectedUserId) {
        fetchAndDisplayUserChat();
      }
    }, 1000);
  }
});

function onConnected() {
  // Subscribe ke topik publik dan private untuk user tertentu
  stompClient.subscribe(
    `/user/${customerId}/queue/messages`,
    onMessageReceived
  );
  stompClient.subscribe(`/user/public`, onMessageReceived);
  stompClient.send("/app/user.searchUser", {}, customerId);

  // Tampilkan pengguna yang terhubung
  findAndDisplayConnectedUsers();

  // Fetch customer info setelah terkoneksi
  fetchCustomerInfo(customerId);
}

async function fetchCustomerInfo(customerId) {
  try {
    const response = await fetch(`/api/users/${customerId}`);
    if (response.ok) {
      const customer = await response.json();
      const fullnameElement = document.getElementById(
        "connected-user-fullname"
      );
      if (fullnameElement && customer.username) {
        fullnameElement.textContent = customer.username;
      }
    } else {
      console.error("Failed to fetch customer info");
    }
  } catch (error) {
    console.error("Error fetching customer info:", error);
  }
}

async function findAndDisplayConnectedUsers() {
  try {
    const connectedUsersResponse = await fetch(
      `/api/users/status/${customerId}`
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

  // Elemen untuk notifikasi jumlah pesan
  const receivedMsgs = document.createElement("span");
  receivedMsgs.textContent = ""; // Kosongkan teks di awal
  receivedMsgs.classList.add("nbr-msg", "hidden"); // Tetap hidden jika belum ada pesan baru

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

  // Reset notifikasi hanya untuk user yang diklik
  const nbrMsg = clickedUser.querySelector(".nbr-msg");
  if (nbrMsg) {
    nbrMsg.classList.add("hidden");
    nbrMsg.textContent = ""; // Kosongkan teks setelah reset
  }

  // Tampilkan chat untuk user yang diklik
  fetchAndDisplayUserChat().then();
}

function displayMessage(senderId, content, imageUrl = null) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message");

  if (senderId === customerId) {
    messageContainer.classList.add("sender");
  } else {
    messageContainer.classList.add("receiver");
  }

  // Add text message if present
  if (content) {
    const message = document.createElement("p");
    message.textContent = content;
    messageContainer.appendChild(message);
  }

  // Securely fetch and display image
  if (imageUrl) {
    fetchImageBlob(imageUrl)
      .then((blobUrl) => {
        const image = document.createElement("img");
        image.src = blobUrl;
        image.alt = "Image";
        image.style.maxWidth = "200px";
        image.style.borderRadius = "8px";
        image.style.marginTop = "5px";
        messageContainer.appendChild(image);
        chatArea.scrollTop = chatArea.scrollHeight;
      })
      .catch((err) => {
        console.error("Error loading chat image:", err);
      });
  }

  chatArea.appendChild(messageContainer);
  chatArea.scrollTop = chatArea.scrollHeight;
}

async function fetchImageBlob(imageUrl) {
  const token = getToken(); 
  const baseURL = "http://localhost:8080"; 

  const fullUrl = baseURL + imageUrl;

  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Image fetch failed");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}


const renderedMessageIds = new Set();

async function fetchAndDisplayUserChat() {
  try {
    const response = await fetch(`/messages/${customerId}/${selectedUserId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chats: ${response.status}`);
    }

    const userChat = await response.json();

    // Only render messages that haven't been rendered before
    userChat.forEach((chat) => {
      if (!renderedMessageIds.has(chat.id)) {
        displayMessage(chat.senderId, chat.content, chat.imageUrl);
        renderedMessageIds.add(chat.id);
      }
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


function getToken() {
  return getCookieValue("token"); // assuming the JWT is stored as a cookie
}

async function sendMessage(event) {
  event.preventDefault();

  const messageContent = messageInput.value.trim();
  const imageFile = document.querySelector("#imageInput").files[0];

  let imageUrl = null;

  if (imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);

    const token = getToken();

    try {
      const uploadResponse = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (uploadResponse.ok) {
        imageUrl = await uploadResponse.text();
      } else {
        console.error("Failed to upload image");
        return;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return;
    }
  }

  if ((!messageContent && !imageUrl) || !selectedUserId) return;

  const chatMessage = {
    senderId: customerId,
    recipientId: selectedUserId,
    content: messageContent || null,
    imageUrl: imageUrl || null,
    timestamp: new Date(),
  };

  stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));

  messageInput.value = "";
  document.querySelector("#imageInput").value = "";
}


async function onMessageReceived(payload) {
  console.log("Message received", payload);
  const message = JSON.parse(payload.body);

  // Perbarui username jika pesan diterima
  if (message.id === customerId) {
    fetchCustomerInfo(customerId);
  }

  // Panggil ulang fungsi untuk memperbarui daftar pengguna
  await findAndDisplayConnectedUsers();

  // Cek apakah pesan berasal dari user yang sedang aktif
  if (selectedUserId && selectedUserId === message.senderId) {
    displayMessage(message.senderId, message.content);
    chatArea.scrollTop = chatArea.scrollHeight;
  } else {
    // Jika pesan dari user lain, tampilkan notifikasi
    const notifiedUser = document.querySelector(`li[id="${message.senderId}"]`);
    if (notifiedUser) {
      const nbrMsg = notifiedUser.querySelector(".nbr-msg");
      nbrMsg.classList.remove("hidden");

      // Update jumlah pesan yang belum dibaca
      const currentCount = parseInt(nbrMsg.textContent || "0");
      nbrMsg.textContent = currentCount + 1;
    }
  }
}

// Fungsi untuk mendapatkan daftar pengguna yang sedang online
async function fetchOnlineUsers() {
  try {
    const response = await fetch(`/api/users/status/${customerId}`);
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
  window.location.href = "http://localhost:3000/menu";
}

// customerIdForm.addEventListener("submit", connect, true);
messageForm.addEventListener("submit", sendMessage, true);
logout.addEventListener("click", onLogout, true);
window.onbeforeunload = () => onLogout();
