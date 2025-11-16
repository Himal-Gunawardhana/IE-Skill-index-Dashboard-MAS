import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Timestamp } from "firebase/firestore";

/**
 * Convert Firebase Timestamp to Date
 */
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

/**
 * Format date for display
 */
export const formatDate = (
  date: Date | Timestamp,
  formatStr: string = "MMM dd, yyyy"
): string => {
  const dateObj = date instanceof Timestamp ? timestampToDate(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format date and time for display
 */
export const formatDateTime = (date: Date | Timestamp): string => {
  return formatDate(date, "MMM dd, yyyy hh:mm a");
};

/**
 * Get date range for filtering
 */
export const getDateRange = (days: number): { start: Date; end: Date } => {
  const end = endOfDay(new Date());
  const start = startOfDay(subDays(end, days - 1));
  return { start, end };
};

/**
 * Check if date is within range
 */
export const isDateInRange = (
  date: Date | Timestamp,
  start: Date,
  end: Date
): boolean => {
  const dateObj = date instanceof Timestamp ? timestampToDate(date) : date;
  return dateObj >= start && dateObj <= end;
};

/**
 * Get last N days label
 */
export const getDateRangeLabel = (days: number): string => {
  if (days === 7) return "Last 7 days";
  if (days === 30) return "Last 30 days";
  if (days === 90) return "Last 3 months";
  return `Last ${days} days`;
};
