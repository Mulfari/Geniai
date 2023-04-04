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
      "https://api.openai.com/v1/images/create",
      {
        model: "image-alpha-001",
        data: `image/jpeg;base64,${base64Image.split("base64,")[1]}`,
        size: "512x512",
      },
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      }
    );
    const jobId = response.data.id;
    setTimeout(async () => {
      const resultResponse = await axios.get(
        `https://api.openai.com/v1/images/${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      const generatedImageURL = resultResponse.data.data.url;
      setGeneratedImage(generatedImageURL);
    }, 10000);
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
