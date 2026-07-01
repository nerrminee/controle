import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DataTable from '../components/DataTable';
import useAdminConnectionStore from '../hooks/useAdminConnectionStore';
import { BiArrowBack, BiBookOpen, BiBriefcase, BiCalendar, BiTimeFive, BiUser } from 'react-icons/bi';

const StudentDetails = () => {
  const { id } = useParams();
  const { learners, connectionTimes, planningDays } = useAdminConnectionStore();
  const learner = learners.find((item) => item.id === id);
  const learnerConnections = connectionTimes.filter((entry) => entry.learnerId === id);
  const learnerPlanning = planningDays.filter((day) => day.learnerId === id);

  if (!learner) {
    return (
      <div className="student-not-found custom-card text-center" style={{ padding: '3rem 2rem' }}>
        <h2 className="mb-3">Apprenant introuvable</h2>
        <p className="text-secondary mb-3">Cet apprenant n existe pas ou a ete supprime par l admin.</p>
        <Link to="/students" className="btn btn-primary">
          <BiArrowBack className="mr-2" /> Retour a la liste
        </Link>
      </div>
    );
  }

  const totalDuration = learnerConnections.reduce((total, entry) => {
    if (entry.durationMinutes) return total + entry.durationMinutes;
    const match = String(entry.duration || '').match(/(\d+)h\s*(\d+)?/);
    return total + (match ? (Number(match[1]) * 60) + Number(match[2] || 0) : 0);
  }, 0);
  const totalLabel = `${Math.floor(totalDuration / 60)}h ${String(totalDuration % 60).padStart(2, '0')}min`;

  return (
    <div className="student-details-page">
      <div className="flex-between mb-3">
        <Link to="/students" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          <BiArrowBack />
          <span>Retour aux Apprenants</span>
        </Link>
        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Fiche issue de la base admin</span>
      </div>

      <div className="grid-two-cols-equal mb-3">
        <div className="custom-card">
          <h3 className="section-title mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Informations generales
          </h3>
          <div className="student-profile-info" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: '#E2E8F0', padding: '0.75rem', borderRadius: '50%' }}>
                <BiUser size={30} className="text-secondary" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>{learner.fullName}</h2>
                <span className={`badge ${learner.active ? 'badge-success' : 'badge-warning'}`}>{learner.active ? 'Actif' : 'Inactif'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Code apprenant</span>
                <span style={{ fontWeight: '600' }}>{learner.code}</span>
              </div>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Formation</span>
                <span style={{ fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <BiBookOpen size={16} /> {learner.formation}
                </span>
              </div>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Diplome prepare</span>
                <span style={{ fontWeight: '600' }}>{learner.level || '-'}</span>
              </div>
              <div>
                <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Volume horaire total</span>
                <span style={{ fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <BiTimeFive size={16} /> {totalLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="custom-card">
          <h3 className="section-title mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Entreprise et connexion
          </h3>
          <div className="admin-detail-list">
            <span><strong>Email :</strong> {learner.email || '-'}</span>
            <span><strong>Telephone :</strong> {learner.phone || '-'}</span>
            <span><strong>Entreprise :</strong> <BiBriefcase size={16} /> {learner.company?.name || '-'}</span>
            <span><strong>Tuteur :</strong> {learner.company?.tutorName || '-'}</span>
            <span><strong>IP :</strong> {learner.connectionInfo?.ipAddress || '-'}</span>
            <span><strong>Navigateur :</strong> {learner.connectionInfo?.browser || '-'}</span>
            <span><strong>Appareil :</strong> {learner.connectionInfo?.device || '-'}</span>
          </div>
        </div>
      </div>

      <div className="custom-card">
        <h3 className="section-title mb-3 flex-between">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <BiCalendar size={20} className="text-secondary" />
            Historique des connexions
          </span>
          <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{learnerPlanning.length} ligne(s) de planning</span>
        </h3>

        <DataTable headers={['Date', 'Jour', 'Type', 'Heure debut', 'Heure fin', 'Duree', 'Statut', 'Commentaire']}>
          {learnerConnections.length > 0 ? learnerConnections.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.date}</td>
              <td>{entry.day}</td>
              <td>{entry.type}</td>
              <td>{entry.startTime || entry.morningLogin || '-'}</td>
              <td>{entry.endTime || entry.afternoonLogout || '-'}</td>
              <td><strong>{entry.duration || `${Math.floor((entry.durationMinutes || 0) / 60)}h ${String((entry.durationMinutes || 0) % 60).padStart(2, '0')}min`}</strong></td>
              <td><span className={`badge ${entry.status === 'Present' ? 'badge-success' : 'badge-warning'}`}>{entry.status}</span></td>
              <td>{entry.content || entry.comment || '-'}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="8" className="text-center text-secondary" style={{ padding: '2rem' }}>
                Aucun temps de connexion genere pour cet apprenant.
              </td>
            </tr>
          )}
        </DataTable>
      </div>
    </div>
  );
};

export default StudentDetails;
