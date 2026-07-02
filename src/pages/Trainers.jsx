import React from 'react';
import DataTable from '../components/DataTable';
import { trainers } from '../data/trainers';

const Trainers = () => {
  return (
    <div className="trainers-page custom-card">
      <div className="flex-between mb-3">
        <h2 className="section-title">Formateurs de l'Etablissement</h2>
        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>
          {trainers.length} formateur(s) actif(s)
        </span>
      </div>

      <DataTable headers={["Nom", "Statut"]}>
        {trainers.map((trainer) => (
          <tr key={trainer.id}>
            <td>
              <strong>{trainer.name}</strong>
            </td>
            <td>
              <span className={`badge ${trainer.status === 'Actif' ? 'badge-success' : 'badge-danger'}`}>
                {trainer.status}
              </span>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export default Trainers;
