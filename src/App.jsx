import { useState } from 'react';
import NewImage from './components/NewImage';
import ModifyImageForm from './components/ModifyImageForm';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import './App.css';
import ChatComponent from './components/Chat';

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
      {modifyImage && <ModifyImageForm />}
      <ChatComponent />
      <Footer />
    </div>
  );
};

export default App;