var isNavToggled = false;
var isDraggingDivider = false;
var counter = 0;

document.addEventListener("DOMContentLoaded", (domLoadEvent) => {
    panelResizeListener();
});

function onNavToggleBtnClick(clickEvent) {
    var navBar = document.getElementById("nav");
    var navBtnRects = document.getElementById("navToggleBtn").getElementsByClassName("rect");

    isNavToggled = !isNavToggled;
    if (isNavToggled) {
        navBar.classList.add("open");
        for (var i = 0; i < navBtnRects.length; i++) {
            navBtnRects[i].classList.add("open");
        }
    }
    else {
        navBar.classList.remove("open");
        for (var i = 0; i < navBtnRects.length; i++) {
            navBtnRects[i].classList.remove("open");
        }
    }
}

function calendarLayout() {
    console.log("shes a burden for " + counter + "times");
    counter++;
}

/**
 * Controls the resizing behaviour of the left and right windows in the main panel
 * 
 * Issue: If resizing is too fast, cursor will highlight text it moves over briefly
 * 
 * @param {Number} leftPanelMinWidthPerc The minimum width (in %) that the left panel can have
 * @param {Number} leftPanelMaxWidthPerc The maximum width (in %) that the left panel can have
 */
function panelResizeListener(leftPanelMinWidthPerc = 30, leftPanelMaxWidthPerc = 80) {
    const mainPanel = document.getElementById("mainArea").getElementsByClassName("main")[0], leftPanel = mainPanel.getElementsByClassName("left")[0], resizer = mainPanel.getElementsByClassName("resizer")[0];

    resizer.addEventListener("mousedown", (mouseEvent) => { isDraggingDivider = true; });
    document.addEventListener("mouseup", (mouseEvent) => { isDraggingDivider = false; });
    resizer.addEventListener("touchstart", (mouseEvent) => { isDraggingDivider = true; });
    document.addEventListener("touchend", (mouseEvent) => { isDraggingDivider = false; });

    document.addEventListener("mousemove", (event) => {
        if (!isDraggingDivider) return;
        event.preventDefault();
        const mainPanelWidth = parseInt(document.defaultView.getComputedStyle(mainPanel).width);
        
        /*
            #1: Math.min(Math.max(x, minBound), maxBound) performs a clamp so the returned value is always within the boundaries

            #2: mouseEvent.clientX returns how many px the cursor is from left of screen

            #3: document.documentElement.clientWidth / 10 is equal to "10vw" (clientWidth = 100vw). This value is subtracted to ensure the left margin of the main panel is taken into account
        */ 
        leftPanel.style.width = Math.min(Math.max(((event.clientX - document.documentElement.clientWidth / 10) * 100 / mainPanelWidth), leftPanelMinWidthPerc), leftPanelMaxWidthPerc) + "%";
    });
    document.addEventListener("touchmove", (event) => {
        if (!isDraggingDivider) return;
        const mainPanelWidth = parseInt(document.defaultView.getComputedStyle(mainPanel).width);
        
        /*
            #1: Math.min(Math.max(x, minBound), maxBound) performs a clamp so the returned value is always within the boundaries

            #2: mouseEvent.clientX returns how many px the cursor is from left of screen

            #3: document.documentElement.clientWidth / 10 is equal to "10vw" (clientWidth = 100vw). This value is subtracted to ensure the left margin of the main panel is taken into account
        */ 
        leftPanel.style.width = Math.min(Math.max(((event.touches.item(0).clientX - document.documentElement.clientWidth / 10) * 100 / mainPanelWidth), leftPanelMinWidthPerc), leftPanelMaxWidthPerc) + "%";
    });
}