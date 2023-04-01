import React, { useState } from "react";
import axios from "axios";
import "./styles.css/ModifyImageForm.css";

const ImageDescriptionForm = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const clarifaiApiKey = "a270745c80654ce085dc1b12c1415227";

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!image) return;

    const base64Image = await toBase64(image);
    const clarifaiResponse = await axios.post(
      "https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs",
      { inputs: [{ data: { image: { base64: base64Image.split("base64,")[1] } } }] },
      { headers: { Authorization: `Key ${clarifaiApiKey}` } }
    );

    const descriptions = clarifaiResponse.data.outputs[0].data.concepts.map(
      (concept) => concept.name
    );
    setDescription(descriptions.join(", "));
  };

  const onImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <div className="image-description-form">
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onImageChange} />
        <button type="submit">Obtener descripción</button>
      </form>
      <p>{description}</p>
    </div>
  );
};

export default ImageDescriptionForm;