import * as displayEvent from "./displayEvent.js";
import * as addEvent from "./addEvent.js";

// Only load the necessary code after the entire document loads, so the code doesn't run when there's nothing on the page yet
document.addEventListener("DOMContentLoaded", (domLoadEvent) => {
  displayEvent.loadInitialMonths(3);
  displayEvent.loadOtherMonths();
  displayEvent.loadEvents();
  displayEvent.indicateCurrentDay();

  addEvent.setupAddEventBtn();
});