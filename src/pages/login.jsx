// login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sha256 from 'crypto-js/sha256'; // Importer la fonction de hachage SHA-256

// Fonction pour hacher le mot de passe avec SHA-256
const hashPassword = (password) => {
    return sha256(password).toString();
};

// Fonction pour hacher l'username avec SHA-256
const hashUsername = (username) => {
    return sha256(username).toString();
};

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Utilise le hook useNavigate pour la redirection
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();

        // Récupérer les informations d'identification correctes depuis le localStorage
        const storedUsername = localStorage.getItem('hashedUsername');
        const storedHashedPassword = localStorage.getItem('hashedPassword');

        // Hacher l'username entré par l'utilisateur
        const hashedUsername = hashUsername(username);

        // Vérifier si les informations d'identification saisies sont correctes
        if (hashedUsername === storedUsername && hashPassword(password) === storedHashedPassword) {
            // Connexion réussie, rediriger vers la page "Home"
            navigate('/home');

        } else {
            // Informer l'utilisateur que les informations d'identification sont incorrectes
            setError('Nom d\'utilisateur ou mot de passe incorrect.');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-heading">Connexion pour le fight de t'as</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label className="form-label">Nom d'utilisateur:</label>
                    <div className="input-container">
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" />
                        <i className="fas fa-user input-icon"></i>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Mot de passe:</label>
                    <div className="input-container">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
                        <i className="fas fa-lock input-icon"></i>
                    </div>
                </div>
                <button type="submit" className="submit-button">Se connecter</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
    }    

export default Login;
