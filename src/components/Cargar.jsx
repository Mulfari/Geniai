import React, { useState } from "react";
import axios from "axios";

const DalleImageGenerator = () => {
  const [image, setImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const base64Image = await convertToBase64(file);
    setImage(base64Image);
    generateImage(base64Image);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const generateImage = async (base64Image) => {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "image-alpha-001",
        prompt: `Generate an image similar to the input image.\nImage:\n[data:image/jpeg;base64,${base64Image.split("base64,")[1]}]`,
        num_images: 1,
        size: "512x512",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const generatedImageURL = response.data.data[0].url;
    setGeneratedImage(generatedImageURL);
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {image && (
        <div>
          <h2>Input Image:</h2>
          <img src={image} alt="input" />
        </div>
      )}
      {generatedImage && (
        <div>
          <h2>Generated Image:</h2>
          <img src={generatedImage} alt="generated" />
        </div>
      )}
    </div>
  );
};

export default DalleImageGenerator;
