// Only load the necessary code after the entire document loads, so the code doesn't run when there's nothing on the page yet
//load the code first friend
document.addEventListener("DOMContentLoaded", (domLoadEvent) => {
  indicateCurrentDay();
  testEventRow();
});

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