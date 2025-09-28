const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        mot_de_passe VARCHAR(255) NOT NULL,
        telephone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS formations (
        id SERIAL PRIMARY KEY,
        titre VARCHAR(200) NOT NULL,
        description TEXT,
        duree VARCHAR(50),
        prix DECIMAL(10,2),
        niveau VARCHAR(50),
        categorie VARCHAR(50),
        statut VARCHAR(20) DEFAULT 'publie',
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        sujet VARCHAR(200),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      INSERT INTO formations (titre, description, duree, prix, niveau, categorie, statut, image)
      SELECT 'Développement Web', 'Apprenez HTML, CSS, JavaScript et React', '3 mois', 299.99, 'Débutant', 'Web', 'publie', '/images/web-dev.jpg'
      WHERE NOT EXISTS (SELECT 1 FROM formations WHERE titre = 'Développement Web')
      UNION ALL
      SELECT 'Bases de données', 'Maîtrisez SQL et PostgreSQL', '2 mois', 199.99, 'Intermédiaire', 'Data', 'publie', '/images/database.jpg'
      WHERE NOT EXISTS (SELECT 1 FROM formations WHERE titre = 'Bases de données')
      UNION ALL
      SELECT 'JavaScript Avancé', 'Concepts avancés de JavaScript', '4 mois', 399.99, 'Avancé', 'Web', 'publie', '/images/js-advanced.jpg'
      WHERE NOT EXISTS (SELECT 1 FROM formations WHERE titre = 'JavaScript Avancé')
      UNION ALL
      SELECT 'React & Node.js', 'Stack complète moderne', '6 mois', 599.99, 'Intermédiaire', 'Web', 'publie', '/images/react-node.jpg'
      WHERE NOT EXISTS (SELECT 1 FROM formations WHERE titre = 'React & Node.js')
    `);

    console.log('Tables créées avec succès');
  } catch (err) {
    console.error('Erreur création tables:', err);
  } finally {
    client.release();
  }
};

module.exports = { pool, createTables };