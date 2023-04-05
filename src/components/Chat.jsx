import React, { useState } from "react";
import axios from "axios";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./styles.css/Chat.css";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      const aiResponse = response.data.choices[0].message.content;
      setChatLog((prevState) => [
        ...prevState,
        { user: message, ai: aiResponse },
      ]);
      setMessage("");

      // Guardar la conversación en Firebase
      const chatRef = collection(db, "chatLogs");
      await addDoc(chatRef, { user: message, ai: aiResponse });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chatLog.map((log, index) => (
          <div
            key={index}
            className={`chat-message ${
              log.user === "User" ? "user" : "ai"
            }`}
          >
            {log.user}: {log.ai}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
