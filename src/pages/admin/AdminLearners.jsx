import React, { useMemo, useState } from 'react';
import { BiEdit, BiImport, BiPlus, BiTimeFive, BiTrash } from 'react-icons/bi';
import DataTable from '../../components/DataTable';
import useAdminConnectionStore from '../../hooks/useAdminConnectionStore';
import {
  deleteLearner,
  generateConnectionTimes,
  importLearners,
  saveLearner,
  savePlanningDay,
} from '../../services/adminConnectionStore';
import { readImportFile } from '../../utils/tableImportExport';

const emptyPlanningLine = {
  week: '',
  date: '',
  day: '',
  type: 'ECOLE',
  holiday: false,
  content: '',
};

const emptyLearner = {
  fullName: '',
  code: '',
  email: '',
  phone: '',
  formation: '',
  level: '',
  contractStart: '',
  contractEnd: '',
  active: true,
  connectionInfo: {
    ipAddress: '',
    browser: '',
    device: '',
  },
  company: {
    name: '',
    tutorName: '',
    tutorEmail: '',
    tutorPhone: '',
  },
  planningRows: [{ ...emptyPlanningLine }],
};

const AdminLearners = () => {
  const { learners, planningDays } = useAdminConnectionStore();
  const [form, setForm] = useState(emptyLearner);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const filteredLearners = useMemo(() => learners.filter((learner) => (
    learner.fullName.toLowerCase().includes(search.toLowerCase()) ||
    learner.code.toLowerCase().includes(search.toLowerCase()) ||
    learner.formation.toLowerCase().includes(search.toLowerCase())
  )), [learners, search]);

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateNested = (group, field, value) => setForm((current) => ({
    ...current,
    [group]: {
      ...current[group],
      [field]: value,
    },
  }));
  const updatePlanningRow = (index, field, value) => setForm((current) => ({
    ...current,
    planningRows: current.planningRows.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: value } : row
    )),
  }));

  const resetForm = () => setForm(emptyLearner);

  const editLearner = (learner) => {
    const learnerPlanning = planningDays.filter((day) => day.learnerId === learner.id);
    setForm({
      ...emptyLearner,
      ...learner,
      connectionInfo: {
        ...emptyLearner.connectionInfo,
        ...(learner.connectionInfo || {}),
      },
      company: {
        ...emptyLearner.company,
        ...(learner.company || {}),
      },
      planningRows: learnerPlanning.length > 0 ? learnerPlanning : [{ ...emptyPlanningLine }],
    });
  };

  const addPlanningRow = () => {
    setForm((current) => ({
      ...current,
      planningRows: [...current.planningRows, { ...emptyPlanningLine }],
    }));
  };

  const removePlanningRow = (index) => {
    setForm((current) => ({
      ...current,
      planningRows: current.planningRows.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const savedLearner = saveLearner(form);
      form.planningRows
        .filter((row) => row.week || row.date || row.day || row.content)
        .forEach((row) => savePlanningDay({ ...row, learnerId: savedLearner.id }));
      resetForm();
      setMessage('Apprenant enregistre avec succes.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImport = async (event) => {
    setError('');
    setMessage('');

    try {
      const result = await readImportFile(event.target.files[0]);
      if (result.type === 'pdf') {
        throw new Error('Le PDF sera pris en charge plus tard pour l import automatique des apprenants.');
      }

      const imported = importLearners(result.rows);
      setMessage(`${imported.length} apprenant(s) importe(s).`);
    } catch (err) {
      setError(err.message);
    } finally {
      event.target.value = '';
    }
  };

  const handleGenerate = (learnerId) => {
    setError('');
    setMessage('');

    try {
      const generated = generateConnectionTimes(learnerId);
      setMessage(`${generated.length} ligne(s) de temps de connexion generee(s).`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Ajouter un apprenant</h2>
          <p className="text-secondary">Aucun apprenant n est precharge. L admin ajoute et maintient toute la liste.</p>
        </div>
        <div className="admin-form-actions">
          <button className="btn btn-primary" type="button" onClick={() => handleGenerate('all')}>
            <BiTimeFive size={18} />
            Generer pour tous
          </button>
          <label className="btn btn-secondary admin-file-button">
            <BiImport size={18} />
            Import CSV/Excel
            <input type="file" accept=".csv,.tsv,.txt,.xls" onChange={handleImport} />
          </label>
        </div>
      </div>

      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      {error && <div className="admin-alert admin-alert-danger">{error}</div>}

      <form className="custom-card admin-stacked-form" onSubmit={handleSubmit}>
        <section className="admin-form-section">
          <h3>Informations apprenant</h3>
          <div className="admin-form-grid">
            <label className="form-field">
              <span>Nom complet *</span>
              <input className="search-input" value={form.fullName} onChange={(event) => updateForm('fullName', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Code apprenant *</span>
              <input className="search-input" value={form.code} onChange={(event) => updateForm('code', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Email</span>
              <input type="email" className="search-input" value={form.email} onChange={(event) => updateForm('email', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Telephone</span>
              <input className="search-input" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Formation *</span>
              <input className="search-input" value={form.formation} onChange={(event) => updateForm('formation', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Niveau / diplome prepare</span>
              <input className="search-input" value={form.level} onChange={(event) => updateForm('level', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Date debut contrat *</span>
              <input type="date" className="search-input" value={form.contractStart} onChange={(event) => updateForm('contractStart', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Date fin contrat *</span>
              <input type="date" className="search-input" value={form.contractEnd} onChange={(event) => updateForm('contractEnd', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Statut</span>
              <select className="search-input" value={form.active ? 'active' : 'inactive'} onChange={(event) => updateForm('active', event.target.value === 'active')}>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <h3>Informations de connexion</h3>
          <div className="admin-form-grid">
            <label className="form-field">
              <span>Adresse IP manuelle</span>
              <input className="search-input" value={form.connectionInfo.ipAddress} onChange={(event) => updateNested('connectionInfo', 'ipAddress', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Navigateur manuel</span>
              <input className="search-input" value={form.connectionInfo.browser} onChange={(event) => updateNested('connectionInfo', 'browser', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Appareil manuel</span>
              <input className="search-input" value={form.connectionInfo.device} onChange={(event) => updateNested('connectionInfo', 'device', event.target.value)} />
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <h3>Informations entreprise</h3>
          <div className="admin-form-grid">
            <label className="form-field">
              <span>Nom entreprise</span>
              <input className="search-input" value={form.company.name} onChange={(event) => updateNested('company', 'name', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Nom du tuteur</span>
              <input className="search-input" value={form.company.tutorName} onChange={(event) => updateNested('company', 'tutorName', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Email du tuteur</span>
              <input type="email" className="search-input" value={form.company.tutorEmail} onChange={(event) => updateNested('company', 'tutorEmail', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Telephone du tuteur</span>
              <input className="search-input" value={form.company.tutorPhone} onChange={(event) => updateNested('company', 'tutorPhone', event.target.value)} />
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="flex-between mb-3">
            <h3>Planning</h3>
            <button className="btn btn-secondary" type="button" onClick={addPlanningRow}><BiPlus size={18} /> Ajouter une ligne</button>
          </div>
          {form.planningRows.map((row, index) => (
            <div className="admin-planning-line" key={row.id || index}>
              <input className="search-input" placeholder="Semaine" value={row.week} onChange={(event) => updatePlanningRow(index, 'week', event.target.value)} />
              <input type="date" className="search-input" value={row.date} onChange={(event) => updatePlanningRow(index, 'date', event.target.value)} />
              <input className="search-input" placeholder="Jour" value={row.day} onChange={(event) => updatePlanningRow(index, 'day', event.target.value)} />
              <select className="search-input" value={row.type} onChange={(event) => updatePlanningRow(index, 'type', event.target.value)}>
                <option value="ECOLE">ECOLE</option>
                <option value="ENTREPRISE">ENTREPRISE</option>
                <option value="FERIE">FERIE</option>
              </select>
              <input className="search-input" placeholder="Contenu / statut" value={row.content} onChange={(event) => updatePlanningRow(index, 'content', event.target.value)} />
              <button className="icon-button danger" type="button" title="Supprimer la ligne" onClick={() => removePlanningRow(index)}>
                <BiTrash size={18} />
              </button>
            </div>
          ))}
        </section>

        <div className="admin-form-actions">
          <button className="btn btn-primary" type="submit"><BiPlus size={18} /> Enregistrer l apprenant</button>
          <button className="btn btn-secondary" type="button" onClick={resetForm}>Nouveau</button>
        </div>
      </form>

      <div className="search-filter-bar">
        <input className="search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filtrer par nom, code ou formation..." />
      </div>

      <DataTable headers={['Nom apprenant', 'Code', 'Formation', 'Diplome', 'Contact', 'Entreprise', 'Statut', 'Actions']}>
        {filteredLearners.length > 0 ? filteredLearners.map((learner) => (
          <tr key={learner.id}>
            <td><strong>{learner.fullName}</strong></td>
            <td>{learner.code}</td>
            <td>{learner.formation}</td>
            <td>{learner.level || '-'}</td>
            <td>{learner.email || '-'}<br />{learner.phone || '-'}</td>
            <td>{learner.company?.name || '-'}</td>
            <td><span className={`badge ${learner.active ? 'badge-success' : 'badge-warning'}`}>{learner.active ? 'Actif' : 'Inactif'}</span></td>
            <td>
              <div className="admin-row-actions">
                <button className="icon-button" type="button" title="Modifier" onClick={() => editLearner(learner)}><BiEdit size={18} /></button>
                <button className="icon-button" type="button" title="Generer les temps de connexion" onClick={() => handleGenerate(learner.id)}><BiTimeFive size={18} /></button>
                <button className="icon-button danger" type="button" title="Supprimer" onClick={() => deleteLearner(learner.id)}><BiTrash size={18} /></button>
              </div>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="8" className="text-center text-secondary" style={{ padding: '2rem' }}>
              Aucun apprenant. Ajoutez le premier apprenant depuis le formulaire admin.
            </td>
          </tr>
        )}
      </DataTable>
    </div>
  );
};

export default AdminLearners;
