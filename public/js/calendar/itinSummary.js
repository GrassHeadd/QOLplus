const catCount = {};

export function spawnItinCategories(events, catColors) {
    events.forEach((event) => {
        updateItinCategory(event, catColors[event.category], 1);
    });
}

export function spawnItinCategory(category, count, catColor) {
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

export function updateItinCategory(event, catColor, delta) {
    const amount = (catCount[event.category] ? catCount[event.category] : 0) + delta;
    if (amount > 0) {
        catCount[event.category] = amount;
    } else {
        delete catCount[event.category];
    }

    if (amount > 0) {
        const categoryElem = document.querySelector("#itinSummary ." + event.category + " .amount");
        
        // If the category HTML element doesn't exist yet, create it
        if (!categoryElem) {
            spawnItinCategory(event.category, catCount[event.category], catColor);
            return;
        }

        categoryElem.innerHTML = amount;
    } else {
        const itinCatElem = document.querySelector("#itinSummary ." + event.category);
        if (itinCatElem) itinCatElem.remove();
    }
}