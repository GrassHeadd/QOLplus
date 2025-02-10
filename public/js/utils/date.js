/**
 * TODO Add JSDocs
 */
export function getNextSundayDelta(date) {
    return 7 - (date.getDay() == 0 ? 7 : date.getDay());
}

/**
 * TODO Add JSDocs
 */
// Get Date Object given DOM and MY
export function getDateFromFormatted(dom, my) {
    return new Date(parseInt((my + "").slice(0, 4)),
        parseInt((my + "").slice(4, 6)) - 1, dom);
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

/**
 * TODO Add JSDocs
 */
// Returns JavaScript Object from user input field in the format HHMM DD/MM/YYYY
export function getDateFromInputFieldFormat(input) {
    const hhmmStr = input.split(" ")[0], ddmmyyyyStr = input.split(" ")[1];
    const hr = parseInt(hhmmStr.slice(0, 2)), min = parseInt(hhmmStr.slice(2, 4));
    if (hr < 0 || hr > 23) {
        alert("hour is kinda scuffed");
        return null;
    }
    if (min < 0 || hr > 59) {
        alert("minute is kinda scuffed");
        return null;
    }

    // 2359 31/ 12/2012 [31, 12, 2012]

    const dd = parseInt(ddmmyyyyStr.split("/")[0]) //"31"
    if (dd < 1 || dd > 31) {
        alert("Your father");
        return null;
    }
    const mm = parseInt(ddmmyyyyStr.split("/")[1])// "12"
    if (mm < 1 || mm > 12) {
        alert("Your mother");
        return null;
    }
    var yyyy = parseInt(ddmmyyyyStr.split("/")[2]) // "2012" /25
    if (ddmmyyyyStr.split("/")[2].length == 2) {
        yyyy += 2000;
    } else if (!ddmmyyyyStr.split("/")[2].length == 4) {
        alert("Screw you enter a proper year format :/ (i.e. either YY or YYYY)");
        return null;
    }

    return new Date(yyyy, mm - 1, dd, hr, min, 0);
}