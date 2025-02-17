import * as DateUtils from "../utils/date.js";

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
    })

    const confirmPopupBtnElem = document.getElementById("confirmEventPopupBtn");
    confirmPopupBtnElem.addEventListener("click", async (event) => {
        const title = document.getElementById("eventTitleInput").value,
            location = document.getElementById("eventLocInput").value,
            notes = document.getElementById("eventNotesInput").value,
            category = document.getElementById("eventCategoryInput").value,
            startDateUnformated = document.getElementById("eventStartDateInput").value,
            endDateUnformated = document.getElementById("eventEndDateInput").value,
            userId = 1;

        const startDateObj = DateUtils.getDateFromInputFieldFormat(startDateUnformated),
            endDateObj = DateUtils.getDateFromInputFieldFormat(endDateUnformated);

        const startMonthYear = DateUtils.getYYYYMMFromDateObj(startDateObj),
            startDOM = startDateObj.getDate(),
            startTime = parseInt(startDateObj.getHours() + ""
                + startDateObj.getMinutes() < 10
                ? "0" + startDateObj.getMinutes()
                : startDateObj.getMinutes());


        const endMonthYear = DateUtils.getYYYYMMFromDateObj(endDateObj),
            endDOM = endDateObj.getDate(),
            endTime = parseInt(endDateObj.getHours() + ""
                + endDateObj.getMinutes() < 10
                ? "0" + endDateObj.getMinutes()
                : endDateObj.getMinutes());

        try {
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
                    startMonthYear: startMonthYear,
                    endMonthYear: endMonthYear,
                    startDOM: startDOM,
                    endDOM: endDOM,
                    startTime: startTime,
                    endTime: endTime
                })
            });
            const data = await response.json().then(() => {
                // to create event ribbons and all that
                
                // to clear input fields
                // to close event
            }).catch(error => {
                // show user popup error
            });
            console.log("Response", data);

            // const response = await fetch("https://qo-lplus.vercel.app/events/" + userId + "/" + monthyear);
        } catch (error) {
            console.log(error);
        }
    });
}