export function togglePopup() {
    const popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", () => {
    const popupElement = document.querySelector(".popup");
    if (popupElement) {
      popupElement.addEventListener("click", togglePopup);
    }
});