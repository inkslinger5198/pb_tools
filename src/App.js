import React from 'react';
import './App.css';
import { Link } from "react-router-dom";
import { Navbar } from './items';

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="welcome-content">
        <h2>Welcome!</h2>
        <p>Please choose the tool you need from the navbar above.</p>
      </div>
    </div>
  );
}

export default App;
