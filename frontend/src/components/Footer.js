import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DCH Learning</h3>
            <p>Votre plateforme d'apprentissage en ligne</p>
          </div>
          
          <div className="footer-section">
            <h4>Liens rapides</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/formations">Formations</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: contact@dchlearning.fr</p>
            <p>Tél: 01 23 45 67 89</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 DCH Learning. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;