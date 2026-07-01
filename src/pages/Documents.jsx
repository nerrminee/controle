import React from 'react';
import { BiFile, BiDownload } from 'react-icons/bi';
import { SCHOOL_NAME } from '../config/school';

const Documents = () => {
  const docsList = [
    {
      id: 1,
      title: 'Reglement Interieur',
      description: `Charte de bonne conduite, droits et devoirs des apprenants au sein de ${SCHOOL_NAME}.`,
      type: 'PDF',
      size: '240 Ko',
    },
    {
      id: 2,
      title: 'Calendrier Pedagogique 2026',
      description: "Dates cles, periodes en entreprise, examens et jours feries de l'annee scolaire en cours.",
      type: 'PDF',
      size: '1.4 Mo',
    },
    {
      id: 3,
      title: "Guide d'Accueil de l'Apprenant",
      description: "Informations pratiques sur la vie de l'ecole, les outils numeriques et le suivi pedagogique.",
      type: 'PDF',
      size: '3.2 Mo',
    },
    {
      id: 4,
      title: 'Modele de Livret de Stage',
      description: 'Document de suivi de stage en entreprise a faire remplir par le tuteur de stage.',
      type: 'Word',
      size: '180 Ko',
    },
    {
      id: 5,
      title: 'Fiche Evaluation de Fin de Cycle',
      description: "Criteres d'evaluation de la formation pour l'obtention de la certification.",
      type: 'PDF',
      size: '450 Ko',
    },
  ];

  const downloadDoc = (title, type) => {
    const fileContent = `==================================================
${SCHOOL_NAME.toUpperCase()} - ESPACE APPRENANT
==================================================

Document : ${title}
Format initial : ${type}
Date de telechargement : ${new Date().toLocaleDateString('fr-FR')}

Ceci est un document administratif / pedagogique officiel fourni par ${SCHOOL_NAME}.

Pour toute question ou reclamation concernant ce document, veuillez vous adresser au secretariat de l'ecole.

--------------------------------------------------
${SCHOOL_NAME} - Gestion des Apprenants
C:\\Users\\Mebrouka\\Desktop\\rch\\controle
`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const ext = type.toLowerCase() === 'word' ? 'docx' : 'pdf';
    const safeName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.href = url;
    link.download = `${safeName}.${ext}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="documents-page">
      <div className="mb-3">
        <h2 className="section-title">Documents Pedagogiques & Administratifs</h2>
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
          Telechargez les documents essentiels pour le bon deroulement de votre parcours de formation.
        </p>
      </div>

      <div className="grid-cards">
        {docsList.map((doc) => (
          <div key={doc.id} className="custom-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'between', height: '100%' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: doc.type === 'PDF' ? '#FEEBC8' : '#EBF8FF', color: doc.type === 'PDF' ? '#C05621' : '#2B6CB0', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
                <BiFile size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.25rem' }}>{doc.title}</h3>
                <span className="badge" style={{ backgroundColor: '#EDF2F7', color: 'var(--text-secondary)', padding: '0.15rem 0.4rem', fontSize: '0.7rem' }}>
                  {doc.type} &bull; {doc.size}
                </span>
              </div>
            </div>

            <p className="text-secondary" style={{ fontSize: '0.85rem', flex: 1, marginBottom: '1.5rem' }}>
              {doc.description}
            </p>

            <button
              onClick={() => downloadDoc(doc.title, doc.type)}
              className="btn btn-primary"
              type="button"
              style={{ display: 'inline-flex', gap: '0.5rem', width: '100%', padding: '0.5rem 1rem' }}
            >
              <BiDownload size={16} />
              <span>Telecharger</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
