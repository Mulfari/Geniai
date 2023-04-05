// ImageVariation.js
import React, { useState } from 'react';
import axios from 'axios';

const ImageVariation = () => {
  const [image, setImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('https://api.openai.com/v1/images/variations', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        params: {
          n: 1,
          size: '1024x1024',
          response_format: 'url',
        },
      });

      setGeneratedImage(response.data.data[0].url);
    } catch (error) {
      console.error('Error al generar la imagen:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/png" onChange={handleChange} />
        <button type="submit">Generar imagen</button>
      </form>
      {generatedImage && (
        <div>
          <h2>Imagen generada:</h2>
          <img src={generatedImage} alt="Imagen generada" />
        </div>
      )}
    </div>
  );
};

export default ImageVariation;