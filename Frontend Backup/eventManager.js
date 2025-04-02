import * as DateUtils from "../utils/date.js";
import * as ColorUtils from "../utils/color.js";
import * as ItinSummary from "./itinSummary.js";
import * as ItinList from "./itinList.js";
import * as Calendar from "./calendar.js";

const catColors = {};
const allEvents = [];

// Logic for loading all events progressively
export async function loadAllEvents(userId = 1) {
    const calRange = Calendar.getCalendarViewableRange();
    const curDate = new Date(calRange.minDate.getTime()), endDate = calRange.maxDate;

    while (curDate.getTime() <= endDate.getTime()) {
        // Load current month's events
        await getMonthEvents(userId, curDate)
            .then(monthEvents => {
                // Populate non-duplicates to allEvents array
                monthEvents.forEach(event => {
                    if (!allEvents.some(eachEvent => eachEvent.eventId == event.eventId)) {
                        allEvents.push(event);
                    }
                });

                const weekMap = splitMonthEventsToWeeks(monthEvents);
                if (Object.keys(weekMap).length > 0) {

                    // Generate color for each category, if it doesn't already exist
                    monthEvents.forEach(event => {
                        generateCategoryColor(event);
                    });

                    // Call rendering one week at a time for the month
                    for (var i = 0; i < 6; i++) {
                        const week = weekMap[i], weekEvents = week.events;
                        if (weekEvents.length > 0) displayWeekEvents(week.weekStart, week.weekEnd, weekEvents);
                    }
                }
            });

        // Increment to the next month
        curDate.setMonth(curDate.getMonth() + 1);
    }
}

// Fetches events for 1 month
async function getMonthEvents(userId, dateObj) {
    return new Promise(async (resolve, reject) => {
        const dateStr = DateUtils.getDateStrForBackend(dateObj);
        // Live Backend Link: https://qo-lplus.vercel.app/events/...

        await fetch("https://qo-lplus.vercel.app/events/" + userId + "/month/" + dateStr)
            .then(async (response) => {
                await response.json().then(data => {
                    resolve(data.data);
                }).catch(error => {
                    console.log("Error while parsing json: ", error);
                    reject(null);
                });
            }).catch(response => {
                console.log("Error while fetching:", response);
                reject(null);
            });
    });
}

// Splits a month's events into array of weeks rows
function splitMonthEventsToWeeks(monthEvents) {
    const weeks = {};
    if (monthEvents.length == 0) return weeks;

    // 1. Begin with the first day of first week (which can go into previous month)
    const curDate = new Date(monthEvents[0].startDate);
    curDate.setDate(1); // Find first day of the month
    curDate.setDate(curDate.getDate() - (curDate.getDay() == 0 ? 6 : curDate.getDay() - 1)); // Set to monday of that week

    // 2. Loop through each week's monday and add events that occur during that week into array
    // Can go up to 6 weeks, e.g. if month starts on a Sunday and is >= 30 days
    // Events fetched in this month can absolutely span outside the 6 weeks but we just let the other months handle the rendering if it does
    for (var i = 0; i < 6; i++) {
        const week = [];

        // Calculate the sunday of the week (range end)
        const curSunday = new Date(curDate);
        curSunday.setDate(curSunday.getDate() + 6);

        // Get events that occur during this week
        const weekEvents = monthEvents.filter(event => DateUtils.doesStartEndOccupyRange(new Date(event.startDate), new Date(event.endDate), curDate, curSunday)).map(event => {
            // Make a copy each event that fits the criteria, but with the start/end dates clamped to the week's bounds
            const eventSlice = cloneEvent(event);
            eventSlice.startDate = new Date(event.startDate);
            eventSlice.endDate = new Date(event.endDate);
            eventSlice.hasPrevious = false;
            eventSlice.hasNext = false;
            if (eventSlice.startDate.getTime() < curDate.getTime()) {
                eventSlice.startDate = new Date(curDate.getTime());
                eventSlice.hasPrevious = true;
            }
            if (eventSlice.endDate.getTime() > curSunday.getTime()) {
                eventSlice.endDate = new Date(curSunday.getTime());
                eventSlice.hasNext = true;
            }
            return eventSlice;
        });
        // StartDate and EndDate are to detect if any event has any next/previous weeks
        weeks[i] = { weekStart: curDate, weekEnd: curSunday, events: weekEvents };

        curDate.setDate(curDate.getDate() + 7); // Increment to next week's monday
    }

    return weeks;
}

