const express = require('express');
const { pool } = require('../config/database');
const { isAdmin } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/admin/formations:
 *   get:
 *     summary: Lister toutes les formations (admin)
 *     tags: [Admin - Formations]
 *     description: Récupère toutes les formations (publiées et brouillons) pour l'interface admin
 *     security:
 *       - AdminAuth: []
 *     responses:
 *       200:
 *         description: Liste complète des formations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Formation'
 *             example:
 *               - id: 1
 *                 titre: "Formation React Avancée"
 *                 description: "Maîtrisez React et ses écosystèmes"
 *                 categorie: "Développement Web"
 *                 niveau: "Avancé"
 *                 duree: "6 semaines"
 *                 prix: "799"
 *                 image: "images/react-advanced.jpg"
 *                 statut: "publie"
 *               - id: 2
 *                 titre: "Introduction au Machine Learning"
 *                 description: "Premiers pas dans l'IA"
 *                 categorie: "Data Science"
 *                 niveau: "Débutant"
 *                 duree: "8 semaines"
 *                 prix: "999"
 *                 image: "images/ml-intro.jpg"
 *                 statut: "brouillon"
 *       401:
 *         description: Accès non autorisé - Admin requis
 *       500:
 *         description: Erreur serveur
 */
// Liste toutes les formations 
router.get('/formations', isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM formations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération formations admin' });
  }
});

/**
 * @swagger
 * /api/admin/formations/{id}:
 *   put:
 *     summary: Modifier une formation complètement
 *     tags: [Admin - Formations]
 *     description: Met à jour tous les champs d'une formation existante
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la formation à modifier
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               duree:
 *                 type: string
 *               prix:
 *                 type: string
 *               niveau:
 *                 type: string
 *               categorie:
 *                 type: string
 *               statut:
 *                 type: string
 *               image:
 *                 type: string
 *           example:
 *             titre: "Formation React Mise à Jour"
 *             description: "Description mise à jour"
 *             duree: "8 semaines"
 *             prix: "899"
 *             niveau: "Avancé"
 *             categorie: "Développement Web"
 *             statut: "publie"
 *             image: "images/react-updated.jpg"
 *     responses:
 *       200:
 *         description: Formation mise à jour avec succès
 *       401:
 *         description: Accès non autorisé
 *       404:
 *         description: Formation non trouvée
 *       500:
 *         description: Erreur serveur
 */
// Modifie une formation 
router.put('/formations/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const result = await pool.query(
      `UPDATE formations SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    
    res.json({ 
      message: 'Formation mise à jour avec succès',
      formation: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur modification formation' });
  }
});

/**
 * @swagger
 * /api/admin/formations/{id}:
 *   delete:
 *     summary: Supprimer une formation
 *     tags: [Admin - Formations]
 *     description: Supprime définitivement une formation
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la formation à supprimer
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Formation supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Formation supprimée avec succès"
 *       401:
 *         description: Accès non autorisé
 *       404:
 *         description: Formation non trouvée
 *       500:
 *         description: Erreur serveur
 */
// Supprime une formation 
router.delete('/formations/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM formations WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    
    res.json({ message: 'Formation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur suppression formation' });
  }
});

/**
 * @swagger
 * /api/admin/formations/{id}/statut:
 *   patch:
 *     summary: Changer le statut d'une formation
 *     tags: [Admin - Formations]
 *     description: Modifie le statut de publication d'une formation (publié/brouillon)
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la formation
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [publie, brouillon]
 *                 description: Nouveau statut de la formation
 *           example:
 *             statut: "publie"
 *     responses:
 *       200:
 *         description: Statut modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 formation:
 *                   $ref: '#/components/schemas/Formation'
 *             example:
 *               message: "Formation publiée"
 *               formation:
 *                 id: 1
 *                 titre: "Formation React"
 *                 statut: "publie"
 *       400:
 *         description: Statut invalide
 *       401:
 *         description: Accès non autorisé
 *       404:
 *         description: Formation non trouvée
 *       500:
 *         description: Erreur serveur
 */
// Change le statut d'une formation (publié/brouillon) 
router.patch('/formations/:id/statut', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    
    if (!['publie', 'brouillon'].includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide (publie ou brouillon)' });
    }
    
    const result = await pool.query(
      'UPDATE formations SET statut = $1 WHERE id = $2 RETURNING *',
      [statut, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    
    res.json({ 
      message: `Formation ${statut === 'publie' ? 'publiée' : 'mise en brouillon'}`,
      formation: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur modification statut' });
  }
});

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Lister tous les utilisateurs
 *     tags: [Admin - Utilisateurs]
 *     description: Récupère la liste de tous les utilisateurs inscrits
 *     security:
 *       - AdminAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - id: 1
 *                 nom: "Admin Principal"
 *                 email: "admin@dchlearning.fr"
 *                 role: "admin"
 *                 created_at: "2024-01-01T10:00:00Z"
 *               - id: 2
 *                 nom: "Utilisateur Standard"
 *                 email: "user@example.com"
 *                 role: "user"
 *                 created_at: "2024-01-15T14:30:00Z"
 *       401:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur serveur
 */
// Lister tous les utilisateurs 
router.get('/users', isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nom, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération utilisateurs' });
  }
});

/**
 * @swagger
 * /api/admin/users/{id}/promote:
 *   patch:
 *     summary: Promouvoir un utilisateur en administrateur
 *     tags: [Admin - Utilisateurs]
 *     description: Change le rôle d'un utilisateur standard en administrateur
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à promouvoir
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Utilisateur promu avec succès
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
 *               message: "Utilisateur promu administrateur"
 *               user:
 *                 id: 2
 *                 nom: "Nouvel Admin"
 *                 email: "newadmin@example.com"
 *                 role: "admin"
 *       401:
 *         description: Accès non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
// Promouvoir un utilisateur en admin 
router.patch('/users/:id/promote', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
      ['admin', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json({ 
      message: 'Utilisateur promu administrateur',
      user: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur promotion utilisateur' });
  }
});

module.exports = router;