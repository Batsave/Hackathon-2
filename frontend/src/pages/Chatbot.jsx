import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../scss/chatbot.scss";

/* eslint-disable */

const socket = io(import.meta.env.VITE_BACKEND_URL);
export default function Chatbot({ isVisible }) {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitiated, setHasInitiated] = useState(false);
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
    if (isVisible && !hasInitiated) {
      socket.emit("initiate");
      setHasInitiated(true);
    }

    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, author: "bot" },
      ]);
      scrollToBottom();
    });

    return () => socket.off("message");
  }, [isVisible]);

  useEffect(scrollToBottom, [messages]);

  return (
    <div>
      {isVisible && (
        <div className="chatbot-container">
          <div className="message-area">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.author === "user" ? "user-message" : "bot-message"
                }`}
              >
                {message.author === "user" ? null : (
                  <div className="containIco">
                    <div className="botIcon" />
                    <p>LorIA</p>
                  </div>
                )}
                {message.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {isTyping && (
            <div className="typingAnimation">
              <span className="typing-indicator">.</span>
              <span className="typing-indicator">.</span>
              <span className="typing-indicator">.</span>
            </div>
          )}
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
    </div>
  );
}
