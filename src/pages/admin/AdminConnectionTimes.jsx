import React, { useMemo, useState } from 'react';
import { BiEdit, BiImport, BiPlus, BiTrash } from 'react-icons/bi';
import DataTable from '../../components/DataTable';
import useAdminConnectionStore from '../../hooks/useAdminConnectionStore';
import {
  createConnectionTime,
  createLearner,
  deleteConnectionTime,
  deleteLearner,
  formatDurationMinutes,
  importLearnerPlanningWithConnections,
  updateConnectionTime,
  updateLearner,
} from '../../services/adminConnectionStore';
import { readImportFile } from '../../utils/tableImportExport';

const emptyLearner = {
  name: '',
  code: '',
  formation: '',
  contractStartDate: '',
  contractEndDate: '',
};

const emptyConnectionTime = {
  learnerId: '',
  week: '',
  tp: '',
  date: '',
  day: '',
  type: 'ECOLE',
  attendance: 'PRESENT',
  content: '',
  startTime: '',
  endTime: '',
  ipAddress: '',
};

const toMinutes = (time) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
};

const getPreviewDuration = (entry) => {
  if (!entry.startTime || !entry.endTime) return '';
  const duration = toMinutes(entry.endTime) - toMinutes(entry.startTime);
  return duration >= 0 ? formatDurationMinutes(duration) : 'Erreur';
};

const getDurationLabel = (entry) => entry.durationFormatted || (/^\d{2}:\d{2}:\d{2}$/.test(entry.duration || '') ? entry.duration : formatDurationMinutes(entry.durationMinutes || 0));

