import React, { useState, useRef, useEffect } from "react";
import { HiArrowLeft } from "react-icons/hi";

const API_BASE = "http://localhost:8080";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    let botMsg = { sender: "bot", text: "" };
    setMessages((prev) => [...prev, botMsg]);

    try {
      const response = await fetch(`${API_BASE}/stream?message=${encodeURIComponent(input)}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botMsg.text += chunk;
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, text: botMsg.text } : msg
          )
        );
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❗ Terjadi kesalahan. Silakan coba lagi." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white border-b border-red-200 px-4 py-3 shadow-sm">
        <a
          href="/"
          className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/10 text-red-600 text-xl"
          title="Kembali"
        >
          <HiArrowLeft />
        </a>
        <span className="font-semibold text-gray-800">Sunkatsu Chatbot</span>
      </header>

      {/* Messages */}
      <main
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-white"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-lg px-4 py-2 rounded-lg shadow text-sm whitespace-pre-wrap break-words ${
              msg.sender === "user"
                ? "ml-auto bg-red-600 text-white"
                : "mr-auto bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </main>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="border-t px-4 py-3 bg-white flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan sesuatu..."
          className="flex-1 border px-3 py-2 rounded-lg text-sm focus:outline-red-400"
          required
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-lg text-sm disabled:opacity-50"
          disabled={!input.trim()}
        >
          Kirim
        </button>
      </form>
    </div>
  );
};

export default ChatbotPage;
