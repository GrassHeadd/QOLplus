/**
 * TODO Add JSDocs
 */
export function getNextSundayDelta(date) {
    return 7 - (date.getDay() == 0 ? 7 : date.getDay());
}

/**
 * TODO Add JSDocs
 */
// Get number of days between start date and end date + 1 (so if it's the same day it'll be 1)
export function getDayNumBetween(startDate, endDate) {
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
}

/**
 * TODO Add JSDocs
 */
export function getYYYYMMFromDateObj(dateObj) {
    return parseInt(dateObj.getFullYear() + "" + ((dateObj.getMonth() + 1) < 10
        ? "0" + (dateObj.getMonth() + 1)
        : (dateObj.getMonth() + 1)));
}

// YYYY-MM-DD
export function getDateStrForBackend(dateObj) {
    return dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
}

export function getCreateEventDateFormatStr(time, date) {
    return time < 1000 ? "0" + time : time +
           " " + date;
}