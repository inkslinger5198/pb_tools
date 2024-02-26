import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import {TimeConverter, List_Saver} from './items';

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/time-converter" element={<TimeConverter />} />
      <Route path="/list-saver" element={<List_Saver />} />
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);


