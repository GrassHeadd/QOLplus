// Only load the necessary code after the entire document loads, so the code doesn't run when there's nothing on the page yet
//load the code first friend
document.addEventListener("DOMContentLoaded", (domLoadEvent) => {
  const currDate = new Date();
  var currDateNum = currDate.getDate();
  currDateNum = 2;
  const allDayElements = document
    .getElementsByClassName("dayDisplay")[0]
    .getElementsByClassName("day");

  for (var i = 0; i < allDayElements.length; i++) {
    const dayElement = allDayElements[i];
    
    if (dayElement.getElementsByClassName("date")[0].innerHTML == currDateNum) {
        dayElement.getElementsByClassName("date")[0].classList.add("dayMarker today");

    }

    if (i + 1 == currDateNum) {
      //edit the colour of thing with css
      break
    }
  }
});
