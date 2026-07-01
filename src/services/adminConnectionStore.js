import {
  deleteConnectionTimeFromFirestore,
  deleteLearnerCascadeFromFirestore,
  deletePlanningDayFromFirestore,
  mirrorStateToFirestore,
} from './firebaseConnectionRepository';

const STORAGE_KEY = 'controle.connectionAdmin.v1';
const ADMIN_KEY = 'controle.admin.authenticated';

const schoolTypes = ['ECOLE', 'ENTREPRISE', 'FERIE'];

const randomTime = (startMinutes, endMinutes) => {
  const value = startMinutes + Math.floor(Math.random() * (endMinutes - startMinutes + 1));
  const hours = String(Math.floor(value / 60)).padStart(2, '0');
  const minutes = String(value % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const toMinutes = (time) => {
  if (!time || !time.includes(':')) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const nowIso = () => new Date().toISOString();

export const durationMinutesBetween = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  if (end < start) {
    throw new Error('Heure fin doit etre apres heure debut.');
  }
  return end - start;
};

export const formatDurationMinutes = (minutes) => {
  if (!minutes) return '0h00';
  return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`;
};

export const calculateDuration = (entry) => {
  if (entry.status !== 'Present') return '0h 00min';

  const morning = Math.max(0, toMinutes(entry.morningLogout) - toMinutes(entry.morningLogin));
  const afternoon = Math.max(0, toMinutes(entry.afternoonLogout) - toMinutes(entry.afternoonLogin));
  const total = morning + afternoon;

  return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, '0')}min`;
};

export const generateConnectionForPlanningDay = (learner, day) => {
  const base = {
    id: crypto.randomUUID(),
    learnerId: learner.id,
    learnerName: learner.fullName,
    learnerCode: learner.code,
    formation: learner.formation,
    planningDayId: day.id,
    week: day.week,
    date: day.date,
    day: day.day,
    type: day.type,
    comment: day.content || '',
    morningLogin: '',
    morningLogout: '',
    afternoonLogin: '',
    afternoonLogout: '',
    duration: '0h 00min',
    status: day.type === 'ENTREPRISE' ? 'En entreprise' : 'Ferie',
  };

  if (day.type === 'ECOLE') {
    const generated = {
      ...base,
      morningLogin: randomTime(8 * 60 + 45, 9 * 60 + 5),
      morningLogout: randomTime(12 * 60, 12 * 60 + 15),
      afternoonLogin: randomTime(13 * 60 + 20, 13 * 60 + 35),
      afternoonLogout: randomTime(16 * 60 + 50, 17 * 60 + 10),
      status: 'Present',
    };

    return {
      ...generated,
      duration: calculateDuration(generated),
    };
  }

  return base;
};

const initialState = {
  learners: [],
  planningDays: [],
  connectionTimes: [],
};

const seedIds = new Set(['learner-alexandre-maxime']);

const sanitizeState = (state) => ({
  learners: (state.learners || []).filter((learner) => !seedIds.has(learner.id)),
  planningDays: (state.planningDays || []).filter((day) => !seedIds.has(day.learnerId)),
  connectionTimes: (state.connectionTimes || []).filter((entry) => !seedIds.has(entry.learnerId)),
});

const readState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? sanitizeState(JSON.parse(stored)) : initialState;
  } catch {
    return initialState;
  }
};

const writeState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('connection-admin-store-updated'));
  mirrorStateToFirestore(state).catch((error) => {
    console.warn('Firestore sync failed:', error.message);
  });
};

export const normalizeType = (type) => {
  const cleanType = String(type || '').trim().toUpperCase().replace('É', 'E');
  if (cleanType === 'FÉRIÉ') return 'FERIE';
  return schoolTypes.includes(cleanType) ? cleanType : 'ECOLE';
};

export const getAdminState = () => readState();

export const cacheAdminState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(state)));
  window.dispatchEvent(new Event('connection-admin-store-updated'));
};

