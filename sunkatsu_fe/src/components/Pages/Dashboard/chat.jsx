import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Fragment/Navbar";
import { ReactComponent as SendIcon } from "../../Icon/Send.svg";

// Message Component
const Message = ({ content, isSent }) => (
  <div
    className={`flex gap-4 items-start ${
      isSent ? "justify-end" : "max-w-[80%]"
    }`}
  >
    <div
      className={`${
        isSent ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
      } rounded-2xl px-4 py-2 text-base leading-relaxed`}
    >
      <p>{content}</p>
    </div>
  </div>
);

const Chat = () => {
  const [messages, setMessages] = useState([]); // Holds messages
  const [newMessage, setNewMessage] = useState(""); // Input field

  // Base API URL (change as per your Swagger documentation)
  const BASE_API_URL = "http://localhost:5000/api";

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send a new message to backend
  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent empty messages
    try {
      const message = { content: newMessage, isSent: true }; // Follow API payload structure
      const response = await axios.post(`${BASE_API_URL}/messages`, message);
      setMessages([...messages, response.data]); // Append new message
      setNewMessage(""); // Clear input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full justify-center pt-20 bg-primary">
      <Navbar />
      <main className="flex flex-grow flex-col gap-5 mx-8 sm:mx-16 lg:mx-32">
        {/* Chat Header */}
        <section className="bg-tertiary text-white p-3 rounded-t-xl">
          <h1 className="text-2xl font-semibold">Sunkatsu</h1>
        </section>

        {/* Messages Section */}
        <div className="flex flex-col flex-grow pt-10 px-4 sm:px-6 md:px-20 mb-24 bg-white rounded-b-xl overflow-y-auto">
          {messages.map((msg, index) => (
            <Message key={index} content={msg.content} isSent={msg.isSent} />
          ))}
        </div>
      </main>

      {/* Input Section */}
      <section className="fixed flex w-full justify-evenly items-center bottom-0 left-0 px-4 sm:px-8 lg:px-48 py-3 gap-4 shadow-lg bg-white">
        <input
          placeholder="Send messages..."
          className="w-full border border-gray-300 rounded-lg pl-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary hover:bg-red-400 cursor-pointer"
          onClick={sendMessage}
        >
          <SendIcon className="w-5 h-5 text-white" />
        </div>
      </section>
    </div>
  );
};

export default Chat;
