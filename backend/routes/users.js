const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const router = express.Router();

/**
 * @swagger
 * /api/users/inscription:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentification]
 *     description: Crée un nouveau compte utilisateur avec mot de passe hashé. Le premier utilisateur devient automatiquement admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - mot_de_passe
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom complet de l'utilisateur
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email unique
 *               telephone:
 *                 type: string
 *                 description: Numéro de téléphone (optionnel)
 *               mot_de_passe:
 *                 type: string
 *                 minLength: 6
 *                 description: Mot de passe (sera hashé)
 *           example:
 *             nom: "Marie Dupont"
 *             email: "marie.dupont@example.com"
 *             telephone: "0123456789"
 *             mot_de_passe: "motdepasse123"
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               message: "Inscription réussie"
 *               user:
 *                 id: 1
 *                 nom: "Marie Dupont"
 *                 email: "marie.dupont@example.com"
 *                 telephone: "0123456789"
 *                 role: "user"
 *                 created_at: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Données manquantes ou email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               missing_data:
 *                 summary: Données manquantes
 *                 value:
 *                   error: "Nom, email et mot de passe requis"
 *               email_exists:
 *                 summary: Email déjà utilisé
 *                 value:
 *                   error: "Un compte existe déjà avec cet email"
 *       500:
 *         description: Erreur serveur
 */
router.post('/inscription', async (req, res) => {
  try {
    const { nom, email, telephone, mot_de_passe } = req.body;
    
    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({ error: 'Nom, email et mot de passe requis' });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Un compte existe déjà avec cet email' });
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

    // Vérifier si c'est le premier utilisateur
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const isFirstUser = parseInt(userCount.rows[0].count) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const result = await pool.query(
      'INSERT INTO users (nom, email, telephone, mot_de_passe, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, nom, email, telephone, role, created_at',
      [nom, email, telephone, hashedPassword, role]
    );
    
    const message = isFirstUser 
      ? 'Inscription réussie - Vous êtes maintenant administrateur !'
      : 'Inscription réussie';
    
    res.status(201).json({ 
      message,
      user: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Email déjà utilisé' });
    } else {
      res.status(500).json({ error: 'Erreur inscription' });
    }
  }
});

/**
 * @swagger
 * /api/users/connexion:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Authentification]
 *     description: Authentifie un utilisateur avec email et mot de passe hashé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - mot_de_passe
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de l'utilisateur
 *               mot_de_passe:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *           example:
 *             email: "marie.dupont@example.com"
 *             mot_de_passe: "motdepasse123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               message: "Connexion réussie"
 *               user:
 *                 id: 1
 *                 nom: "Marie Dupont"
 *                 email: "marie.dupont@example.com"
 *                 telephone: "0123456789"
 *                 role: "user"
 *                 created_at: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Email et mot de passe requis"
 *       401:
 *         description: Identifiants incorrects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Email ou mot de passe incorrect"
 *       500:
 *         description: Erreur serveur
 */
router.post('/connexion', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    
    if (!email || !mot_de_passe) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Récupérer l'utilisateur avec son mot de passe
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Retourner les infos utilisateur sans le mot de passe
    const { mot_de_passe: _, ...userWithoutPassword } = user;

    res.json({ 
      message: 'Connexion réussie',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur connexion' });
  }
});

module.exports = router;