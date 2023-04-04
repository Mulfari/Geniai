import React, { useState } from "react";
import axios from "axios";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await axios.post("https://api.openai.com/v1/engines/davinci-codex/completions", {
        prompt: `User: ${message}\nAI:`,
        max_tokens: 50,
        temperature: 0.5
      }, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        }
      });
      setChatLog(prevState => [...prevState, { user: message, ai: response.data.choices[0].text }]);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        {chatLog.map((log, index) => (
          <div key={index}>
            <div>{log.user}</div>
            <div>{log.ai}</div>
          </div>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
