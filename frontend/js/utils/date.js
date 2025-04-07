// Format YYYY-MM-DD because you can wrap it in new Date("") and it will work automatically
export function getDateStrForBackend(dateObj) {
    return dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
}