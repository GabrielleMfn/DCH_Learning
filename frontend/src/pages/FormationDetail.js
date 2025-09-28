import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FormationDetail.css';

// Fonctions pour générer du contenu dynamique
const getProgramModules = (category) => {
  const programs = {
    'Développement Web': [
      { title: 'Module 1: HTML/CSS Fondamentaux', description: 'Structure et style des pages web' },
      { title: 'Module 2: JavaScript Interactif', description: 'Programmation côté client et DOM' },
      { title: 'Module 3: Frameworks Modernes', description: 'React, Vue.js et outils de développement' },
      { title: 'Module 4: Projet Portfolio', description: 'Création d\'un site web complet' }
    ],
    'Data Science': [
      { title: 'Module 1: Statistiques & Maths', description: 'Bases mathématiques pour l\'analyse de données' },
      { title: 'Module 2: Python & Pandas', description: 'Manipulation et nettoyage des données' },
      { title: 'Module 3: Visualisation', description: 'Graphiques et tableaux de bord' },
      { title: 'Module 4: Machine Learning', description: 'Modèles prédictifs et algorithmes' }
    ],
    'Intelligence Artificielle': [
      { title: 'Module 1: IA Fondamentaux', description: 'Concepts et histoire de l\'intelligence artificielle' },
      { title: 'Module 2: Machine Learning', description: 'Algorithmes d\'apprentissage automatique' },
      { title: 'Module 3: Deep Learning', description: 'Réseaux de neurones et applications' },
      { title: 'Module 4: Projet IA', description: 'Développement d\'une solution IA complète' }
    ],
    'Cybersécurité': [
      { title: 'Module 1: Sécurité Réseau', description: 'Protection des infrastructures et communications' },
      { title: 'Module 2: Cryptographie', description: 'Chiffrement et signature numérique' },
      { title: 'Module 3: Tests d\'Intrusion', description: 'Audit et test de sécurité' },
      { title: 'Module 4: Gestion des Incidents', description: 'Réponse aux cyberattaques' }
    ],
    'default': [
      { title: 'Module 1: Fondamentaux', description: 'Introduction aux concepts de base et outils essentiels' },
      { title: 'Module 2: Pratique', description: 'Mise en application à travers des exercices pratiques' },
      { title: 'Module 3: Projet', description: 'Réalisation d\'un projet complet en autonomie' },
      { title: 'Module 4: Certification', description: 'Évaluation finale et obtention de la certification' }
    ]
  };
  
  return programs[category] || programs['default'];
};

const getPrerequisitesText = (level) => {
  const texts = {
    'Débutant': 'Cette formation est conçue pour les débutants. Aucune expérience préalable n\'est requise.',
    'Intermédiaire': 'Cette formation nécessite des bases dans le domaine. Une première expérience est recommandée.',
    'Avancé': 'Formation destinée aux professionnels expérimentés. Des compétences avancées sont requises.',
    'Expert': 'Niveau expert requis. Formation très technique pour spécialistes confirmés.'
  };
  
  return texts[level] || 'Cette formation est accessible selon votre niveau d\'expérience.';
};

const getPrerequisitesList = (level) => {
  const prerequisites = {
    'Débutant': [
      'Motivation et envie d\'apprendre',
      'Accès à un ordinateur avec connexion internet',
      'Disponibilité selon le planning de formation',
      'Aucune expérience technique requise'
    ],
    'Intermédiaire': [
      'Connaissances de base dans le domaine',
      'Expérience pratique d\'au moins 6 mois',
      'Ordinateur avec logiciels spécialisés',
      'Portfolio ou projets antérieurs recommandés'
    ],
    'Avancé': [
      'Expérience professionnelle significative (2+ ans)',
      'Maîtrise des outils du domaine',
      'Projets complexes réalisés',
      'Certification ou diplôme dans le domaine'
    ],
    'Expert': [
      'Expertise confirmée (5+ ans d\'expérience)',
      'Leadership technique reconnu',
      'Participation à des projets d\'envergure',
      'Veille technologique active'
    ]
  };
  
  return prerequisites[level] || [
    'Motivation et envie d\'apprendre',
    'Accès à un ordinateur avec connexion internet',
    'Disponibilité selon le planning de formation'
  ];
};

const FormationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formation, setFormation] = useState(null);
  const [relatedFormations, setRelatedFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        // Charge la formation spécifique
        const response = await axios.get(`http://localhost:5000/api/formations/${id}`);
        console.log('Formation data:', response.data);
        console.log('Formation image URL:', response.data.image);
        setFormation(response.data);
        
        // Charge toutes les formations pour trouver les similaires
        const allFormationsResponse = await axios.get('http://localhost:5000/api/formations');
        const allFormations = allFormationsResponse.data;
        
        // Filtre les formations similaires (même catégorie, excluant la formation actuelle)
        const similar = allFormations
          .filter(f => f.id !== parseInt(id) && f.categorie === response.data.categorie)
          .slice(0, 3);
        
        console.log('Related formations:', similar);
        similar.forEach(f => console.log('Related formation image:', f.titre, f.image));
        setRelatedFormations(similar);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement formation:', error);
        setError('Formation non trouvée');
        setLoading(false);
      }
    };

    fetchFormation();
  }, [id]);

  if (loading) {
    return (
      <div className="formation-detail">
        <div className="container">
          <div className="loading-spinner">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="formation-detail">
        <div className="container">
          <div className="error-message">
            <h2>Formation non trouvée</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/formations')}>
              Retour aux formations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="formation-detail">
      {/* Hero Section */}
      <div 
        className="hero-section"
        style={{
          background: formation.image 
            ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/${formation.image}') center/cover`
            : `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/web-dev.jpg') center/cover`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="hero-overlay">
          <div className="container">
            <div className="breadcrumb">
              <span onClick={() => navigate('/')} className="breadcrumb-link">Accueil</span>
              <span className="separator"> / </span>
              <span onClick={() => navigate('/formations')} className="breadcrumb-link">Formations</span>
              <span className="separator"> / </span>
              <span className="current">{formation.titre}</span>
            </div>
            
            <div className="hero-content">
              <div className="hero-info">
                <span className={`category-badge ${formation.categorie?.toLowerCase()}`}>
                  {formation.categorie}
                </span>
                <h1 className="hero-title">{formation.titre}</h1>
                <p className="hero-description">{formation.description}</p>
                
                <div className="hero-meta">
                  <div className="meta-item">
                    <i className="icon-clock"></i>
                    <span>Durée: {formation.duree}</span>
                  </div>
                  <div className="meta-item">
                    <i className="icon-level"></i>
                    <span>Niveau: {formation.niveau}</span>
                  </div>
                  <div className="meta-item">
                    <i className="icon-students"></i>
                    <span>Places limitées</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Course Details */}
            <div className="course-details">
              <div className="detail-section">
                <h2>À propos de cette formation</h2>
                <div className="description-content">
                  <p>{formation.description}</p>
                  
                  <div className="course-highlights">
                    <h3>Points forts de la formation</h3>
                    <ul>
                      <li>Formation pratique et interactive</li>
                      <li>Encadrement par des professionnels expérimentés</li>
                      <li>Certification reconnue à la fin de la formation</li>
                      <li>Support pédagogique inclus</li>
                      <li>Suivi personnalisé tout au long du parcours</li>
                    </ul>
                  </div>
                  
                  <div className="course-objectives">
                    <h3>Objectifs pédagogiques</h3>
                    <ul>
                      <li>Acquérir les compétences techniques essentielles</li>
                      <li>Développer une expertise pratique du domaine</li>
                      <li>Être capable de réaliser des projets concrets</li>
                      <li>Comprendre les enjeux professionnels actuels</li>
                    </ul>
                  </div>

                  <div className="course-program">
                    <h3>Programme de la formation</h3>
                    <div className="program-modules">
                      {getProgramModules(formation.categorie).map((module, index) => (
                        <div key={index} className="module">
                          <h4>{module.title}</h4>
                          <p>{module.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h2>Prérequis</h2>
                <div className="prerequisites">
                  <p>{getPrerequisitesText(formation.niveau)}</p>
                  <ul>
                    {getPrerequisitesList(formation.niveau).map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="course-sidebar">
              <div className="enrollment-card">
                <div className="price-section">
                  <div className="price">
                    <span className="amount">{formation.prix}</span>
                    <span className="currency">€</span>
                  </div>
                  <div className="price-note">Prix tout compris</div>
                </div>

                <div className="course-info">
                  <div className="info-item">
                    <strong>Durée:</strong>
                    <span>{formation.duree}</span>
                  </div>
                  <div className="info-item">
                    <strong>Niveau:</strong>
                    <span>{formation.niveau}</span>
                  </div>
                  <div className="info-item">
                    <strong>Catégorie:</strong>
                    <span>{formation.categorie}</span>
                  </div>
                  <div className="info-item">
                    <strong>Format:</strong>
                    <span>Présentiel + Distanciel</span>
                  </div>
                </div>

                <div className="enrollment-actions">
                  <button className="btn btn-primary btn-large">
                    <i className="icon-cart"></i>
                    S'inscrire maintenant
                  </button>
                  <button className="btn btn-outline btn-large">
                    <i className="icon-heart"></i>
                    Ajouter aux favoris
                  </button>
                </div>

                <div className="course-features">
                  <div className="feature">
                    <i className="icon-certificate"></i>
                    <span>Certificat inclus</span>
                  </div>
                  <div className="feature">
                    <i className="icon-support"></i>
                    <span>Support 24/7</span>
                  </div>
                  <div className="feature">
                    <i className="icon-update"></i>
                    <span>Contenu mis à jour</span>
                  </div>
                  <div className="feature">
                    <i className="icon-access"></i>
                    <span>Accès à vie</span>
                  </div>
                </div>
              </div>

              <div className="instructor-card">
                <h3>Votre formateur</h3>
                <div className="instructor-info">
                  <div className="instructor-avatar">
                    <img src="/images/instructor-default.jpg" alt="Formateur" />
                  </div>
                  <div className="instructor-details">
                    <h4>Expert certifié</h4>
                    <p>Professionnel avec plus de 10 ans d'expérience dans le domaine</p>
                    <div className="instructor-stats">
                      <div className="stat">
                        <strong>500+</strong>
                        <span>Étudiants formés</span>
                      </div>
                      <div className="stat">
                        <strong>4.9/5</strong>
                        <span>Note moyenne</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Courses */}
      {relatedFormations.length > 0 && (
        <div className="related-courses">
          <div className="container">
            <h2>Formations similaires en {formation.categorie}</h2>
            <div className="related-grid">
              {relatedFormations.map((relatedFormation) => (
                <div 
                  key={relatedFormation.id} 
                  className="related-card"
                  onClick={() => navigate(`/formations/${relatedFormation.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={relatedFormation.image ? `/${relatedFormation.image}` : '/images/web-dev.jpg'} 
                    alt={relatedFormation.titre}
                    onError={(e) => {
                      e.target.src = '/images/web-dev.jpg';
                    }}
                  />
                  <h4>{relatedFormation.titre}</h4>
                  <p className="related-price">{relatedFormation.prix}€</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormationDetail;