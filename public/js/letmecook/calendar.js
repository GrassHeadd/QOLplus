// Only load the necessary code after the entire document loads, so the code doesn't run when there's nothing on the page yet
document.addEventListener("DOMContentLoaded", (domLoadEvent) => {
  loadInitialMonths(3);
  loadOtherMonths();
  loadEvents();
  indicateCurrentDay();
  //testEventRow();
});

/* [RR's Thonkang Stuff] Calendar Area Behaviour:
- Allows default scrolling behaviour
- Upon release, corrects view by auto-snapping to a week's row (if scrolling past half of row X, snap that row, if not, scnap to the row above it)
  - Snapping is transitive, not instant (i.e. there's an animation)
- At any point of time of non-scrolling & non-snapping transition, there will always be 35 days visible on the screen
*/

function loadInitialMonths(plusMinusAmt) {
  /* =================[ vv Variable Setup vv ]================= */
  // No arguments in Date constructor = today's date
  // Using 0 as "day" automatically sets the date to the last day of the previous month, hence some currMonthIndex + 1
  const currMonthDate = new Date(), currYear = currMonthDate.getFullYear(), currMonthIndex = currMonthDate.getMonth();
  const currMonthStartDate = new Date(currYear, currMonthIndex, 1), startMonthDate = new Date(currYear, currMonthIndex - plusMinusAmt, 1), endMonthDate = new Date(currYear, currMonthIndex + plusMinusAmt + 1, 0);

  // dowOfFdom = Day of week of the first day of start month
  // Date.getDay() returns 0-6 Sunday to Monday, so this formula converts it to 1-7 Monday to Sunday for convenience
  const dowOfFirstOfCurrMth = (currMonthStartDate.getDay() + 7) % 8 + Math.ceil(currMonthStartDate.getDay() / 8), dowOfFirstOfStartMth = (startMonthDate.getDay() + 7) % 8 + Math.ceil(startMonthDate.getDay() / 8);

  const endMonthDateStr = endMonthDate.toDateString();
  const dayDisplayElem = document.getElementById("main").getElementsByClassName("calendar")[0].getElementsByClassName("bottom")[0].getElementsByClassName("dayDisplay")[0];

  /* =====================[ vv Main Logic vv ]===================== */

  // This loop temporarily creates day items to fill up any extra space before the 1st day of the start month
  // TODO: In dynamic loading, remove these when the other months load in the background (otherwise there'll be duplicates)
  for (var i = dowOfFirstOfStartMth - 1; i > 0; i--) {
    dayDisplayElem.innerHTML += "<div class=\"day\"><div>";
  }

  // Handles creation of all date elements between startMonthDate and endMonthDate
  while (true) {
    if (startMonthDate.toDateString() == endMonthDateStr) break;

    var eventsHtml = "";
    /*"<div class=\"events\">" +
          "<div class=\"item gym\">" +
          "<div class=\"marker\"></div>" +
          "<div class=\"label\">" + labelText + "</div>" +
          "<div class=\"amount\">" + timeText + "</div>" +
      "</div>" +
    "</div>";
    */

    dayDisplayElem.innerHTML +=
      "<div class=\"day " + startMonthDate.toDateString().replaceAll(" ", "") + "\">" +
      "<div class=\"date dayMarker\">" + startMonthDate.getDate() + "</div>"
      + eventsHtml +
      "</div>";

    startMonthDate.setDate(startMonthDate.getDate() + 1);
  }

  // Snap to the first day of the current month;
  dayDisplayElem.getElementsByClassName(currMonthStartDate.toDateString().replaceAll(" ", ""))[0].scrollIntoView();

  // The default view can only show up to 5 rows, hence we check and move it down by 1 if the current date happens to past the 5th row
  // E.g. 30 September 2024 is on the 6th row of the month
  if (dowOfFirstOfCurrMth - 1 + currMonthDate.getDate() > 35) {
    dayDisplayElem.getElementsByClassName(new Date(currYear, currMonthIndex, 8).toDateString().replaceAll(" ", ""))[0].scrollIntoView();
  }
}

function loadOtherMonths() {

}

function indicateCurrentDay() {
  // // Grab current day and then the date as number
  // const currDate = new Date(); //get date
  // var currDateNum = currDate.getDate(); //get day

  // // Grab all 35 day HTML elements
  // const allDayElements = document
  //   .getElementsByClassName("dayDisplay")[0]
  //   .getElementsByClassName("day");

  // // Loop through the 35 HTMl elements
  // for (var i = 0; i < allDayElements.length; i++) {
  //   const dayElement = allDayElements[i];

  //   // Find which one has a date number that matches the current day, then add the "today" class to it so the CSS kicks into effect
  //   if (dayElement.getElementsByClassName("date")[0].innerHTML == currDateNum) {
  //     dayElement.getElementsByClassName("date")[0].classList.add("today");
  //   } //add the class for css to the day that is today
  // }
}

