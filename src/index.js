import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainApp from './MainApp'; // Sử dụng MainApp làm root component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp /> {/* Sử dụng MainApp */}
  </React.StrictMode>
);

reportWebVitals();
