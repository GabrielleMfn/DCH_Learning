const { pool } = require('../config/database');

// Middleware pour vérifier les droits admin
const isAdmin = async (req, res, next) => {
  try {
    // Récupère l'email depuis les headers, query params ou body
    const email = req.headers['user-email'] || req.query.email || req.body.email;
    
    if (!email) {
      return res.status(401).json({ error: 'Email requis pour authentification' });
    }

    const result = await pool.query('SELECT id, nom, email, telephone, role, created_at FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé - Droits administrateur requis' });
    }

    req.user = user;
    next();
    
  } catch (error) {
    res.status(500).json({ error: 'Erreur authentification' });
  }
};

// Fonction pour obtenir les infos utilisateurs
const getUserInfo = async (email) => {
  try {
    const result = await pool.query('SELECT id, nom, email, telephone, role, created_at FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    return null;
  }
};

module.exports = { 
  isAdmin, 
  getUserInfo 
};