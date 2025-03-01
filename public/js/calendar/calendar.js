import * as DateUtils from "../utils/date.js";

const weekMap = {};

export function loadInitialMonths(plusMinusAmt) {
    // No arguments in Date constructor = today's date
    // Using 0 as "day" automatically sets the date to the last day of the previous month, hence some currMonthIndex + 1
    const currMonthDate = new Date(), currYear = currMonthDate.getFullYear(), currMonthIndex = currMonthDate.getMonth();
    const currMonthStartDate = new Date(currYear, currMonthIndex, 1), startMonthDate = new Date(currYear, currMonthIndex - plusMinusAmt, 1), endMonthDate = new Date(currYear, currMonthIndex + plusMinusAmt + 1, 0);

    // dowOfFdom = Day of week of the first day of start month
    // Date.getDay() returns 0-6 Sunday to Monday, so this formula converts it to 1-7 Monday to Sunday for convenience
    const dowOfFirstOfCurrMth = (currMonthStartDate.getDay() + 7) % 8 + Math.ceil(currMonthStartDate.getDay() / 8), dowOfFirstOfStartMth = (startMonthDate.getDay() + 7) % 8 + Math.ceil(startMonthDate.getDay() / 8);
    const endMonthDateStr = endMonthDate.toDateString(), dayDisplayElem = document.querySelector("#main .calendar .bottom .dayDisplay");

    // Temporarily create empty day elements to fill up any extra space before the 1st day of the start month (e.g. starts on thursday, make 3 empty day elements)
    for (var i = dowOfFirstOfStartMth - 1; i > 0; i--) {
        dayDisplayElem.innerHTML += "<div class=\"day\"><div>";
    }

    // Creation of all date elements between startMonthDate and endMonthDate
    while (true) {
        if (startMonthDate.toDateString() == endMonthDateStr) break;

        addDayElement(dayDisplayElem, startMonthDate);

        startMonthDate.setDate(startMonthDate.getDate() + 1);
    }

    // Snap to the first day of the current month
    dayDisplayElem.querySelector("." + currMonthStartDate.toDateString().replaceAll(" ", "")).scrollIntoView();

    // The default view can only show up to 5 rows, hence we check and move it down by 1 if the current date happens to past the 5th row
    // E.g. 30 September 2024 is on the 6th row of the month
    if (dowOfFirstOfCurrMth - 1 + currMonthDate.getDate() > 35) {
        dayDisplayElem.getElementsByClassName(new Date(currYear, currMonthIndex, 8).toDateString().replaceAll(" ", ""))[0].scrollIntoView();
    }
}

// Finds and styles the day element's marker (i.e. orange circle) to indicate the current day
export function indicateCurrentDay() {
    const todayElement = document.querySelector("#main .calendar .bottom .day." + new Date().toDateString().replaceAll(" ", ""));
    todayElement.classList.add("today");
}

// Adds a day element to the calendar area and returns the newly created day element
function addDayElement(calendarArea, dateObj) {
    calendarArea.insertAdjacentHTML('beforeend', createDayElementHTMLStr(dateObj));
    return calendarArea.children[calendarArea.children.length - 1];
}

// Creates HTML string for a day element, given a Date object
function createDayElementHTMLStr(dateObj) {
    return "<div class=\"day " + dateObj.toDateString().replaceAll(" ", "") + "\">" +
           "   <div class=\"date dayMarker\">" + dateObj.getDate() + "</div>" +
           "</div>";
}


/* =====[ EVENTS ]===== */
export function spawnRibbonsForAllEvents(events, catColors) {
    const ribbonElemSet = [];

    events.forEach(event => {
        ribbonElemSet.push(spawnEventRibbons(event, catColors[event.category]));
    });

    return ribbonElemSet;
}