export const saveLearner = (learner) => {
  const state = readState();
  const existingLearner = state.learners.find((item) => item.id === learner.id);
  const cleanLearner = {
    id: learner.id || crypto.randomUUID(),
    name: String(learner.name || learner.fullName || '').trim(),
    fullName: String(learner.fullName || learner.name || '').trim(),
    code: String(learner.code || '').trim(),
    email: String(learner.email || '').trim(),
    phone: String(learner.phone || '').trim(),
    formation: String(learner.formation || '').trim(),
    level: String(learner.level || '').trim(),
    contractStartDate: learner.contractStartDate || learner.contractStart || '',
    contractEndDate: learner.contractEndDate || learner.contractEnd || '',
    contractStart: learner.contractStart || learner.contractStartDate || '',
    contractEnd: learner.contractEnd || learner.contractEndDate || '',
    createdAt: learner.createdAt || existingLearner?.createdAt || nowIso(),
    updatedAt: nowIso(),
    active: learner.active === undefined ? true : Boolean(learner.active),
    connectionInfo: {
      ipAddress: String(learner.connectionInfo?.ipAddress || learner.ipAddress || '').trim(),
      browser: String(learner.connectionInfo?.browser || learner.browser || '').trim(),
      device: String(learner.connectionInfo?.device || learner.device || '').trim(),
    },
    company: {
      name: String(learner.company?.name || learner.companyName || '').trim(),
      tutorName: String(learner.company?.tutorName || learner.tutorName || '').trim(),
      tutorEmail: String(learner.company?.tutorEmail || learner.tutorEmail || '').trim(),
      tutorPhone: String(learner.company?.tutorPhone || learner.tutorPhone || '').trim(),
    },
  };

  if (!cleanLearner.name || !cleanLearner.code || !cleanLearner.formation) {
    throw new Error('Nom complet, code apprenant et formation sont obligatoires.');
  }

  if (!cleanLearner.contractStartDate || !cleanLearner.contractEndDate) {
    throw new Error('Les dates de debut et fin de contrat sont obligatoires.');
  }

  const exists = state.learners.some((item) => item.id === cleanLearner.id);
  const learners = exists
    ? state.learners.map((item) => (item.id === cleanLearner.id ? cleanLearner : item))
    : [...state.learners, cleanLearner];

  writeState({ ...state, learners });
  return cleanLearner;
};

export const deleteLearner = (learnerId) => {
  const state = readState();
  writeState({
    learners: state.learners.filter((learner) => learner.id !== learnerId),
    planningDays: state.planningDays.filter((day) => day.learnerId !== learnerId),
    connectionTimes: state.connectionTimes.filter((entry) => entry.learnerId !== learnerId),
  });
  deleteLearnerCascadeFromFirestore(learnerId).catch((error) => {
    console.warn('Firestore learner cascade delete failed:', error.message);
  });
};

export const importLearners = (rows) => rows.map((row) => saveLearner({
  fullName: row.fullName || row.nom || row.name,
  code: row.code || row.codeApprenant,
  email: row.email || '',
  phone: row.phone || row.telephone || '',
  formation: row.formation,
  level: row.level || row.niveau || row.diplome,
  contractStart: row.contractStart || row.dateDebut || row.debut,
  contractEnd: row.contractEnd || row.dateFin || row.fin,
  ipAddress: row.ipAddress || row.ip || '',
  browser: row.browser || row.navigateur || '',
  device: row.device || row.appareil || '',
  companyName: row.companyName || row.entreprise || '',
  tutorName: row.tutorName || row.tuteur || '',
  tutorEmail: row.tutorEmail || row.emailTuteur || '',
  tutorPhone: row.tutorPhone || row.telephoneTuteur || '',
  active: row.active === undefined ? true : String(row.active).toLowerCase() !== 'false',
}));

export const savePlanningDay = (planningDay) => {
  const state = readState();
  const learner = state.learners.find((item) => item.id === planningDay.learnerId);

  if (!learner) throw new Error('Selectionnez un apprenant pour ce planning.');

  const cleanDay = {
    id: planningDay.id || crypto.randomUUID(),
    learnerId: learner.id,
    week: String(planningDay.week || '').trim(),
    date: planningDay.date || '',
    day: String(planningDay.day || '').trim(),
    type: normalizeType(planningDay.type),
    holiday: Boolean(planningDay.holiday || normalizeType(planningDay.type) === 'FERIE'),
    content: String(planningDay.content || '').trim(),
    sourceFile: planningDay.sourceFile || '',
  };

  if (!cleanDay.week || !cleanDay.date || !cleanDay.day) {
    throw new Error('Semaine, date et jour sont obligatoires.');
  }

  const exists = state.planningDays.some((item) => item.id === cleanDay.id);
  const planningDays = exists
    ? state.planningDays.map((item) => (item.id === cleanDay.id ? cleanDay : item))
    : [...state.planningDays, cleanDay];

  writeState({ ...state, planningDays });
  return cleanDay;
};

export const deletePlanningDay = (planningDayId) => {
  const state = readState();
  writeState({
    ...state,
    planningDays: state.planningDays.filter((day) => day.id !== planningDayId),
    connectionTimes: state.connectionTimes.filter((entry) => entry.planningDayId !== planningDayId),
  });
  deletePlanningDayFromFirestore(planningDayId).catch((error) => {
    console.warn('Firestore planning delete failed:', error.message);
  });
};

