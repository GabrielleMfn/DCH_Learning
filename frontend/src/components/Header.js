import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, isConnected, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="nav-brand">
          <Link to="/" className="logo">
            <h2>DCH Learning</h2>
          </Link>
        </div>
        
        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">Accueil</Link></li>
            <li><Link to="/formations" className="nav-link">Formations</Link></li>
            
            {!isConnected() ? (
              <li><Link to="/connexion" className="nav-link">Connexion</Link></li>
            ) : (
              <li>
                <button onClick={logout} className="nav-link logout-btn">
                  Déconnexion ({user?.nom})
                </button>
              </li>
            )}
            
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
            
            {isAdmin() && (
              <li><Link to="/admin" className="nav-link admin-link">Administration</Link></li>
            )}
          </ul>
        </nav>

        <button 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;