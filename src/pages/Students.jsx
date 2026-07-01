import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { students } from '../data/students';
import { BiSearch, BiInfoCircle } from 'react-icons/bi';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students based on search term (name or training)
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.training.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="students-page custom-card">
      <div className="flex-between mb-3 flex-wrap" style={{ gap: '1rem' }}>
        <h2 className="section-title">Liste des Apprenants</h2>
        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>
          {filteredStudents.length} apprenant(s) trouvé(s)
        </span>
      </div>

      {/* Search Input Bar */}
      <div className="search-filter-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <input 
            type="text" 
            placeholder="Rechercher par nom ou par formation..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <BiSearch 
            size={18} 
            className="text-secondary" 
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} 
          />
        </div>
      </div>

      {/* Students Data Table */}
      <DataTable headers={["Nom", "Formation", "Présence", "Temps de Connexion", "Progression", "Actions"]}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>
                <strong>{student.name}</strong>
              </td>
              <td>{student.training}</td>
              <td>
                <span className={`badge ${parseInt(student.presence, 10) >= 90 ? 'badge-success' : 'badge-warning'}`}>
                  {student.presence}
                </span>
              </td>
              <td>{student.totalTime}</td>
              <td>
                <div className="progress-container">
                  <div className="progress-bar-outer" style={{ maxWidth: '120px' }}>
                    <div 
                      className="progress-bar-inner" 
                      style={{ 
                        width: student.progress,
                        backgroundColor: parseInt(student.progress, 10) >= 75 ? 'var(--success)' : 'var(--primary-light)'
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">{student.progress}</span>
                </div>
              </td>
              <td>
                <Link to={`/students/${student.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem' }}>
                  <BiInfoCircle size={14} />
                  <span>Détails</span>
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center text-secondary" style={{ padding: '2rem' }}>
              Aucun apprenant ne correspond à votre recherche.
            </td>
          </tr>
        )}
      </DataTable>
    </div>
  );
};

export default Students;
