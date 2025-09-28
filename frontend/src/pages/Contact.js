import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      setResponseMessage(response.data.message);
      setFormData({ nom: '', email: '', sujet: '', message: '' });
    } catch (error) {
      setResponseMessage(error.response?.data?.error || 'Erreur envoi message');
    }
  };

  return (
    <div className="contact">
      <div className="container">
        <div className="page-header">
          <h1>Contactez-nous</h1>
          <p>Nous sommes là pour vous aider</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Nos coordonnées</h2>
            
            <div className="info-item">
              <div className="info-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p>contact@dchlearning.fr</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <h4>Téléphone</h4>
                <p>01 23 45 67 89</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h4>Adresse</h4>
                <p>123 Rue de l'Education<br />75001 Paris, France</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Envoyez-nous un message</h2>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nom">Nom complet</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom complet"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre.email@exemple.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="sujet">Sujet</label>
                <input
                  type="text"
                  id="sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  placeholder="Sujet de votre message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">
                Envoyer le message
              </button>

              {responseMessage && (
                <div className={`message ${responseMessage.includes('succès') ? 'success' : 'error'}`}>
                  {responseMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;