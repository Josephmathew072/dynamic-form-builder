// Utility functions for consistent date handling across timezones

/**
 * Get start of day in local timezone as UTC for database query
 */
export const getLocalDayStart = (date) => {
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  return new Date(localDate.toISOString());
};

/**
 * Get end of day in local timezone as UTC for database query
 */
export const getLocalDayEnd = (date) => {
  const localDate = new Date(date);
  localDate.setHours(23, 59, 59, 999);
  return new Date(localDate.toISOString());
};

/**
 * Get month boundaries in local timezone
 */
export const getMonthBoundaries = (year, month) => {
  const start = new Date(year, month, 1);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(year, month + 1, 0);
  end.setHours(23, 59, 59, 999);
  
  return {
    start: new Date(start.toISOString()),
    end: new Date(end.toISOString())
  };
};

/**
 * Format date for display in API responses (keep as UTC, frontend will format)
 */
export const formatDateForAPI = (date) => {
  return date;
};