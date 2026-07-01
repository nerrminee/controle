import React, { useMemo, useState } from 'react';
import { BiEdit, BiImport, BiPlus, BiTrash } from 'react-icons/bi';
import DataTable from '../../components/DataTable';
import useAdminConnectionStore from '../../hooks/useAdminConnectionStore';
import { deletePlanningDay, importPlanningDays, savePlanningDay } from '../../services/adminConnectionStore';
import { readImportFile } from '../../utils/tableImportExport';

const emptyDay = {
  learnerId: '',
  week: '',
  date: '',
  day: '',
  type: 'ECOLE',
  holiday: false,
  content: '',
  sourceFile: '',
};

const AdminPlanning = () => {
  const { learners, planningDays } = useAdminConnectionStore();
  const [form, setForm] = useState(emptyDay);
  const [filterLearner, setFilterLearner] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sourceFile, setSourceFile] = useState('');

  const learnerMap = useMemo(() => new Map(learners.map((learner) => [learner.id, learner])), [learners]);
  const filteredDays = useMemo(() => (
    filterLearner === 'all' ? planningDays : planningDays.filter((day) => day.learnerId === filterLearner)
  ), [planningDays, filterLearner]);

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const resetForm = () => setForm({ ...emptyDay, learnerId: filterLearner === 'all' ? '' : filterLearner, sourceFile });

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      savePlanningDay({ ...form, sourceFile });
      resetForm();
      setMessage('Ligne de planning enregistree.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImport = async (event) => {
    setError('');
    setMessage('');

    try {
      if (filterLearner === 'all') {
        throw new Error('Selectionnez un apprenant avant d importer son planning.');
      }

      const result = await readImportFile(event.target.files[0]);
      setSourceFile(result.name || '');

      if (result.type === 'pdf') {
        setMessage(`PDF "${result.name}" attache. Ajoutez les lignes manuellement ou importez un CSV extrait du PDF.`);
        return;
      }

      const imported = importPlanningDays(filterLearner, result.rows, result.name);
      setMessage(`${imported.length} ligne(s) de planning importee(s).`);
    } catch (err) {
      setError(err.message);
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Planning apprenant</h2>
          <p className="text-secondary">Importez un planning ou saisissez les journees ECOLE, ENTREPRISE et FERIE.</p>
        </div>
        <label className="btn btn-secondary admin-file-button">
          <BiImport size={18} />
          Import PDF/CSV/Excel
          <input type="file" accept=".pdf,.csv,.tsv,.txt,.xls" onChange={handleImport} />
        </label>
      </div>

      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      {error && <div className="admin-alert admin-alert-danger">{error}</div>}

      <div className="search-filter-bar">
        <select className="search-input" value={filterLearner} onChange={(event) => {
          setFilterLearner(event.target.value);
          setForm((current) => ({ ...current, learnerId: event.target.value === 'all' ? '' : event.target.value }));
        }}>
          <option value="all">Tous les apprenants</option>
          {learners.map((learner) => <option key={learner.id} value={learner.id}>{learner.fullName} - {learner.code}</option>)}
        </select>
        <input className="search-input" value={sourceFile} onChange={(event) => setSourceFile(event.target.value)} placeholder="Nom du fichier source PDF/Excel..." />
      </div>

      <form className="custom-card admin-form-grid" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Apprenant</span>
          <select className="search-input" value={form.learnerId} onChange={(event) => updateForm('learnerId', event.target.value)}>
            <option value="">Selectionner</option>
            {learners.map((learner) => <option key={learner.id} value={learner.id}>{learner.fullName}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>Semaine</span>
          <input className="search-input" value={form.week} onChange={(event) => updateForm('week', event.target.value)} />
        </label>
        <label className="form-field">
          <span>Date</span>
          <input type="date" className="search-input" value={form.date} onChange={(event) => updateForm('date', event.target.value)} />
        </label>
        <label className="form-field">
          <span>Jour</span>
          <input className="search-input" value={form.day} onChange={(event) => updateForm('day', event.target.value)} />
        </label>
        <label className="form-field">
          <span>Type</span>
          <select className="search-input" value={form.type} onChange={(event) => updateForm('type', event.target.value)}>
            <option value="ECOLE">ECOLE</option>
            <option value="ENTREPRISE">ENTREPRISE</option>
            <option value="FERIE">FERIE</option>
          </select>
        </label>
        <label className="form-field checkbox-field">
          <input type="checkbox" checked={form.holiday} onChange={(event) => updateForm('holiday', event.target.checked)} />
          <span>Ferie oui/non</span>
        </label>
        <label className="form-field admin-span-2">
          <span>Contenu pedagogique / statut entreprise</span>
          <input className="search-input" value={form.content} onChange={(event) => updateForm('content', event.target.value)} />
        </label>
        <div className="admin-form-actions">
          <button className="btn btn-primary" type="submit"><BiPlus size={18} /> Enregistrer</button>
          <button className="btn btn-secondary" type="button" onClick={resetForm}>Nouveau</button>
        </div>
      </form>

      <DataTable headers={['Apprenant', 'S.', 'Date', 'Jour', 'Type', 'Ferie', 'Contenu / Statut', 'Source', 'Actions']}>
        {filteredDays.map((day) => (
          <tr key={day.id}>
            <td><strong>{learnerMap.get(day.learnerId)?.fullName || '-'}</strong></td>
            <td>{day.week}</td>
            <td>{day.date}</td>
            <td>{day.day}</td>
            <td><span className="badge badge-success">{day.type}</span></td>
            <td>{day.holiday ? 'Oui' : 'Non'}</td>
            <td>{day.content}</td>
            <td>{day.sourceFile || '-'}</td>
            <td>
              <div className="admin-row-actions">
                <button className="icon-button" type="button" title="Modifier" onClick={() => setForm(day)}><BiEdit size={18} /></button>
                <button className="icon-button danger" type="button" title="Supprimer" onClick={() => deletePlanningDay(day.id)}><BiTrash size={18} /></button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export default AdminPlanning;
