import React, { useMemo, useState } from 'react';
import { BiEdit, BiPlus, BiTrash } from 'react-icons/bi';
import DataTable from '../../components/DataTable';
import useAdminConnectionStore from '../../hooks/useAdminConnectionStore';
import {
  createConnectionTime,
  createLearner,
  deleteConnectionTime,
  deleteLearner,
  formatDurationMinutes,
  updateConnectionTime,
  updateLearner,
} from '../../services/adminConnectionStore';

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
  date: '',
  day: '',
  type: 'ECOLE',
  content: '',
  startTime: '',
  endTime: '',
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

  const handleEditConnectionTime = (entry) => {
    setSelectedLearnerId(entry.learnerId);
    setConnectionForm({
      id: entry.id,
      learnerId: entry.learnerId,
      week: entry.week || '',
      date: entry.date || '',
      day: entry.day || '',
      type: entry.type || 'ECOLE',
      content: entry.content || entry.comment || '',
      startTime: entry.startTime || '',
      endTime: entry.endTime || '',
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
          <p className="text-secondary">Page admin separee, accessible uniquement par route directe.</p>
        </div>
      </div>

      {loading && <div className="admin-alert admin-alert-info">Traitement en cours...</div>}
      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      {error && <div className="admin-alert admin-alert-danger">{error}</div>}

      <form className="custom-card admin-form-grid" onSubmit={handleSaveLearner}>
        <label className="form-field">
          <span>Nom de l apprenant</span>
          <input className="search-input" value={learnerForm.name} onChange={(event) => updateLearnerForm('name', event.target.value)} />
        </label>
        <label className="form-field">
          <span>Code apprenant</span>
          <input className="search-input" value={learnerForm.code} onChange={(event) => updateLearnerForm('code', event.target.value)} />
        </label>
        <label className="form-field">
          <span>Formation</span>
          <input className="search-input" value={learnerForm.formation} onChange={(event) => updateLearnerForm('formation', event.target.value)} />
        </label>
        <label className="form-field">
          <span>Date debut du contrat</span>
          <input type="date" className="search-input" value={learnerForm.contractStartDate} onChange={(event) => updateLearnerForm('contractStartDate', event.target.value)} />
        </label>
        <label className="form-field">
          <span>Date fin du contrat</span>
          <input type="date" className="search-input" value={learnerForm.contractEndDate} onChange={(event) => updateLearnerForm('contractEndDate', event.target.value)} />
        </label>
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
          <form className="custom-card admin-form-grid" onSubmit={handleSaveConnectionTime}>
            <div className="admin-span-2">
              <h3>Ajouter temps de connexion</h3>
              <p className="text-secondary">{selectedLearner.name || selectedLearner.fullName} - {selectedLearner.code}</p>
            </div>
            <label className="form-field">
              <span>Semaine</span>
              <input className="search-input" value={connectionForm.week} onChange={(event) => updateConnectionForm('week', event.target.value)} />
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
              <span>Contenu</span>
              <input className="search-input" value={connectionForm.content} onChange={(event) => updateConnectionForm('content', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Heure debut</span>
              <input type="time" className="search-input" value={connectionForm.startTime} onChange={(event) => updateConnectionForm('startTime', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Heure fin</span>
              <input type="time" className="search-input" value={connectionForm.endTime} onChange={(event) => updateConnectionForm('endTime', event.target.value)} />
            </label>
            <div className="form-field">
              <span>Duree session</span>
              <strong className="admin-duration-preview">{getPreviewDuration(connectionForm) || '0h00'}</strong>
            </div>
            <div className="admin-form-actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {connectionForm.id ? 'Mettre a jour' : 'Enregistrer la session'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => resetConnectionForm(connectionForm.learnerId)}>Annuler</button>
            </div>
          </form>

          <div className="custom-card">
            <h3 className="mb-3">Temps de connexion de {selectedLearner.name || selectedLearner.fullName}</h3>
            <DataTable headers={['Semaine', 'Date', 'Jour', 'Type', 'Contenu', 'Heure debut', 'Heure fin', 'Duree session', 'Actions']}>
              {selectedConnectionTimes.length > 0 ? selectedConnectionTimes.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.week}</td>
                  <td>{entry.date}</td>
                  <td>{entry.day}</td>
                  <td>{entry.type}</td>
                  <td>{entry.content || entry.comment}</td>
                  <td>{entry.startTime || '-'}</td>
                  <td>{entry.endTime || '-'}</td>
                  <td>{formatDurationMinutes(entry.durationMinutes || 0)}</td>
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
                  <td colSpan="9" className="text-center text-secondary" style={{ padding: '2rem' }}>
                    Aucun temps de connexion pour cet apprenant.
                  </td>
                </tr>
              )}
            </DataTable>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminConnectionTimes;
