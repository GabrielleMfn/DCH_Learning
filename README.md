# Projet Éducation - Web 2

Site web d'éducation en ligne développé avec React, Node.js, Express et PostgreSQL.

## Structure du projet

```
projet-education/
├── backend/           # API Node.js/Express
├── frontend/          # Application React
└── README.md
```

## Installation et Configuration

### Prérequis
- Node.js (version 16+)
- PostgreSQL
- npm

### Configuration Backend

1. Aller dans le dossier backend :
```bash
cd backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer PostgreSQL :
   - Créer une base de données nommée `education_db`
   - Modifier les variables dans `.env` si nécessaire

4. Démarrer le serveur :
```bash
npm run dev
```

Le serveur démarre sur http://localhost:5000

### Configuration Frontend

1. Aller dans le dossier frontend :
```bash
cd frontend
```

2. Installer les dépendances :
```bash
npm install
```

3. Démarrer l'application :
```bash
npm start
```

L'application démarre sur http://localhost:3000

## Pages disponibles

- **Accueil** : Page d'accueil avec présentation
- **Formations** : Liste des formations disponibles
- **Connexion** : Inscription et connexion des utilisateurs
- **Contact** : Formulaire de contact

## API Endpoints

### Formations
- `GET /api/formations` - Liste des formations
- `GET /api/formations/:id` - Détail d'une formation

### Utilisateurs
- `POST /api/users/inscription` - Créer un compte
- `POST /api/users/connexion` - Se connecter

### Contact
- `POST /api/contact` - Envoyer un message

## Technologies utilisées

- **Frontend** : React, React Router, Axios, CSS
- **Backend** : Node.js, Express, CORS, PostgreSQL 
- **Base de données** : PostgreSQL

## Fait Par : 
- **M'FOUMOUNE Gabrielle**