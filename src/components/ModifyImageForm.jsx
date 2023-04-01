import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const ImageDescriptionForm = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!image) return;

    try {
      const base64Image = await toBase64(image);
      const clarifaiApiKey = 'a270745c80654ce085dc1b12c1415227';
      const response = await axios.post(
        'https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs',
        { inputs: [{ data: { image: { base64: base64Image.split(',')[1] } } }] },
        { headers: { 'Authorization': `Key ${clarifaiApiKey}` } }
      );

      const descriptions = response.data.outputs[0].data.concepts.map((concept) => concept.name);
      setDescription(descriptions.join(', '));
    } catch (error) {
      console.error('Error fetching image description:', error);
    }
  };

  return (
    <div className="image-description-form">
      <form onSubmit={onSubmit}>
        <div className="input-container">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files[0])}
          />
        </div>
        <button type="submit">Obtener descripción</button>
      </form>
      {description && <div className="image-description">{description}</div>}
    </div>
  );
};

export default ImageDescriptionForm;
