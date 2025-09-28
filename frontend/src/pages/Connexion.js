import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Connexion = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.motDePasse.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caract?res');
      setLoading(false);
      return;
    }

    try {
      const url = isLogin 
        ? 'http://localhost:5000/api/users/connexion'
        : 'http://localhost:5000/api/users/inscription';

      const body = isLogin 
        ? { email: formData.email, mot_de_passe: formData.motDePasse }
        : { nom: formData.nom, email: formData.email, mot_de_passe: formData.motDePasse };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la connexion');
      }

      login(data.user);
      navigate('/');
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="connexion">
      <div className="container">
        <div className="auth-container">
          <div className="auth-header">
            <h1>{isLogin ? 'Connexion' : 'Inscription'}</h1>
            <p>{isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="nom">Nom complet:</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Votre nom complet"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="motDePasse">Mot de passe:</label>
            <input
              type="password"
              id="motDePasse"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              required
              placeholder="Minimum 6 caractères"
              minLength="6"
            />
          </div>

          {error && <div className="message error">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
            <button 
              type="button"
              className="link-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ nom: '', email: '', motDePasse: '' });
              }}
            >
              {isLogin ? 'S\'inscrire' : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Connexion;
