import React from 'react';
import './styles.css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} GeniAI. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
