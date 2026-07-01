import React from 'react';
import { BiFile, BiDownload } from 'react-icons/bi';

const Documents = () => {
  const docsList = [
    {
      id: 1,
      title: "Règlement Intérieur",
      description: "Charte de bonne conduite, droits et devoirs des apprenants au sein du centre CONTROLE.",
      type: "PDF",
      size: "240 Ko"
    },
    {
      id: 2,
      title: "Calendrier Pédagogique 2026",
      description: "Dates clés, périodes en entreprise, examens et jours fériés de l'année scolaire en cours.",
      type: "PDF",
      size: "1.4 Mo"
    },
    {
      id: 3,
      title: "Guide d'Accueil de l'Apprenant",
      description: "Informations pratiques sur la vie de l'école, les outils numériques et le suivi pédagogique.",
      type: "PDF",
      size: "3.2 Mo"
    },
    {
      id: 4,
      title: "Modèle de Livret de Stage",
      description: "Document de suivi de stage en entreprise à faire remplir par le tuteur de stage.",
      type: "Word",
      size: "180 Ko"
    },
    {
      id: 5,
      title: "Fiche d'Évaluation de Fin de Cycle",
      description: "Critères d'évaluation de la formation pour l'obtention de la certification.",
      type: "PDF",
      size: "450 Ko"
    }
  ];

  // Helper to dynamically generate a text file simulating a PDF/Word download
  const downloadDoc = (title, type) => {
    const fileContent = `==================================================
CENTRE DE FORMATION CONTROLE - ESPACE APPRENANT
==================================================

Document : ${title}
Format initial : ${type}
Date de téléchargement : ${new Date().toLocaleDateString('fr-FR')}

Ceci est un document administratif / pédagogique officiel fourni par l'établissement de formation CONTROLE.

Pour toute question ou réclamation concernant ce document, veuillez vous adresser au secrétariat de l'école.

--------------------------------------------------
CONTROLE - Gestion des Apprenants
C:\\Users\\Mebrouka\\Desktop\\rch\\controle
`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Choose file extension based on type
    const ext = type.toLowerCase() === 'word' ? 'docx' : 'pdf';
    // Format filename to avoid spaces
    const safeName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `${safeName}.${ext}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="documents-page">
      <div className="mb-3">
        <h2 className="section-title">Documents Pédagogiques & Administratifs</h2>
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
          Téléchargez les documents essentiels pour le bon déroulement de votre parcours de formation.
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
              style={{ display: 'inline-flex', gap: '0.5rem', width: '100%', padding: '0.5rem 1rem' }}
            >
              <BiDownload size={16} />
              <span>Télécharger</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
