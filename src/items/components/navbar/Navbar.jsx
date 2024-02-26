import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
const Navbar = () => {
  return (
    <div className="navbar">
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/time-converter">Time Converter</Link>
          </li>
          <li>
            <Link to="/list-saver">To Do</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
