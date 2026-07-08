import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//  Cari element dengan id="root" di HTML 
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
//  Render App component ke element root 
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
