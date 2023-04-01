import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Clarifai } from "clarifai";
import styles from "./ModifyImageForm.module.css";

const app = new Clarifai.App({
  apiKey: "a270745c80654ce085dc1b12c1415227",
});

const ModifyImageForm = () => {
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [description, setDescription] = useState("");

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await app.models.predict(
        Clarifai.GENERAL_MODEL,
        { base64: imageDataUrl.split(",")[1] }
      );

      const descriptions = response.outputs[0].data.concepts.map(
        (concept) => concept.name
      );
      setDescription(descriptions.join(", "));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageDataUrl(await toBase64(file));
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group controlId="formFile">
        <Form.Label>Upload Image</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
      </Form.Group>
      {imageDataUrl && <img src={imageDataUrl} alt="Preview" className={styles.imagePreview} />}
      <Button type="submit" className="mt-3">
        Get Description
      </Button>
      {description && (
        <div className="mt-3">
          <h4>Description</h4>
          <p>{description}</p>
        </div>
      )}
    </Form>
  );
};

export default ModifyImageForm;