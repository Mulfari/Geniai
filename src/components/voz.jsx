import React, { useState, useEffect } from "react";

const VoiceToText = () => {
  const [transcription, setTranscription] = useState("");

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const startTranscription = () => {
    recognition.start();
  };

  const stopTranscription = () => {
    recognition.stop();
  };

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Web Speech API is not supported on this browser");
    } else {

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscription(result);
      };

      recognition.onerror = (event) => {
        alert(`Error occurred in recognition: ${event.error}`);
      };

      recognition.onend = () => {
        recognition.stop();
      };

      return () => {
        recognition.stop();
      };
    }
  }, []);

  return (
    <div>
      <button onClick={startTranscription}>Start Recording</button>
      <button onClick={stopTranscription}>Stop Recording</button>
      <p>{transcription}</p>
    </div>
  );
};

export default VoiceToText;
