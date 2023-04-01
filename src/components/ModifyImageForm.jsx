import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: "a270745c80654ce085dc1b12c1415227",
});

const ModifyImageForm = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const base64Image = await toBase64(image);

    app.models
      .predict(Clarifai.GENERAL_MODEL, { base64: base64Image.split(",")[1] })
      .then((response) => {
        const concepts = response.outputs[0].data.concepts;
        const descriptions = concepts.map((concept) => concept.name);
        setDescription(descriptions.join(", "));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formImageFile">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Get Description
        </Button>
      </Form>
      {description && <p>{description}</p>}
    </div>
  );
};

export default ModifyImageForm;