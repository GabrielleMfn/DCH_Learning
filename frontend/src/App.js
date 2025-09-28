import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Formations from './pages/Formations';
import FormationDetail from './pages/FormationDetail';
import Connexion from './pages/Connexion';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/formations/:id" element={<FormationDetail />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;