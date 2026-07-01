import React from 'react';

/**
 * Footer component displaying school copyrights
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} <strong>CONTROLE</strong>. Tous droits réservés.</p>
        <p className="footer-sub">Application de Gestion des Apprenants & Formations</p>
      </div>
    </footer>
  );
};

export default Footer;
