import React, { useState } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    setMessages([...messages, { role: 'user', content: inputMessage }]);

    const data = {
      "prompt": inputMessage,
      "temperature": 0.7,
      "max_tokens": 60,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
    };

    try {
      const response = await axios.post('https://api.openai.com/v1/engine/turing/completions/531ccfb7-8359-4d8f-80c3-2f84b667938f', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      });

      const aiMessage = response.data.choices[0].text;
      setMessages([...messages, { role: 'ai', content: aiMessage }]);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }

    setInputMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
