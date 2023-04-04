import React, { useState } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    try {
      const { data } = await axios.post('https://api.openai.com/v1/engine/<ENGINE_ID>/completions', {
        prompt: message,
        max_tokens: 50,
        temperature: 0.5,
        n: 1,
        stop: "\n"
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      setResponse(data.choices[0].text);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <p>{response}</p>
    </div>
  );
}

export default ChatComponent;
