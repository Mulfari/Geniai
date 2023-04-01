import React, { useState } from 'react';
import axios from 'axios';
import './styles.css/ModifyImageForm.css';

const ModifyImageForm = () => {
  const [imageURL, setImageURL] = useState('');
  const [description, setDescription] = useState('');

  const getImageDescription = async () => {
    // Asegúrate de que la URL de la API sea correcta
    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

    // Agrega tus credenciales de API aquí
    const apiKey = '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';

    try {
      const response = await axios.post(apiUrl, {
        prompt: `Describe la siguiente imagen: ${imageURL}`,
        max_tokens: 50,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      setDescription(response.data.choices[0].text);
    } catch (error) {
      console.error('Error al obtener la descripción de la imagen:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getImageDescription();
  };

  return (
    <div className="modify-image-form">
      <h2>Modificar imagen</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="image-url">URL de la imagen:</label>
        <input
          type="text"
          id="image-url"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />
        <button type="submit">Obtener descripción</button>
      </form>
      {description && (
        <div className="image-description">
          <h3>Descripción de la imagen:</h3>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default ModifyImageForm;
