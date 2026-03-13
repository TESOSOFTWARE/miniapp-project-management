import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/**
 * Parses dates in the format "Wednesday, 31/12/2025" or standard formats
 */
export const parseSheetDate = (dateStr: string | null | undefined) => {
  if (!dateStr || typeof dateStr !== 'string') return null;

  // Handle "Friday, 27/3/2026"
  if (dateStr.includes(',')) {
    const parts = dateStr.split(',');
    if (parts.length > 1) {
      const actualDate = parts[1].trim(); // "31/12/2025"
      const parsed = dayjs(actualDate, 'D/M/YYYY');
      if (parsed.isValid()) return parsed;
    }
  }

  // Fallback to standard dayjs parsing
  const fallback = dayjs(dateStr);
  return fallback.isValid() ? fallback : null;
};

export const formatDisplayDate = (dateStr: string | null | undefined) => {
  const parsed = parseSheetDate(dateStr);
  return parsed ? parsed.format('MMM DD, YYYY') : 'TBD';
};

export const isDateOverdue = (dateStr: string | null | undefined) => {
  const parsed = parseSheetDate(dateStr);
  if (!parsed) return false;
  return parsed.isBefore(dayjs(), 'day');
};
