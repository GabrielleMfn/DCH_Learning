const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const { createTables } = require('./config/database');

const formationsRoutes = require('./routes/formations');
const usersRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API DCH Learning',
      version: '1.0.0',
      description: 'API pour la plateforme de formation DCH Learning - Projet étudiant Web2',
      contact: {
        name: 'Équipe DCH Learning',
        email: 'contact@dchlearning.fr'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      schemas: {
        Formation: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de la formation'
            },
            titre: {
              type: 'string',
              description: 'Titre de la formation'
            },
            description: {
              type: 'string',
              description: 'Description détaillée'
            },
            categorie: {
              type: 'string',
              description: 'Catégorie de formation',
              enum: ['Développement Web', 'Data Science', 'Design']
            },
            niveau: {
              type: 'string',
              description: 'Niveau requis',
              enum: ['Débutant', 'Intermédiaire', 'Avancé', 'Expert']
            },
            duree: {
              type: 'string',
              description: 'Durée de la formation'
            },
            prix: {
              type: 'string',
              description: 'Prix de la formation'
            },
            image: {
              type: 'string',
              description: 'URL de l\'image'
            },
            statut: {
              type: 'string',
              description: 'Statut de publication',
              enum: ['publie', 'brouillon']
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de l\'utilisateur'
            },
            nom: {
              type: 'string',
              description: 'Nom de l\'utilisateur'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de l\'utilisateur'
            },
            role: {
              type: 'string',
              description: 'Rôle de l\'utilisateur',
              enum: ['user', 'admin']
            }
          }
        },
        ContactMessage: {
          type: 'object',
          properties: {
            nom: {
              type: 'string',
              description: 'Nom du contact'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email du contact'
            },
            sujet: {
              type: 'string',
              description: 'Sujet du message'
            },
            message: {
              type: 'string',
              description: 'Contenu du message'
            }
          }
        }
      },
      securitySchemes: {
        AdminAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'user-email',
          description: 'Email administrateur requis dans le header "user-email"'
        }
      }
    },
    tags: [
      {
        name: 'Formations',
        description: 'API pour la gestion des formations publiques'
      },
      {
        name: 'Admin - Formations',
        description: 'API admin pour la gestion des formations'
      },
      {
        name: 'Admin - Utilisateurs',
        description: 'API admin pour la gestion des utilisateurs'
      },
      {
        name: 'Authentification',
        description: 'API pour l\'inscription et la connexion'
      },
      {
        name: 'Contact',
        description: 'API pour les messages de contact'
      }
    ]
  },
  apis: ['./routes/*.js'] 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Documentation Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/api/formations', formationsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API DCH Learning - Serveur actif',
    documentation: 'http://localhost:5000/api-docs',
    version: '1.0.0'
  });
});

const startServer = async () => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur démarrage serveur:', error);
  }
};

startServer();