import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { BiMenu, BiUserCircle } from 'react-icons/bi';

/**
 * Top Navbar component
 * @param {Object} props
 * @param {Function} props.onToggleSidebar - Handler to toggle sidebar on mobile viewports
 */
const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const params = useParams();

  // Helper to resolve the page title in French based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Tableau de bord';
    if (path === '/students') return 'Gestion des Apprenants';
    if (path.startsWith('/students/')) return "Détails de l'Apprenant";
    if (path === '/trainers') return 'Formateurs';
    if (path === '/companies') return 'Entreprises Partenaires';
    if (path === '/documents') return 'Centre de Documents';
    if (path === '/about') return 'À Propos de CONTROLE';
    return 'Portail Scolaire';
  };

  // Format current date in French
  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('fr-FR', options);
  };

  return (
    <header className="main-navbar">
      <div className="navbar-left">
        <button className="mobile-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle Menu">
          <BiMenu size={24} />
        </button>
        <h1 className="navbar-title">{getPageTitle()}</h1>
      </div>
      
      <div className="navbar-right">
        <div className="navbar-date text-secondary">
          {getFormattedDate()}
        </div>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Admin CONTROLE</span>
            <span className="user-role">Secrétariat</span>
          </div>
          <BiUserCircle size={36} className="user-avatar" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
