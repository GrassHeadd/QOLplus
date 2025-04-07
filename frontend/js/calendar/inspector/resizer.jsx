import React from "react";
import { useState, useEffect } from "react";

/**
 * Vertical resizer sliding bar for the inspector panel.
 *  
 * @setCursorX Parent Prop: setCursorX function
 */
export default function Resizer({ setCursorX }) {
    /* TODO: Uncover why adding listeners in the beginning does not work 
        For some reason, registering the listeners (in return) right at the start then just manipulating the props
        onMouseDown and onMouseUp works, but the prop change does not reflect in onHoldMove (it's always true after the
        first click), so I had to use this workaround.
    */

    function onMouseDown(event) {
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMouseMove);
    }

    function onTouchStart(event) {
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("touchmove", onTouchMove);
    }

    function onMouseUp(event) {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }

    function onTouchEnd(event) {
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
    }

    function onMouseMove(event) {
        setCursorX(event.clientX);
    }

    function onTouchMove(event) {
        setCursorX(event.touches[0].clientX);
    }

    return (
        <div className="resizer" onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
            <div className="handle"></div>
        </div>
    );
}