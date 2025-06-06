import React from 'react'
import ReactDOM from 'react-dom/client'
<<<<<<< HEAD
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { LanguageProvider } from "./context/LanguageContext"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <LanguageProvider>
    <App />
    </LanguageProvider>
=======
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
  </BrowserRouter>
)
