'use strict';

const customerIdPage = document.querySelector('#customerId-page');
const chatPage = document.querySelector('#chat-page');
const customerIdForm = document.querySelector('#customerIdForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const connectingElement = document.querySelector('.connecting');
const chatArea = document.querySelector('#chat-messages');
const logout = document.querySelector('#logout');

let stompClient = null;
let fullname = null;
let selectedUserId = null;

let customerId = null;

// Panggil fetchOnlineUsers ketika halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    fetchOnlineUsers();
});

// Panggil fetchOnlineUsers ketika halaman dimuat dan setiap 5 detik
document.addEventListener('DOMContentLoaded', () => {
    fetchOnlineUsers();
    setInterval(fetchOnlineUsers, 5000); // Perbarui daftar setiap 5 detik
});


function connect(event) {
    customerId = document.querySelector('#customerId').value.trim();

    if (customerId) {
        customerIdPage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    stompClient.subscribe(`/customer/${customerId}/queue/messages`, onMessageReceived);
    stompClient.subscribe(`/customer/public`, onMessageReceived);

    // Permintaan untuk mengambil informasi pelanggan berdasarkan customerId
    stompClient.send("/app/customer.searchCustomer", {}, JSON.stringify({customerId: customerId}));

    findAndDisplayConnectedUsers().then();
}

async function findAndDisplayConnectedUsers() {
    const connectedUsersResponse = await fetch('/api/customers/status');
    let connectedUsers = await connectedUsersResponse.json();
    connectedUsers = connectedUsers.filter(user => user.id !== customerId);
    const connectedUsersList = document.getElementById('connectedUsers');
    connectedUsersList.innerHTML = '';

    connectedUsers.forEach(user => {
        appendUserElement(user, connectedUsersList);
    });
}

function appendUserElement(user, connectedUsersList) {
    const listItem = document.createElement('li');
    listItem.classList.add('user-item');
    listItem.id = user.id;

    const userImage = document.createElement('img');
    userImage.src = '../img/user_icon.png';
    userImage.alt = user.fullName;

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = user.fullName;

    const receivedMsgs = document.createElement('span');
    receivedMsgs.textContent = '0';
    receivedMsgs.classList.add('nbr-msg', 'hidden');

    listItem.appendChild(userImage);
    listItem.appendChild(usernameSpan);
    listItem.appendChild(receivedMsgs);

    listItem.addEventListener('click', userItemClick);

    connectedUsersList.appendChild(listItem);
}

function userItemClick(event) {
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
    });
    messageForm.classList.remove('hidden');

    const clickedUser = event.currentTarget;
    clickedUser.classList.add('active');

    selectedUserId = clickedUser.getAttribute('id');
    fetchAndDisplayUserChat().then();

    const nbrMsg = clickedUser.querySelector('.nbr-msg');
    nbrMsg.classList.add('hidden');
    nbrMsg.textContent = '0';
}

function displayMessage(senderId, content) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    if (senderId === customerId) {
        messageContainer.classList.add('sender');
    } else {
        messageContainer.classList.add('receiver');
    }
    const message = document.createElement('p');
    message.textContent = content;
    messageContainer.appendChild(message);
    chatArea.appendChild(messageContainer);
}

async function fetchAndDisplayUserChat() {
    try {
        const userChatResponse = await fetch(`/messages/${customerId}/${selectedUserId}`);
        if (!userChatResponse.ok) {
            throw new Error(`Failed to fetch chats: ${userChatResponse.status}`);
        }

        const userChat = await userChatResponse.json();

        chatArea.innerHTML = '';
        userChat.forEach(chat => {
            displayMessage(chat.senderId, chat.content);
        });
        chatArea.scrollTop = chatArea.scrollHeight;
    } catch (error) {
        console.error('Error fetching user chat:', error);
    }
}

function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {
    const messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        const chatMessage = {
            senderId: customerId,
            recipientId: selectedUserId,
            content: messageInput.value.trim(),
            timestamp: new Date()
        };
        stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
        displayMessage(customerId, messageInput.value.trim());
        messageInput.value = '';
    }
    chatArea.scrollTop = chatArea.scrollHeight;
    event.preventDefault();
}

async function onMessageReceived(payload) {
    await findAndDisplayConnectedUsers();
    console.log('Message received', payload);
    const message = JSON.parse(payload.body);
    if (selectedUserId && selectedUserId === message.senderId) {
        displayMessage(message.senderId, message.content);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    const notifiedUser = document.querySelector(`#${message.senderId}`);
    if (notifiedUser && !notifiedUser.classList.contains('active')) {
        const nbrMsg = notifiedUser.querySelector('.nbr-msg');
        nbrMsg.classList.remove('hidden');
        nbrMsg.textContent = '';
    }
}

// Fungsi untuk mendapatkan daftar pengguna yang sedang online
async function fetchOnlineUsers() {
    try {
        const response = await fetch('/api/customers/status');
        if (!response.ok) {
            throw new Error('Failed to fetch online users');
        }
        const users = await response.json();
        displayOnlineUsers(users);
    } catch (error) {
        console.error('Error fetching online users:', error);
    }
}

// Fungsi untuk menampilkan daftar pengguna yang sedang online
function displayOnlineUsers(users) {
    const connectedUsersElement = document.getElementById('connectedUsers');
    connectedUsersElement.innerHTML = ''; // Kosongkan elemen sebelum memperbarui

    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.textContent = user.username; // Tampilkan username pengguna
        userItem.dataset.userId = user.id; // Simpan ID pengguna jika diperlukan untuk fungsi lain
        userItem.classList.add('user-item'); // Tambahkan kelas untuk styling
        userItem.addEventListener('click', () => {
            // Memungkinkan pengguna untuk memulai percakapan dengan pengguna lain saat di-klik
            userItemClick(user.id);
        });
        connectedUsersElement.appendChild(userItem);
    });
}


function onLogout() {
    stompClient.send("/app/customer.disconnectCustomer", {}, JSON.stringify({ customerId: customerId}));
    window.location.reload();
}

customerIdForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);
logout.addEventListener('click', onLogout, true);
window.onbeforeunload = () => onLogout();
