import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../scss/chatbot.scss";

const socket = io("http://localhost:5000");
export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (currentMessage) {
      setMessages([...messages, { content: currentMessage, author: "user" }]);
      socket.emit("message", currentMessage);
      setCurrentMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, author: "bot" },
      ]);
      scrollToBottom();
    });
  }, []);

  useEffect(scrollToBottom, [messages]);

  return (
    <>
      <button
        className="button-chatbot"
        type="button"
        onClick={() => setIsChatbotVisible(!isChatbotVisible)}
      >
        {isChatbotVisible ? "Close Chat" : "Open Chat"}
      </button>
      {isChatbotVisible && (
        <div className="chatbot-container">
          <div className="message-area">
            {messages.map((message, index) => (
              <div
                // eslint-disable-next-line
                key={index}
                className={`message ${
                  message.author === "user" ? "user-message" : "bot-message"
                }`}
              >
                {message.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={currentMessage}
              onKeyPress={handleKeyPress}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <button type="button" onClick={sendMessage} className="button-send">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
