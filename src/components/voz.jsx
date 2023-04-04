import React, { useState } from "react";
import axios from "axios";

const VoiceToText = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");

  const handleAudioChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!audioFile) return;

    const formData = new FormData();
    formData.append("audio", audioFile);

    const response = await axios.post(
      "https://api.openai.com/v1/audio-to-text",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    setTranscription(response.data.text);
  };

  return (
    <div>
      <h2>Voz a Texto</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="audio-file">Seleccionar archivo de audio:</label>
        <input type="file" id="audio-file" onChange={handleAudioChange} />
        <button type="submit">Transcribir</button>
      </form>
      <p>{transcription}</p>
    </div>
  );
};

export default VoiceToText;
