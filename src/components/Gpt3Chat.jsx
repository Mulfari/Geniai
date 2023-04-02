// Gpt3Chat.js
import React, { useState } from 'react';
import axios from 'axios';

const Gpt3Chat = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const getGPT3Response = async () => {
    const data = {
      'messages': [
        {
          'role': 'system',
          'content': 'You are a helpful assistant.'
        },
        {
          'role': 'user',
          'content': prompt
        }
      ],
    };

    try {
      const result = await axios.post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },        
      });

      setResponse(result.data.choices[0].message.content);
    } catch (error) {
      console.error('Error calling GPT-3 API:', error);
      alert('Error al obtener respuesta de GPT-3. Verifica la consola para más detalles.');
    }
  };

  const handleSubmit = (event) => {    event.preventDefault();
    getGPT3Response();
  };

  return (
    <div>
      <h2>OpenAI Chat Component</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
      {response && (
        <div>
          <h3>Respuesta:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Gpt3Chat;
