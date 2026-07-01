import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { students } from '../data/students';
import { BiArrowBack, BiUser, BiBookOpen, BiBriefcase, BiTimeFive, BiCalendar } from 'react-icons/bi';

/**
 * StudentDetails page
 * Displays full profile and connection history for a single student.
 * The student is looked up from the students array via the :id URL parameter.
 */
const StudentDetails = () => {
  const { id } = useParams();

  // Find the student by numeric ID from URL
  const student = students.find(s => s.id === parseInt(id, 10));

  // Handle case where ID doesn't match any student
  if (!student) {
    return (
      <div className="student-not-found custom-card text-center" style={{ padding: '3rem 2rem' }}>
        <h2 className="mb-3">Apprenant introuvable</h2>
        <p className="text-secondary mb-3">L'apprenant demandé n'existe pas ou a été retiré du système.</p>
        <Link to="/students" className="btn btn-primary">
          <BiArrowBack className="mr-2" /> Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="student-details-page">
      {/* Top navigation bar: back button and page label */}
      <div className="flex-between mb-3">
        <Link to="/students" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          <BiArrowBack />
          <span>Retour aux Apprenants</span>
        </Link>
        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Fiche d'activité individuelle</span>
      </div>

      {/* Student Profile: equal two-column layout on wide screens */}
      <div className="grid-two-cols-equal mb-3">

        {/* Left Card: General Information */}
        <div className="custom-card">
          <h3 className="section-title mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Informations Générales
          </h3>

          <div className="student-profile-info" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Avatar + Name row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: '#E2E8F0', padding: '0.75rem', borderRadius: '50%' }}>
                <BiUser size={30} className="text-secondary" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>{student.name}</h2>
                <span className="badge badge-success">Apprenant</span>
              </div>
            </div>

            {/* Detail grid: 2 columns of fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Formation</span>
                <span style={{ fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <BiBookOpen size={16} /> {student.training}
                </span>
              </div>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Formateur référent</span>
                <span style={{ fontWeight: '600' }}>{student.trainer}</span>
              </div>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Entreprise d'accueil</span>
                <span style={{ fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <BiBriefcase size={16} /> {student.company}
                </span>
              </div>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Volume horaire total</span>
                <span style={{ fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <BiTimeFive size={16} /> {student.totalTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Performance Indicators */}
        <div className="custom-card">
          <h3 className="section-title mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Indicateurs de Suivi
          </h3>

          <div className="student-metrics" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '0.5rem' }}>
            {/* Présence bar */}
            <div>
              <div className="flex-between mb-3">
                <span className="text-secondary">Assiduité / Présence</span>
                <strong>{student.presence}</strong>
              </div>
              <div className="progress-container">
                <div className="progress-bar-outer">
                  <div
                    className="progress-bar-inner"
                    style={{ width: student.presence, backgroundColor: 'var(--success)' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex-between mb-3">
                <span className="text-secondary">Progression du cursus</span>
                <strong>{student.progress}</strong>
              </div>
              <div className="progress-container">
                <div className="progress-bar-outer">
                  <div
                    className="progress-bar-inner"
                    style={{ width: student.progress, backgroundColor: 'var(--primary-light)' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Summary note */}
            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Suivi pédagogique en cours — {student.connections.length} session(s) enregistrée(s).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection History Table */}
      <div className="custom-card">
        <h3 className="section-title mb-3 flex-between">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <BiCalendar size={20} className="text-secondary" />
            Historique des connexions
          </span>
          <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Détails des sessions</span>
        </h3>

        <DataTable headers={["Date", "Heure d'entrée", "Heure de sortie", "Durée de la session"]}>
          {student.connections && student.connections.length > 0 ? (
            student.connections.map((conn, index) => (
              <tr key={index}>
                <td>{conn.date}</td>
                <td><span className="badge badge-success">{conn.login}</span></td>
                <td><span className="badge badge-warning">{conn.logout}</span></td>
                <td><strong>{conn.duration}</strong></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-secondary" style={{ padding: '2rem' }}>
                Aucun enregistrement de connexion disponible pour cet apprenant.
              </td>
            </tr>
          )}
        </DataTable>
      </div>
    </div>
  );
};

export default StudentDetails;
