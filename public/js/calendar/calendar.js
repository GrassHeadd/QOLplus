import * as DateUtils from "../utils/date.js";
import * as DaySelector from "./daySelector.js"

/* Format
    {
        2024: {
            2: { // monthIndex + 1
                1: { // Day Of Month
                    0: { // Ribbon Index
                        eventId: 3, // Event ID
                        startTime: 1000,
                    }  
                },
                2: {
                    1: {
                        eventId: 4,
                        startTime: 1200
                    },
                    3: {
                    }
                },
                ...
            },
            ...
        },
        ...
    }
*/
const ribbonRenderOrderMap = {};
var calMinDate, calMaxDate;

/* =====[ CALENDAR CREATION ]===== */
export function loadInitialMonths(plusMinusAmt) {
    // No arguments in Date constructor = today's date
    // Using 0 as "day" automatically sets the date to the last day of the previous month, hence some currMonthIndex + 1
    const currMonthDate = new Date(), currYear = currMonthDate.getFullYear(), currMonthIndex = currMonthDate.getMonth();
    const currMonthStartDate = new Date(currYear, currMonthIndex, 1), startMonthDate = new Date(currYear, currMonthIndex - plusMinusAmt, 1), endMonthDate = new Date(currYear, currMonthIndex + plusMinusAmt + 1, 0);

    calMinDate = new Date(startMonthDate.getTime());
    calMaxDate = new Date(endMonthDate.getTime());

    // dowOfFdom = Day of week of the first day of start month
    // Date.getDay() returns 0-6 Sunday to Monday, so this formula converts it to 1-7 Monday to Sunday for convenience
    const dowOfFirstOfCurrMth = (currMonthStartDate.getDay() + 7) % 8 + Math.ceil(currMonthStartDate.getDay() / 8), dowOfFirstOfStartMth = (startMonthDate.getDay() + 7) % 8 + Math.ceil(startMonthDate.getDay() / 8);
    const endMonthDateStr = endMonthDate.toDateString(), dayDisplayElem = document.querySelector("#main .calendar .bottom .dayDisplay");

    // Temporarily create empty day elements to fill up any extra space before the 1st day of the start month (e.g. starts on thursday, make 3 empty day elements)
    for (var i = dowOfFirstOfStartMth - 1; i > 0; i--) {
        dayDisplayElem.innerHTML += "<div class=\"day\"><div>";
    }

    // Creation of all date elements between startMonthDate and endMonthDate
    const dayElems = [];
    while (true) {
        if (startMonthDate.toDateString() == endMonthDateStr) break;

        const dayElem = addDayElement(dayDisplayElem, startMonthDate);
        dayElems.push(dayElem);

        startMonthDate.setDate(startMonthDate.getDate() + 1);
    }
    // Pass to DaySelector to register the day selection event
    DaySelector.initListeners(dayElems);

    // Snap to the first day of the current month
    getDayElement(currMonthStartDate).scrollIntoView();

    // The default view can only show up to 5 rows, hence we check and move it down by 1 if the current date happens to past the 5th row
    // E.g. 30 September 2024 is on the 6th row of the month
    if (dowOfFirstOfCurrMth - 1 + currMonthDate.getDate() > 35) {
        getDayElement(new Date(currYear, currMonthIndex, 8)).scrollIntoView();
    }
}

// Finds and styles the day element's marker (i.e. orange circle) to indicate the current day
export function indicateCurrentDay() {
    const todayDateClassName = DateUtils.getClassNameFromDateObj(new Date());
    const todayElement = document.querySelector("#main .calendar .bottom .day." + todayDateClassName);
    todayElement.classList.add("today");
}

function clearRibbons() {
    document.querySelectorAll(".eventRibbon").forEach(ribbon => ribbon.remove());
}

// Adds a day element to the calendar area and returns the newly created day element
function addDayElement(calendarArea, dateObj) {
    calendarArea.insertAdjacentHTML('beforeend', createDayElementHTMLStr(dateObj));
    return calendarArea.children[calendarArea.children.length - 1];
}

// Creates HTML string for a day element, given a Date object
function createDayElementHTMLStr(dateObj) {
    return "<div class=\"day " + DateUtils.getClassNameFromDateObj(dateObj) + "\">" +
        "   <div class=\"date dayMarker\">" + dateObj.getDate() + "</div>" +
        "   <div class=\"ribbons\"></div>" +
        "</div>";
}

// Get min and max dates for the calendar's view for event fetching / preventing out of bound logic
export function getCalendarViewableRange() {
    return { minDate: calMinDate, maxDate: calMaxDate};
}


/* =====[ EVENT RIBBONS ]===== */
export function spawnRibbonsForAllEvents(events, catColors) {
    clearRibbons();
    const ribbonElemSet = [];

    events.forEach(event => {
        ribbonElemSet.push(spawnEventRibbons(event, catColors[event.category]));
    });

    return ribbonElemSet;
}

