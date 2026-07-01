import {
  deleteConnectionTimeFromFirestore,
  deleteLearnerCascadeFromFirestore,
  deletePlanningDayFromFirestore,
  mirrorStateToFirestore,
} from './firebaseConnectionRepository';
import { sortChronological } from '../utils/attendanceDisplay';

const STORAGE_KEY = 'controle.connectionAdmin.v1';
const ADMIN_KEY = 'controle.admin.authenticated';

const schoolTypes = ['ECOLE', 'ENTREPRISE', 'FERIE'];

const slugify = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const randomTime = (startMinutes, endMinutes) => {
  const value = randomInt(startMinutes, endMinutes);
  const hours = String(Math.floor(value / 60)).padStart(2, '0');
  const minutes = String(value % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const randomTimeWithSeconds = (hour, minuteStart, minuteEnd) => (
  `${String(hour).padStart(2, '0')}:${String(randomInt(minuteStart, minuteEnd)).padStart(2, '0')}:${String(randomInt(0, 59)).padStart(2, '0')}`
);

const randomSecondOffset = (minutes) => (minutes * 60) + randomInt(0, 59);

const timeToSeconds = (time) => {
  if (!time || !time.includes(':')) return 0;
  const [hours = 0, minutes = 0, seconds = 0] = time.split(':').map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
};

const secondsToTime = (seconds) => {
  const safeSeconds = Math.max(0, Math.min((24 * 3600) - 1, Number(seconds) || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const rest = safeSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
};

const toMinutes = (time) => {
  if (!time || !time.includes(':')) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const nowIso = () => new Date().toISOString();

const sortConnectionTimes = (connectionTimes = []) => sortChronological(connectionTimes);
const sortPlanningDays = (planningDays = []) => sortChronological(planningDays);

const parseFrenchDate = (date) => {
  const match = String(date || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return String(date || '').trim();
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

const normalizeFlag = (value) => String(value || '')
  .trim()
  .toUpperCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const getRowValue = (row, keys) => keys.map((key) => row[key]).find((value) => value !== undefined && value !== '') || '';

const getFlexibleRowValue = (row, matcher) => {
  const match = Object.entries(row).find(([key, value]) => matcher(key) && value !== undefined && value !== '');
  return match?.[1] || '';
};

const extractLearnerMetadata = (text) => {
  const content = String(text || '');
  const studentLine = content.split(/\r?\n/).find((line) => line.toLowerCase().includes('code'));
  const contractLine = content.split(/\r?\n/).find((line) => line.toLowerCase().includes('contrat'));
  const studentMatch = studentLine?.match(/:\s*([^|]+)\|\s*Code\s*:\s*([^|]+)\|\s*Formation\s*:\s*([^,]+)/i);
  const contractMatch = contractLine?.match(/(\d{2}\/\d{2}\/\d{4})\s+au\s+(\d{2}\/\d{2}\/\d{4})/i);

  return {
    fullName: studentMatch?.[1]?.trim() || '',
    code: studentMatch?.[2]?.trim() || '',
    formation: studentMatch?.[3]?.trim() || '',
    contractStartDate: parseFrenchDate(contractMatch?.[1] || ''),
    contractEndDate: parseFrenchDate(contractMatch?.[2] || ''),
  };
};

const normalizeStatus = (type) => {
  if (type === 'ENTREPRISE') return 'En entreprise';
  if (type === 'FERIE') return 'Férié';
  return 'Present';
};

export const formatDurationSeconds = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const rest = safeSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
};

const durationSecondsBetween = (startTime, endTime) => {
  const start = timeToSeconds(startTime);
  const end = timeToSeconds(endTime);
  if (end <= start) {
    throw new Error('Heure fin doit etre apres heure debut.');
  }
  return end - start;
};

const randomIpv4 = (usedIps) => {
  const privateRanges = [
    () => `192.168.${randomInt(0, 255)}.${randomInt(1, 254)}`,
    () => `10.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
    () => `172.${randomInt(16, 31)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
  ];
  let ipAddress = '';

  do {
    ipAddress = privateRanges[randomInt(0, privateRanges.length - 1)]();
  } while (usedIps.has(ipAddress));

  usedIps.add(ipAddress);
  return ipAddress;
};

export const durationMinutesBetween = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  if (end <= start) {
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

const sanitizeConnectionEntry = (entry) => {
  const isAbsent = entry?.attendance === 'ABSENT' || entry?.status === 'Absent';
  if (!isAbsent) return entry;

  return {
    ...entry,
    startTime: '',
    endTime: '',
    ipAddress: '',
    durationMinutes: 0,
    durationSeconds: 0,
    duration: formatDurationMinutes(0),
    durationFormatted: formatDurationSeconds(0),
    attendance: 'ABSENT',
    status: 'Absent',
  };
};

const sanitizeState = (state) => ({
  learners: (state.learners || []).filter((learner) => !seedIds.has(learner.id)),
  planningDays: (state.planningDays || []).filter((day) => !seedIds.has(day.learnerId)),
  connectionTimes: (state.connectionTimes || [])
    .filter((entry) => !seedIds.has(entry.learnerId))
    .map(sanitizeConnectionEntry),
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
  const sortedState = {
    ...state,
    planningDays: sortPlanningDays(state.planningDays),
    connectionTimes: sortConnectionTimes(state.connectionTimes),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedState));
  window.dispatchEvent(new Event('connection-admin-store-updated'));
  mirrorStateToFirestore(sortedState).catch((error) => {
    console.warn('Firestore sync failed:', error.message);
  });
};

export const normalizeType = (type) => {
  const cleanType = normalizeFlag(type).replace(/[^A-Z]/g, '');
  if (cleanType.includes('ENTREPRISE')) return 'ENTREPRISE';
  if (cleanType.includes('FERIE')) return 'FERIE';
  if (cleanType.includes('ECOLE')) return 'ECOLE';
  return schoolTypes.includes(cleanType) ? cleanType : 'ECOLE';
};

export const getAdminState = () => readState();

export const cacheAdminState = (state) => {
  const cleanState = sanitizeState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...cleanState,
    planningDays: sortPlanningDays(cleanState.planningDays),
    connectionTimes: sortConnectionTimes(cleanState.connectionTimes),
  }));
  window.dispatchEvent(new Event('connection-admin-store-updated'));
};

export const saveLearner = (learner) => {
  const state = readState();
  const requestedCode = String(learner.code || '').trim();
  const requestedName = String(learner.name || learner.fullName || '').trim();
  const existingLearner = state.learners.find((item) => (
    item.id === learner.id ||
    (requestedCode && item.code === requestedCode) ||
    (requestedName && (item.fullName || item.name || '').toLowerCase() === requestedName.toLowerCase())
  ));
  const cleanLearner = {
    id: learner.id || existingLearner?.id || (requestedCode ? `learner-${slugify(requestedCode)}` : crypto.randomUUID()),
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

export const importLearnerPlanningWithConnections = ({ rows, text = '', sourceFile = '' }) => {
  const metadata = extractLearnerMetadata(text);
  const learner = saveLearner(metadata);
  const state = readState();
  const usedIps = new Set(state.connectionTimes.map((entry) => entry.ipAddress).filter(Boolean));
  const existingConnectionMap = new Map(state.connectionTimes.map((entry) => [entry.id, entry]));

  const cleanPlanningDays = rows
    .map((row, index) => {
      const type = normalizeType(getRowValue(row, ['type']));
      const rawDate = getRowValue(row, ['date']);
      const date = type === 'ECOLE' ? parseFrenchDate(rawDate) : String(rawDate || '').trim();
      const week = String(getRowValue(row, ['week', 'semaine', 's.', 's']) || '').trim();
      const day = String(getRowValue(row, ['day', 'jour']) || '').trim();
      const content = String(
        getRowValue(row, ['content', 'contenu', 'statut', 'commentaire']) ||
        getFlexibleRowValue(row, (key) => key.includes('contenu') || key.includes('statut')),
      ).trim();
      const dateKey = slugify(`${week}-${rawDate || date}-${day}`) || `row-${index + 1}`;

      if (!rawDate || !day) return null;

      return {
        id: `${learner.id}-planning-${dateKey}`,
        learnerId: learner.id,
        week,
        date,
        day,
        type,
        holiday: Boolean(getRowValue(row, ['holiday', 'ferie', 'ferieoui/non']) || type === 'FERIE'),
        content,
        sourceFile,
        importKey: dateKey,
      };
    })
    .filter(Boolean);

  const importedPlanningIds = new Set(cleanPlanningDays.map((day) => day.id));
  const planningDays = [
    ...state.planningDays.filter((day) => !importedPlanningIds.has(day.id)),
    ...cleanPlanningDays,
  ];

  const importedEntries = cleanPlanningDays.flatMap((day) => {
    const base = {
      learnerId: learner.id,
      learnerName: learner.name || learner.fullName,
      learnerCode: learner.code,
      formation: learner.formation,
      planningDayId: day.id,
      week: day.week,
      date: day.date,
      day: day.day,
      type: day.type,
      content: day.content,
      comment: day.content,
      attendance: day.type === 'ECOLE' ? 'PRESENT' : '',
      status: normalizeStatus(day.type),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    if (day.type !== 'ECOLE') {
      const id = `${day.id}-status`;
      const existingEntry = existingConnectionMap.get(id);

      return [{
        ...base,
        ...(existingEntry || {}),
        id,
        content: day.content,
        comment: day.content,
        updatedAt: nowIso(),
        startTime: existingEntry?.startTime || '',
        endTime: existingEntry?.endTime || '',
        durationMinutes: existingEntry?.durationMinutes || 0,
        durationSeconds: existingEntry?.durationSeconds || 0,
        duration: existingEntry?.duration || '00:00:00',
        durationFormatted: existingEntry?.durationFormatted || '00:00:00',
        ipAddress: existingEntry?.ipAddress || '',
      }];
    }

    return [
      ['morning', randomTimeWithSeconds(9, 0, 2), randomTimeWithSeconds(11, 29, 30)],
      ['afternoon', randomTimeWithSeconds(13, 0, 2), randomTimeWithSeconds(15, 29, 30)],
    ].map(([sessionPart, startTime, endTime]) => {
      const id = `${day.id}-${sessionPart}`;
      const existingEntry = existingConnectionMap.get(id);

      if (existingEntry) {
        return {
          ...base,
          ...existingEntry,
          id,
          content: day.content,
          comment: day.content,
          updatedAt: nowIso(),
        };
      }

      const durationSeconds = durationSecondsBetween(startTime, endTime);
      const durationFormatted = formatDurationSeconds(durationSeconds);

      return {
        ...base,
        id,
        sessionPart,
        startTime,
        endTime,
        durationMinutes: Math.round((durationSeconds / 60) * 100) / 100,
        durationSeconds,
        duration: durationFormatted,
        durationFormatted,
        ipAddress: randomIpv4(usedIps),
      };
    });
  });

  const importedEntryIds = new Set(importedEntries.map((entry) => entry.id));
  const connectionTimes = [
    ...state.connectionTimes.filter((entry) => !importedEntryIds.has(entry.id)),
    ...importedEntries,
  ];

  writeState({
    ...state,
    learners: state.learners.map((item) => (item.id === learner.id ? learner : item)),
    planningDays,
    connectionTimes,
  });

  return {
    learner,
    planningCount: cleanPlanningDays.length,
    connectionCount: importedEntries.filter((entry) => entry.type === 'ECOLE').length,
    statusCount: importedEntries.filter((entry) => entry.type !== 'ECOLE').length,
  };
};

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

const recalculateSingleSession = (entry) => {
  const isAbsent = entry.attendance === 'ABSENT' || entry.status === 'Absent';
  const durationSeconds = isAbsent ? 0 : durationSecondsBetween(entry.startTime, entry.endTime);
  const durationMinutes = Math.round((durationSeconds / 60) * 100) / 100;

  return {
    ...entry,
    startTime: isAbsent ? '' : entry.startTime,
    endTime: isAbsent ? '' : entry.endTime,
    ipAddress: isAbsent ? '' : String(entry.ipAddress || '').trim(),
    durationMinutes,
    durationSeconds,
    duration: formatDurationMinutes(durationMinutes),
    durationFormatted: formatDurationSeconds(durationSeconds),
    attendance: isAbsent ? 'ABSENT' : (entry.attendance || 'PRESENT'),
    status: isAbsent ? 'Absent' : entry.type === 'ENTREPRISE' ? 'En entreprise' : entry.type === 'FERIE' ? 'Ferie' : 'Present',
    updatedAt: nowIso(),
  };
};

const getSessionWindow = (entry) => {
  const currentStart = timeToSeconds(entry.startTime);
  const isMorning = currentStart < (12 * 3600);

  return isMorning
    ? { label: 'matin', start: 9 * 3600, end: (11 * 3600) + (30 * 60) }
    : { label: 'apres-midi', start: 13 * 3600, end: (15 * 3600) + (30 * 60) };
};

const formatChangeRange = (entry) => `${entry.startTime || '-'} - ${entry.endTime || '-'}`;

const buildRandomAdjustment = (entry, index) => {
  const window = getSessionWindow(entry);
  const originalStart = timeToSeconds(entry.startTime);
  const originalEnd = timeToSeconds(entry.endTime);
  const safeStart = Math.max(window.start, Math.min(originalStart || window.start, window.end - (20 * 60)));
  const safeEnd = Math.min(window.end, Math.max(originalEnd || window.end, safeStart + (20 * 60)));
  const availableSeconds = safeEnd - safeStart;
  const options = window.label === 'apres-midi'
    ? ['pause', 'late', 'early', 'skip-afternoon']
    : ['pause', 'late', 'early'];
  const type = options[randomInt(0, options.length - 1)];
  const baseReason = {
    pause: 'Pause aleatoire pendant la session',
    late: 'Connexion avec quelques minutes de retard',
    early: 'Deconnexion quelques minutes avant la fin',
    'skip-afternoon': 'Absence complete sur la session de l apres-midi',
  }[type];

  if (type === 'skip-afternoon') {
    const replacement = recalculateSingleSession({
      ...entry,
      startTime: '',
      endTime: '',
      ipAddress: '',
      attendance: 'ABSENT',
      status: 'Absent',
      pauseReason: baseReason,
    });

    return {
      id: `random-${entry.id}-${index}`,
      reason: baseReason,
      oldTime: formatChangeRange(entry),
      newTime: 'Absent',
      updates: [replacement],
      creates: [],
      deletes: [],
    };
  }

  if (type === 'late') {
    const lateSeconds = randomSecondOffset([2, 5, 10, 15][randomInt(0, 3)]);
    const newStart = Math.min(safeStart + lateSeconds, safeEnd - (15 * 60));
    const replacement = recalculateSingleSession({
      ...entry,
      startTime: secondsToTime(newStart),
      endTime: secondsToTime(safeEnd - randomInt(0, 59)),
      attendance: 'PRESENT',
      status: 'Present',
      pauseReason: baseReason,
    });

    return {
      id: `random-${entry.id}-${index}`,
      reason: baseReason,
      oldTime: formatChangeRange(entry),
      newTime: formatChangeRange(replacement),
      updates: [replacement],
      creates: [],
      deletes: [],
    };
  }

  if (type === 'early') {
    const earlySeconds = randomSecondOffset([2, 5, 10, 15][randomInt(0, 3)]);
    const newEnd = Math.max(safeEnd - earlySeconds, safeStart + (15 * 60));
    const replacement = recalculateSingleSession({
      ...entry,
      startTime: secondsToTime(safeStart + randomInt(0, 59)),
      endTime: secondsToTime(newEnd),
      attendance: 'PRESENT',
      status: 'Present',
      pauseReason: baseReason,
    });

    return {
      id: `random-${entry.id}-${index}`,
      reason: baseReason,
      oldTime: formatChangeRange(entry),
      newTime: formatChangeRange(replacement),
      updates: [replacement],
      creates: [],
      deletes: [],
    };
  }

  if (availableSeconds < 45 * 60) return null;

  const pauseMinutes = [2, 5, 10, 15][randomInt(0, 3)];
  const pauseDuration = randomSecondOffset(pauseMinutes);
  const earliestPause = safeStart + (35 * 60);
  const latestPause = safeEnd - pauseDuration - (25 * 60);

  if (latestPause <= earliestPause) return null;

  const pauseStart = randomInt(earliestPause, latestPause);
  const pauseEnd = pauseStart + pauseDuration;
  const firstPart = recalculateSingleSession({
    ...entry,
    startTime: secondsToTime(safeStart + randomInt(0, 59)),
    endTime: secondsToTime(pauseStart),
    attendance: 'PRESENT',
    status: 'Present',
    pauseReason: `${baseReason} (${pauseMinutes} min)`,
  });
  const secondPart = recalculateSingleSession({
    ...entry,
    id: `${entry.id}-pause-${Date.now()}-${index}`,
    startTime: secondsToTime(pauseEnd),
    endTime: secondsToTime(safeEnd - randomInt(0, 59)),
    attendance: 'PRESENT',
    status: 'Present',
    createdAt: nowIso(),
    pauseReason: `Retour apres pause (${pauseMinutes} min)`,
  });

  return {
    id: `random-${entry.id}-${index}`,
    reason: `${baseReason} de ${pauseMinutes} min`,
    oldTime: formatChangeRange(entry),
    newTime: `${formatChangeRange(firstPart)} puis ${formatChangeRange(secondPart)}`,
    updates: [firstPart],
    creates: [secondPart],
    deletes: [],
  };
};

export const previewRandomPausesAbsences = (learnerId) => {
  const state = readState();
  const learner = state.learners.find((item) => item.id === learnerId);
  if (!learner) throw new Error('Selectionnez un apprenant avant de generer des pauses.');

  const candidates = sortConnectionTimes(state.connectionTimes)
    .filter((entry) => (
      entry.learnerId === learnerId &&
      entry.type === 'ECOLE' &&
      entry.startTime &&
      entry.endTime &&
      entry.attendance !== 'ABSENT' &&
      entry.status !== 'Absent'
    ));

  if (!candidates.length) {
    throw new Error('Aucune session ecole modifiable pour cet apprenant.');
  }

  const targetCount = Math.min(Math.max(3, Math.ceil(candidates.length * 0.18)), 10, candidates.length);
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const changes = [];

  for (const entry of shuffled) {
    const adjustment = buildRandomAdjustment(entry, changes.length + 1);
    if (adjustment) changes.push(adjustment);
    if (changes.length >= targetCount) break;
  }

  if (!changes.length) {
    throw new Error('Impossible de generer des pauses valides pour les sessions disponibles.');
  }

  return {
    learnerId,
    learnerName: learner.name || learner.fullName,
    createdAt: nowIso(),
    changes,
  };
};

export const applyRandomPausesAbsences = (learnerId, preview) => {
  if (!preview?.changes?.length || preview.learnerId !== learnerId) {
    throw new Error('Apercu invalide pour cet apprenant.');
  }

  const state = readState();
  const updateMap = new Map();
  const createdEntries = [];
  const deleteIds = new Set();

  preview.changes.forEach((change) => {
    (change.updates || []).forEach((entry) => updateMap.set(entry.id, recalculateSingleSession(entry)));
    (change.creates || []).forEach((entry) => createdEntries.push(recalculateSingleSession(entry)));
    (change.deletes || []).forEach((id) => deleteIds.add(id));
  });

  const connectionTimes = [
    ...state.connectionTimes
      .filter((entry) => !deleteIds.has(entry.id))
      .map((entry) => (updateMap.has(entry.id) ? updateMap.get(entry.id) : entry)),
    ...createdEntries,
  ];

  writeState({ ...state, connectionTimes });
  return sortConnectionTimes(connectionTimes).filter((entry) => entry.learnerId === learnerId);
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
  const attendance = entry.attendance || 'PRESENT';
  const isAbsent = attendance === 'ABSENT';

  if (!entry.date) {
    throw new Error('La date est obligatoire.');
  }

  if (!isAbsent && (!startTime || !endTime)) {
    throw new Error('Heure debut et heure fin sont obligatoires.');
  }

  const durationMinutes = isAbsent ? 0 : durationMinutesBetween(startTime, endTime);
  const durationSeconds = isAbsent ? 0 : durationSecondsBetween(startTime, endTime);

  const existingEntry = state.connectionTimes.find((item) => item.id === entry.id);
  const usedIps = new Set(state.connectionTimes
    .filter((item) => item.id !== entry.id)
    .map((item) => item.ipAddress)
    .filter(Boolean));
  const cleanEntry = {
    id: entry.id || crypto.randomUUID(),
    learnerId: learner.id,
    learnerName: learner.name || learner.fullName,
    learnerCode: learner.code,
    formation: learner.formation,
    week: String(entry.week || '').trim(),
    tp: String(entry.tp || '').trim(),
    date: entry.date || '',
    day: String(entry.day || '').trim(),
    type,
    content: String(entry.content || '').trim(),
    comment: String(entry.content || entry.comment || '').trim(),
    startTime: isAbsent ? '' : startTime,
    endTime: isAbsent ? '' : endTime,
    attendance,
    durationMinutes,
    durationSeconds,
    duration: formatDurationMinutes(durationMinutes),
    durationFormatted: formatDurationSeconds(durationSeconds),
    ipAddress: isAbsent ? '' : String(entry.ipAddress || '').trim() || (type === 'ECOLE' ? randomIpv4(usedIps) : ''),
    status: isAbsent ? 'Absent' : type === 'ECOLE' ? 'Present' : type === 'ENTREPRISE' ? 'En entreprise' : 'Férié',
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
