import { useState } from 'react';
import NewImage from './components/NewImage';
import ModifyImageForm from './components/ModifyImageForm';
import HomePage from './components/HomePage';
import './App.css';

const App = () => {
  const [newImage, setNewImage] = useState(false);
  const [modifyImage, setModifyImage] = useState(false);

  const handleNewImage = () => {
    setNewImage(true);
    setModifyImage(false);
  };

  const handleModifyImage = () => {
    setNewImage(false);
    setModifyImage(true);
  };

  return (
    <div>
      <HomePage />
      <h1>Bienvenido a nuestra aplicación</h1>
      <button onClick={handleNewImage}>Nueva imagen</button>
      <button onClick={handleModifyImage}>Modificar imagen</button>
      {newImage && <NewImage />}
      {modifyImage && <ModifyImageForm />}
    </div>
  );
};

export default App;