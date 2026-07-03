import React, { useMemo } from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import useAdminConnectionStore from '../hooks/useAdminConnectionStore';
import { trainers } from '../data/trainers';
import { BiAward, BiGroup, BiLogInCircle, BiTimeFive } from 'react-icons/bi';
import {
  formatDurationHHMMSS,
  formatFrenchDate,
  formatSessionTime,
  isCompanyDay,
  compareChronological,
  splitDateAndDay,
} from '../utils/attendanceDisplay';

const minutesFromDuration = (duration) => {
  const match = String(duration || '').match(/(\d+)h\s*(\d+)?/);
  return match ? (Number(match[1]) * 60) + Number(match[2] || 0) : 0;
};

const entryMinutes = (entry) => entry.durationMinutes || minutesFromDuration(entry.duration);

const formatMinutes = (minutes) => {
  const roundedMinutes = Math.round(minutes || 0);
  return `${Math.floor(roundedMinutes / 60)}h ${String(roundedMinutes % 60).padStart(2, '0')}min`;
};

const Dashboard = () => {
  const { learners, connectionTimes, isLoading } = useAdminConnectionStore();
  const schoolConnectionTimes = useMemo(() => connectionTimes.filter((entry) => !isCompanyDay(entry)), [connectionTimes]);
  const totalConnectionMinutes = useMemo(() => (
    schoolConnectionTimes.reduce((total, entry) => total + entryMinutes(entry), 0)
  ), [schoolConnectionTimes]);
  const totalConnectionTime = useMemo(() => formatMinutes(totalConnectionMinutes), [totalConnectionMinutes]);
  const connectionSessionCount = useMemo(() => (
    schoolConnectionTimes.filter((entry) => entry.type === 'ECOLE' && entry.status === 'Present').length
  ), [schoolConnectionTimes]);
  const latestConnections = useMemo(() => (
    [...schoolConnectionTimes]
      .sort((first, second) => compareChronological(second, first))
      .slice(0, 5)
  ), [schoolConnectionTimes]);

  return (
    <div className="dashboard-page">
      <div className="grid-stats">
        <Card
          title="Apprenants"
          value={isLoading && learners.length === 0 ? 'Chargement...' : learners.length}
          icon={<BiGroup size={24} />}
          description="Ajoutes par l admin"
        />
        <Card
          title="Formateurs"
          value={trainers.length}
          icon={<BiAward size={24} />}
          description="Enseignants actifs"
        />
        <Card
          title="Temps de Connexion"
          value={connectionSessionCount}
          icon={<BiTimeFive size={24} />}
          description="Sessions ECOLE"
        />
      </div>

      <div className="dashboard-summary-strip">
        <div className="dashboard-summary-card">
          <span>Volume horaire total</span>
          <strong>{totalConnectionTime}</strong>
          <small>Duree cumulee des connexions</small>
        </div>
        <div className="dashboard-summary-card">
          <span>Temps de Connexion</span>
          <strong>{connectionSessionCount}</strong>
          <small>Session(s) ECOLE enregistree(s)</small>
        </div>
      </div>

      <div className="grid-two-cols">
        <div className="dashboard-section custom-card">
          <div className="section-header flex-between mb-3">
            <h3 className="section-title flex-between">
              <BiLogInCircle size={20} className="mr-2 text-secondary" />
              Dernieres connexions
            </h3>
            <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Base admin</span>
          </div>

          <DataTable className="dashboard-connections-table" headers={['Date', 'Apprenant', 'Connexion', 'Deconnexion', 'Duree']}>
            {latestConnections.length > 0 ? latestConnections.map((entry) => {
              const displayDate = splitDateAndDay(entry.date, entry.day);

              return (
                <tr key={entry.id}>
                  <td className="col-date">{formatFrenchDate(displayDate.date)}</td>
                  <td><strong>{entry.learnerName}</strong></td>
                  <td className="col-time"><span className="badge badge-success">{formatSessionTime(entry, 'startTime', 'morningLogin')}</span></td>
                  <td className="col-time"><span className="badge badge-warning">{formatSessionTime(entry, 'endTime', 'afternoonLogout')}</span></td>
                  <td className="col-duration">{formatDurationHHMMSS(entry)}</td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="5" className="text-center text-secondary" style={{ padding: '2rem' }}>
                  Aucun temps de connexion genere pour le moment.
                </td>
              </tr>
            )}
          </DataTable>
        </div>

        <div className="dashboard-section custom-card">
          <h3 className="section-title mb-3">Statistiques Globales</h3>
          <div className="stat-widget mb-3">
            <div className="flex-between mb-3">
              <span className="text-secondary">Apprenants actifs</span>
              <strong>{isLoading && learners.length === 0 ? 'Chargement...' : learners.filter((learner) => learner.active).length}</strong>
            </div>
          </div>
          <div className="stat-widget mb-3">
            <div className="flex-between mb-3">
              <span className="text-secondary">Lignes de connexion</span>
              <strong>{schoolConnectionTimes.length}</strong>
            </div>
          </div>
          <div className="school-status-card mt-3" style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Gestion admin</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Les apprenants affiches proviennent uniquement des ajouts effectues par l admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
