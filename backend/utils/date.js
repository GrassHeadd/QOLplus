function getDateAtMonthStart(inputDate) {
  const fromDate = Date.parse(inputDate);
  const month = fromDate.getMonth() + 1;
  fromDate.setDate(1);
  return getQueryFormatDateStr(fromDate.getFullYear(), month, fromDate.getDate());
}

function getDateAtMonthEnd(inputDate) {
  const endDate = Date.parse(inputDate);
  const month = endDate.getMonth() + 1;
  endDate.setMonth(month);
  endDate.setDate(0);
  return getQueryFormatDateStr(endDate.getFullYear(), month, endDate.getDate());
}

function getDateAtWeekStart(dateStr) {
  let StartWeekDate = Date.parse(dateStr);
  while(getDayFromDate(StartWeekDate) > 0) {
      StartWeekDate.addDays(-1);
  }

  let year = StartWeekDate.getFullYear();
  let month = StartWeekDate.getMonth()+1;
  let day = StartWeekDate.getDate()+1;    
  return getQueryFormatDateStr(year, month, day); 
}

function getDateAtWeekEnd(dateStr) {
  let EndWeekDate = Date.parse(dateStr);
  while(getDayFromDate(EndWeekDate) < 6) {
      EndWeekDate.addDays(1);
  }
  let year = EndWeekDate.getFullYear();
  let month = EndWeekDate.getMonth()+1;
  let day = EndWeekDate.getDate()+1;  
  return getQueryFormatDateStr(year, month, day);
}

function getFormattedDateStr(dateStr) {
  let StartWeekDate = Date.parse(dateStr);
  let year = StartWeekDate.getFullYear();
  let month = StartWeekDate.getMonth()+1;
  let day = StartWeekDate.getDate()+1;    
  return getQueryFormatDateStr(year, month, day); 
}

function getDayFromDate(dateStr) {
  return Date.parse(dateStr).getDay(); //return 0-6
}

function getQueryFormatDateStr(year, month, dayOfMonth) {
  return year + "-" + month + "-" + dayOfMonth;
}

module.exports = {
  getDateAtMonthStart: getDateAtMonthStart,
  getDateAtMonthEnd: getDateAtMonthEnd,
  getStartOfWeek: getDateAtWeekStart,
  getEndOfWeek: getDateAtWeekEnd,
  getFormattedDateStr: getFormattedDateStr,
};