// Can be called multiple time for the overlapping weeks when rendering adjacent months
export function renderWeekRibbons(weekStart, weekEnd, weekEvents, catColors) {
    /* 
        Render order logic:
        1. Ribbon sorted by start time; ribbons with no start time has highest priority
        1.5(?) Ribbon further sorted by how long it spans, largest taking highest priority
        2. Function to calculate the lowest index that a ribbon can place for each day it occurs in
            - Ribbon order will be the lowest index across all indices returned
            - E.g. Event spans Mon-Wed, Mon has no events, Tue has 1 event before cur event, Wed has 3 events after cur event, then it will render at index 1
    */

    const ribbonMap = {};

    // Sort all events across the week by start time
    weekEvents.sort((event1, event2) => {
        if (!event1.startTime) return -1;
        if (!event2.startTime) return 1;
        return parseInt(event1.startTime) - parseInt(event2.startTime);
    });

    // Calculate the index that a ribbon should be placed, then render it using that index
    weekEvents.forEach(event => {
        const startDate = new Date(event.startDate), endDate = new Date(event.endDate);

        // If event is already rendered (by previous months), skip
        if (isEventAlreadyRendered(event, startDate)) return;

        if (startDate.getTime() > calMinDate.getTime() && endDate.getTime() < calMaxDate.getTime()) {
            const lowestIndex = getLowestIndexWithinWeek(event);
            setRibbonIndexForRange(event, lowestIndex);

            const dayIndex = event.startDate.getDay() == 0 ? 6 : event.startDate.getDay() - 1;

            const ribbons = spawnEventRibbons(event, lowestIndex, ribbonRenderOrderMap[startDate.getFullYear() + ""][startDate.getMonth() + 1][startDate.getDate()], catColors[event.category]);
            ribbonMap[event.eventId] = ribbons;
        }
    });

    return ribbonMap;
}

// Register a ribbon's render index for each day it occurs in (so other ribbons cannot use it)
function setRibbonIndexForRange(event, index) {
    var curDate = new Date(event.startDate.getTime());
    // For every day that the event occurs in the week, register the event in the ribbonRenderOrderMap
    for (var i = 7 - (curDate.getDay() == 0 ? 6 : curDate.getDay() - 1); i > 0; i--) {
        const yearStr = curDate.getFullYear() + "", monthStr = (curDate.getMonth() + 1) + "", dayOfMonthStr = curDate.getDate() + "";
        if (ribbonRenderOrderMap[yearStr] == undefined) ribbonRenderOrderMap[yearStr] = {};
        if (ribbonRenderOrderMap[yearStr][monthStr] == undefined) ribbonRenderOrderMap[yearStr][monthStr] = {};
        if (ribbonRenderOrderMap[yearStr][monthStr][dayOfMonthStr] == undefined) ribbonRenderOrderMap[yearStr][monthStr][dayOfMonthStr] = {};
        ribbonRenderOrderMap[yearStr][monthStr][dayOfMonthStr][index] = { eventId: event.eventId, startTime: event.startTime };
        curDate.setDate(curDate.getDate() + 1);
    }
}

function isEventAlreadyRendered(event, startDate) {
    if (ribbonRenderOrderMap[startDate.getFullYear() + ""] == undefined) return false;    
    if (ribbonRenderOrderMap[startDate.getFullYear() + ""][startDate.getMonth() + 1] == undefined) return false;    
    if (ribbonRenderOrderMap[startDate.getFullYear() + ""][startDate.getMonth() + 1][startDate.getDate()] == undefined) return false;    
    for (var index in ribbonRenderOrderMap[startDate.getFullYear() + ""][startDate.getMonth() + 1][startDate.getDate()]) {
        if (ribbonRenderOrderMap[startDate.getFullYear() + ""][startDate.getMonth() + 1][startDate.getDate()][index].eventId == event.eventId) return true;
    }
    return false;
}

