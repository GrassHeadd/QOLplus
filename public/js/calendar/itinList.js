export function spawnEventItinCards(events, catColors) {
    const cardElems = [];
    events.forEach(event => {
        cardElems.push(spawnEventItinCard(event, catColors[event.category]));
    });
    return cardElems;
}

export function spawnEventItinCard(event, catColor) {
    const {
        eventId,
        title,
        category,
        startDate,
        endDate,
        startTime,
        endTime,
        location,
        notes
    } = event;

    // Set up the card HTML
    const cardHtmlStr =
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
        '      <div class="moreOptionBtn editBtn material-symbols-outlined">edit</div>' +
        '      <div class="moreOptionBtn deleteBtn material-symbols-outlined">delete</div>' +
        '    </div>' +
        '  </div>' +
        '</div>';

    // Inject the HTML into the page and retrieve the HTML Element object for manipulation
    document.querySelector("#main .inspector .itinerary").insertAdjacentHTML("beforeend", cardHtmlStr);
    const allCardElems = document.querySelector("#main .inspector .itinerary").getElementsByClassName("item"),
          cardElem = allCardElems[allCardElems.length - 1];

    // Style the card according to its category's color
    cardElem.getElementsByClassName("left")[0].style.backgroundColor = catColor;

    const moreBtn = cardElem.querySelector(".moreBtn");
    moreBtn.addEventListener("click", () => {
        moreBtn.innerHTML = moreBtn.innerHTML == "close" ? "more_vert" : "close";
        cardElem.querySelector(".moreBtnPopup").classList.toggle("active");
    });

    return cardElem;
}