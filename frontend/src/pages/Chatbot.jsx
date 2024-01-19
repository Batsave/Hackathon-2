import "../scss/chatbot.scss";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

/* eslint-disable-next-line */
export default function Chatbot({ isVisible }) {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

  const simulateTyping = (newMessage) => {
    setIsTyping(true);
    let typedMessage = "";
    const typingSpeed = 7;
    const characters = newMessage.split("");

    const typeCharacter = (index) => {
      if (index < characters.length) {
        typedMessage += characters[index];
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          { content: typedMessage, author: "bot" },
        ]);
        scrollToBottom();
        setTimeout(() => typeCharacter(index + 1), typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: "", author: "bot" },
    ]);
    typeCharacter(0);
  };

  useEffect(() => {
    socket.on("message", (message) => {
      simulateTyping(message);
    });

    return () => socket.off("message");
  }, []);

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isVisible) {
      socket.emit("initiate");
    }
  }, [isVisible]);

  return (
    <div>
      {isVisible && (
        <div className="chatbot-container">
          <div className="message-area">
            {messages.map((message, index) => (
              <div
                /* eslint-disable-next-line */
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
            {isTyping && (
              <div className="typingAnimation">
                <span className="typing-indicator">.</span>
                <span className="typing-indicator">.</span>
                <span className="typing-indicator">.</span>
              </div>
            )}
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
    </div>
  );
}
