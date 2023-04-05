// ImageEdit.js
import React, { useState } from 'react';
import axios from 'axios';

const ImageEdit = () => {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [editedImage, setEditedImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !prompt) {
      alert('Por favor, selecciona una imagen y escribe un texto.');
      return;
    }

    const imageToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const base64Image = await imageToBase64(image);
    const strippedBase64Image = base64Image.replace('data:image/png;base64,', '');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/edits',
        {
          image: strippedBase64Image,
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'url',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      setEditedImage(response.data.data[0].url);
    } catch (error) {
      console.error('Error al generar la imagen editada:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/png" onChange={handleImageChange} />
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          maxLength="1000"
          placeholder="Escribe una descripción"
        />
        <button type="submit">Generar imagen editada</button>
      </form>
      {editedImage && (
        <div>
          <h2>Imagen editada:</h2>
          <img src={editedImage} alt="Imagen editada" />
        </div>
      )}
    </div>
  );
};

export default ImageEdit;
