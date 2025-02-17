function getDateAtMonthStart(inputDate) {
  const fromDate = Date.parse(inputDate);
  const month = fromDate.getMonth() + 1;
  fromDate.setDate(1);
  console.log("Start Date: " + formatDate(fromDate.getFullYear(), month, fromDate.getDate()));
  return formatDate(fromDate.getFullYear(), month, fromDate.getDate());
}

function getDateAtMonthEnd(inputDate) {
  const endDate = Date.parse(inputDate);
  const month = endDate.getMonth() + 1;
  endDate.setMonth(month);
  endDate.setDate(0);
  console.log("End Date: " + formatDate(endDate.getFullYear(), month, endDate.getDate()));
  return formatDate(endDate.getFullYear(), month, endDate.getDate());
}

function getStartOfWeek(dateStr) {
  let StartWeekDate = Date.parse(dateStr);
  while(getDayFromDate(StartWeekDate) > 0) {
      StartWeekDate.addDays(-1);
  }

  let year = StartWeekDate.getFullYear();
  let month = StartWeekDate.getMonth()+1;
  let day = StartWeekDate.getDate()+1;    
  console.log("Start Date: " + formatDate(year, month, day));
  return formatDate(year, month, day); 
}

function getEndOfWeek(dateStr) {
  let EndWeekDate = Date.parse(dateStr);
  while(getDayFromDate(EndWeekDate) < 6) {
      EndWeekDate.addDays(1);
  }
  let year = EndWeekDate.getFullYear();
  let month = EndWeekDate.getMonth()+1;
  let day = EndWeekDate.getDate()+1;  
  return formatDate(year, month, day);
}

function getDayFromDate(dateStr) {
  return Date.parse(dateStr).getDay(); //return 0-6
}

function formatDate(year, month, dayOfMonth) {
  return year + "-" + month + "-" + dayOfMonth;
}

module.exports = {
  getDateAtMonthStart: getDateAtMonthStart,
  getDateAtMonthEnd: getDateAtMonthEnd,
  getStartOfWeek: getStartOfWeek,
  getEndOfWeek: getEndOfWeek
};