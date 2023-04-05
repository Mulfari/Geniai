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

    if (!image) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    if (!prompt) {
      alert('Por favor, escribe un prompt.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);

    try {
      const response = await axios.post('https://api.openai.com/v1/images/edits', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        params: {
          n: 1,
          size: '1024x1024',
          response_format: 'url',
        },
      });

      setEditedImage(response.data.data[0].url);
    } catch (error) {
      console.error('Error al generar la imagen editada:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/png" onChange={handleImageChange} />
        <input type="text" placeholder="Prompt" value={prompt} onChange={handlePromptChange} />
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
