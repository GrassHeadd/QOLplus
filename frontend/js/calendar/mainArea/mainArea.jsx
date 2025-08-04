import React from "react";

import GridHeader from "./gridHeader.jsx";
import CalendarGrid from "./calendarGrid.jsx";

export default function MainArea() {
    return (
        <div id="mainArea">
            <GridHeader />
            <CalendarGrid />
        </div>
    );
}