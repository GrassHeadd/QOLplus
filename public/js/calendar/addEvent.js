import * as DisplayEvent from "./eventManager.js";

var isAddEventPopupActive = false;

export function setupAddEventBtn() {
    // The popup toggle and the close button both close (toggle) the popup window
    const popupToggleBtn = document.querySelector("#addEventBtn");
    const closePopupBtnElem = document.querySelector("#closeEventPopupBtn");
    popupToggleBtn.addEventListener("click", (event) => toggleAddEventPopupWindow());
    closePopupBtnElem.addEventListener("click", (event) => toggleAddEventPopupWindow());

    const confirmPopupBtnElem = document.getElementById("confirmEventPopupBtn");
    confirmPopupBtnElem.addEventListener("click", async (event) => {
        if (!areInputsValid()) return;
        tryAddEvent();
    });
}

function areInputsValid() {
    const title = document.querySelector("#eventTitleInput").value,
            location = document.querySelector("#eventLocInput").value,
            notes = document.querySelector("#eventNotesInput").value,
            category = document.querySelector("#eventCategoryInput").value,
            startDateUnformatted = document.querySelector("#eventStartDateInput").value,
            endDateUnformatted = document.querySelector("#eventEndDateInput").value,
            userId = 1;

        // TODO - Implement AI to allow parsing of time and date while preserving input validation
        if (title.trim() == "") {
            window.alert("Please enter a valid title")
            return false;
        }

        const timeRegex = /(?:[01]?\d|2[0-3])[0-5]\d\s\d{4}-([1-9]|[01][012])-(0*[1-9]|[1-2]\d|3[01])/;
        if (!timeRegex.test(startDateUnformatted) || !timeRegex.test(endDateUnformatted)) {
            window.alert("Invalid start/end date input format");
            return false;
        }

    return true;
}

async function tryAddEvent() {
    const title = document.querySelector("#eventTitleInput").value,
        location = document.querySelector("#eventLocInput").value,
        notes = document.querySelector("#eventNotesInput").value,
        category = document.querySelector("#eventCategoryInput").value,
        startDateUnformatted = document.querySelector("#eventStartDateInput").value,
        endDateUnformatted = document.querySelector("#eventEndDateInput").value,
        userId = 1;

        const startDate = startDateUnformatted.split(" ")[1].trim(),
        endDate = endDateUnformatted.split(" ")[1].trim();

    const startTime = startDateUnformatted.split(" ")[0].trim(),
        endTime = endDateUnformatted.split(" ")[0].trim();

    await fetch("https://qo-lplus.vercel.app/events/", {
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
    }).then(async (response) => {
        await response.json()
        .then(data => {
            if (response.status !== 200) {
                console.log("Error while adding event:", data.error);
                window.alert(data.error);
                return;
            }

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
        })
    }).catch((error) => {
        window.alert("Error while sending request to backend");
        console.error("Error while sending request to backend:", error);
    });
}

function toggleAddEventPopupWindow() {
    const addEventPopupElem = document.querySelector(".addEventPopup");
    const qotdElem = document.querySelector(".qotd");

    isAddEventPopupActive = !isAddEventPopupActive;
    qotdElem.style.display = isAddEventPopupActive ? "none" : "flex";
    addEventPopupElem.style.display = isAddEventPopupActive ? "flex" : "none";
}