import React from 'react';
import { SCHOOL_NAME } from '../config/school';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} <strong>{SCHOOL_NAME}</strong>. Tous droits reserves.</p>
        <p className="footer-sub">Application de Gestion des Apprenants & Formations</p>
      </div>
    </footer>
  );
};

export default Footer;
