const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

/**
 * @swagger
 * /api/formations:
 *   get:
 *     summary: Récupérer toutes les formations publiées
 *     tags: [Formations]
 *     description: Retourne la liste de toutes les formations ayant le statut 'publie', triées par date de création décroissante
 *     responses:
 *       200:
 *         description: Liste des formations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Formation'
 *             example:
 *               - id: 1
 *                 titre: "Développement Web Full Stack"
 *                 description: "Apprenez à créer des applications web complètes"
 *                 categorie: "Développement Web"
 *                 niveau: "Intermédiaire"
 *                 duree: "3 mois"
 *                 prix: "899"
 *                 image: "images/web-dev.jpg"
 *                 statut: "publie"
 *               - id: 2
 *                 titre: "Data Science avec Python"
 *                 description: "Maîtrisez l'analyse de données et le machine learning"
 *                 categorie: "Data Science"
 *                 niveau: "Avancé"
 *                 duree: "4 mois"
 *                 prix: "1299"
 *                 image: "images/data-science.jpg"
 *                 statut: "publie"
 *       500:
 *         description: Erreur serveur lors de la récupération des formations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Erreur récupération formations"
 */
router.get('/', async (req, res) => {
  try {
    // Ne récupérer que les formations publiées pour le public
    const result = await pool.query("SELECT * FROM formations WHERE statut = 'publie' ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération formations' });
  }
});

/**
 * @swagger
 * /api/formations/{id}:
 *   get:
 *     summary: Récupérer une formation spécifique par son ID
 *     tags: [Formations]
 *     description: Retourne les détails d'une formation spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérique de la formation à récupérer
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Formation trouvée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Formation'
 *             example:
 *               id: 1
 *               titre: "Développement Web Full Stack"
 *               description: "Apprenez à créer des applications web complètes avec React, Node.js et PostgreSQL"
 *               categorie: "Développement Web"
 *               niveau: "Intermédiaire"
 *               duree: "3 mois"
 *               prix: "899"
 *               image: "images/web-dev.jpg"
 *               statut: "publie"
 *       404:
 *         description: Formation non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Formation non trouvée"
 *       500:
 *         description: Erreur serveur lors de la récupération de la formation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Erreur récupération formation"
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM formations WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération formation' });
  }
});

module.exports = router;