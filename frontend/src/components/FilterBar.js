import React from 'react';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  categories, 
  durations, 
  levels 
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-section">
        <label htmlFor="sortPrice">Trier par prix:</label>
        <select 
          id="sortPrice"
          value={filters.sortPrice || ''} 
          onChange={(e) => onFilterChange('sortPrice', e.target.value)}
        >
          <option value="">-- Choisir --</option>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="category">Catégorie:</label>
        <select 
          id="category"
          value={filters.category || ''} 
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="duration">Durée:</label>
        <select 
          id="duration"
          value={filters.duration || ''} 
          onChange={(e) => onFilterChange('duration', e.target.value)}
        >
          <option value="">Toutes les durées</option>
          {durations.map(dur => (
            <option key={dur} value={dur}>{dur}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="level">Niveau:</label>
        <select 
          id="level"
          value={filters.level || ''} 
          onChange={(e) => onFilterChange('level', e.target.value)}
        >
          <option value="">Tous les niveaux</option>
          {levels.map(lev => (
            <option key={lev} value={lev}>{lev}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <button 
          className="btn btn-secondary"
          onClick={() => onFilterChange('reset', null)}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default FilterBar;