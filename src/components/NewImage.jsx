import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [description, setDescription] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  
  
  const generateImage = async () => {
    setLoading(true);
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: 'image-alpha-001',
          prompt: description,
          num_images: 1,
          size: "512x512",
          response_format: 'url',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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',
          },
        }
      );
  
      setImageSrc(response.data.data[0].url);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div>
      <h1>Generador de imágenes con DALL-E 2</h1>
      <input
        type="text"
        placeholder="Descripción de la imagen"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={generateImage} disabled={loading}>
        {loading ? 'Generando...' : 'Generar imagen'}
      </button>
      {imageSrc && (
        <div>
          <h2>Imagen generada:</h2>
          <img src={imageSrc} alt="Imagen generada" />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
