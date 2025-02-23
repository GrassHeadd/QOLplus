import * as DateUtils from "../utils/date.js";

export function spawnRibbonsForAllEvents(events, catColors) {
    const ribbonElemSet = [];

    events.forEach(event => {
        ribbonElemSet.push(spawnEventRibbons(event, catColors[event.category]));
    });

    return ribbonElemSet;
}

export function spawnEventRibbons(event, catColor) {
    const ribbonElems = [];

    var startDateObj = new Date(event.startDate), endDateObj = new Date(event.endDate);
    var totalDaysLeft = DateUtils.getDayNumBetween(startDateObj, endDateObj); // Total number of days the event spans across
    var curDate = new Date(startDateObj.getTime()); // For looping through the days
    var nextSundayDelta = DateUtils.getNextSundayDelta(curDate); // Count of how many days from curDate until the current week's sunday

    /* 1. GENERATE THE FIRST ROW'S RIBBON  */
    const firstRowLength = Math.min(nextSundayDelta + 1, totalDaysLeft); // Limit the ribbon length to the current sunday, from whichever day it starts from
    const firstRowRibbon = spawnEventRibbon(getDayElement(startDateObj), event, firstRowLength, catColor, true, firstRowLength == totalDaysLeft);
    ribbonElems.push(firstRowRibbon);
    totalDaysLeft -= firstRowLength; // Update counter

    /* 2. GENERATE ALL SUBSEQUENT ROWS' RIBBONS (IF NEEDED) */
    var rowsGenerated = 0;
    while (totalDaysLeft > 0) {
        var curRowLength = Math.min(7, totalDaysLeft); // Limit the current ribbon's length to 7 since it starts from monday

        // Calculate the date of current week/row's monday from the initial startDate
        // This is to retrieve the current parent monday element to append the ribbon to, since the each day has a class name corresponding to its Date object's string representation (without spaces)
        var curMondayDateObj = new Date(startDateObj.getTime());
        curMondayDateObj.setDate(curMondayDateObj.getDate() + firstRowLength + 7 * rowsGenerated);
        totalDaysLeft -= curRowLength; // Update counter not at end of loop because of "totalDaysLeft == 0" to check if this ribbon needs a right margin (i.e. if it is the last ribbon)
        const curRowRibbon = spawnEventRibbon(getDayElement(curMondayDateObj), event, curRowLength, catColor, false, totalDaysLeft == 0);
        ribbonElems.push(curRowRibbon);

        rowsGenerated++;
    }
    
    return ribbonElems;
}

function spawnEventRibbon(dayElem, event, length, catColor, hasLeftMargin, hasRightMargin) {
    /* 1. CREATING THE RIBBON ELEMENT */
    // Set up and inject the HTML into the webpage, then retrieve the ribbon for manipulation
    const ribbonHtmlStr =
        `<div class="eventRibbon">` +
        `   <div class="indicator"></div>` +
        `   <div class="title">${event.title}</div>` +
        `   <div class="time">${event.startTime}</div>` +
        `</div>`;
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

    return ribbonElem;
}

function getDayElement(dateObj) {
    return document.querySelector("#main .calendar .bottom .day." + dateObj.toDateString().replaceAll(" ", ""))
}