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

        /* INPUT VALIDATION */
        // TODO - Implement AI to allow parsing of time and date while preserving input validation
        if (title.trim() == "") {
            window.alert("Please enter a valid title")
            return;
        }

        const timeRegex = /(?:[01]?\d|2[0-3])[0-5]\d\s\d{4}-([1-9]|[01][012])-(0*[1-9]|[1-2]\d|3[01])/;
        if (!timeRegex.test(startDateUnformated) || !timeRegex.test(endDateUnformated)) {
            window.alert("Invalid start/end date input format");
            return;
        }

        const startDate = startDateUnformated.split(" ")[1].trim(),
            endDate = endDateUnformated.split(" ")[1].trim();

        const startTime = startDateUnformated.split(" ")[0].trim(),
            endTime = endDateUnformated.split(" ")[0].trim();

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