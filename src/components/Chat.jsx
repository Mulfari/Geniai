import React, { useState } from "react";
import axios from "axios";
import './styles.css/Chat.css';

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await axios.post("https://api.openai.com/v1/engines/davinci/completions", {
        prompt: `User: ${message}\nAI:`,
        max_tokens: 100,
        n: 1,
        stop: "\n",
        temperature: 0.5
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        }
      });
      setChatLog(prevState => [...prevState, { user: message, ai: response.data.choices[0].text }]);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chatLog.map((log, index) => (
          <div key={index} className={`chat-message ${log.user === "User" ? "user" : "ai"}`}>
            {log.user}: {log.ai}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
