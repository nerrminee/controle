import React, { useMemo, useState } from 'react';
import { BiImport, BiPlus } from 'react-icons/bi';
import DataTable from '../../components/DataTable';
import useAdminConnectionStore from '../../hooks/useAdminConnectionStore';
import {
  createConnectionTime,
  createLearner,
  deleteConnectionTime,
  deleteLearner,
  formatDurationMinutes,
  importLearnerPlanningWithConnections,
  applyRandomPausesAbsences,
  previewRandomPausesAbsences,
  updateConnectionTime,
  updateLearner,
} from '../../services/adminConnectionStore';
import { readImportFile } from '../../utils/tableImportExport';
import {
  formatDurationHHMMSS,
  formatSessionTime,
  isAbsentSession,
  isCompanyDay,
  compareChronological,
  splitDateAndDay,
  sortChronological,
} from '../../utils/attendanceDisplay';

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
  if (entry.attendance === 'ABSENT' || entry.status === 'Absent') return '0h00';
  if (!entry.startTime || !entry.endTime) return '';
  const duration = toMinutes(entry.endTime) - toMinutes(entry.startTime);
  if (duration <= 0) return 'Erreur';
  return formatDurationMinutes(duration);
};

const buildConnectionDraft = (entry) => ({
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

const getStatusBadgeClass = (entry) => (
  isAbsentSession(entry) ? 'badge-danger' : entry.status === 'Present' ? 'badge-success' : 'badge-warning'
);

const renderStatusBadge = (entry) => (
  <span className={`badge compact-badge ${getStatusBadgeClass(entry)}`}>
    {isAbsentSession(entry) ? 'Absent' : entry.status || 'Present'}
  </span>
);

const AdminConnectionTimes = () => {
  const { learners, connectionTimes, isLoading } = useAdminConnectionStore();
  const [learnerForm, setLearnerForm] = useState(emptyLearner);
  const [connectionForm, setConnectionForm] = useState(emptyConnectionTime);
  const [selectedLearnerId, setSelectedLearnerId] = useState('');
  const [editingConnectionId, setEditingConnectionId] = useState('');
  const [editingConnectionForm, setEditingConnectionForm] = useState(emptyConnectionTime);
  const [randomPreview, setRandomPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedLearner = learners.find((learner) => learner.id === selectedLearnerId);
  const selectedConnectionTimes = useMemo(() => (
    selectedLearnerId
      ? connectionTimes
        .filter((entry) => entry.learnerId === selectedLearnerId && !isCompanyDay(entry))
        .sort(compareChronological)
      : []
  ), [connectionTimes, selectedLearnerId]);
  const allConnectionRows = useMemo(() => sortChronological(connectionTimes.filter((entry) => !isCompanyDay(entry))), [connectionTimes]);

  const resetLearnerForm = () => setLearnerForm(emptyLearner);
  const resetConnectionForm = (learnerId = selectedLearnerId) => {
    setConnectionForm({ ...emptyConnectionTime, learnerId });
  };
  const cancelConnectionEdit = () => {
    setEditingConnectionId('');
    setEditingConnectionForm(emptyConnectionTime);
  };
  const cancelRandomPreview = () => setRandomPreview(null);

  const updateLearnerForm = (field, value) => {
    setLearnerForm((current) => ({ ...current, [field]: value }));
  };
  const updateConnectionForm = (field, value) => {
    setConnectionForm((current) => ({ ...current, [field]: value }));
  };
  const updateEditingConnectionForm = (field, value) => {
    setEditingConnectionForm((current) => ({ ...current, [field]: value }));
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
      setMessage('Apprenant enregistré.');
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
    setSelectedLearnerId(learner.id);
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
        cancelConnectionEdit();
        cancelRandomPreview();
      }
      setMessage('Apprenant et temps liés supprimés.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLearnerForConnection = (learnerId) => {
    setSelectedLearnerId(learnerId);
    resetConnectionForm(learnerId);
    cancelConnectionEdit();
    cancelRandomPreview();
    setError('');
    setMessage('');
  };

  const handleSaveConnectionTime = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      createConnectionTime(connectionForm);
      resetConnectionForm(connectionForm.learnerId);
      setMessage('Session de connexion ajoutée.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConnectionEdit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      updateConnectionTime(editingConnectionId, editingConnectionForm);
      cancelConnectionEdit();
      setMessage('Session de connexion modifiée.');
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
        throw new Error('Importez le planning au format CSV pour générer les temps de connexion.');
      }

      const imported = importLearnerPlanningWithConnections({
        rows: result.rows,
        text: result.text,
        sourceFile: result.name,
      });
      setSelectedLearnerId(imported.learner.id);
      resetConnectionForm(imported.learner.id);
      cancelConnectionEdit();
      cancelRandomPreview();
      setMessage(`${imported.learner.fullName} importé : ${imported.planningCount} ligne(s) planning, ${imported.connectionCount} session(s), ${imported.statusCount} statut(s).`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handlePreviewRandomPauses = () => {
    setError('');
    setMessage('');
    cancelConnectionEdit();

    try {
      const preview = previewRandomPausesAbsences(selectedLearnerId);
      setRandomPreview(preview);
      setMessage('Apercu genere. Verifiez les changements avant de confirmer.');
    } catch (err) {
      setRandomPreview(null);
      setError(err.message);
    }
  };

  const handleApplyRandomPauses = () => {
    setError('');
    setMessage('');

    if (!window.confirm('Confirmer la generation des pauses/absences aleatoires pour cet apprenant ?')) {
      return;
    }

    setLoading(true);

    try {
      applyRandomPausesAbsences(selectedLearnerId, randomPreview);
      const count = randomPreview?.changes?.length || 0;
      setRandomPreview(null);
      setMessage(`${count} changement(s) pauses/absences applique(s).`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditConnectionTime = (entry) => {
    setSelectedLearnerId(entry.learnerId);
    setEditingConnectionId(entry.id);
    setEditingConnectionForm(buildConnectionDraft(entry));
    cancelRandomPreview();
    setError('');
    setMessage('');
  };

  const handleDeleteConnectionTime = (connectionTimeId) => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      deleteConnectionTime(connectionTimeId);
      if (editingConnectionId === connectionTimeId) cancelConnectionEdit();
      setMessage('Session de connexion supprimée.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderConnectionCells = (entry) => {
    const isEditing = editingConnectionId === entry.id;
    const form = isEditing ? editingConnectionForm : entry;
    const isAbsent = isAbsentSession(form);
    const displayDate = splitDateAndDay(entry.date, entry.day);

    if (!isEditing) {
      return (
        <>
          <td>{entry.week}</td>
          <td>{displayDate.date}</td>
          <td>{displayDate.day}</td>
          <td>{entry.type}</td>
          <td>{entry.content || entry.comment}</td>
          <td>{formatSessionTime(entry, 'startTime')}</td>
          <td>{formatSessionTime(entry, 'endTime')}</td>
          <td>{renderStatusBadge(entry)}</td>
          <td>{formatDurationHHMMSS(entry)}</td>
          <td>
            <div className="admin-row-actions admin-row-actions-nowrap">
              <button className="btn btn-secondary btn-compact" type="button" onClick={() => handleEditConnectionTime(entry)}>Modifier</button>
              <button className="btn btn-secondary btn-compact danger-text" type="button" onClick={() => handleDeleteConnectionTime(entry.id)}>Supprimer</button>
            </div>
          </td>
        </>
      );
    }

    return (
      <>
        <td>
          <input className="search-input admin-table-input" value={form.week} onChange={(event) => updateEditingConnectionForm('week', event.target.value)} />
        </td>
        <td>
          <input required type="date" className="search-input admin-table-input" value={form.date} onChange={(event) => updateEditingConnectionForm('date', event.target.value)} />
        </td>
        <td>
          <input className="search-input admin-table-input" value={form.day} onChange={(event) => updateEditingConnectionForm('day', event.target.value)} />
        </td>
        <td>
          <select className="search-input admin-table-input" value={form.type} onChange={(event) => updateEditingConnectionForm('type', event.target.value)}>
            <option value="ECOLE">École</option>
            <option value="ENTREPRISE">Entreprise</option>
            <option value="FERIE">Férié</option>
          </select>
        </td>
        <td>
          <input className="search-input admin-table-input admin-table-input-wide" value={form.content} onChange={(event) => updateEditingConnectionForm('content', event.target.value)} />
        </td>
        <td>
          <input required={!isAbsent} disabled={isAbsent} type="time" step="1" className="search-input admin-table-input" value={isAbsent ? '' : form.startTime} onChange={(event) => updateEditingConnectionForm('startTime', event.target.value)} />
        </td>
        <td>
          <input required={!isAbsent} disabled={isAbsent} type="time" step="1" className="search-input admin-table-input" value={isAbsent ? '' : form.endTime} onChange={(event) => updateEditingConnectionForm('endTime', event.target.value)} />
        </td>
        <td>{renderStatusBadge(form)}</td>
        <td><strong className="admin-duration-preview">{getPreviewDuration(form) || '0h00'}</strong></td>
        <td>
          <div className="admin-row-actions admin-row-actions-nowrap">
            <button className="btn btn-primary btn-compact" type="submit" form="connection-edit-form" disabled={loading}>Enregistrer</button>
            <button className="btn btn-secondary btn-compact" type="button" onClick={cancelConnectionEdit}>Annuler</button>
          </div>
        </td>
      </>
    );
  };

  return (
    <div className="admin-page admin-connection-page">
      <div className="admin-page-header">
        <div>
          <h2>Gestion des temps de connexion</h2>
          <p className="text-secondary">Ajout, modification et suivi chronologique des sessions apprenants.</p>
        </div>
        <label className="btn btn-secondary admin-file-button">
          <BiImport size={18} />
          Importer un planning CSV
          <input type="file" accept=".csv,.tsv,.txt,.xls" onChange={handleImportPlanningFile} />
        </label>
      </div>

      {loading && <div className="admin-alert admin-alert-info">Traitement en cours...</div>}
      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      {error && <div className="admin-alert admin-alert-danger">{error}</div>}

      <section className="custom-card admin-section-card">
        <div className="admin-section-heading">
          <div>
            <h3>Informations apprenant</h3>
            <p className="text-secondary">Créez, modifiez ou sélectionnez rapidement un apprenant.</p>
          </div>
        </div>

        <form className="admin-stacked-form" onSubmit={handleSaveLearner}>
          <div className="admin-form-grid admin-learner-form-grid">
            <label className="form-field">
              <span>Nom complet</span>
              <input className="search-input" value={learnerForm.name} onChange={(event) => updateLearnerForm('name', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Identifiant</span>
              <input className="search-input" value={learnerForm.code} onChange={(event) => updateLearnerForm('code', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Formation</span>
              <input className="search-input" value={learnerForm.formation} onChange={(event) => updateLearnerForm('formation', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Début du contrat</span>
              <input type="date" className="search-input" value={learnerForm.contractStartDate} onChange={(event) => updateLearnerForm('contractStartDate', event.target.value)} />
            </label>
            <label className="form-field">
              <span>Fin du contrat</span>
              <input type="date" className="search-input" value={learnerForm.contractEndDate} onChange={(event) => updateLearnerForm('contractEndDate', event.target.value)} />
            </label>
          </div>
          <div className="admin-form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              <BiPlus size={18} />
              {learnerForm.id ? 'Enregistrer' : 'Ajouter'}
            </button>
            {learnerForm.id && (
              <button className="btn btn-secondary" type="button" onClick={resetLearnerForm}>Annuler</button>
            )}
          </div>
        </form>

        <DataTable className="admin-compact-table" headers={['Apprenant', 'Identifiant', 'Formation', 'Contrat', 'Actions']}>
          {learners.length > 0 ? learners.map((learner) => (
            <tr key={learner.id} className={selectedLearnerId === learner.id ? 'admin-selected-row' : ''}>
              <td><strong>{learner.name || learner.fullName}</strong></td>
              <td>{learner.code}</td>
              <td>{learner.formation}</td>
              <td>{learner.contractStartDate || learner.contractStart} au {learner.contractEndDate || learner.contractEnd}</td>
              <td>
                <div className="admin-row-actions">
                  <button className="btn btn-primary btn-compact" type="button" onClick={() => handleSelectLearnerForConnection(learner.id)}>Ajouter</button>
                  <button className="btn btn-secondary btn-compact" type="button" onClick={() => handleEditLearner(learner)}>Modifier</button>
                  <button className="btn btn-secondary btn-compact danger-text" type="button" onClick={() => handleDeleteLearner(learner.id)}>Supprimer</button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="text-center text-secondary" style={{ padding: '2rem' }}>
                {isLoading ? 'Chargement des apprenants...' : "Aucun apprenant ajoute par l'admin."}
              </td>
            </tr>
          )}
        </DataTable>
      </section>

      {selectedLearner && (
        <section className="custom-card admin-section-card">
          <div className="admin-section-heading">
            <div>
              <h3>Temps de connexion</h3>
              <p className="text-secondary">{selectedLearner.name || selectedLearner.fullName} - identifiant {selectedLearner.code}</p>
            </div>
            <div className="admin-section-summary">
              <strong>{selectedConnectionTimes.length}</strong>
              <span>session(s)</span>
            </div>
          </div>

          <form className="admin-stacked-form admin-add-session-form" onSubmit={handleSaveConnectionTime}>
            <div className="admin-form-grid admin-session-form-grid">
              <label className="form-field">
                <span>Semaine</span>
                <input className="search-input" value={connectionForm.week} onChange={(event) => updateConnectionForm('week', event.target.value)} />
              </label>
              <label className="form-field">
                <span>Date</span>
                <input required type="date" className="search-input" value={connectionForm.date} onChange={(event) => updateConnectionForm('date', event.target.value)} />
              </label>
              <label className="form-field">
                <span>Jour</span>
                <input className="search-input" value={connectionForm.day} onChange={(event) => updateConnectionForm('day', event.target.value)} />
              </label>
              <label className="form-field">
                <span>Type</span>
                <select className="search-input" value={connectionForm.type} onChange={(event) => updateConnectionForm('type', event.target.value)}>
                  <option value="ECOLE">École</option>
                  <option value="ENTREPRISE">Entreprise</option>
                  <option value="FERIE">Férié</option>
                </select>
              </label>
              <label className="form-field admin-span-2">
                <span>Contenu</span>
                <input className="search-input" value={connectionForm.content} onChange={(event) => updateConnectionForm('content', event.target.value)} />
              </label>
              <label className="form-field">
                <span>Heure de début</span>
                <input required type="time" step="1" className="search-input" value={connectionForm.startTime} onChange={(event) => updateConnectionForm('startTime', event.target.value)} />
              </label>
              <label className="form-field">
                <span>Heure de fin</span>
                <input required type="time" step="1" className="search-input" value={connectionForm.endTime} onChange={(event) => updateConnectionForm('endTime', event.target.value)} />
              </label>
              <div className="form-field">
                <span>Durée recalculée</span>
                <strong className="admin-duration-preview">{getPreviewDuration(connectionForm) || '0h00'}</strong>
              </div>
            </div>
            <div className="admin-form-actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>Ajouter</button>
              <button className="btn btn-secondary" type="button" onClick={() => resetConnectionForm(connectionForm.learnerId)}>Annuler</button>
            </div>
          </form>

          <div className="admin-random-panel">
            <div className="admin-random-panel-header">
              <div>
                <h4>Pauses et absences aleatoires</h4>
                <p className="text-secondary">Genere un apercu uniquement pour l'apprenant selectionne.</p>
              </div>
              <button className="btn btn-secondary" type="button" onClick={handlePreviewRandomPauses} disabled={loading || !selectedConnectionTimes.length}>
                Generer pauses/absences aleatoires
              </button>
            </div>

            {randomPreview && (
              <div className="admin-random-preview">
                <div className="admin-random-preview-header">
                  <strong>Apercu avant enregistrement</strong>
                  <span>{randomPreview.changes.length} changement(s)</span>
                </div>
                <DataTable className="admin-random-preview-table" headers={['Ancien horaire', 'Nouvel horaire', 'Motif']}>
                  {randomPreview.changes.map((change) => (
                    <tr key={change.id}>
                      <td>{change.oldTime}</td>
                      <td>{change.newTime}</td>
                      <td>{change.reason}</td>
                    </tr>
                  ))}
                </DataTable>
                <div className="admin-form-actions">
                  <button className="btn btn-primary" type="button" onClick={handleApplyRandomPauses} disabled={loading}>Enregistrer</button>
                  <button className="btn btn-secondary" type="button" onClick={cancelRandomPreview}>Annuler</button>
                </div>
              </div>
            )}
          </div>

          <form id="connection-edit-form" onSubmit={handleSaveConnectionEdit}>
            <DataTable className="admin-connection-table" headers={['Semaine', 'Date', 'Jour', 'Type', 'Contenu', 'Début', 'Fin', 'Statut', 'Durée', 'Actions']}>
              {selectedConnectionTimes.length > 0 ? selectedConnectionTimes.map((entry) => (
                <tr key={entry.id} className={editingConnectionId === entry.id ? 'admin-editing-row' : ''}>
                  {renderConnectionCells(entry)}
                </tr>
              )) : (
                <tr>
                  <td colSpan="10" className="text-center text-secondary" style={{ padding: '2rem' }}>
                    Aucun temps de connexion pour cet apprenant.
                  </td>
                </tr>
              )}
            </DataTable>
          </form>
        </section>
      )}

      <section className="custom-card admin-section-card">
        <div className="admin-section-heading">
          <div>
            <h3>Vue globale des connexions</h3>
            <p className="text-secondary">Toutes les sessions sont classées par date puis heure de début.</p>
          </div>
        </div>
        <DataTable className="admin-compact-table admin-global-connection-table" headers={['Apprenant', 'Identifiant', 'Formation', 'Date', 'Jour', 'Type', 'Contenu', 'Début', 'Fin', 'Statut', 'Durée']}>
          {allConnectionRows.length > 0 ? allConnectionRows.map((entry) => {
            const displayDate = splitDateAndDay(entry.date, entry.day);

            return (
              <tr key={entry.id}>
                <td><strong>{entry.learnerName || learners.find((learner) => learner.id === entry.learnerId)?.fullName || '-'}</strong></td>
                <td>{entry.learnerCode || '-'}</td>
                <td>{entry.formation || '-'}</td>
                <td>{displayDate.date}</td>
                <td>{displayDate.day}</td>
                <td>{entry.type || '-'}</td>
                <td>{entry.content || entry.comment || '-'}</td>
                <td>{formatSessionTime(entry, 'startTime')}</td>
                <td>{formatSessionTime(entry, 'endTime')}</td>
                <td>{renderStatusBadge(entry)}</td>
                <td>{formatDurationHHMMSS(entry)}</td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan="11" className="text-center text-secondary" style={{ padding: '2rem' }}>
                Aucun temps de connexion importé ou enregistré.
              </td>
            </tr>
          )}
        </DataTable>
      </section>
    </div>
  );
};

export default AdminConnectionTimes;
