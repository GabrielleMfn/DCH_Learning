import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FilterBar from '../components/FilterBar';
import '../styles/Formations.css';

const Formations = () => {
  const navigate = useNavigate();
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sortPrice: '',
    category: '',
    duration: '',
    level: ''
  });

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/formations');
        setFormations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement formations:', error);
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  // Extrait les valeurs uniques pour les filtres
  const categories = useMemo(() => {
    return [...new Set(formations.map(f => f.categorie).filter(Boolean))];
  }, [formations]);

  const durations = useMemo(() => {
    return [...new Set(formations.map(f => f.duree).filter(Boolean))];
  }, [formations]);

  const levels = useMemo(() => {
    return [...new Set(formations.map(f => f.niveau).filter(Boolean))];
  }, [formations]);

  // Fonction de filtrage et tri
  const filteredFormations = useMemo(() => {
    let result = [...formations];

    // Applique les filtres
    if (filters.category) {
      result = result.filter(f => f.categorie === filters.category);
    }
    if (filters.duration) {
      result = result.filter(f => f.duree === filters.duration);
    }
    if (filters.level) {
      result = result.filter(f => f.niveau === filters.level);
    }

    // Applique le tri par prix
    if (filters.sortPrice) {
      result = result.sort((a, b) => {
        const priceA = parseFloat(a.prix) || 0;
        const priceB = parseFloat(b.prix) || 0;
        return filters.sortPrice === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return result;
  }, [formations, filters]);

  // Gestionnaire des changements de filtres
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'reset') {
      setFilters({
        sortPrice: '',
        category: '',
        duration: '',
        level: ''
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  if (loading) {
    return <div className="loading">Chargement des formations...</div>;
  }

  return (
    <div className="formations">
      <div className="container">
        <div className="page-header">
          <h1>Nos Formations</h1>
          <p>Découvrez notre catalogue de formations</p>
        </div>

        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          durations={durations}
          levels={levels}
        />

        <div className="formations-stats">
          <p>{filteredFormations.length} formation(s) trouvée(s)</p>
        </div>

        <div className="formations-grid">
          {filteredFormations.map((formation) => (
            <div 
              key={formation.id} 
              className="formation-card"
            >
              <div className="card-image">
                <img 
                  src={formation.image ? `/${formation.image}` : '/images/web-dev.jpg'} 
                  alt={formation.titre}
                  onError={(e) => {
                    e.target.src = '/images/web-dev.jpg';
                  }}
                />
              </div>
              
              <div className="card-content">
                <div className="card-header">
                  <h3>{formation.titre}</h3>
                  <span className={`category-badge ${formation.categorie?.toLowerCase()}`}>
                    {formation.categorie}
                  </span>
                </div>
                <p className="description">{formation.description}</p>
                
                <div className="card-details">
                  <span className="duration">Durée: {formation.duree}</span>
                  <span className="level">Niveau: {formation.niveau}</span>
                </div>
                
                <div className="card-footer">
                  <span className="price">{formation.prix}€</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate(`/formations/${formation.id}`)}
                  >
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Formations;