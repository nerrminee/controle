import React from 'react';
import DataTable from '../components/DataTable';
import { companies } from '../data/companies';

const Companies = () => {
  return (
    <div className="companies-page custom-card">
      <div className="flex-between mb-3">
        <h2 className="section-title">Entreprises Partenaires</h2>
        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>
          {companies.length} entreprise(s) partenaire(s)
        </span>
      </div>

      <DataTable headers={["Nom de l'entreprise", "Contact principal", "Adresse E-mail", "Numéro de téléphone", "Secteur d'activité"]}>
        {companies.map((company) => (
          <tr key={company.id}>
            <td>
              <strong>{company.name}</strong>
            </td>
            <td>{company.contactName}</td>
            <td>
              <a href={`mailto:${company.email}`} style={{ color: 'var(--primary-light)', textDecoration: 'underline' }}>
                {company.email}
              </a>
            </td>
            <td>{company.phone}</td>
            <td>
              <span className="badge" style={{ backgroundColor: '#EDF2F7', color: 'var(--text-primary)' }}>
                {company.sector}
              </span>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export default Companies;