const AdminConnectionTimes = () => {
  const { learners, connectionTimes } = useAdminConnectionStore();
  const [learnerForm, setLearnerForm] = useState(emptyLearner);
  const [connectionForm, setConnectionForm] = useState(emptyConnectionTime);
  const [selectedLearnerId, setSelectedLearnerId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedLearner = learners.find((learner) => learner.id === selectedLearnerId);
  const selectedConnectionTimes = useMemo(() => (
    selectedLearnerId
      ? connectionTimes.filter((entry) => entry.learnerId === selectedLearnerId)
      : []
  ), [connectionTimes, selectedLearnerId]);
  const allConnectionRows = useMemo(() => [...connectionTimes].sort((first, second) => (
    `${first.learnerName || ''}-${first.date || ''}-${first.startTime || ''}`.localeCompare(`${second.learnerName || ''}-${second.date || ''}-${second.startTime || ''}`)
  )), [connectionTimes]);

  const resetLearnerForm = () => setLearnerForm(emptyLearner);
  const resetConnectionForm = (learnerId = selectedLearnerId) => {
    setConnectionForm({ ...emptyConnectionTime, learnerId });
  };

  const updateLearnerForm = (field, value) => {
    setLearnerForm((current) => ({ ...current, [field]: value }));
  };

  const updateConnectionForm = (field, value) => {
    setConnectionForm((current) => ({ ...current, [field]: value }));
  };

  const handleSaveLearner = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const savedLearner = learnerForm.id
        ? updateLearner(learnerForm.id, learnerForm)
        : createLearner(learnerForm);
      setSelectedLearnerId(savedLearner.id);
      resetLearnerForm();
      setMessage('Apprenant enregistre.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLearner = (learner) => {
    setLearnerForm({
      id: learner.id,
      name: learner.name || learner.fullName || '',
      code: learner.code || '',
      formation: learner.formation || '',
      contractStartDate: learner.contractStartDate || learner.contractStart || '',
      contractEndDate: learner.contractEndDate || learner.contractEnd || '',
      createdAt: learner.createdAt,
    });
  };

  const handleDeleteLearner = (learnerId) => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      deleteLearner(learnerId);
      if (selectedLearnerId === learnerId) {
        setSelectedLearnerId('');
        resetConnectionForm('');
      }
      setMessage('Apprenant et temps lies supprimes.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLearnerForConnection = (learnerId) => {
    setSelectedLearnerId(learnerId);
    resetConnectionForm(learnerId);
    setError('');
    setMessage('');
  };

  const handleSaveConnectionTime = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (connectionForm.id) {
        updateConnectionTime(connectionForm.id, connectionForm);
      } else {
        createConnectionTime(connectionForm);
      }
      resetConnectionForm(connectionForm.learnerId);
      setMessage('Temps de connexion enregistre.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportPlanningFile = async (event) => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const result = await readImportFile(event.target.files[0]);
      if (result.type === 'pdf') {
        throw new Error('Importez le planning au format CSV pour generer les temps de connexion.');
      }

      const imported = importLearnerPlanningWithConnections({
        rows: result.rows,
        text: result.text,
        sourceFile: result.name,
      });
      setSelectedLearnerId(imported.learner.id);
      resetConnectionForm(imported.learner.id);
      setMessage(`${imported.learner.fullName} importe: ${imported.planningCount} ligne(s) planning, ${imported.connectionCount} session(s), ${imported.statusCount} statut(s).`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleEditConnectionTime = (entry) => {
    setSelectedLearnerId(entry.learnerId);
    setConnectionForm({
      id: entry.id,
      learnerId: entry.learnerId,
      week: entry.week || '',
      tp: entry.tp || '',
      date: entry.date || '',
      day: entry.day || '',
      type: entry.type || 'ECOLE',
      attendance: entry.attendance || (entry.status === 'Absent' ? 'ABSENT' : 'PRESENT'),
      content: entry.content || entry.comment || '',
      startTime: entry.startTime || '',
      endTime: entry.endTime || '',
      ipAddress: entry.ipAddress || '',
      createdAt: entry.createdAt,
    });
  };

  const handleDeleteConnectionTime = (connectionTimeId) => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      deleteConnectionTime(connectionTimeId);
      setMessage('Temps de connexion supprime.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Temps de connexion apprenants</h2>
          <p className="text-secondary">Import planning CSV et suivi des sessions apprenants.</p>
        </div>
        <label className="btn btn-secondary admin-file-button">
          <BiImport size={18} />
          Import planning CSV
          <input type="file" accept=".csv,.tsv,.txt,.xls" onChange={handleImportPlanningFile} />
        </label>
      </div>

      {loading && <div className="admin-alert admin-alert-info">Traitement en cours...</div>}
      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      {error && <div className="admin-alert admin-alert-danger">{error}</div>}

      <form className="custom-card admin-stacked-form" onSubmit={handleSaveLearner}>
        <section className="admin-form-section">
          <h3>Ajouter apprenant</h3>
          <div className="admin-form-grid admin-learner-form-grid">
            <label className="form-field">
              <span>Nom</span>
              <input className="search-input" value={learnerForm.name} onChange={(event) => updateLearnerForm('name', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Code</span>
              <input className="search-input" value={learnerForm.code} onChange={(event) => updateLearnerForm('code', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Formation</span>
              <input className="search-input" value={learnerForm.formation} onChange={(event) => updateLearnerForm('formation', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Date debut contrat</span>
              <input type="date" className="search-input" value={learnerForm.contractStartDate} onChange={(event) => updateLearnerForm('contractStartDate', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Date fin contrat</span>
              <input type="date" className="search-input" value={learnerForm.contractEndDate} onChange={(event) => updateLearnerForm('contractEndDate', event.target.value)} />
            </label>
          </div>
        </section>
        <div className="admin-form-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            <BiPlus size={18} />
            Enregistrer l apprenant
          </button>
          {learnerForm.id && (
            <button className="btn btn-secondary" type="button" onClick={resetLearnerForm}>Annuler</button>
          )}
        </div>
      </form>

      <div className="custom-card">
        <h3 className="mb-3">Apprenants sauvegardes</h3>
        <DataTable headers={['Nom', 'Code', 'Formation', 'Debut contrat', 'Fin contrat', 'Actions']}>
          {learners.length > 0 ? learners.map((learner) => (
            <tr key={learner.id}>
              <td><strong>{learner.name || learner.fullName}</strong></td>
              <td>{learner.code}</td>
              <td>{learner.formation}</td>
              <td>{learner.contractStartDate || learner.contractStart}</td>
              <td>{learner.contractEndDate || learner.contractEnd}</td>
              <td>
                <div className="admin-row-actions">
                  <button className="btn btn-secondary" type="button" onClick={() => handleEditLearner(learner)}>Modifier</button>
                  <button className="btn btn-secondary" type="button" onClick={() => handleDeleteLearner(learner.id)}>Supprimer</button>
                  <button className="btn btn-primary" type="button" onClick={() => handleSelectLearnerForConnection(learner.id)}>
                    Ajouter temps de connexion
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="text-center text-secondary" style={{ padding: '2rem' }}>
                Aucun apprenant ajoute par l admin.
              </td>
            </tr>
          )}
        </DataTable>
      </div>

      {selectedLearner && (
        <>
          <form className="custom-card admin-stacked-form" onSubmit={handleSaveConnectionTime}>
            <section className="admin-form-section">
              <h3>Ajouter temps de connexion</h3>
              <p className="text-secondary">{selectedLearner.name || selectedLearner.fullName} - {selectedLearner.code}</p>
              <div className="admin-form-grid admin-session-form-grid">
                <label className="form-field">
                  <span>Semaine</span>
                  <input className="search-input" value={connectionForm.week} onChange={(event) => updateConnectionForm('week', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>TP</span>
                  <input className="search-input" value={connectionForm.tp} onChange={(event) => updateConnectionForm('tp', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Date</span>
                  <input type="date" className="search-input" value={connectionForm.date} onChange={(event) => updateConnectionForm('date', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Jour</span>
                  <input className="search-input" value={connectionForm.day} onChange={(event) => updateConnectionForm('day', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Type</span>
                  <select className="search-input" value={connectionForm.type} onChange={(event) => updateConnectionForm('type', event.target.value)}>
                    <option value="ECOLE">ECOLE</option>
                    <option value="ENTREPRISE">ENTREPRISE</option>
                    <option value="FERIE">FERIE</option>
                  </select>
                </label>
                <label className="form-field">
                  <span>Presence</span>
                  <select className="search-input" value={connectionForm.attendance} onChange={(event) => updateConnectionForm('attendance', event.target.value)}>
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </label>
                <label className="form-field admin-span-2">
                  <span>Contenu</span>
                  <input className="search-input" value={connectionForm.content} onChange={(event) => updateConnectionForm('content', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Heure debut</span>
                  <input type="time" step="1" className="search-input" value={connectionForm.startTime} onChange={(event) => updateConnectionForm('startTime', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Heure fin</span>
                  <input type="time" step="1" className="search-input" value={connectionForm.endTime} onChange={(event) => updateConnectionForm('endTime', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Adresse IP</span>
                  <input className="search-input" value={connectionForm.ipAddress} onChange={(event) => updateConnectionForm('ipAddress', event.target.value)} />
                </label>
                <div className="form-field">
                  <span>Duree session</span>
                  <strong className="admin-duration-preview">{connectionForm.attendance === 'ABSENT' ? '0h00' : getPreviewDuration(connectionForm) || '0h00'}</strong>
                </div>
              </div>
            </section>
            <div className="admin-form-actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {connectionForm.id ? 'Mettre a jour' : 'Enregistrer la session'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => resetConnectionForm(connectionForm.learnerId)}>Annuler</button>
            </div>
          </form>

          <div className="custom-card">
            <h3 className="mb-3">Temps de connexion de {selectedLearner.name || selectedLearner.fullName}</h3>
            <DataTable headers={['Semaine', 'TP', 'Date', 'Jour', 'Type', 'Presence', 'Contenu', 'Heure debut', 'Heure fin', 'Duree session', 'Adresse IP', 'Actions']}>
              {selectedConnectionTimes.length > 0 ? selectedConnectionTimes.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.week}</td>
                  <td>{entry.tp || '-'}</td>
                  <td>{entry.date}</td>
                  <td>{entry.day}</td>
                  <td>{entry.type}</td>
                  <td>{entry.attendance === 'ABSENT' || entry.status === 'Absent' ? 'Absent' : 'Present'}</td>
                  <td>{entry.content || entry.comment}</td>
                  <td>{entry.startTime || '-'}</td>
                  <td>{entry.endTime || '-'}</td>
                  <td>{getDurationLabel(entry)}</td>
                  <td>{entry.ipAddress || '-'}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="icon-button" type="button" title="Modifier" onClick={() => handleEditConnectionTime(entry)}>
                        <BiEdit size={18} />
                      </button>
                      <button className="icon-button danger" type="button" title="Supprimer" onClick={() => handleDeleteConnectionTime(entry.id)}>
                        <BiTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="12" className="text-center text-secondary" style={{ padding: '2rem' }}>
                    Aucun temps de connexion pour cet apprenant.
                  </td>
                </tr>
              )}
            </DataTable>
          </div>
        </>
      )}

      <div className="custom-card">
        <h3 className="mb-3">Toutes les lignes de connexion</h3>
        <DataTable headers={['Learner Name', 'Learner Code', 'Formation', 'Week', 'Date', 'Day', 'Type', 'Content', 'Start Time', 'End Time', 'Session Duration', 'IP Address', 'Status']}>
          {allConnectionRows.length > 0 ? allConnectionRows.map((entry) => (
            <tr key={entry.id}>
              <td><strong>{entry.learnerName || learners.find((learner) => learner.id === entry.learnerId)?.fullName || '-'}</strong></td>
              <td>{entry.learnerCode || '-'}</td>
              <td>{entry.formation || '-'}</td>
              <td>{entry.week || '-'}</td>
              <td>{entry.date || '-'}</td>
              <td>{entry.day || '-'}</td>
              <td>{entry.type || '-'}</td>
              <td>{entry.content || entry.comment || '-'}</td>
              <td>{entry.startTime || '-'}</td>
              <td>{entry.endTime || '-'}</td>
              <td>{getDurationLabel(entry)}</td>
              <td>{entry.ipAddress || '-'}</td>
              <td>{entry.status || '-'}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="13" className="text-center text-secondary" style={{ padding: '2rem' }}>
                Aucun temps de connexion importe ou enregistre.
              </td>
            </tr>
          )}
        </DataTable>
      </div>
    </div>
  );
};

export default AdminConnectionTimes;
