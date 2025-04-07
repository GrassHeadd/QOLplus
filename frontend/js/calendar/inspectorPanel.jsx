import React, { useEffect } from "react";
import { useState } from "react";

import Inspector from "./inspector.jsx";
import Resizer from "./inspector/resizer.jsx";

export default function InspectorPanel() {
    const [cursorX, setCursorX] = useState(-1);
    const [panelWidth, setPanelWidth] = useState("30%");

    // Calls function upon any change to cursorX (which is updated by Resizer child component)
    useEffect(() => {
        calculatePanelWidth(cursorX);
    }, [cursorX]);

    function calculatePanelWidth(cursorX, minWidth = 20, maxWidth = 50) {
        // Prevent trigger in recalculation on page load which overrides default panel width
        if (cursorX === -1) return;

        const pageWidth = parseInt(document.defaultView.getComputedStyle(document.querySelector("body")).width);
        const totalWidth = parseInt(document.defaultView.getComputedStyle(document.querySelector("#inspectorPanel")).width);
        const resizerWidth = parseInt(document.defaultView.getComputedStyle(document.querySelector(".resizer")).width);

        // Aligns the cursor and resizing to the center of the resizer, otherwise it'll align to the edge of the entire panel
        const newPanelWidth = (cursorX + resizerWidth / 2) / pageWidth * 100;
        
        setPanelWidth(Math.min(Math.max(newPanelWidth, minWidth), maxWidth) + "%");
    }

    return (
        <div id="inspectorPanel" style={{ width: panelWidth }}>
            <Inspector />
            <Resizer setCursorX={setCursorX} />
        </div>
    );
}