async function loadEvents() {
  try {
    const userId = 1;
    const monthyear = 202412;
    const response = await fetch("https://qo-lplus.vercel.app/events/" + userId + "/" + monthyear);
    const data = await response.json();

    console.log("Events:", data.data);

    data.data.forEach(element => {
      const title = element.title, category = element.category, startDOM = element.start_dayofmonth, endDOM = element.end_dayofmonth, startTime = element.start_time, endTime = element.end_time, startMY = element.start_monthyear, endMY = element.end_monthyear, location = element.location, notes = element.notes;

      const eventElement =
        `<div class="item ${category}">` +
        '  <div class="left">' +
        `    <div class="period"> ${startTime}hr<br>-<br>${endTime}hr</div>` +
        '  </div>' +
        '  <div class="right">' +
        `    <div class="title"> ${title}</div>` +
        `    <div class="info">${notes}</div>` +
        '  </div>' +
        '</div>';

      document.getElementById("main").getElementsByClassName("inspector")[0].getElementsByClassName("itinerary")[0].innerHTML += eventElement;




      const eventMarkerElemStr =
        `<div class="eventRibbon">` +
        `   <div class="indicator"></div>` +
        `   <div class="title">${title}</div>` +
        `   <div class="time">${startTime}</div>` +
        `</div>`;

      var startDate = getDateFromFormatted(startDOM, startMY), endDate = getDateFromFormatted(endDOM, endMY);
      var dayCount = getDayNumBetween(startDate, endDate);

      const dayElem = document.getElementById("main").getElementsByClassName("calendar")[0].getElementsByClassName("bottom")[0].getElementsByClassName(startDate.toDateString().replaceAll(" ", ""))[0];
      var curDate = new Date(startDate.getTime());
      var nextSundayDelta = getNextSundayDelta(curDate);

      // Generate the event marker HTML for the current week row
      const firstRowLength = Math.min(nextSundayDelta + 1, dayCount);
      dayElem.insertAdjacentHTML('beforeend', eventMarkerElemStr);
      const allDayEvents = dayElem.getElementsByClassName("eventRibbon"), eventMarkerElem = allDayEvents[allDayEvents.length - 1];
      eventMarkerElem.style.width = "calc(" + (100 * firstRowLength) + "% - 28px)";
      dayCount -= firstRowLength;
      if (dayCount > 0) {
        eventMarkerElem.style.width = "calc(" + (100 * firstRowLength) + "% - 18px)";
        eventMarkerElem.style.marginRight = 0;
        eventMarkerElem.style.borderTopRightRadius = 0;
        eventMarkerElem.style.borderBottomRightRadius = 0;
      }

      console.log("Left " + dayCount + " days to mark out after first row");

      // If there are any days left after the first row's event marker, continue making it
      var fullRowCounter = 0;
      while (dayCount > 0) {
        var curRowLength = Math.min(7, dayCount);
        var mondayDate = new Date(startDate.getTime());
        mondayDate.setDate(mondayDate.getDate() + firstRowLength + 7 * fullRowCounter);
        var mondayElem = document.getElementById("main").getElementsByClassName("calendar")[0].getElementsByClassName("bottom")[0].getElementsByClassName(mondayDate.toDateString().replaceAll(" ", ""))[0];
        mondayElem.insertAdjacentHTML('beforeend', eventMarkerElemStr);
        const allDayEvents = mondayElem.getElementsByClassName("eventRibbon"), eventMarkerElem = allDayEvents[allDayEvents.length - 1];

        dayCount -= curRowLength;
        fullRowCounter++;

        // By default no margins on left since it's continue from the event marker in the previous row
        eventMarkerElem.style.marginLeft = 0;
        eventMarkerElem.style.borderTopLeftRadius = 0;
        eventMarkerElem.style.borderBottomLeftRadius = 0;
        
        // Check if there should be right margin (i.e. whether there is a next row to generate or not)
        // Ternary Operator Reasoning: dayCount == 0 means event ends on the sunday (i.e. no more rows to generate), so no right margins taken into account when calculating width
        eventMarkerElem.style.width = "calc(" + (100 * curRowLength) + "% - " + (dayCount == 0 ? 18 : 6) + "px)";
        if (dayCount > 0) {
          eventMarkerElem.style.marginRight = 0;
          eventMarkerElem.style.borderTopRightRadius = 0;
          eventMarkerElem.style.borderBottomRightRadius = 0;
        }
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function formatTime(timeInt) {
  var string = "";
  if (timeInt % 10 < 10) {
    string += "0";
  }
  string += timeInt;
  return string + "hr";
}

function getNextSundayDelta(date) {
  return 7 - (date.getDay() == 0 ? 7 : date.getDay());
}

function getDateFromFormatted(dom, my) {
  return new Date(parseInt((my + "").slice(0, 4)), parseInt((my + "").slice(4, 6)) - 1, dom);
}

function getDayNumBetween(startDate, endDate) {
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
}