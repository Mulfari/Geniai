import React from 'react';
import './styles.css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">GeniAI</div>
        <ul className="navbar-menu">
          <li>
            <a href="#new-image">Nueva imagen</a>
          </li>
          <li>
            <a href="#modify-image">Modificar imagen</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;