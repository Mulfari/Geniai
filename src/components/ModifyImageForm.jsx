import { useState } from 'react';
import axios from 'axios';

const ModifyImageForm = () => {
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const getImageDescription = async (e) => {
    e.preventDefault();

    // Asegúrate de agregar tus credenciales de API correctas
    const clarifaiApiKey = 'a270745c80654ce085dc1b12c1415227';
    const openaiApiKey = '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';

    // Crear un objeto FormData para enviar la imagen
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      // Convierte la imagen a base64
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];

        // Utiliza Clarifai API para extraer etiquetas de la imagen
        const clarifaiResponse = async (imageData) => {
          try {
            const response = await app.models.predict(Clarifai.GENERAL_MODEL, {base64: imageData});
            
            console.log("Respuesta completa de Clarifai API:", response);
        
            // Agrega un registro de consola aquí
            console.log("Antes de verificar si 'response' y 'response.outputs' existen");
            
            if (response && response.outputs) {
              const concepts = response.outputs[0].data.concepts;
              const descriptions = concepts.map((concept) => concept.name);
              setDescription(descriptions.join(", "));
            } else {
              console.error("No se encontraron 'outputs' en la respuesta de la API de Clarifai");
            }
          } catch (error) {
            console.error("Error al obtener la descripción de la imagen:", error);
          }
        };
        
        
        
        
        

        const labels = clarifaiResponse.data.outputs[0].data.concepts
          .map((concept) => concept.name)
          .join(', ');

        // Utiliza OpenAI API para generar una descripción basada en las etiquetas de la imagen
        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/engines/davinci-codex/completions',
          {
            prompt: `Describe una imagen que contiene ${labels}:`,
            max_tokens: 50,
            n: 1,
            stop: null,
            temperature: 0.7,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`,
            },
          }
        );

        setDescription(openaiResponse.data.choices[0].text.trim());
      };
    } catch (error) {
      console.error('Error al obtener la descripción de la imagen:',error);
    }
    };
    
    return (
    <div>
    <h2>Modificar imagen</h2>
    <form onSubmit={getImageDescription}>
    <div>
    <label htmlFor="image">Cargar imagen:</label>
    <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
    </div>
    <button type="submit">Obtener descripción</button>
    </form>
    {description && (
    <div>
    <h3>Descripción de la imagen:</h3>
    <p>{description}</p>
    </div>
    )}
    </div>
    );
    };
    
    export default ModifyImageForm;