export function renderWeekRibbons(weekStart, weekEnd, weekEvents, catColors) {
    /* 
        Render order logic:
        1. Ribbon sorted by start time; ribbons with no start time has highest priority
        1.5(?) Ribbon further sorted by how long it spans, largest taking highest priority
        2. Function to calculate the lowest index that a ribbon can place for each day it occurs in
            - Ribbon order will be the lowest index across all indices returned
            - E.g. Event spans Mon-Wed, Mon has no events, Tue has 1 event before cur event, Wed has 3 events after cur event, then it will render at index 1
    */

    const ribbonMap = {}, dayMap = [[], [], [], [], [], [], []];

    // Sort all events across the week by start time
    weekEvents.sort((event1, event2) => {
        if (!event1.startTime) return -1;
        if (!event2.startTime) return 1;
        return parseInt(event1.startTime) - parseInt(event2.startTime);
    });

    // Calculate the index that a ribbon should be placed, then render it using that index
    weekEvents.forEach(event => {
        const lowestIndex = getLowestIndexWithinRange(event, dayMap);
        setRibbonIndexForRange(event, dayMap, lowestIndex);

        const dayIndex = event.startDate.getDay() == 0 ? 6 : event.startDate.getDay() - 1;
        const ribbons = spawnEventRibbons(event, lowestIndex, dayMap[dayIndex], catColors[event.category]);
        ribbonMap[event.eventId] = ribbons;
    });

    return ribbonMap;
}

// Register a ribbon's render index for each day it occurs in (so other ribbons cannot use it)
function setRibbonIndexForRange(event, dayMap, index) {
    var curDate = new Date(event.startDate.getTime());
    for (var curDay = curDate.getDay() == 0 ? 6 : curDate.getDay() - 1; curDay < 7; curDay++) {
        dayMap[curDay][index] = index;
    }
}

// Gets the lowest index that a ribbon can be placed given its occurence range
function getLowestIndexWithinRange(event, weekArray) {
    var highestIndex = -1, curDate = new Date(event.startDate.getTime()), endDay = event.endDate.getDay() == 0 ? 6 : event.endDate.getDay() - 1;
    // Return the lowest index across all days the event occurs in
    for (var curDay = curDate.getDay() == 0 ? 6 : curDate.getDay() - 1; curDay <= endDay; curDay++) {
        const lowestIndexForCurDay = getLowestIndexForDay(event, weekArray[curDay]);
        if (highestIndex == -1 || lowestIndexForCurDay > highestIndex) highestIndex = lowestIndexForCurDay;
    }
    return highestIndex;
}

// Gets the multiplier for marginTop for a ribbon, given its index (e.g. index 4, highest index before it is 2, multiplier is 4-2 = 2)
function getRibbonMarginTopMultiplier(event, index, dayArray) {
    var highestBeforeIndex = 0;
    dayArray.forEach(eachIndex => {
        if (eachIndex < index && eachIndex > highestBeforeIndex) highestBeforeIndex = eachIndex;
    });
    return index - highestBeforeIndex;
}

// Gets the lowest index that a ribbon can be placed for a specific day
function getLowestIndexForDay(event, dayArray) {
    var index = 0;
    if (dayArray.length == 0) return index;
    while (true) {
        if (dayArray.find(eachIndex => eachIndex == index) != undefined) {
            index++;
            continue;
        }
        return index;
    }
}

export function spawnEventRibbons(event, index, weekArray, catColor) {
    const startDateObj = new Date(event.startDate), endDateObj = new Date(event.endDate);
    const totalDaysLeft = DateUtils.getDayNumBetween(startDateObj, endDateObj); // Total number of days the event spans across
    const marginTopMult = getRibbonMarginTopMultiplier(event, index, weekArray);

    const firstRowRibbon = spawnEventRibbon(getDayElement(startDateObj), event, totalDaysLeft, catColor, !event.hasPrevious, !event.hasNext, marginTopMult);
    return firstRowRibbon;
}

function spawnEventRibbon(dayElem, event, length, catColor, hasLeftMargin, hasRightMargin, marginTopMult) {
    const ribbonHtmlStr = createRibbonHTMLStr(event);

    /* 1. CREATING THE RIBBON ELEMENT */
    // Set up and inject the HTML into the webpage, then retrieve the ribbon for manipulation
    dayElem.insertAdjacentHTML('beforeend', ribbonHtmlStr);
    const allDayEvents = dayElem.querySelectorAll(".eventRibbon"),
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

    if (marginTopMult > 0) ribbonElem.style.marginTop = "calc(" + (marginTopMult * 22) + "% + " + (27 + (marginTopMult - 1) * 5) + "px";

    // console.log(marginTopMult, ribbonElem, "");

    return ribbonElem;
}

function createRibbonHTMLStr(event) {
    return `<div class="eventRibbon">` +
           `   <div class="indicator"></div>` +
           `   <div class="title">${event.title}</div>` +
           `   <div class="time">${event.startTime}</div>` +
           `</div>`;
}

function getDayElement(dateObj) {
    return document.querySelector("#main .calendar .bottom .day." + dateObj.toDateString().replaceAll(" ", ""))
}