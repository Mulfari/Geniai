import './App.css';
import { useState } from 'react';
import Navbar from './components/Navbar';
import NewImage from './components/NewImage';
import ModificarImagen from './components/Modificar';
import HomePage from './components/HomePage';
import ChatComponent from './components/Chat';
import Footer from './components/Footer'
import ImageVariation from './components/Prueba';
import ImageEdit from './components/Prueba2';

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
      <Navbar />
      <HomePage />
      <h1>Bienvenido a nuestra aplicación</h1>
      <button onClick={handleNewImage}>Nueva imagen</button>
      <button onClick={handleModifyImage}>Modificar imagen</button>
      {newImage && <NewImage />}
      {modifyImage && <ModificarImagen />}
      <ChatComponent />
      <ImageVariation />
      <ImageEdit />
      <Footer />
    </div>
  );
};

export default App;