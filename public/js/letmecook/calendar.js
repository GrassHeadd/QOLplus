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

      const eventMarkerElem =
        `<div class="eventRibbon long">` +
        `   <div class="indicator"></div>` +
        `   <div class="title">${title}</div>` +
        `   <div class="time">${startTime}</div>` +
        `</div>`;

      var thisDate = new Date(parseInt((startMY + "").slice(0, 4)), parseInt((startMY + "").slice(4, 6)) - 1, startDOM), nextSundayDelta = getNextSundayDelta(thisDate), nextSunday = new Date(thisDate);
      nextSunday.setDate(nextSunday.getDate() + nextSundayDelta);
      // TODO: Check if end date stretches past nearest sunday, then generate ribbon to sunday and another from monday onwards if so; otherwise, just generate with the margin based on num of days between start and end day
      document.getElementById("main").getElementsByClassName("calendar")[0].getElementsByClassName("bottom")[0].getElementsByClassName(thisDate.toDateString().replaceAll(" ", ""))[0].innerHTML += eventMarkerElem;
    });

    console.log("Events data:", data.data);
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

function getNextSundayDelta(curDate) {
  var counter = 0;
  do {
    curDate.setDate(curDate.getDate() + 1);
    counter++;
  } while (curDate.getDay() != 6);
  return counter;
}