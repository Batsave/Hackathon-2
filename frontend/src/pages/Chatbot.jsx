import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const sendMessage = () => {
    if (currentMessage) {
      socket.emit("message", currentMessage);
      setCurrentMessage("");
    }
  };
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  return (
    <div className="App">
      <div className="messages">
        {messages.map((message, index) => (
          // eslint-disable-next-line
          <div key={`${message}-${index}`} className="message">
            {message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button type="button" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}
