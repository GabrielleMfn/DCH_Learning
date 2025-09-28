import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Admin.css';

const Admin = () => {
  const [formations, setFormations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const loadAdminData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Charge les formations
      const formationsResponse = await axios.get('http://localhost:5000/api/admin/formations', {
        params: { email: user.email }
      });
      setFormations(formationsResponse.data);

      // Charge les utilisateurs
      const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
        params: { email: user.email }
      });
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Erreur chargement données admin:', error);
      setMessage('Erreur chargement données admin: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Redirige si pas admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/connexion');
      return;
    }
    loadAdminData();
  }, [isAdmin, navigate, loadAdminData]);

  const toggleFormationStatus = async (formationId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'publie' ? 'brouillon' : 'publie';
      
      await axios.patch(`http://localhost:5000/api/admin/formations/${formationId}/statut`, 
        { 
          statut: newStatus,
          email: user.email 
        }
      );
      
      loadAdminData();
      setMessage(`Formation ${newStatus === 'publie' ? 'publiée' : 'mise en brouillon'}`);
    } catch (error) {
      setMessage('Erreur modification statut');
    }
  };

  const deleteFormation = async (formationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/formations/${formationId}`, {
        data: { email: user.email }
      });
      
      loadAdminData();
      setMessage('Formation supprimée avec succès');
    } catch (error) {
      setMessage('Erreur suppression formation');
    }
  };

  const promoteUser = async (userId) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/users/${userId}/promote`, 
        { email: user.email }
      );
      
      loadAdminData();
      setMessage('Utilisateur promu administrateur');
    } catch (error) {
      setMessage('Erreur promotion utilisateur');
    }
  };

  if (!isAdmin()) {
    return null; 
  }

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Tableau de bord administrateur</h1>
            <p>Bienvenue {user.nom} ({user.email})</p>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('succès') || message.includes('publiée') || message.includes('promu') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="admin-sections">
          {/* Gestion des formations */}
          <section className="admin-section">
            <h2>Gestion des formations ({formations.length})</h2>
            
            <div className="formations-admin-grid">
              {formations.map((formation) => (
                <div key={formation.id} className="formation-admin-card">
                  <div className="card-header">
                    <h3>{formation.titre}</h3>
                    <div className="formation-status">
                      <span className={`status-badge ${formation.statut}`}>
                        {formation.statut === 'publie' ? 'Publié' : 'Brouillon'}
                      </span>
                      <span className={`category-badge ${formation.categorie?.toLowerCase()}`}>
                        {formation.categorie}
                      </span>
                    </div>
                  </div>
                  
                  <p className="formation-description">{formation.description}</p>
                  
                  <div className="formation-actions">
                    <button 
                      className={`btn ${formation.statut === 'publie' ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => toggleFormationStatus(formation.id, formation.statut)}
                    >
                      {formation.statut === 'publie' ? 'Masquer' : 'Publier'}
                    </button>
                    
                    <button 
                      className="btn btn-danger"
                      onClick={() => deleteFormation(formation.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Gestion des utilisateurs */}
          <section className="admin-section">
            <h2>Gestion des utilisateurs ({users.length})</h2>
            
            <div className="users-admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nom}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        {user.role === 'user' && (
                          <button 
                            className="btn btn-primary btn-small"
                            onClick={() => promoteUser(user.id)}
                          >
                            Promouvoir Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;