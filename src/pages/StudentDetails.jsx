import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DataTable from '../components/DataTable';
import useAdminConnectionStore from '../hooks/useAdminConnectionStore';
import { BiArrowBack, BiBookOpen, BiBriefcase, BiCalendar, BiTimeFive, BiUser } from 'react-icons/bi';
import {
  formatDurationHHMMSS,
  formatFrenchDate as formatAttendanceDate,
  formatSessionTime,
  formatType as formatAttendanceType,
  isAbsentSession,
  isNonConnectionType,
  splitDateAndDay,
  sortChronological,
} from '../utils/attendanceDisplay';

const StudentDetails = () => {
  const { id } = useParams();
  const { learners, connectionTimes, planningDays } = useAdminConnectionStore();
  const [expandedContentIds, setExpandedContentIds] = useState(new Set());
  const learner = learners.find((item) => item.id === id);
  const learnerConnections = sortChronological(connectionTimes.filter((entry) => entry.learnerId === id));
  const learnerPlanning = sortChronological(planningDays.filter((day) => day.learnerId === id));

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
  const formatMinutes = (minutes) => {
    const roundedMinutes = Math.round(minutes || 0);
    return `${Math.floor(roundedMinutes / 60)}h ${String(roundedMinutes % 60).padStart(2, '0')}min`;
  };
  const totalLabel = formatMinutes(totalDuration);
  const connectionSessionCount = learnerConnections.filter((entry) => entry.type === 'ECOLE' && entry.status === 'Present').length;
  const toggleContent = (entryId) => {
    setExpandedContentIds((current) => {
      const next = new Set(current);
      if (next.has(entryId)) {
        next.delete(entryId);
      } else {
        next.add(entryId);
      }
      return next;
    });
  };

  return (
    <div className="student-details-page student-details-layout">
      <div className="student-details-toolbar">
        <Link to="/students" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          <BiArrowBack />
          <span>Retour aux Apprenants</span>
        </Link>
        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Fiche issue de la base admin</span>
      </div>

      <div className="student-summary-strip">
        <div className="student-summary-card">
          <span>Volume horaire total</span>
          <strong>{totalLabel}</strong>
          <small>Duree cumulee des sessions</small>
        </div>
        <div className="student-summary-card">
          <span>Temps de connexion</span>
          <strong>{connectionSessionCount}</strong>
          <small>Session(s) ECOLE enregistree(s)</small>
        </div>
      </div>

      <div className="grid-two-cols-equal student-details-summary">
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
                <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Periode de contrat</span>
                <span style={{ fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <BiTimeFive size={16} /> {formatAttendanceDate(learner.contractStart || learner.contractStartDate)} - {formatAttendanceDate(learner.contractEnd || learner.contractEndDate)}
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
            <span><strong>Entreprise :</strong> <BiBriefcase size={16} /> {learner.company?.name || '-'}</span>
          </div>
        </div>
      </div>

      <div className="custom-card student-history-card">
        <h3 className="section-title student-history-title">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <BiCalendar size={20} className="text-secondary" />
            Historique des connexions
          </span>
          <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{learnerPlanning.length} ligne(s) de planning</span>
        </h3>

        <DataTable className="connection-history-table" headers={['Date', 'Jour', 'Type', 'Heure début', 'Heure fin', 'Durée', 'Adresse IP', 'Statut', 'Contenu']}>
          {learnerConnections.length > 0 ? learnerConnections.map((entry) => {
            const content = entry.content || entry.comment || '-';
            const displayDate = splitDateAndDay(entry.date, entry.day);
            const isExpanded = expandedContentIds.has(entry.id);
            const canExpand = content.length > 130;
            const mutedStatus = isAbsentSession(entry) || isNonConnectionType(entry);

            return (
              <tr key={entry.id}>
                <td className="col-date">{displayDate.date}</td>
                <td className="col-day">{displayDate.day}</td>
                <td className="col-type"><span className="type-pill">{formatAttendanceType(entry.type)}</span></td>
                <td className="col-time">{formatSessionTime(entry, 'startTime', 'morningLogin')}</td>
                <td className="col-time">{formatSessionTime(entry, 'endTime', 'afternoonLogout')}</td>
                <td className="col-duration"><strong>{formatDurationHHMMSS(entry)}</strong></td>
                <td className="col-ip">{mutedStatus ? '' : entry.ipAddress || ''}</td>
                <td className="col-status"><span className={`badge compact-badge ${entry.status === 'Present' ? 'badge-success' : 'badge-warning'}`}>{entry.status}</span></td>
                <td className="col-content">
                  <div className={`history-content ${isExpanded ? 'expanded' : ''}`}>{content}</div>
                  {canExpand && (
                    <button className="history-content-toggle" type="button" onClick={() => toggleContent(entry.id)}>
                      {isExpanded ? 'Voir moins' : 'Voir plus'}
                    </button>
                  )}
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan="9" className="text-center text-secondary" style={{ padding: '2rem' }}>
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
