import React, { useState } from "react";
import { Form, Button, Image, InputGroup } from "react-bootstrap";
import Clarifai from "clarifai";

const ModifyImageForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [description, setDescription] = useState("");

  const API_KEY = "<your_clarifai_api_key>";
  const MODEL_ID = "c0c0ac362b03416da06ab3fa36fb58e3";

  const clarifai = new Clarifai.App({ apiKey: API_KEY });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    try {
      const base64 = await toBase64(file);
      const response = await clarifai.models.predict(MODEL_ID, { base64 });

      const descriptions = response.outputs[0].data.concepts.map(
        (concept) => concept.name
      );

      setDescription(descriptions.join(", "));
    } catch (error) {
      console.error(error);
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="imageUpload">
        <Form.Label>Upload Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </Form.Group>
      {preview && <Image src={preview} thumbnail />}
      <Form.Group controlId="imageDescription">
        <Form.Label>Image Description</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={description}
            readOnly
          />
        </InputGroup>
      </Form.Group>
      <Button type="submit" className="mt-3">
        Get Description
      </Button>
    </Form>
  );
};

export default ModifyImageForm;
