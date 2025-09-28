import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Accueil = () => {
  const { user } = useAuth();

  return (
    <div className="accueil">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Apprenez avec DCH Learning</h1>
            <p>Découvrez nos formations en ligne et développez vos compétences</p>
            <Link to="/formations" className="btn btn-primary">
              Voir les formations
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Pourquoi choisir DCH Learning ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Formations de qualité</h3>
              <p>Contenu créé par des experts du domaine</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Flexibilité</h3>
              <p>Apprenez à votre rythme, quand vous voulez</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Certification</h3>
              <p>Obtenez des certificats reconnus</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Prêt à commencer ?</h2>
          <p>Rejoignez des milliers d'étudiants satisfaits</p>
          {user ? (
            <Link to="/formations" className="btn btn-secondary">
              Voir les formations
            </Link>
          ) : (
            <Link to="/connexion" className="btn btn-secondary">
              S'inscrire maintenant
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Accueil;