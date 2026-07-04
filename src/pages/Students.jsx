import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable';
import useAdminConnectionStore from '../hooks/useAdminConnectionStore';
import { BiInfoCircle, BiSearch } from 'react-icons/bi';
import { isVisibleConnectionListEntry } from '../utils/attendanceDisplay';

const Students = () => {
  const { learners, connectionTimes, isLoading } = useAdminConnectionStore();
  const [searchTerm, setSearchTerm] = useState('');

  const totalsByLearner = useMemo(() => connectionTimes.filter(isVisibleConnectionListEntry).reduce((totals, entry) => {
    totals[entry.learnerId] = (totals[entry.learnerId] || 0) + 1;
    return totals;
  }, {}), [connectionTimes]);

  const filteredLearners = learners.filter((learner) => (
    learner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    learner.formation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    learner.code.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="students-page custom-card">
      <div className="flex-between mb-3 flex-wrap" style={{ gap: '1rem' }}>
        <h2 className="section-title">Liste des Apprenants</h2>
        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>
          {isLoading && learners.length === 0 ? 'Chargement des apprenants...' : `${filteredLearners.length} apprenant(s) trouve(s)`}
        </span>
      </div>

      <div className="search-filter-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Rechercher par nom, identifiant ou formation..."
            className="search-input"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <BiSearch
            size={18}
            className="text-secondary"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>
      </div>

      <DataTable headers={['Nom', 'Identifiant', 'Formation', 'Statut', 'Connexions', 'Actions']}>
        {filteredLearners.length > 0 ? (
          filteredLearners.map((learner) => (
            <tr key={learner.id}>
              <td><strong>{learner.fullName}</strong></td>
              <td>{learner.code}</td>
              <td>{learner.formation}</td>
              <td>
                <span className={`badge ${learner.active ? 'badge-success' : 'badge-warning'}`}>
                  {learner.active ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td>{totalsByLearner[learner.id] || 0}</td>
              <td>
                <Link to={`/students/${learner.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem' }}>
                  <BiInfoCircle size={14} />
                  <span>Details</span>
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center text-secondary" style={{ padding: '2rem' }}>
              {isLoading ? 'Chargement des apprenants...' : 'Aucun apprenant n a encore ete ajoute par l admin.'}
            </td>
          </tr>
        )}
      </DataTable>
    </div>
  );
};

export default Students;
