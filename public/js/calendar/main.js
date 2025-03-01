import * as Calendar from "./calendar.js";
import * as EventManager from "./eventManager.js";
import * as AddEvent from "./addEvent.js";

// Only load the necessary code after the entire document loads, so the code doesn't run when there's nothing on the page yet
document.addEventListener("DOMContentLoaded", (domLoadEvent) => {
  Calendar.loadInitialMonths(3);
  Calendar.indicateCurrentDay();

  EventManager.loadAllEvents();

  AddEvent.setupAddEventBtn();
});