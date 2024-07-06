var isNavToggled = false;
var counter = 0;

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