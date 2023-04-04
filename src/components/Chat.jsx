import React, { useState } from 'react';
import axios from 'axios';
import './styles.css/ChatComponent.css';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    setMessages([...messages, { role: 'user', content: inputMessage }]);

    const data = {
      'messages': messages.concat({ role: 'user', content: inputMessage }),
      'max_tokens': 50,
    };

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      });

      const aiMessage = response.data.choices[0].message.content;
      setMessages([...messages, { role: 'user', content: inputMessage }, { role: 'ai', content: aiMessage }]);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }

    setInputMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Escribe tu mensaje aquí"
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatComponent;