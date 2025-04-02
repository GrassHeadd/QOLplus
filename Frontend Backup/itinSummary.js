const curCatElems = [];

function spawnItinCategories(allEvents, catColors) {
    const catCountMap = {};
    allEvents.forEach((event) => {
        catCountMap[event.category] = (catCountMap[event.category] ? catCountMap[event.category] : 0) + 1;
    });
    allEvents.forEach((event) => {
        spawnItinCategory(event.category, catCountMap[event.category], catColors[event.category]);
    });
}

function spawnItinCategory(category, count, catColor) {
    // Create the HTML element then retrieve it for manipulation
    const catHtmlString = `<div class="item ${category}">` +
        '   <div class="marker"></div>' +
        `   <div class="label">${category}</div>` +
        `   <div class="amount">${count}</div>` +
        '</div>'
    const itinSumElem = document.querySelector("#itinSummary");
    itinSumElem.insertAdjacentHTML('beforeend', catHtmlString);

    // Style the colours according to the category color
    itinSumElem.querySelector("." + category + " .marker").style.backgroundColor = catColor;
    itinSumElem.querySelector("." + category + " .label").style.color = catColor;
}

function clearItinCategories() {
    document.querySelector("#itinSummary").innerHTML = "";
}

export function displayDayItineraryCats(dayEvents, catColors) {
    clearItinCategories();
    spawnItinCategories(dayEvents, catColors);
}