function displayWeekEvents(weekStart, weekEnd, weekEvents) {
    const ribbons = Calendar.renderWeekRibbons(weekStart, weekEnd, weekEvents, catColors);
    return ribbons;
}

export function displayEvent(event) {
    // Generate color for the event category if it doesn't exist
    generateCategoryColor(event);

    // ItinSummary.updateItinCategory(event, catColors[event.category], 1);
    // const itinCardElem = ItinList.spawnEventItinCard(event, catColors[event.category]);
    const ribbonElems = Calendar.spawnEventRibbons(event, catColors[event.category]);
    // linkCardAndRibbons(itinCardElem, ribbonElems);
    // setupEditBtn(event, itinCardElem, ribbonElems);
    // setupDeleteBtn(event, itinCardElem, ribbonElems);
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
    const moreBtn = cardElem.querySelector(".moreBtn"),
        moreBtnPopup = cardElem.querySelector(".moreBtnPopup"),
        editBtnPopup = cardElem.querySelector(".editBtnPopup"),
        confirmEditBtn = editBtnPopup.querySelector(".confirmBtn"),
        cancelEditBtn = editBtnPopup.querySelector(".cancelBtn");

    const startTimeInput = cardElem.querySelector("#itemStartTimeInput"),
        endTimeInput = cardElem.querySelector("#itemEndTimeInput"),
        titleInput = cardElem.querySelector("#itemTitleInput"),
        //   locInput = cardElem.querySelector("#itemLocInput"),
        infoInput = cardElem.querySelector("#itemInfoInput");

    const startTimeText = cardElem.querySelector(".startTime"),
        endTimeText = cardElem.querySelector(".endTime"),
        titleText = cardElem.querySelector(".title"),
        //   locText = cardElem.querySelector(".location"),
        infoText = cardElem.querySelector(".info");

    // On edit, swap to edit view with input fields and edit popup icons
    cardElem.querySelector(".editBtn").addEventListener("click", () => {
        moreBtn.classList.toggle("hidden");
        moreBtn.innerHTML = "more_vert";
        moreBtnPopup.classList.toggle("active");
        editBtnPopup.classList.toggle("active");

        startTimeInput.value = DateUtils.getCreateEventDateFormatStr(event.startTime, event.startDate);
        endTimeInput.value = DateUtils.getCreateEventDateFormatStr(event.endTime, event.endDate);
        titleInput.value = titleText.innerHTML.trim();
        // locInput.value = locText.innerHTML;
        infoInput.value = infoText.innerHTML.trim();

        startTimeInput.classList.toggle("hidden");
        endTimeInput.classList.toggle("hidden");
        titleInput.classList.toggle("hidden");
        // locInput.classList.toggle("hidden");
        infoInput.classList.toggle("hidden");

        startTimeText.classList.toggle("hidden");
        endTimeText.classList.toggle("hidden");
        titleText.classList.toggle("hidden");
        // locText.classList.toggle("hidden");
        infoText.classList.toggle("hidden");
    });

    // On cancel, return back to normal card state and swap icons back
    cancelEditBtn.addEventListener("click", () => {
        moreBtn.classList.toggle("hidden");
        editBtnPopup.classList.toggle("active");

        startTimeInput.classList.toggle("hidden");
        endTimeInput.classList.toggle("hidden");
        titleInput.classList.toggle("hidden");
        // locInput.classList.toggle("hidden");
        infoInput.classList.toggle("hidden");

        startTimeText.classList.toggle("hidden");
        endTimeText.classList.toggle("hidden");
        titleText.classList.toggle("hidden");
        // locText.classList.toggle("hidden");
        infoText.classList.toggle("hidden");
    });
}

/* UTILITIES AND GETTERS */
export function getAllEvents() {
    return allEvents;
}

export function removeEvent(eventId) {
    console.log("Before: ", allEvents, " removing " + eventId);
    const index = allEvents.findIndex(event => event.eventId == eventId);
    if (index != -1) allEvents.splice(index, 1);
    console.log("After: ", allEvents);
}

export function getEventsInDay(dateObj) {
    return allEvents.filter(event => {
        const startDate = new Date(event.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(event.endDate);
        endDate.setHours(0, 0, 0, 0);
        return DateUtils.doesDateOccurInRange(dateObj, startDate, endDate);
    });
}

export function getCategoryColors() {
    return catColors;
}

function cloneEvent(event) {
    return {
        eventId: event.eventId,
        title: event.title,
        category: event.category,
        startDate: event.startDate,
        startTime: event.startTime,
        endDate: event.endDate,
        endTime: event.endTime,
        location: event.location,
        notes: event.notes
    };
}