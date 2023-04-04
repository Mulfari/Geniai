import React, { useState } from 'react';
import axios from 'axios';

const TestApiKey = () => {
  const [engines, setEngines] = useState([]);
  const [error, setError] = useState(null);

  const getEngines = async () => {
    try {
      const result = await axios.get('https://api.openai.com/v1/engines', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-`,
        },
      });

      setEngines(result.data.data);
      setError(null);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      setError('Error al obtener la lista de motores. Verifica la consola para más detalles.');
    }
  };
  return (
    <div>
      <h2>List Engines Component</h2>
      <button onClick={getEngines}>Obtener lista de motores</button>
      {error && <p>{error}</p>}
      {engines.length > 0 && (
        <div>
          <h3>Motores disponibles:</h3>
          <ul>
            {engines.map((engine) => (
              <li key={engine.id}>{engine.id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestApiKey;