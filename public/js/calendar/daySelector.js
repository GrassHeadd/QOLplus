import * as DateUtils from "../utils/date.js";
import * as Calendar from "./calendar.js";
import * as ItinList from "./itinList.js";
import * as EventManager from "./eventManager.js";

// Defaults to today's date
var selectedDay = new Date();

export function initDefaultSelectedDay() {
    Calendar.getDayElement(selectedDay).classList.add("selected");
}

// Sets up click listener
export function initListeners(dayElems) {
    dayElems.forEach(dayElem => {
        dayElem.addEventListener("click", (clickEvent) => {
            const className = Array.from(dayElem.classList).filter(className => className.includes("dateIs"))[0];
            const dateObj = DateUtils.getDateObjFromClassName(className);
            // If selecting same date, ignore
            if (selectedDay.getTime() == dateObj.getTime()) {
                return;
            }

            // Update visuals (reset previous, set current)
            Calendar.getDayElement(selectedDay).classList.remove("selected");
            selectedDay = dateObj;
            Calendar.getDayElement(selectedDay).classList.add("selected");
            
            // Propagate event to itinerary list area
            ItinList.displayDayItinerary(dateObj, EventManager.getCategoryColors());
        });
    });
}