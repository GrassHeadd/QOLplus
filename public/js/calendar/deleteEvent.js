import * as EventManager from "./eventManager.js";
import * as Calendar from "./calendar.js";
import * as ItinList from "./itinList.js";

export function initDeleteBtnListener(eventId, cardElem) {
    cardElem.querySelector(".deleteBtn").addEventListener("click", () => {
        tryDeleteEvent(eventId);
    });
}

async function tryDeleteEvent(eventId) {
    await fetch("https://qo-lplus.vercel.app/events/" + eventId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    }).then(async (response) => {
        await response.json()
            .then(data => {
                console.log("Test2");
                if (response.status !== 200) {
                    console.log("Error while deleting event:", data.error);
                    window.alert(data.error);
                    return;
                }

                EventManager.removeEvent(eventId);
                Calendar.spawnRibbonsForAllEvents(EventManager.getAllEvents(), EventManager.getCategoryColors());
                ItinList.displayDayItinerary(new Date(), EventManager.getCategoryColors());
            });
    }).catch(error => {
        console.log("Catching error message");
        console.error("Error:", error.message);
    });
}