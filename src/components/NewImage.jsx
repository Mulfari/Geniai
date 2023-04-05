import React, { useState } from 'react';
import axios from 'axios';
import './styles.css/NewImage.css';
import { uploadImageToFirebase } from '../firebase/firebaseStorage';



const NewImage = () => {
  const [description, setDescription] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
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

  const saveGeneratedImage = async () => {
    if (!generatedImage) {
      alert('No hay imagen generada para guardar.');
      return;
    }
  
    const fileName = `generated-image-${Date.now()}.png`;
    const response = await fetch(generatedImage);
    const imageBlob = await response.blob();
  
    try {
      const downloadURL = await uploadImageToFirebase(fileName, imageBlob);
      alert(`Imagen guardada en Firebase Storage. URL de descarga: ${downloadURL}`);
    } catch (error) {
      console.error('Error al guardar la imagen en Firebase Storage:', error);
    }
  };
  

  const generateSimilarImages = async () => {
    setLoading(true);
    const generatedImages = [];

    for (let i = 0; i < 3; i++) {
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

        generatedImages.push(response.data.data[0].url);
      } catch (error) {
        console.error('Error generating similar image:', error);
      }
    }

    setAdditionalImages(generatedImages);
    setLoading(false);
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
        <button onClick={generateSimilarImages} disabled={loading}>
          {loading ? 'Generando coincidencias...' : 'Generar coincidencias'}
        </button>
      )}
      {imageSrc && (
        <div>
          <h2>Imagen generada:</h2>
          <img src={imageSrc} alt="Imagen generada" />
        </div>
      )}
      <button onClick={saveGeneratedImage}>Descargar imagen generada</button>
      {additionalImages.length > 0 && (
        <div>
                    <h2>Imágenes similares:</h2>
          {additionalImages.map((src, index) => (
            <img key={index} src={src} alt={`Imagen similar ${index + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewImage;