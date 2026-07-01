const arrowPattern = /\s*(?:\u2192|->|â†’|Ã¢â€ â€™)\s*/g;
const dayNamesPattern = /(Lun(?:di)?|Mar(?:di)?|Mer(?:credi)?|Jeu(?:di)?|Ven(?:dredi)?|Sam(?:edi)?|Dim(?:anche)?)/i;

export const normalizeArrowSpacing = (value) => String(value || '')
  .replace(arrowPattern, ' \u2192 ')
  .replace(/\s+/g, ' ')
  .trim();

const parseSortableDate = (value) => {
  const cleanValue = normalizeArrowSpacing(value);
  const isoMatch = cleanValue.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  const rangeMatch = cleanValue.match(/(\d{2})\/(\d{2})\s+\u2192\s+\d{2}\/\d{2}\/(\d{4})/);
  if (rangeMatch) return `${rangeMatch[3]}-${rangeMatch[2]}-${rangeMatch[1]}`;

  const fullFrenchMatch = cleanValue.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (fullFrenchMatch) return `${fullFrenchMatch[3]}-${fullFrenchMatch[2]}-${fullFrenchMatch[1]}`;

  return cleanValue;
};

const normalizeTimeForSort = (value) => {
  const [hours = '99', minutes = '99', seconds = '99'] = String(value || '').split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
};

export const getChronologicalKey = (entry) => [
  parseSortableDate(entry?.date),
  normalizeTimeForSort(entry?.startTime || entry?.morningLogin),
  normalizeTimeForSort(entry?.endTime || entry?.afternoonLogout),
  entry?.learnerName || '',
  entry?.id || '',
].join('|');

export const compareChronological = (first, second) => (
  getChronologicalKey(first).localeCompare(getChronologicalKey(second))
);

export const sortChronological = (rows = []) => [...rows].sort(compareChronological);

export const formatFrenchDate = (value) => {
  const cleanValue = normalizeArrowSpacing(value);
  const match = cleanValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  return cleanValue || '-';
};

export const splitDateAndDay = (dateValue, dayValue) => {
  let date = formatFrenchDate(dateValue);
  let day = normalizeArrowSpacing(dayValue);
  const gluedDayMatch = date.match(/^(.+\d{4})\s+\u2192\s+(.+)$/);

  if (gluedDayMatch && dayNamesPattern.test(gluedDayMatch[2])) {
    const suffixDay = normalizeArrowSpacing(gluedDayMatch[2]);
    date = gluedDayMatch[1].trim();
    day = day
      ? day.toLowerCase().includes(suffixDay.toLowerCase()) ? day : normalizeArrowSpacing(`${day} \u2192 ${suffixDay}`)
      : suffixDay;
  }

  return {
    date,
    day: day || '-',
  };
};

export const formatType = (type) => {
  if (type === 'ECOLE') return 'ECOLE';
  if (type === 'FERIE') return 'FERIE';
  return type || '-';
};

export const isAbsentSession = (entry) => entry?.attendance === 'ABSENT' || entry?.status === 'Absent';

export const isNonConnectionType = (entry) => entry?.type === 'ENTREPRISE' || entry?.type === 'FERIE';

export const formatDurationHHMMSS = (entry) => {
  if (isAbsentSession(entry)) return 'Absent';
  if (isNonConnectionType(entry)) return '-';

  if (/^\d{2}:\d{2}:\d{2}$/.test(entry?.durationFormatted || '')) return entry.durationFormatted;
  if (/^\d{2}:\d{2}:\d{2}$/.test(entry?.duration || '')) return entry.duration;

  const seconds = Number.isFinite(Number(entry?.durationSeconds))
    ? Number(entry.durationSeconds)
    : Math.round((Number(entry?.durationMinutes) || 0) * 60);
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const rest = safeSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
};

export const formatSessionTime = (entry, field, fallbackField = '') => {
  if (isAbsentSession(entry) || isNonConnectionType(entry)) return '';
  return entry?.[field] || (fallbackField ? entry?.[fallbackField] : '') || '';
};
