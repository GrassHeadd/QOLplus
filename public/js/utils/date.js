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

// Requires Date Objects for all 4 parameters
export function doesStartEndOccupyRange(startObj, endObj, rangeStartObj, rangeEndObj) {
    const start = startObj.getTime(), end = endObj.getTime(), rangeStart = rangeStartObj.getTime(), rangeEnd = rangeEndObj.getTime();
    return (start >= rangeStart && start <= rangeEnd) || // If the start date is within the range
           (end >= rangeStart && end <= rangeEnd) || // If the end date is within the range
           (start <= rangeStart && end >= rangeEnd); // If the range is within the start and end date
}

// Converts Date Object into a string meant for className
// Format is dateIsYYYYMMDD (e.g. dateIs20250327)
export function getClassNameFromDateObj(dateObj) {
    const year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var date = dateObj.getDate();
    if (date < 10) {
        date = "0" + date;
    }
    return "dateIs" + year + month + date;
}

// Converts className string into Date Object
export function getDateObjFromClassName(className) {
    const dateArr = className.replace("dateIs", "");
    const year = parseInt(dateArr.substring(0, 4));
    const month = parseInt(dateArr.substring(4, 6));
    const date = parseInt(dateArr.substring(6, 8));
    return new Date(year, month - 1, date);
}

export function doesDateOccurInRange(dateObj, startDateObj, endDateObj) {
    console.log("Checking " + dateObj.toDateString().replace(" ", "") + " against " + startDateObj.toDateString().replace(" ", "") + " and " + endDateObj.toDateString().replace(" ", "") + ": " + dateObj.getTime() + " and " + endDateObj.getTime() + " and " + startDateObj.getTime());
    return dateObj.getTime() >= startDateObj.getTime() && dateObj.getTime() <= endDateObj.getTime();
}