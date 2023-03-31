import React, { useState } from 'react';
import axios from 'axios';

const ImageModifier = () => {
  const [description, setDescription] = useState('');
  const [originalImage, setOriginalImage] = useState(null);
  const [modifiedImage, setModifiedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadOriginalImage = async (event) => {
    setLoading(true);

    try {
      const file = event.target.files[0];

      // Read the file data as a base64 encoded string
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;

        // Upload the image to OpenAI's DALL-E 2 API
        const response = await axios.post(
          'https://api.openai.com/v1/images/generations',
          {
            model: 'image-alpha-001',
            image: base64data.split(',')[1], // The base64 encoded image data (without the "data:image/jpeg;base64," prefix)
            size: "512x512",
            response_format: 'url',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_API_KEY',
            },
          }
        );

        // Set the original image and clear the description
        setOriginalImage(response.data.data[0].url);
        setDescription('');
      };
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const modifyImage = async () => {
    setLoading(true);

    try {
      // Upload the modified image to OpenAI's DALL-E 2 API
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: 'image-alpha-001',
          prompt: description,
          image: modifiedImage.split(',')[1], // The base64 encoded image data (without the "data:image/jpeg;base64," prefix)
          size: "512x512",
          response_format: 'url',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY',
          },
        }
      );

      // Set the modified image and clear the description
      setModifiedImage(response.data.data[0].url);
      setDescription('');
    } catch (error) {
      console.error('Error generating modified image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <h1>Modificador de imágenes con DALL-E 2</h1>
    <input
    type="text"
    placeholder="URL de la imagen a modificar"
    value={imageUrl}
    onChange={(e) => setImageUrl(e.target.value)}
    />
    <input
    type="text"
    placeholder="Descripción de la modificación"
    value={modificationDescription}
    onChange={(e) => setModificationDescription(e.target.value)}
    />
    <button onClick={modifyImage} disabled={loading}>
    {loading ? 'Modificando...' : 'Modificar imagen'}
    </button>
    {imageSrc && (
    <div>
    <h2>Imagen modificada:</h2>
    <img src={imageSrc} alt="Imagen modificada" />
    </div>
    )}
    </div>
    );
    };
    
    export default ModifyImageForm;