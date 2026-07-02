import React, { useMemo, useState } from 'react';
import { BiFile, BiSpreadsheet } from 'react-icons/bi';
import useAdminConnectionStore from '../../hooks/useAdminConnectionStore';
import { exportExcelTable, printPdfReport } from '../../utils/tableImportExport';
import {
  formatDurationHHMMSS,
  formatSessionTime,
  sortChronological,
  splitDateAndDay,
} from '../../utils/attendanceDisplay';

const minutesFromDuration = (duration) => {
  const match = String(duration || '').match(/(\d+)h\s*(\d+)?/);
  if (!match) return 0;
  return (Number(match[1]) * 60) + Number(match[2] || 0);
};

const entryMinutes = (entry) => entry.durationMinutes || minutesFromDuration(entry.duration);

const formatMinutes = (minutes) => `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}min`;

const AdminExports = () => {
  const { learners, connectionTimes } = useAdminConnectionStore();
  const [learnerId, setLearnerId] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const selectedLearner = learners.find((learner) => learner.id === learnerId);
  const rows = useMemo(() => sortChronological(connectionTimes.filter((entry) => {
    if (learnerId !== 'all' && entry.learnerId !== learnerId) return false;
    if (startDate && entry.date < startDate) return false;
    if (endDate && entry.date > endDate) return false;
    return true;
  })), [connectionTimes, learnerId, startDate, endDate]);

  const total = useMemo(() => formatMinutes(rows.reduce((sum, row) => sum + entryMinutes(row), 0)), [rows]);
  const period = `${startDate || 'debut'} - ${endDate || 'fin'}`;
  const learnerLabel = selectedLearner ? selectedLearner.name || selectedLearner.fullName : 'Tous les apprenants';
  const code = selectedLearner ? selectedLearner.code : 'Tous';
  const formation = selectedLearner ? selectedLearner.formation : 'Toutes formations';

  const toExportRows = () => rows.map((entry) => {
    const displayDate = splitDateAndDay(entry.date, entry.day);

    return {
      'Nom apprenant': entry.learnerName,
      Identifiant: entry.learnerCode,
      Formation: entry.formation,
      Date: displayDate.date,
      Jour: displayDate.day,
      Type: entry.type,
      'Heure debut': formatSessionTime(entry, 'startTime', 'morningLogin'),
      'Heure fin': formatSessionTime(entry, 'endTime', 'afternoonLogout'),
      'Duree totale': formatDurationHHMMSS(entry),
      Statut: entry.status,
      'Contenu / commentaire': entry.content || entry.comment,
    };
  });

  const handlePdf = () => {
    setError('');

    try {
      printPdfReport({
        title: 'Releve des temps de connexion',
        learnerLabel,
        code,
        formation,
        period,
        rows,
        total,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExcel = () => {
    setError('');
    exportExcelTable('releve-temps-connexion.xls', 'Releve des temps de connexion', toExportRows());
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Exports</h2>
          <p className="text-secondary">Export PDF ou Excel pour un apprenant ou pour tous les apprenants.</p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-danger">{error}</div>}

      <div className="custom-card admin-export-panel">
        <div className="admin-filters">
          <select className="search-input" value={learnerId} onChange={(event) => setLearnerId(event.target.value)}>
            <option value="all">Tous les apprenants</option>
            {learners.map((learner) => <option key={learner.id} value={learner.id}>{learner.name || learner.fullName} - {learner.code}</option>)}
          </select>
          <input type="date" className="search-input" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          <input type="date" className="search-input" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </div>

        <div className="admin-export-summary">
          <div>
            <span className="text-secondary">Apprenant</span>
            <strong>{learnerLabel}</strong>
          </div>
          <div>
            <span className="text-secondary">Periode</span>
            <strong>{period}</strong>
          </div>
          <div>
            <span className="text-secondary">Lignes</span>
            <strong>{rows.length}</strong>
          </div>
          <div>
            <span className="text-secondary">Total heures</span>
            <strong>{total}</strong>
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="btn btn-primary" type="button" onClick={handlePdf}><BiFile size={18} /> Exporter PDF</button>
          <button className="btn btn-secondary" type="button" onClick={handleExcel}><BiSpreadsheet size={18} /> Exporter Excel</button>
        </div>
      </div>
    </div>
  );
};

export default AdminExports;
