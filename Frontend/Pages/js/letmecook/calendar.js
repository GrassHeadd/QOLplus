// Only load the necessary code after the entire document loads, so the code doesn't run when there's nothing on the page yet
document.addEventListener("DOMContentLoaded", (domLoadEvent) => {  
  loadInitialMonths(3);
  loadOtherMonths();
  
  //indicateCurrentDay();
  //testEventRow();
});

/* [RR's Thonkang Stuff] Calendar Area Behaviour:
- Allows default scrolling behaviour
- Upon release, corrects view by auto-snapping to a week's row (if scrolling past half of row X, snap that row, if not, scnap to the row above it)
  - Snapping is transitive, not instant (i.e. there's an animation)
- At any point of time of non-scrolling & non-snapping transition, there will always be 35 days visible on the screen
*/

function loadInitialMonths(plusMinusAmt) {
  // No arguments in Date constructor = today's date
  const startMonthDate = new Date();
  startMonthDate.setMonth(startMonthDate.getMonth() - plusMinusAmt);
  startMonthDate.setDate(1);

  // dowOfFdom = Day of week of the first day of this month
  // Date.getDay() returns 0-6 Sunday to Monday, so this formula converts it to 1-7 Monday to Sunday for convenience
  const dowOfFdom = (startMonthDate.getDay() + 7) % 8 + startMonthDate.getDay() / 8;

  // Finds the date of the last day of the current month
  // Using 0 as arg automatically sets the date to the last day of the previous month, so I have to set it to the next month first.
  startMonthDate.setMonth(startMonthDate.getMonth() + 1);
  startMonthDate.setDate(0);
  const daysInMonth = startMonthDate.getDate();

  const dayDisplayElem = document.getElementById("main").getElementsByClassName("calendar")[0].getElementsByClassName("bottom")[0].getElementsByClassName("dayDisplay")[0];

  const prevMonthDate = new Date(startMonthDate.getFullYear(), startMonthDate.getMonth(), 0);
  // Rolls back the date of prevMonthDate to be suitable for iterating in the loop below
  // E.g. 1 Nov 2024 is Friday (dowOfFdom = 5), prevMonth = 31 Oct 2024 is Thurs
  // getDate() - dowFdom would yield 31 - 5 = 26, but we need to loop from 28 to 31 to
  // fill in the empty calendar slots from Monday to Thursdays (Oct) before Fri (1 Nov)
  prevMonthDate.setDate(prevMonthDate.getDate() - dowOfFdom + 2);
  
  // dom = Date of Month
  // Handles creation of the previous month's date elements that fill up any extra space before the 1st day of the current month
  for (var dom = 1; dom < dowOfFdom; dom++) {
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
    "<div class=\"day\">" +
      "<div class=\"date dayMarker\">" + prevMonthDate.getDate() + "</div>"
        + eventsHtml +
    "</div>";
    prevMonthDate.setDate(prevMonthDate.getDate() + 1);
  }
  
  startMonthDate.setDate(1);
  // Set endMonthDate to be the last day of the "max" month from plusMinusAmt
  const endMonthDate = new Date();
  endMonthDate.setMonth(endMonthDate.getMonth() + plusMinusAmt + 1);
  endMonthDate.setDate(0);
  const endMonthDateStr = endMonthDate.toDateString();
  
  const currDateStr = new Date().toDateString();

  // Handles creation of all of min to max month's date elements
  while (true) {
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
    "<div class=\"day" + (startMonthDate.toDateString() == currDateStr ? " today" : "") + "\">" +
      "<div class=\"date dayMarker\">" + startMonthDate.getDate() + "</div>"
        + eventsHtml +
    "</div>";

    startMonthDate.setDate(startMonthDate.getDate() + 1);
  }

  // Handles creation of the next month's date elements that fill up any extra space after the last day of the current month
  for (var dom = 1; dom <= 35 - daysInMonth - dowOfFdom + 1; dom++) {
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
    "<div class=\"day\">" +
      "<div class=\"date dayMarker\">" + dom + "</div>"
        + eventsHtml +
    "</div>";
  }

  // TODO: Find a better way to jump to current month. 
  // Be aware of the edge case: if month starts on Sunday as 1st, month is > 29 days AND the current day is 30/31, then the current day's view will go past the 5th row
  const currDateElem = dayDisplayElem.getElementsByClassName("today")[0];
  currDateElem.scrollIntoView();
}

function loadOtherMonths() {

}

function indicateCurrentDay() {
  // Grab current day and then the date as number
  const currDate = new Date(); //get date
  var currDateNum = currDate.getDate(); //get day

  // Grab all 35 day HTML elements
  const allDayElements = document
    .getElementsByClassName("dayDisplay")[0]
    .getElementsByClassName("day");

  // Loop through the 35 HTMl elements
  for (var i = 0; i < allDayElements.length; i++) {
    const dayElement = allDayElements[i];

    // Find which one has a date number that matches the current day, then add the "today" class to it so the CSS kicks into effect
    if (dayElement.getElementsByClassName("date")[0].innerHTML == currDateNum) {
      dayElement.getElementsByClassName("date")[0].classList.add("today");
    } //add the class for css to the day that is today
  }
}

function testEventRow() {
  const startDate = 1212, endDate = 16, dayCount = endDate - startDate;

  // All calculations must minus the topleft day (item 0)
  const topLeftBoxNum = document
    .getElementsByClassName("dayDisplay")[0]
    .getElementsByClassName("day");

  var startBoxDateNum;
  // Find the index & actual date of start Box
  for (var i = 0; i < topLeftBoxNum.length; i++) {
    if (topLeftBoxNum[i].getElementsByClassName("date")[0].innerHTML.trim() == startDate) {
      startBoxDateNum = topLeftBoxNum[i].getElementsByClassName("date")[0].innerHTML.trim();
      // topLeftBoxNum[i].getElementsByClassName("date")[0].innerHTML = "all women do is gaslight you and crush your will to live and sou leaving you as an empty shell just wandering in a materialistic worlds";
    }
  }

  for (var i = 0; i < topLeftBoxNum.length; i++) {
    if (topLeftBoxNum[i].getElementsByClassName("date")[0].innerHTML.trim() == startDate) {
      startBoxDateNum = topLeftBoxNum[i].getElementsByClassName("date")[0].innerHTML.trim();

      

      // topLeftBoxNum[i].getElementsByClassName("date")[0].innerHTML = "all women do is gaslight you and crush your will to live and sou leaving you as an empty shell just wandering in a materialistic worlds";
    }
  }
}