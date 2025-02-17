import * as DateUtils from "../utils/date.js";
import * as ColorUtils from "../utils/color.js";

export function loadInitialMonths(plusMinusAmt) {
    /* =================[ vv Variable Setup vv ]================= */
    // No arguments in Date constructor = today's date
    // Using 0 as "day" automatically sets the date to the last day of the previous month, hence some currMonthIndex + 1
    const currMonthDate = new Date(), currYear = currMonthDate.getFullYear(), currMonthIndex = currMonthDate.getMonth();
    const currMonthStartDate = new Date(currYear, currMonthIndex, 1), startMonthDate = new Date(currYear, currMonthIndex - plusMinusAmt, 1), endMonthDate = new Date(currYear, currMonthIndex + plusMinusAmt + 1, 0);

    // dowOfFdom = Day of week of the first day of start month
    // Date.getDay() returns 0-6 Sunday to Monday, so this formula converts it to 1-7 Monday to Sunday for convenience
    const dowOfFirstOfCurrMth = (currMonthStartDate.getDay() + 7) % 8 + Math.ceil(currMonthStartDate.getDay() / 8), dowOfFirstOfStartMth = (startMonthDate.getDay() + 7) % 8 + Math.ceil(startMonthDate.getDay() / 8);

    const endMonthDateStr = endMonthDate.toDateString();
    const dayDisplayElem = document.getElementById("main").getElementsByClassName("calendar")[0].getElementsByClassName("bottom")[0].getElementsByClassName("dayDisplay")[0];

    /* =====================[ vv Main Logic vv ]===================== */

    // This loop temporarily creates day items to fill up any extra space before the 1st day of the start month
    // TODO: In dynamic loading, remove these when the other months load in the background (otherwise there'll be duplicates)
    for (var i = dowOfFirstOfStartMth - 1; i > 0; i--) {
        dayDisplayElem.innerHTML += "<div class=\"day\"><div>";
    }

    // Handles creation of all date elements between startMonthDate and endMonthDate
    while (true) {
        if (startMonthDate.toDateString() == endMonthDateStr) break;

        var eventsHtml = "";
        /*"<div class=\"events\">" +
              "<div class=\"item gym\">" +
              "<div class=\"marker\"></div>" +
              "<div class=\"label\">" + labelText + "</div>" +
              "<div class=\"amount\">" + timeText + "</div>" +
          "</div>" +
        "</div>";
        */

        dayDisplayElem.innerHTML +=
            "<div class=\"day " + startMonthDate.toDateString().replaceAll(" ", "") + "\">" +
            "<div class=\"date dayMarker\">" + startMonthDate.getDate() + "</div>"
            + eventsHtml +
            "</div>";

        startMonthDate.setDate(startMonthDate.getDate() + 1);
    }

    // Snap to the first day of the current month;
    dayDisplayElem.getElementsByClassName(currMonthStartDate.toDateString().replaceAll(" ", ""))[0].scrollIntoView();

    // The default view can only show up to 5 rows, hence we check and move it down by 1 if the current date happens to past the 5th row
    // E.g. 30 September 2024 is on the 6th row of the month
    if (dowOfFirstOfCurrMth - 1 + currMonthDate.getDate() > 35) {
        dayDisplayElem.getElementsByClassName(new Date(currYear, currMonthIndex, 8).toDateString().replaceAll(" ", ""))[0].scrollIntoView();
    }
}

export function loadOtherMonths() {

}

export function indicateCurrentDay() {
    // // Grab current day and then the date as number
    // const currDate = new Date(); //get date
    // var currDateNum = currDate.getDate(); //get day

    // // Grab all 35 day HTML elements
    // const allDayElements = document
    //   .getElementsByClassName("dayDisplay")[0]
    //   .getElementsByClassName("day");

    // // Loop through the 35 HTMl elements
    // for (var i = 0; i < allDayElements.length; i++) {
    //   const dayElement = allDayElements[i];

    //   // Find which one has a date number that matches the current day, then add the "today" class to it so the CSS kicks into effect
    //   if (dayElement.getElementsByClassName("date")[0].innerHTML == currDateNum) {
    //     dayElement.getElementsByClassName("date")[0].classList.add("today");
    //   } //add the class for css to the day that is today
    // }
}

