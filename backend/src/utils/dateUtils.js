// IST Timezone (UTC+5:30)
const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

/**
 * Get current time in IST
 */
export const getCurrentIST = () => {
    const now = new Date();
    const utcTime = now.getTime();
    const istTime = new Date(utcTime + IST_OFFSET);
    return istTime;
};

/**
 * Convert UTC date to IST for display
 */
export const toIST = (utcDate) => {
    if (!utcDate) return null;
    const date = new Date(utcDate);
    const utcTime = date.getTime();
    const istTime = new Date(utcTime + IST_OFFSET);
    return istTime;
};

/**
 * Get start of day in IST (as UTC for DB query)
 */
export const getISTDayStart = (date) => {
    const istDate = toIST(date);
    istDate.setHours(0, 0, 0, 0);
    // Convert back to UTC for DB query
    const utcTime = istDate.getTime() - IST_OFFSET;
    return new Date(utcTime);
};

/**
 * Get end of day in IST (as UTC for DB query)
 */
export const getISTDayEnd = (date) => {
    const istDate = toIST(date);
    istDate.setHours(23, 59, 59, 999);
    // Convert back to UTC for DB query
    const utcTime = istDate.getTime() - IST_OFFSET;
    return new Date(utcTime);
};

/**
 * Get month boundaries in IST timezone
 */
export const getISTMonthBoundaries = (year, month) => {
    // Create date in IST
    const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const istStart = toIST(startDate);
    istStart.setHours(0, 0, 0, 0);

    const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    const istEnd = toIST(endDate);
    istEnd.setHours(23, 59, 59, 999);

    // Convert back to UTC for DB query
    const startUTC = new Date(istStart.getTime() - IST_OFFSET);
    const endUTC = new Date(istEnd.getTime() - IST_OFFSET);

    return { startUTC, endUTC };
};

/**
 * Format date in IST for display
 */
export const formatIST = (utcDate, format = 'full') => {
    const istDate = toIST(utcDate);
    if (!istDate) return '';

    if (format === 'date') {
        return istDate.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'Asia/Kolkata'
        });
    } else if (format === 'time') {
        return istDate.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        });
    } else {
        return istDate.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        });
    }
};

/**
 * Get current month name in IST
 */
export const getCurrentISTMonth = () => {
    const istNow = getCurrentIST();
    return istNow.toLocaleDateString('en-US', { month: 'long', timeZone: 'Asia/Kolkata' });
};

/**
 * Get previous month name in IST
 */
export const getPreviousISTMonth = () => {
    const istNow = getCurrentIST();
    istNow.setMonth(istNow.getMonth() - 1);
    return istNow.toLocaleDateString('en-US', { month: 'long', timeZone: 'Asia/Kolkata' });
};

/**
 * Check if current date is early in IST month (first 7 days)
 */
export const isEarlyInISTMonth = () => {
    const istNow = getCurrentIST();
    return istNow.getDate() <= 7;
};