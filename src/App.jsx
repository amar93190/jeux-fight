import './App.css';
import { Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/login';
import AuthMiddleware from './components/AuthMiddleware';
import sha256 from 'crypto-js/sha256';
import Fight from './pages/fight';
import backgroundImage from './image/maxresdefault.jpg';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  // Hasher le mot de passe et l'username avec SHA-256
  const hashedPassword = sha256('123').toString();
  const hashedUsername = sha256('123').toString();

  useEffect(() => { 
    // Stocker le nom d'utilisateur et le mot de passe haché dans le stockage local
    const username = localStorage.getItem('hashedUsername');

    localStorage.setItem('hashedUsername', hashedUsername);
    localStorage.setItem('hashedPassword', hashedPassword);
    setIsLoggedIn(!!username);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Login />
        }
      />
      <Route path="/home" element={<AuthMiddleware isAuthenticated={isLoggedIn}><Home /></AuthMiddleware>} />
      <Route path="/fight/:index" element={<AuthMiddleware isAuthenticated={isLoggedIn}><Fight /></AuthMiddleware>} />
    </Routes>
  );
}
export default App;
