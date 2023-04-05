import React, { useState } from 'react';
import axios from 'axios';
import './styles.css/NewImage.css';
import { uploadImage, downloadImage } from '../firebase/firebaseStorage';

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

  const handleDownloadImage = async () => {
    try {
      setLoading(true);
      const imageName = 'imagen-generada.jpg';
      const response = await axios.get(imageSrc, { responseType: 'blob' });
      const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = await uploadImage(imageBlob, imageName);
      window.open(await downloadImage(imageName), '_blank');
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setLoading(false);
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
      {imageSrc && (
        <div>
          <h2>Imagen generada:</h2>
          <img src={imageSrc} alt="Imagen generada" />
          <button
            onClick={async () => {
              setLoading(true);
              try {
                const imageName = 'imagen-generada.jpg';
                const imageUrl = await uploadImage(imageSrc, imageName);
                await saveChatLog({
                  type: 'image',
                  message: imageUrl,
                  timestamp: new Date().getTime(),
                });
                window.open(await downloadImage(imageName), '_blank');
              } catch (error) {
                console.error('Error downloading image:', error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? 'Descargando...' : 'Descargar imagen'}
          </button>
        </div>
      )}
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