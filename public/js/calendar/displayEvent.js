import * as DateUtils from "../utils/date.js";
import * as ColorUtils from "../utils/color.js";
import * as ItinSummary from "./itinSummary.js";
import * as ItinList from "./itinList.js";
import * as Calendar from "./calendar.js";

const catColors = {};

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
    document.querySelectorAll("#main .inspector .itinerary .item").forEach(item => item.remove());
    document.querySelectorAll("#main .calendar .bottom .day .eventRibbon").forEach(item => item.remove());
    document.querySelectorAll("#itinSummary .item").forEach(item => item.remove());

    const userId = 1;
    const todayDateObj = new Date();
    const dateStr = DateUtils.getDateStrForBackend(todayDateObj);

    // Live Backend Link: https://qo-lplus.vercel.app/events/...

    await fetch("http://localhost:3000/events/" + userId + "/month/" + dateStr)
        .then(async (response) => {
            await response.json().then(data => {
                const events = data.data;

                /* 1. Sort the events by start date so events with earlier dates are created at the top of the event ribbon stack */
                events.sort((event1, event2) => {
                    const event1StartTimeStr = toString(event1.startTime), event2StartTimeStr = toString(event2.startTime);
                    const date1 = new Date(event1StartTimeStr.substring(0, 2) + ":" + event1StartTimeStr.substring(3, 4) + " " + event1.startDate);
                    const date2 = new Date(event2StartTimeStr.substring(0, 2) + ":" + event2StartTimeStr.substring(3, 4) + " " + event2.endDate);
                    return date1.getTime() - date2.getTime();
                });

                /* 2. Generate the color for each category */
                events.forEach(event => {
                    generateCategoryColor(event);
                });

                /* 3. Generate the needed cards and ribbons, then link them together */
                displayEvents(events);
            }).catch(error => {
                console.log("Error while parsing json: ", error);
            });
        }).catch(response => {
            console.log("Error while fetching:", response);
        });
}

function displayEvents(events) {
    events.forEach(event => {
        displayEvent(event);
    });
}

export function displayEvent(event) {
    // Generate color for the event category if it doesn't exist
    generateCategoryColor(event);

    ItinSummary.updateItinCategory(event, catColors[event.category], 1);
    const itinCardElem = ItinList.spawnEventItinCard(event, catColors[event.category]);
    const ribbonElems = Calendar.spawnEventRibbons(event, catColors[event.category]);
    linkCardAndRibbons(itinCardElem, ribbonElems);
    setupEditBtn(event, itinCardElem, ribbonElems);
    setupDeleteBtn(event, itinCardElem, ribbonElems);
}

function generateCategoryColor(event) {
    if (catColors[event.category] == undefined) {
        catColors[event.category] = ColorUtils.getRandomColorStr(catColors);
    }
}

function linkCardsAndRibbons(itinCardElems, ribbonElemSet) {
    itinCardElems.forEach((cardElem, index) => {
        linkCardAndRibbons(cardElem, ribbonElemSet[index]);
    });
}

function linkCardAndRibbons(itinCardElem, ribbonElems) {
    // Each Card activates all ribbons when hovered over
    itinCardElem.addEventListener("mouseenter", event => {
        ribbonElems.forEach(ribbonElem => {
            if (!ribbonElem.classList.contains("active"))
                ribbonElem.classList.add("active");
        });
    });

    itinCardElem.addEventListener("mouseleave", event => {
        ribbonElems.forEach(ribbonElem => {
            if (ribbonElem.classList.contains("active"))
                ribbonElem.classList.remove("active");
        });
    });

    // Each Ribbon activates all others when hovered over
    ribbonElems.forEach(ribbonElem => {
        ribbonElem.addEventListener("mouseenter", event => {
            ribbonElems.forEach(eachRibbonElem => {
                if (!eachRibbonElem.classList.contains("active"))
                    eachRibbonElem.classList.add("active");
            });
        });

        ribbonElem.addEventListener("mouseleave", event => {
            ribbonElems.forEach(eachRibbonElem => {
                if (eachRibbonElem.classList.contains("active"))
                    eachRibbonElem.classList.remove("active");
            });
        });
    });

    // Each Ribbon activates the card when hovered over
    ribbonElems.forEach(ribbonElem => {
        ribbonElem.addEventListener("mouseenter", event => {
            if (!itinCardElem.classList.contains("active"))
                itinCardElem.classList.add("active");
        });

        ribbonElem.addEventListener("mouseleave", event => {
            if (itinCardElem.classList.contains("active"))
                itinCardElem.classList.remove("active");
        });
    });
}

async function setupEditBtn(event, cardElem, ribbonElems) {
    cardElem.querySelector(".editBtn").addEventListener("click", async () => {
        window.alert("WIP");
    });
}

async function setupDeleteBtn(event, cardElem, ribbonElems) {
    cardElem.querySelector(".deleteBtn").addEventListener("click", async () => {
        await fetch("http://localhost:3000/events/" + event.eventId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        }).then(async (response) => {
            await response.json()
            .then(data => {  
                if (response.status !== 200) {
                    console.log("Error while deleting event:", data.error);
                    window.alert(data.error);
                    return;
                }

                ItinSummary.updateItinCategory(event, catColors[event.category], -1);
                cardElem.remove();
                ribbonElems.forEach(ribbonElem => {
                    ribbonElem.remove();
                });
            });
        }).catch(error => {
            console.log("Catching error message");
            console.error("Error:", error.message);
        });
    });
}