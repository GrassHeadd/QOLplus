import React, { useEffect } from "react";
import { useState } from "react";

import Inspector from "./inspector.jsx";
import Resizer from "./inspector/resizer.jsx";

export default function InspectorPanel() {
    const [isResizing, setIsResizing] = useState(false);
    const [cursorX, setCursorX] = useState(-1);
    const [initCursorInInspRatio, setInitCursorInInspRatio] = useState(-1); // Default ratio of inspector panel width to page width
    const [prevCursorOnPagePerc, setPrevCursorOnPagePerc] = useState(-1); // Default ratio of inspector panel width to page width
    const [panelWidth, setPanelWidth] = useState(30);

    // Calls function upon any change to cursorX (which is updated by Resizer child component)
    useEffect(() => {
        calculatePanelWidth(cursorX);
    }, [cursorX]);

    useEffect(() => {
        if (!isResizing) {
            setInitCursorInInspRatio(-1); // Reset initial cursorOnPageRatio when resizing stops
            setPrevCursorOnPagePerc(-1); // Reset cursorInInspRatio when resizing stops
        }
    }, [isResizing]);

    function calculatePanelWidth(cursorX, minWidth = 20, maxWidth = 50) {
        // Prevent trigger in recalculation on page load which overrides default panel width
        if (cursorX === -1) return;
        if (!isResizing) return;

        const pageWidth = parseInt(document.defaultView.getComputedStyle(document.querySelector("body")).width);
        const totalInspWidth = parseInt(document.defaultView.getComputedStyle(document.querySelector("#inspectorPanel")).width);
        // Aligns the cursor and resizing to the center of the resizer, otherwise it'll align to the edge of the entire panel
        // const newPanelWidth = (cursorX + resizerWidth / 2) / pageWidth * 100;

        // On first mouse/touch down, record which position the cursor is relative to the page, since the inspector panel width is also relative to the page
        if (initCursorInInspRatio == -1) {
            setInitCursorInInspRatio(cursorX / totalInspWidth);
            setPrevCursorOnPagePerc((cursorX / pageWidth) * 100);
            return;
        }

        // Calculate how much the cursor has moved from the initial mouse/touch down position, relative to the page width
        const curCursorOnPagePerc = (cursorX / pageWidth) * 100;
        const percentageDelta = curCursorOnPagePerc - prevCursorOnPagePerc;

        // Update previous value with current one
        setPrevCursorOnPagePerc(curCursorOnPagePerc);

        // If panel is at bounds, and mouse went out of bounds, wait for the mouse to come back to original mouse/touch down position
        // Flaw: Not very accurate if the user moves the mouse too quickly; it seems the mouse event refresh can't catch up
        if (panelWidth <= minWidth && cursorX / totalInspWidth < initCursorInInspRatio) return;
        if (panelWidth >= maxWidth && cursorX / totalInspWidth > initCursorInInspRatio) return;

        // Move the inspector panel width by the same percentage delta. Clamp it to the min and max width
        const newPanelWidth = Math.min(Math.max(panelWidth + percentageDelta, minWidth), maxWidth);

        setPanelWidth(newPanelWidth);
    }

    return (
        <div id="inspectorPanel" style={{ width: panelWidth + "%" }}>
            <Inspector />
            <Resizer setCursorX={setCursorX} setIsResizing={setIsResizing} />
        </div>
    );
}