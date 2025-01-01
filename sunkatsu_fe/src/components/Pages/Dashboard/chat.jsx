import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default function ChatApp() {
  const [customerId, setCustomerId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [customerName, setCustomerName] = useState("");
  const chatAreaRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      findAndDisplayConnectedUsers();
      const interval = setInterval(findAndDisplayConnectedUsers, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && selectedUserId) {
      const interval = setInterval(fetchAndDisplayUserChat, 1000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, selectedUserId]);

  const connect = (event) => {
    event.preventDefault();
    if (customerId.trim()) {
      setIsLoggedIn(true);
      const socket = new SockJS("/ws");
      const client = Stomp.over(socket);
      client.connect({}, onConnected, onError);
      setStompClient(client);
    }
  };

  const onConnected = () => {
    stompClient.subscribe(
      `/user/${customerId}/queue/messages`,
      onMessageReceived
    );
    stompClient.subscribe(`/user/public`, onMessageReceived);
    stompClient.send("/app/user.searchUser", {}, customerId);
    findAndDisplayConnectedUsers();
    fetchCustomerInfo(customerId);
  };

  const onError = () => {
    console.error(
      "Could not connect to WebSocket server. Please refresh this page to try again!"
    );
  };

  const fetchCustomerInfo = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (response.ok) {
        const customer = await response.json();
        setCustomerName(customer.username);
      }
    } catch (error) {
      console.error("Error fetching customer info:", error);
    }
  };

  const findAndDisplayConnectedUsers = async () => {
    try {
      const response = await fetch(`/api/users/status/${customerId}`);
      if (response.ok) {
        const users = await response.json();
        setConnectedUsers(users);
      }
    } catch (error) {
      console.error("Error fetching connected users:", error);
    }
  };

  const userItemClick = (userId) => {
    setSelectedUserId(userId);
    fetchAndDisplayUserChat();
  };

  const fetchAndDisplayUserChat = async () => {
    try {
      const response = await fetch(`/messages/${customerId}/${selectedUserId}`);
      if (response.ok) {
        const chat = await response.json();
        setMessages(chat);
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
      }
    } catch (error) {
      console.error("Error fetching user chat:", error);
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (messageInput.trim() && stompClient && selectedUserId) {
      const chatMessage = {
        senderId: customerId,
        recipientId: selectedUserId,
        content: messageInput.trim(),
        timestamp: new Date(),
      };
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
      setMessages([...messages, chatMessage]);
      setMessageInput("");
    }
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    if (message.id === customerId) {
      fetchCustomerInfo(customerId);
    }
    findAndDisplayConnectedUsers();
    if (selectedUserId && selectedUserId === message.senderId) {
      setMessages([...messages, message]);
    }
  };

  const onLogout = () => {
    stompClient.send(
      "/app/customer.disconnectCustomer",
      {},
      JSON.stringify({ customerId: customerId })
    );
    setIsLoggedIn(false);
    setCustomerId("");
    setSelectedUserId(null);
    setMessages([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Sunkatsu Chat</h2>
      {!isLoggedIn ? (
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Enter Chatroom
          </h2>
          <form onSubmit={connect}>
            <label htmlFor="customerId" className="block mb-2">
              Customer ID:
            </label>
            <input
              type="text"
              id="customerId"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Enter Chatroom
            </button>
          </form>
        </div>
      ) : (
        <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="w-1/3 bg-blue-500 p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Online Users
              </h2>
              <ul className="space-y-2">
                {connectedUsers.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => userItemClick(user.id)}
                    className={`flex items-center cursor-pointer p-2 rounded ${
                      selectedUserId === user.id
                        ? "bg-blue-200 text-gray-800"
                        : "text-white"
                    }`}
                  >
                    <img
                      src="../img/user_icon.png"
                      alt={user.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{user.username}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white mb-2">
                Logged in as{" "}
                <span className="font-semibold">{customerName}</span>
              </p>
              <button onClick={onLogout} className="text-white hover:underline">
                Logout
              </button>
            </div>
          </div>
          <div className="w-2/3 p-4 flex flex-col">
            <div ref={chatAreaRef} className="flex-1 overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg ${
                    msg.senderId === customerId
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-gray-800 self-start"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-l"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
