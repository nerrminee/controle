import React, { useMemo } from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import useAdminConnectionStore from '../hooks/useAdminConnectionStore';
import { trainers } from '../data/trainers';
import { BiAward, BiGroup, BiLogInCircle, BiTimeFive } from 'react-icons/bi';

const minutesFromDuration = (duration) => {
  const match = String(duration || '').match(/(\d+)h\s*(\d+)?/);
  return match ? (Number(match[1]) * 60) + Number(match[2] || 0) : 0;
};

const entryMinutes = (entry) => entry.durationMinutes || minutesFromDuration(entry.duration);

const formatMinutes = (minutes) => `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}min`;

const Dashboard = () => {
  const { learners, connectionTimes } = useAdminConnectionStore();
  const totalConnectionTime = useMemo(() => (
    formatMinutes(connectionTimes.reduce((total, entry) => total + entryMinutes(entry), 0))
  ), [connectionTimes]);
  const latestConnections = useMemo(() => (
    [...connectionTimes]
      .sort((a, b) => `${b.date} ${b.startTime || b.morningLogin || ''}`.localeCompare(`${a.date} ${a.startTime || a.morningLogin || ''}`))
      .slice(0, 5)
  ), [connectionTimes]);

  return (
    <div className="dashboard-page">
      <div className="grid-stats">
        <Card
          title="Apprenants"
          value={learners.length}
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
          value={totalConnectionTime}
          icon={<BiTimeFive size={24} />}
          description="Volume genere"
        />
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

          <DataTable headers={['Date', 'Apprenant', 'Connexion', 'Deconnexion', 'Duree']}>
            {latestConnections.length > 0 ? latestConnections.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td><strong>{entry.learnerName}</strong></td>
                <td><span className="badge badge-success">{entry.startTime || entry.morningLogin || '-'}</span></td>
                <td><span className="badge badge-warning">{entry.endTime || entry.afternoonLogout || '-'}</span></td>
                <td>{entry.duration || formatMinutes(entry.durationMinutes || 0)}</td>
              </tr>
            )) : (
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
              <strong>{learners.filter((learner) => learner.active).length}</strong>
            </div>
          </div>
          <div className="stat-widget mb-3">
            <div className="flex-between mb-3">
              <span className="text-secondary">Lignes de connexion</span>
              <strong>{connectionTimes.length}</strong>
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
