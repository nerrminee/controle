import React from 'react';
import logo from '../assets/logo.png';
import { BiBuildingHouse, BiCheckShield, BiEnvelope, BiPhoneCall } from 'react-icons/bi';

const About = () => {
  return (
    <div className="about-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Hero Welcome banner */}
      <div className="custom-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', padding: '2rem' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            À propos de l'École CONTROLE
          </h2>
          <p className="text-secondary mb-3" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            Fondée avec la volonté de former les professionnels du numérique de demain, l'école 
            <strong> CONTROLE</strong> propose des parcours d'apprentissage intensifs et pragmatiques, 
            adaptés aux exigences réelles du marché du travail.
          </p>
          <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            Grâce à une pédagogie par projet et un encadrement assuré par des formateurs experts de leur secteur, 
            nos apprenants acquièrent des compétences directement opérationnelles en développement web, design, marketing et systèmes.
          </p>
        </div>
        <div className="text-center" style={{ flex: '0 0 200px', margin: '0 auto' }}>
          <img 
            src={logo} 
            alt="CONTROLE logo" 
            style={{ width: '150px', height: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto' }} 
          />
          <h3 style={{ marginTop: '1rem', fontSize: '1.25rem', color: 'var(--sidebar-bg)', letterSpacing: '1px' }}>CONTROLE</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Institut de Formation</span>
        </div>
      </div>

      {/* Two column breakdown for values and contacts */}
      <div className="grid-two-cols">
        {/* Left Column: School Values */}
        <div className="custom-card">
          <h3 className="section-title mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Nos Valeurs & Mission
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--success)', marginTop: '0.25rem' }}>
                <BiCheckShield size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Excellence Pédagogique</strong>
                <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                  Un accompagnement personnalisé et des cours rédigés par des praticiens du secteur pour garantir une maîtrise technique optimale.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--primary-light)', marginTop: '0.25rem' }}>
                <BiBuildingHouse size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Insertion Professionnelle</strong>
                <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                  Un réseau solide d'entreprises partenaires favorisant les stages et l'alternance de nos apprenants.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--warning)', marginTop: '0.25rem' }}>
                <BiCheckShield size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Accompagnement et Suivi</strong>
                <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                  Un suivi rigoureux des présences, des temps d'apprentissage et de la progression individuelle de chaque profil.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact info */}
        <div className="custom-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="section-title mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Contact & Informations
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem', flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BiBuildingHouse size={20} className="text-secondary" />
              <div>
                <span className="text-secondary" style={{ fontSize: '0.75rem', display: 'block' }}>Adresse de l'établissement</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>12, Rue du Contrôle, 75001 Paris, France</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BiPhoneCall size={20} className="text-secondary" />
              <div>
                <span className="text-secondary" style={{ fontSize: '0.75rem', display: 'block' }}>Numéro de téléphone</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>+33 (0)1 40 50 60 70</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BiEnvelope size={20} className="text-secondary" />
              <div>
                <span className="text-secondary" style={{ fontSize: '0.75rem', display: 'block' }}>Adresse E-mail</span>
                <a href="mailto:contact@ecolecontrole.fr" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--primary-light)', textDecoration: 'underline' }}>
                  contact@ecolecontrole.fr
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
