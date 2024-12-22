import React, { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input }]);
      setInput("");

      // Simulate a bot response (replace this logic with your actual bot API call)
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "nak beli ape dik?" },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chatbot Toggle Button */}
      <button
        onClick={toggleChatbot}
        className="w-16 h-16 p-3 rounded-full shadow-lg text-white bg-tertiary hover:bg-red-500 transition-all"
      >
        {isOpen ? "X" : "💬"}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="w-72 bg-white shadow-xl rounded-lg mt-3 p-4 border border-gray-300">
          <div className="flex flex-col h-80">
            {/* Header */}
            <div className="text-lg font-semibold text-center text-gray-700 border-b pb-2">
              Chatbot
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mt-3 space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg text-white ${
                      message.sender === "user"
                        ? "bg-tertiary"
                        : "bg-gray-400"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Field */}
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-800"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-tertiary text-white p-2 rounded-lg hover:bg-red-500 transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
