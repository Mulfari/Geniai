// Gpt3Chat.js
import React, { useState } from "react";
import axios from "axios";

const Gpt3Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const sendMessageToGPT3 = async (message) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message },
          ],
          max_tokens: 150,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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',
          },
        }
      );

      const gpt3Reply = response.data.choices[0].message.content.trim();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "user" },
        { text: gpt3Reply, sender: "gpt3" },
      ]);
    } catch (error) {
      console.error("Error sending message to GPT-3:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessageToGPT3(inputMessage);
    setInputMessage("");
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <p key={index}>
            <strong>{message.sender === "user" ? "You: " : "GPT-3: "}</strong>
            {message.text}
          </p>
        ))}
      </div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Gpt3Chat;