export const importPlanningDays = (learnerId, rows, sourceFile = '') => rows.map((row) => savePlanningDay({
  learnerId,
  week: row.week || row.semaine || row['s.'] || row.s,
  date: row.date,
  day: row.day || row.jour,
  type: row.type,
  holiday: row.holiday || row.ferie || row['ferie oui/non'],
  content: row.content || row.contenu || row.statut || row.commentaire || row['contenu / statut'],
  sourceFile,
}));

export const generateConnectionTimes = (learnerId = 'all') => {
  const state = readState();
  const learners = learnerId === 'all'
    ? state.learners
    : state.learners.filter((learner) => learner.id === learnerId);

  const learnerMap = new Map(learners.map((learner) => [learner.id, learner]));
  const selectedDays = state.planningDays.filter((day) => learnerMap.has(day.learnerId));
  const keepOtherEntries = state.connectionTimes.filter((entry) => !learnerMap.has(entry.learnerId));

  const generatedEntries = selectedDays.map((day) => generateConnectionForPlanningDay(learnerMap.get(day.learnerId), day));
  const connectionTimes = [...keepOtherEntries, ...generatedEntries];

  writeState({ ...state, connectionTimes });
  return generatedEntries;
};

export const saveConnectionTime = (entry) => {
  const state = readState();
  const cleanEntry = {
    ...entry,
    duration: calculateDuration(entry),
  };

  writeState({
    ...state,
    connectionTimes: state.connectionTimes.map((item) => (item.id === cleanEntry.id ? cleanEntry : item)),
  });

  return cleanEntry;
};

export const createLearner = (learner) => saveLearner(learner);

export const getLearners = () => readState().learners;

export const updateLearner = (learnerId, learner) => saveLearner({ ...learner, id: learnerId });

export const createConnectionTime = (entry) => {
  const state = readState();
  const learner = state.learners.find((item) => item.id === entry.learnerId);
  if (!learner) throw new Error('Apprenant introuvable.');

  const type = normalizeType(entry.type);
  const startTime = entry.startTime || '';
  const endTime = entry.endTime || '';

  if (type === 'ECOLE' && (!startTime || !endTime)) {
    throw new Error('Heure debut et heure fin sont obligatoires pour une journee ECOLE.');
  }

  const durationMinutes = type === 'ECOLE' ? durationMinutesBetween(startTime, endTime) : (
    startTime && endTime ? durationMinutesBetween(startTime, endTime) : 0
  );

  const existingEntry = state.connectionTimes.find((item) => item.id === entry.id);
  const cleanEntry = {
    id: entry.id || crypto.randomUUID(),
    learnerId: learner.id,
    learnerName: learner.name || learner.fullName,
    learnerCode: learner.code,
    formation: learner.formation,
    week: String(entry.week || '').trim(),
    date: entry.date || '',
    day: String(entry.day || '').trim(),
    type,
    content: String(entry.content || '').trim(),
    comment: String(entry.content || entry.comment || '').trim(),
    startTime,
    endTime,
    durationMinutes,
    duration: formatDurationMinutes(durationMinutes),
    status: type === 'ECOLE' ? 'Present' : type === 'ENTREPRISE' ? 'En entreprise' : 'Ferie',
    createdAt: entry.createdAt || existingEntry?.createdAt || nowIso(),
    updatedAt: nowIso(),
  };

  if (!cleanEntry.week || !cleanEntry.date || !cleanEntry.day) {
    throw new Error('Semaine, date et jour sont obligatoires.');
  }

  const exists = state.connectionTimes.some((item) => item.id === cleanEntry.id);
  const connectionTimes = exists
    ? state.connectionTimes.map((item) => (item.id === cleanEntry.id ? cleanEntry : item))
    : [...state.connectionTimes, cleanEntry];

  writeState({ ...state, connectionTimes });
  return cleanEntry;
};

export const getConnectionTimesByLearner = (learnerId) => (
  readState().connectionTimes.filter((entry) => entry.learnerId === learnerId)
);

export const updateConnectionTime = (connectionTimeId, entry) => createConnectionTime({ ...entry, id: connectionTimeId });

export const deleteConnectionTime = (connectionTimeId) => {
  const state = readState();
  writeState({
    ...state,
    connectionTimes: state.connectionTimes.filter((entry) => entry.id !== connectionTimeId),
  });
  deleteConnectionTimeFromFirestore(connectionTimeId).catch((error) => {
    console.warn('Firestore connection time delete failed:', error.message);
  });
};

export const isAdminAuthenticated = () => localStorage.getItem(ADMIN_KEY) === 'true';

export const loginAdmin = (password) => {
  if (password !== 'admin123') {
    throw new Error('Mot de passe admin incorrect.');
  }

  localStorage.setItem(ADMIN_KEY, 'true');
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_KEY);
};
