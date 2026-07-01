import React from 'react';
import logo from '../assets/logo.png';
import { BiBuildingHouse, BiCheckShield, BiEnvelope, BiPhoneCall } from 'react-icons/bi';
import { SCHOOL_NAME } from '../config/school';

const About = () => (
  <div className="about-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div className="custom-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', padding: '2rem' }}>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
          A propos de {SCHOOL_NAME}
        </h2>
        <p className="text-secondary mb-3" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
          Fondee avec la volonte de former les professionnels de demain, l'ecole <strong>{SCHOOL_NAME}</strong> propose des parcours d'apprentissage intensifs et pragmatiques, adaptes aux exigences reelles du marche du travail.
        </p>
        <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
          Grace a une pedagogie par projet et un encadrement assure par des formateurs experts, nos apprenants acquierent des competences directement operationnelles.
        </p>
      </div>
      <div className="text-center" style={{ flex: '0 0 220px', margin: '0 auto' }}>
        <img
          src={logo}
          alt={`${SCHOOL_NAME} logo`}
          style={{ width: '150px', height: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto' }}
        />
        <h3 style={{ marginTop: '1rem', fontSize: '1.15rem', color: 'var(--sidebar-bg)' }}>{SCHOOL_NAME}</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Institut de Formation</span>
      </div>
    </div>

    <div className="grid-two-cols">
      <div className="custom-card">
        <h3 className="section-title mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Nos valeurs & mission
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <BiCheckShield size={22} style={{ color: 'var(--success)', marginTop: '0.25rem', flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Excellence pedagogique</strong>
              <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                Un accompagnement personnalise et des cours concus pour garantir une progression solide.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <BiBuildingHouse size={22} style={{ color: 'var(--primary-light)', marginTop: '0.25rem', flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Insertion professionnelle</strong>
              <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                Un reseau d'entreprises partenaires favorisant les stages et l'alternance.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <BiCheckShield size={22} style={{ color: 'var(--warning)', marginTop: '0.25rem', flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Accompagnement et suivi</strong>
              <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                Un suivi rigoureux des presences, des temps d'apprentissage et de la progression individuelle.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 className="section-title mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Contact & informations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BiBuildingHouse size={20} className="text-secondary" />
            <div>
              <span className="text-secondary" style={{ fontSize: '0.75rem', display: 'block' }}>Adresse de l'etablissement</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>12, Rue du Controle, 75001 Paris, France</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BiPhoneCall size={20} className="text-secondary" />
            <div>
              <span className="text-secondary" style={{ fontSize: '0.75rem', display: 'block' }}>Numero de telephone</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>+33 (0)1 40 50 60 70</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BiEnvelope size={20} className="text-secondary" />
            <div>
              <span className="text-secondary" style={{ fontSize: '0.75rem', display: 'block' }}>Adresse e-mail</span>
              <a href="mailto:contact@lamaisondapprentissage.fr" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--primary-light)', textDecoration: 'underline' }}>
                contact@lamaisondapprentissage.fr
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
