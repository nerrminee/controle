import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { 
  BiLayout, 
  BiGroup, 
  BiAward, 
  BiBuilding, 
  BiFile, 
  BiInfoCircle, 
  BiX 
} from 'react-icons/bi';

/**
 * Sidebar Navigation component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the sidebar is visible on mobile
 * @param {Function} props.onClose - Function to close the sidebar
 */
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay backdrop for mobile viewports */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <img src={logo} alt="CONTROLE Logo" className="sidebar-logo" />
            <span className="sidebar-brand">CONTROLE</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Fermer le menu">
            <BiX size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
            end
          >
            <BiLayout size={20} className="sidebar-icon" />
            <span>Tableau de bord</span>
          </NavLink>
          
          <NavLink 
            to="/students" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <BiGroup size={20} className="sidebar-icon" />
            <span>Apprenants</span>
          </NavLink>
          
          <NavLink 
            to="/trainers" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <BiAward size={20} className="sidebar-icon" />
            <span>Formateurs</span>
          </NavLink>
          
          <NavLink 
            to="/companies" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <BiBuilding size={20} className="sidebar-icon" />
            <span>Entreprises</span>
          </NavLink>
          
          <NavLink 
            to="/documents" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <BiFile size={20} className="sidebar-icon" />
            <span>Documents</span>
          </NavLink>
          
          <NavLink 
            to="/about" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <BiInfoCircle size={20} className="sidebar-icon" />
            <span>À propos</span>
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <span className="sidebar-version">v1.0.0</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
