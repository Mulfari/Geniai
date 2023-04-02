import React, { useState } from 'react';
import axios from 'axios';

const TestApiKey = () => {
  const [response, setResponse] = useState('');

  const testAPIKey = async () => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    const data = {
      'prompt': 'Translate the following English text to French: "Hello, how are you?"',
      'max_tokens': 30,
    };

    try {
      const result = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      setResponse(result.data.choices[0].text);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      setResponse('Error al probar la API key. Verifica la consola para más detalles.');
    }
  };

  return (
    <div>
      <h2>Test API Key Component</h2>
      <button onClick={testAPIKey}>Probar API key</button>
      {response && (
        <div>
          <h3>Respuesta:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default TestApiKey;