// Gets the lowest index that a ribbon can be placed given its occurence range
function getLowestIndexWithinWeek(event) {
    var highestIndex = -1, curDate = new Date(event.startDate.getTime());
    // Return the lowest index across all days the event occurs in
    for (var i = 7 - (curDate.getDay() == 0 ? 6 : curDate.getDay() - 1); i > 0; i--) {
        const lowestIndexForCurDay = getLowestIndexForDay(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
        if (highestIndex == -1 || lowestIndexForCurDay > highestIndex) highestIndex = lowestIndexForCurDay;
        curDate.setDate(curDate.getDate() + 1);
    }
    return highestIndex;
}

// Gets the lowest index that a ribbon can be placed for a specific day
function getLowestIndexForDay(year, month, dayOfMonth) {
    if (ribbonRenderOrderMap[year] == undefined || ribbonRenderOrderMap[year][month] == undefined || ribbonRenderOrderMap[year][month][dayOfMonth] == undefined) return 0;
    const dayMap = ribbonRenderOrderMap[year][month][dayOfMonth];
    var index = 0;
    if (dayMap.length == 0) return index;
    while (true) {
        // If index already exists, increment
        if (dayMap[index] != undefined) {
            index++;
            continue;
        }
        return index;
    }
}

// Gets the marginTop CSS for a ribbon, given its index
function getRibbonMarginTopCSS(event, index, dayArray) {
    var highestBeforeIndex = 0;
    for (const eachIndex in dayArray) {
        if (eachIndex < index && eachIndex > highestBeforeIndex) highestBeforeIndex = eachIndex;
    }
    // 3 cases: Ribbons before this in same box, Ribbons before this in other box, First ribbon in box
    if (highestBeforeIndex == 0 && index == 0) return "0";
    if (highestBeforeIndex == 0) {
        // Index means how many ribbon spaces it should skip
        // 11% for height, 8px for both top and bottom padding of each ribbon, 7px for spacing between ribbons
        // (unsure why it's 8 for padding since CSS says 5px top and bottom which adds up to 10, :/)
        return "calc(" + (index * 11) + "% + " + (7 + index * 8) + "px)";
    }
    return "calc(" + ((index - highestBeforeIndex - 1) * 11) + "% + " + ((index - highestBeforeIndex - 1) * 7 + (index - highestBeforeIndex) * 8) + "px)";
}

export function spawnEventRibbons(event, index, weekArray, catColor) {
    const startDateObj = new Date(event.startDate), endDateObj = new Date(event.endDate);
    const totalDaysLeft = DateUtils.getDayNumBetween(startDateObj, endDateObj); // Total number of days the event spans across
    const marginTopMult = getRibbonMarginTopCSS(event, index, weekArray);

    const firstRowRibbon = spawnEventRibbon(getDayRibbonListElement(startDateObj), event, totalDaysLeft, catColor, !event.hasPrevious, !event.hasNext, marginTopMult);
    return firstRowRibbon;
}

function spawnEventRibbon(ribbonListElem, event, length, catColor, hasLeftMargin, hasRightMargin, marginTop) {
    const ribbonHtmlStr = createRibbonHTMLStr(event);

    /* 1. CREATING THE RIBBON ELEMENT */
    // Set up and inject the HTML into the webpage, then retrieve the ribbon for manipulation
    ribbonListElem.insertAdjacentHTML('beforeend', ribbonHtmlStr);
    const allDayEvents = ribbonListElem.querySelectorAll(".eventRibbon"),
        ribbonElem = allDayEvents[allDayEvents.length - 1];


    /* 2. STYLING THE RIBBON ELEMENT */
    // Adjust margins according to whether it has a previous row and/or has a next row
    if (!hasLeftMargin) {
        ribbonElem.style.marginLeft = 0;
        ribbonElem.style.borderTopLeftRadius = 0;
        ribbonElem.style.borderBottomLeftRadius = 0;
    }
    if (!hasRightMargin) {
        ribbonElem.style.marginRight = 0;
        ribbonElem.style.borderTopRightRadius = 0;
        ribbonElem.style.borderBottomRightRadius = 0;
    }

    // Set the color of the ribbon's indicator
    ribbonElem.querySelector(".indicator").style.backgroundColor = catColor;

    // TODO - Some weirdness here - on RR's large monitor, 18px works, but on the laptop, 19px is the minimum (else horizontal scrollbar shows)
    // Correct the width of the ribbon according to how many days it spans across and whether it has a previous and/or next row
    ribbonElem.style.width = "calc(" + (100 * length) + "% - " + (hasLeftMargin
        ? (hasRightMargin ? 28 : 19)
        : (hasRightMargin ? 19 : 8)) + "px)";

    // if (marginTopMult > 0) ribbonElem.style.marginTop = "calc(" + (marginTopMult * 22) + "% + " + (27 + (marginTopMult - 1) * 5) + "px";
    ribbonElem.style.marginTop = marginTop;

    // console.log(marginTopMult, ribbonElem, "");

    return ribbonElem;
}

function createRibbonHTMLStr(event) {
    return `<div class="eventRibbon eventId${event.eventId}">` +
        `   <div class="indicator"></div>` +
        `   <div class="title">${event.title}</div>` +
        `   <div class="time">${event.startTime}</div>` +
        `</div>`;
}

export function getDayElement(dateObj) {
    return document.querySelector("#main .calendar .bottom .day." + DateUtils.getClassNameFromDateObj(dateObj));
}

function getDayRibbonListElement(dateObj) {
    if (!getDayElement(dateObj)) return null; 
    return getDayElement(dateObj).querySelector(".ribbons");
}