import React, { useState } from 'react';
import axios from 'axios';

const ImageComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const fileSelectedHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      alert('Selecciona una imagen antes de continuar.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('https://api.openai.com/v1/images/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      });

      const imageURL = response.data.url;
      generateSimilarImage(imageURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const generateSimilarImage = async (imageURL) => {
    const data = {
      'model': 'image-alpha-001',
      'prompt': `Create an image similar to ${imageURL}`,
      'num_images': 1,
      'size': '512x512',
    };

    try {
      const response = await axios.post('https://api.openai.com/v1/images/generations', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      });

      const generatedImageURL = response.data.data[0].url;
      setGeneratedImage(generatedImageURL);
    } catch (error) {
      console.error('Error generating similar image:', error);
    }
  };

  return (
    <div className="image-container">
      <input type="file" onChange={fileSelectedHandler} />
      <button onClick={uploadImage}>Generar imagen similar</button>
      {generatedImage && (
        <>
          <h3>Imagen generada:</h3>
          <img src={generatedImage} alt="Generated" className="generated-image" />
        </>
      )}
    </div>
  );
};

export default ImageComponent;