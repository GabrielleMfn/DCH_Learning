const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Envoyer un message de contact
 *     tags: [Contact]
 *     description: Permet aux utilisateurs d'envoyer un message via le formulaire de contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - message
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom de la personne qui envoie le message
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de contact pour la réponse
 *               sujet:
 *                 type: string
 *                 description: Sujet du message (optionnel)
 *               message:
 *                 type: string
 *                 description: Contenu du message
 *           example:
 *             nom: "Jean Martin"
 *             email: "jean.martin@example.com"
 *             sujet: "Demande d'information sur les formations"
 *             message: "Bonjour, je souhaiterais avoir plus d'informations sur vos formations en développement web."
 *     responses:
 *       201:
 *         description: Message envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 contact:
 *                   $ref: '#/components/schemas/ContactMessage'
 *             example:
 *               message: "Message envoyé avec succès"
 *               contact:
 *                 id: 1
 *                 nom: "Jean Martin"
 *                 email: "jean.martin@example.com"
 *                 sujet: "Demande d'information sur les formations"
 *                 message: "Bonjour, je souhaiterais avoir plus d'informations sur vos formations en développement web."
 *                 created_at: "2024-01-15T14:30:00Z"
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
 *               error: "Nom, email et message requis"
 *       500:
 *         description: Erreur serveur lors de l'envoi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Erreur envoi message"
 */
router.post('/', async (req, res) => {
  try {
    const { nom, email, sujet, message } = req.body;
    
    if (!nom || !email || !message) {
      return res.status(400).json({ error: 'Nom, email et message requis' });
    }

    const result = await pool.query(
      'INSERT INTO contacts (nom, email, sujet, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [nom, email, sujet, message]
    );
    
    res.status(201).json({ 
      message: 'Message envoyé avec succès',
      contact: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur envoi message' });
  }
});

module.exports = router;