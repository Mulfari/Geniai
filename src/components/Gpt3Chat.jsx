import React, { useState } from 'react';
import axios from 'axios';

const Gpt3Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const apiKey = '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';

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    setMessages([...messages, { type: 'user', text: inputMessage }]);
    setInputMessage('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt: `${messages.map((msg) => msg.text).join('\n')}\n${inputMessage}\n`,
          max_tokens: 100,
          n: 1,
          stop: null,
          temperature: 0.8,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      const gpt3Reply = response.data.choices[0].text.trim();
      setMessages([...messages, { type: 'gpt3', text: gpt3Reply }]);
    } catch (error) {
      console.error('Error sending message to GPT-3:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Gpt3Chat;
