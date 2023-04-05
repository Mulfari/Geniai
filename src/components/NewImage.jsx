import React, { useState } from 'react';
import axios from 'axios';
import './styles.css/NewImage.css';
import { uploadImageToFirebase } from '../FirebaseStorage';

const NewImage = () => {
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
          size: '512x512',
          response_format: 'url',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
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

  const uploadGeneratedImageToFirebase = async () => {
    if (!imageSrc) {
      alert('No hay imagen generada para subir.');
      return;
    }

    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const corsFreeUrl = corsProxy + imageSrc;
    const fileName = `generated-image-${Date.now()}.png`;
    const response = await fetch(corsFreeUrl);
    const imageBlob = await response.blob();

    try {
      const downloadURL = await uploadImageToFirebase(fileName, imageBlob);
      alert(`Imagen subida a Firebase Storage. URL de descarga: ${downloadURL}`);
    } catch (error) {
      console.error('Error al subir la imagen a Firebase Storage:', error);
    }
  };

  return (
    <div className="new-image-container">
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
          <button onClick={uploadGeneratedImageToFirebase}>Subir imagen a Firebase</button>
        </div>
      )}
    </div>
  );
};

export default NewImage;