// Handles event fetching from backend & frontend displaying of events
export async function loadEvents() {
    try {
        const userId = 1;
        const todayDateObj = new Date();
        const dateStr = DateUtils.getDateStrForBackend(todayDateObj);
        const response = await fetch("http://localhost:3000/events/" + userId + "/month/" + dateStr);
        // Live Backend Link: https://qo-lplus.vercel.app/events/...
        const data = await response.json();

        console.log("Events:", data.data);

        const events = data.data, eventColours = [];
        var eventItinElems = [], eventRowElems = [];

        /* 1. Sort the events by start date so events with earlier dates are created at the top of the event ribbon stack */
        events.sort((event1, event2) =>
            DateUtils.getDateFromFormatted(event1.start_dayofmonth, event1.start_monthyear).getTime() -
            DateUtils.getDateFromFormatted(event2.start_dayofmonth, event2.start_monthyear).getTime());

        events.forEach(event => {
            const eventId = event.eventId,
                title = event.title,
                category = event.category,
                startDate = event.startDate,
                endDate = event.endDate,
                startTime = event.startTime,
                endTime = event.endTime,
                location = event.location,
                notes = event.notes;

            var rowElems = [];

            /* 2 Generate a random colour for each event */
            const colourStr = ColorUtils.getRandomColorStr(eventColours);
            eventColours.push(colourStr);

            /* 3. Generate Itinerary item */
            const eventElement =
                `<div class="item ${category}">` +
                '  <div class="left">' +
                `    <div class="period"> ${startTime}hr<br>-<br>${endTime}hr</div>` +
                '  </div>' +
                '  <div class="right">' +
                `    <div class="title"> ${title}</div>` +
                `    <div class="info">${notes}</div>` +
                '  </div>' +
                '  <span class="moreBtn material-symbols-outlined">more_vert</span>' +
                '  <div class="moreBtnPopup">' +
                '    <div class="inner">' +
                '      <div class="moreOptionBtn deleteBtn material-symbols-outlined">delete</div>' +
                '    </div>' +
                '  </div>' +
                '</div>';

            document.getElementById("main").getElementsByClassName("inspector")[0]
                .getElementsByClassName("itinerary")[0]
                .insertAdjacentHTML("beforeend", eventElement);
            const allItinElems = document.getElementById("main")
                .getElementsByClassName("inspector")[0]
                .getElementsByClassName("itinerary")[0]
                .getElementsByClassName("item"),
                eventItinElem = allItinElems[allItinElems.length - 1];

            eventItinElem.getElementsByClassName("left")[0]
                .style.backgroundColor = colourStr;

            var startDateObj = DateUtils.getDateFromFormatted(startDate, startTime),
                endDateObj = DateUtils.getDateFromFormatted(endDate, endTime);
            var dayCount = DateUtils.getDayNumBetween(startDateObj, endDateObj);

            const parentDayElem = document.getElementById("main")
                .getElementsByClassName("calendar")[0]
                .getElementsByClassName("bottom")[0]
                .getElementsByClassName(startDateObj.toDateString()
                    .replaceAll(" ", ""))[0];
            var curDate = new Date(startDateObj.getTime());
            var nextSundayDelta = DateUtils.getNextSundayDelta(curDate);

            /* 4. Generate the first row's ribbon  */
            const firstRowLength = Math.min(nextSundayDelta + 1, dayCount);
            dayCount -= firstRowLength;
            const firstRowElem = spawnEventRibbon(parentDayElem, event, firstRowLength, colourStr, true, dayCount == 0);
            rowElems.push(firstRowElem);

            /* 5. Generate all subsequent row's ribbons */
            var fullRowCounter = 0;
            while (dayCount > 0) {
                var curRowLength = Math.min(7, dayCount);
                var mondayDate = new Date(startDateObj.getTime());
                mondayDate.setDate(mondayDate.getDate() + firstRowLength + 7 * fullRowCounter);
                const mondayElem = document.getElementById("main")
                    .getElementsByClassName("calendar")[0]
                    .getElementsByClassName("bottom")[0]
                    .getElementsByClassName(mondayDate.toDateString()
                        .replaceAll(" ", ""))[0];
                dayCount -= curRowLength;
                const curRowRibbon = spawnEventRibbon(mondayElem, event, curRowLength, colourStr, false, dayCount == 0);
                rowElems.push(curRowRibbon);
                fullRowCounter++;
            }

            eventItinElems.push(eventItinElem);
            eventRowElems.push(rowElems);

            // Register event delete button once all cards and ribbons are created (so it can grab them to delete too)
            eventItinElem.querySelector(".deleteBtn").addEventListener("click", (event) => {
                deleteEvent(eventId, eventItinElem, rowElems);
            });
        });

        // Hover-active state linking between itninerary cards and calendar ribbons
        eventItinElems.forEach((itinElem, index) => {

            itinElem.addEventListener("mouseenter", event => {
                eventRowElems[index].forEach(rowElem => {
                    if (!rowElem.classList.contains("active"))
                        rowElem.classList.add("active");
                });
            });

            itinElem.addEventListener("mouseleave", event => {
                eventRowElems[index].forEach(rowElem => {
                    if (rowElem.classList.contains("active"))
                        rowElem.classList.remove("active");
                });
            });
        });

        // Each Row Item actives all others when hovered over
        eventRowElems.forEach(rowGroup => {
            rowGroup.forEach(rowItem => {
                rowItem.addEventListener("mouseenter", event => {
                    rowGroup.forEach(eachRowItem => {
                        if (!eachRowItem.classList.contains("active"))
                            eachRowItem.classList.add("active");
                    });
                });

                rowItem.addEventListener("mouseleave", event => {
                    rowGroup.forEach(eachRowItem => {
                        if (eachRowItem.classList.contains("active"))
                            eachRowItem.classList.remove("active");
                    });
                });
            });
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

function deleteEvent(eventId, eventItinElem, eventRibbons) {
    tryDeleteEvent(eventId).then(data => {
        eventItinElem.remove();
        eventRibbons.forEach(eventRibbon => {
            eventRibbon.remove();
        });
    }).catch(error => {
        console.log("Error when sending DELETE request to backend, not continuing for frontend:");
        console.log(error);
    })
}

async function tryDeleteEvent(eventId) {
    const response = await fetch("http://localhost:3000/events/" + eventId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    });
    return await response.json();
}

function spawnEventItinCard() {

}

// Creates an Event Ribbon at the given HTML Element of the specific day
function spawnEventRibbon(dayElem, event, length, colourStr, hasLeftMargin, hasRightMargin) {
    const title = event.title, startTime = event.start_time;

    if (title == "Plan Bali Trip") console.log(hasRightMargin + " test");

    const eventRibbonElemStr =
        `<div class="eventRibbon">` +
        `   <div class="indicator"></div>` +
        `   <div class="title">${title}</div>` +
        `   <div class="time">${startTime}</div>` +
        `</div>`;

    dayElem.insertAdjacentHTML('beforeend', eventRibbonElemStr);
    const allDayEvents = dayElem.getElementsByClassName("eventRibbon"),
        eventRibbonElem = allDayEvents[allDayEvents.length - 1];

    if (!hasLeftMargin) {
        eventRibbonElem.style.marginLeft = 0;
        eventRibbonElem.style.borderTopLeftRadius = 0;
        eventRibbonElem.style.borderBottomLeftRadius = 0;
    }

    if (!hasRightMargin) {
        eventRibbonElem.style.marginRight = 0;
        eventRibbonElem.style.borderTopRightRadius = 0;
        eventRibbonElem.style.borderBottomRightRadius = 0;
    }

    eventRibbonElem.getElementsByClassName("indicator")[0]
        .style.backgroundColor = colourStr;
    eventRibbonElem.style.width = "calc(" + (100 * length) + "% - " + (hasLeftMargin
        ? (hasRightMargin ? 28 : 18)
        : (hasRightMargin ? 18 : 8)) + "px)";

    return eventRibbonElem;
}