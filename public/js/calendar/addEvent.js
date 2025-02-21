import * as DateUtils from "../utils/date.js";
import * as DisplayEvent from "./displayEvent.js";

export function setupAddEventBtn() {
    const popupToggleBtn = document.getElementById("addEventBtn");
    const addEventPopupElem = document.getElementsByClassName("addEventPopup")[0];
    const qotdElem = document.getElementsByClassName("qotd")[0];
    var isPopup = false;

    popupToggleBtn.addEventListener("click", (event) => {
        isPopup = !isPopup;
        qotdElem.style.display = isPopup ? "none" : "flex";
        addEventPopupElem.style.display = isPopup ? "flex" : "none";
    });

    const closePopupBtnElem = document.getElementById("closeEventPopupBtn");
    closePopupBtnElem.addEventListener("click", (event) => {
        isPopup = !isPopup;
        qotdElem.style.display = isPopup ? "none" : "flex";
        addEventPopupElem.style.display = isPopup ? "flex" : "none";
    });

    const confirmPopupBtnElem = document.getElementById("confirmEventPopupBtn");
    confirmPopupBtnElem.addEventListener("click", async (event) => {
        const title = document.getElementById("eventTitleInput").value,
            location = document.getElementById("eventLocInput").value,
            notes = document.getElementById("eventNotesInput").value,
            category = document.getElementById("eventCategoryInput").value,
            startDateUnformated = document.getElementById("eventStartDateInput").value,
            endDateUnformated = document.getElementById("eventEndDateInput").value,
            userId = 1;

        const startDate = startDateUnformated.split(" ")[1],
            endDate = endDateUnformated.split(" ")[1];

        const startTime = startDateUnformated.split(" ")[0],
            endTime = endDateUnformated.split(" ")[0];

        const response = await fetch("http://localhost:3000/events/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                title: title,
                location: location,
                notes: notes,
                category: category,
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime
            })
        });
        
        await response.json().then(data => {
            DisplayEvent.displayEvent({
                eventId: data.eventId,
                title: title,
                location: location,
                notes: notes,
                category: category,
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime
            });
        }).catch((error) => {
            window.alert("Error creating event");
            console.error("Could not create:", error);
        });
    });
}