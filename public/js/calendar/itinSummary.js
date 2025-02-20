export function spawnEventItinCategory(events, catColors) {
    const catCount = {};
    events.forEach(event => {
        catCount[event.category] = catCount[event.category] ? catCount[event.category] + 1 : 1;
    });

    for (const category in catCount) {
        const amount = catCount[category];
        const catHtmlString = `<div class="item ${category}">` +
                              '   <div class="marker"></div>' +
                              `   <div class="label">${category}</div>` +
                              `   <div class="amount">${amount}</div>` +
                              '</div>'
        const itinSumElem = document.querySelector("#itinSummary");
        itinSumElem.insertAdjacentHTML('beforeend', catHtmlString);
        itinSumElem.querySelector("." + category + " .marker").style.backgroundColor = catColors[category];
        itinSumElem.querySelector("." + category + " .label").style.color = catColors[category];
    }
}

export function updateItinCategory(event) {
    document.querySelector("#itinSummary ." + event.category + " .amount").textContent = parseInt(document.querySelector("#itinSummary ." + event.category + " .amount").textContent) + 1;
}