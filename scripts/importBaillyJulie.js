import fs from 'node:fs';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../src/firebase.js';
import { parseDelimitedText } from '../src/utils/tableImportExport.js';

const csvPath = process.argv[2] || 'C:/Users/Mebrouka/Downloads/BAILLY_JULIE.xlsx - BAILLY JULIE.csv';
const sourceFile = csvPath.split(/[\\/]/).pop();

const slugify = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const hashValue = (value) => String(value || '')
  .split('')
  .reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) % 1000000, 7);

const getLearnerIdentifier = (learner) => {
  const key = learner.originalCode || learner.code || learner.fullName || learner.name || learner.id;
  return `ID-${String(100000 + (hashValue(key) % 900000)).padStart(6, '0')}`;
};

const getLearnerIpAddress = (learner) => {
  const key = learner.id || learner.identifier || learner.code || learner.fullName || learner.name;
  return `192.168.1.${20 + (hashValue(key) % 200)}`;
};

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const randomTime = (hour, minuteStart, minuteEnd) => (
  `${String(hour).padStart(2, '0')}:${String(randomInt(minuteStart, minuteEnd)).padStart(2, '0')}:${String(randomInt(0, 59)).padStart(2, '0')}`
);
const timeToSeconds = (time) => {
  const [hours = 0, minutes = 0, seconds = 0] = String(time || '').split(':').map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
};
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
};
const parseFrenchDate = (date) => {
  const match = String(date || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : String(date || '').trim();
};
const normalizeType = (value) => {
  const clean = String(value || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z]/g, '');
  if (clean.includes('ENTREPRISE')) return 'ENTREPRISE';
  if (clean.includes('FERIE')) return 'FERIE';
  return 'ECOLE';
};
const rowValue = (row, keys) => keys.map((key) => row[key]).find((value) => value !== undefined && value !== '') || '';
const flexibleValue = (row, matcher) => Object.entries(row).find(([key, value]) => matcher(key) && value)?.[1] || '';

const text = fs.readFileSync(csvPath, 'utf8');
const rows = parseDelimitedText(text);
const originalCode = '252238713';
const identifier = getLearnerIdentifier({ originalCode, fullName: 'BAILLY JULIE' });
const learner = {
  id: `learner-${slugify(identifier)}`,
  identifier,
  originalCode,
  name: 'BAILLY JULIE',
  fullName: 'BAILLY JULIE',
  code: identifier,
  email: '',
  phone: '',
  formation: 'BAC PRO LOGISTIQUE',
  level: '',
  contractStartDate: '2025-09-01',
  contractEndDate: '2026-05-15',
  contractStart: '2025-09-01',
  contractEnd: '2026-05-15',
  active: true,
  updatedAt: new Date().toISOString(),
  connectionInfo: { ipAddress: '', browser: '', device: '' },
  company: { name: '', tutorName: '', tutorEmail: '', tutorPhone: '' },
};

const existingConnections = await getDocs(collection(db, 'connectionTimes'));
const existingById = new Map(existingConnections.docs.map((item) => [item.id, item.data()]));
const now = new Date().toISOString();

const planningDays = rows.map((row, index) => {
  const type = normalizeType(rowValue(row, ['type']));
  const rawDate = rowValue(row, ['date']);
  const week = String(rowValue(row, ['week', 'semaine', 's.', 's'])).trim();
  const day = String(rowValue(row, ['day', 'jour'])).trim();
  const content = String(rowValue(row, ['content', 'contenu', 'statut', 'commentaire']) || flexibleValue(row, (key) => key.includes('contenu') || key.includes('statut'))).trim();
  const dateKey = slugify(`${week}-${rawDate}-${day}`) || `row-${index + 1}`;

  return {
    id: `${learner.id}-planning-${dateKey}`,
    learnerId: learner.id,
    week,
    date: type === 'ECOLE' ? parseFrenchDate(rawDate) : String(rawDate || '').trim(),
    day,
    type,
    holiday: Boolean(rowValue(row, ['holiday', 'ferie', 'ferieoui/non']) || type === 'FERIE'),
    content,
    sourceFile,
    importKey: dateKey,
  };
}).filter((day) => day.date && day.day);

const connectionTimes = planningDays.flatMap((day) => {
  const base = {
    learnerId: learner.id,
    learnerName: learner.fullName,
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
    status: day.type === 'ENTREPRISE' ? 'En entreprise' : day.type === 'FERIE' ? 'Férié' : 'Present',
    createdAt: now,
    updatedAt: now,
  };

  if (day.type !== 'ECOLE') {
    const id = `${day.id}-status`;
    const existing = existingById.get(id);
    return [{
      ...base,
      ...(existing || {}),
      id,
      content: day.content,
      comment: day.content,
      updatedAt: now,
      startTime: existing?.startTime || '',
      endTime: existing?.endTime || '',
      durationMinutes: existing?.durationMinutes || 0,
      durationSeconds: existing?.durationSeconds || 0,
      duration: existing?.duration || '00:00:00',
      durationFormatted: existing?.durationFormatted || '00:00:00',
      ipAddress: existing?.ipAddress || '',
    }];
  }

  return [
    ['morning', randomTime(9, 0, 2), randomTime(11, 29, 30)],
    ['afternoon', randomTime(13, 0, 2), randomTime(15, 29, 30)],
  ].map(([sessionPart, startTime, endTime]) => {
    const id = `${day.id}-${sessionPart}`;
    const existing = existingById.get(id);
    if (existing) return { ...base, ...existing, id, content: day.content, comment: day.content, updatedAt: now, ipAddress: getLearnerIpAddress(learner) };

    const durationSeconds = timeToSeconds(endTime) - timeToSeconds(startTime);
    const durationFormatted = formatDuration(durationSeconds);
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
      ipAddress: getLearnerIpAddress(learner),
    };
  });
});

await Promise.all([
  setDoc(doc(db, 'learners', learner.id), learner, { merge: true }),
  ...planningDays.map((day) => setDoc(doc(db, 'planningDays', day.id), day, { merge: true })),
  ...connectionTimes.map((entry) => setDoc(doc(db, 'connectionTimes', entry.id), entry, { merge: true })),
]);

console.log(JSON.stringify({
  learner: learner.fullName,
  planningLines: planningDays.length,
  schoolSessions: connectionTimes.filter((entry) => entry.type === 'ECOLE').length,
  statusRows: connectionTimes.filter((entry) => entry.type !== 'ECOLE').length,
}, null, 2));
