import React, { useState } from "react";
import axios from "axios";

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [filteredImage, setFilteredImage] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const base64Image = await convertToBase64(file);
    setImage(base64Image);
    applyFilter(base64Image);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const applyFilter = async (base64Image) => {
    const response = await axios.post(
      "https://api.openai.com/v1/images/create",
      {
        prompt: "Apply a cool filter to this image:",
        images: [base64Image.split("base64,")[1]],
        size: [512, 512],
        response_format: "url",
      },
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      }
    );
    const filteredImageURL = response.data.data[0];
    setFilteredImage(filteredImageURL);
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {image && (
        <div>
          <h2>Original Image:</h2>
          <img src={image} alt="original" />
        </div>
      )}
      {filteredImage && (
        <div>
          <h2>Filtered Image:</h2>
          <img src={filteredImage} alt="filtered" />
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
