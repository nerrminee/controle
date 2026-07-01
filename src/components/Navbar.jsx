import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BiLogOut, BiMenu, BiUserCircle } from 'react-icons/bi';
import { isAdminAuthenticated, logoutAdmin } from '../services/adminConnectionStore';

const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Tableau de bord';
    if (path === '/students') return 'Gestion des Apprenants';
    if (path.startsWith('/students/')) return "Details de l'Apprenant";
    if (path === '/trainers') return 'Formateurs';
    if (path === '/companies') return 'Entreprises Partenaires';
    if (path === '/documents') return 'Centre de Documents';
    if (path === '/admin/login') return 'Connexion admin';
    if (path === '/admin/add-learner') return 'Admin - Ajouter un apprenant';
    if (path === '/admin/learners') return 'Admin - Apprenants';
    if (path === '/admin/planning') return 'Admin - Planning';
    if (path === '/admin/connection-times') return 'Admin - Temps de connexion';
    if (path === '/admin/exports') return 'Admin - Exports';
    if (path === '/about') return 'A Propos de CONTROLE';
    return params.id ? "Details de l'Apprenant" : 'Portail Scolaire';
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('fr-FR', options);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
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
            <span className="user-role">Secretariat</span>
          </div>
          <BiUserCircle size={36} className="user-avatar" />
          {location.pathname.startsWith('/admin') && isAdminAuthenticated() && (
            <button className="icon-button" type="button" title="Deconnexion admin" onClick={handleLogout}>
              <BiLogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
