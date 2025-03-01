import * as DisplayEvent from "./eventManager.js";

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
            startDateUnformatted = document.getElementById("eventStartDateInput").value,
            endDateUnformatted = document.getElementById("eventEndDateInput").value,
            userId = 1;

        /* INPUT VALIDATION */
        // TODO - Implement AI to allow parsing of time and date while preserving input validation
        if (title.trim() == "") {
            window.alert("Please enter a valid title")
            return;
        }

        const timeRegex = /(?:[01]?\d|2[0-3])[0-5]\d\s\d{4}-([1-9]|[01][012])-(0*[1-9]|[1-2]\d|3[01])/;
        if (!timeRegex.test(startDateUnformatted) || !timeRegex.test(endDateUnformatted)) {
            window.alert("Invalid start/end date input format");
            return;
        }

        const startDate = startDateUnformatted.split(" ")[1].trim(),
            endDate = endDateUnformatted.split(" ")[1].trim();

        const startTime = startDateUnformatted.split(" ")[0].trim(),
            endTime = endDateUnformatted.split(" ")[0].trim();

        await fetch("http://localhost:3000/events/", {
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
    });
}