import React, { useState } from "react";
import axios from "axios";
import { uploadImage } from "../FirebaseStorage";
import "./styles.css/ModifyImageForm.css";

const ModifyImageComponent = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);

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

    const base64Image = await toBase64(image);
    const clarifaiResponse = await axios.post(
      "https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs",
      { inputs: [{ data: { image: { base64: base64Image.split("base64,")[1] } } }] },
      { headers: { Authorization: `Key ${process.env.CLARIFAI_API_KEY}` } }
    );

    const descriptions = clarifaiResponse.data.outputs[0].data.concepts.map(
      (concept) => concept.name
    );
    setDescription(descriptions.join(", "));

    try {
      const imageURL = await uploadImage(image);
      console.log('Image uploaded successfully:', imageURL);
      generateSimilarImage(imageURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const onImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const generateSimilarImage = async (imageURL) => {
    const data = {
      'model': 'image-alpha-001',
      'prompt': `Create an image similar to ${imageURL}, but with a blue sky and a mountain in the background`,
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
    <div className="image-description-form">
      <h2 className="image-description-header">Modificar imagen</h2>
      <form onSubmit={onSubmit}>
        <input className="image-description-input" type="file" onChange={onImageChange} />
        <button className="image-description-button" type="submit">Obtener descripción y generar imagen similar</button>
      </form>
      <p>{description}</p>
      {generatedImage && (
        <>
          <h3>Imagen generada:</h3>
          <img src={generatedImage} alt="Generated" className="generated-image" />
        </>
      )}
    </div>
  );
};

export default ModifyImageComponent;