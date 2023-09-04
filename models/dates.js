function getPacificDate() {
  const utcDate = new Date();
  const pacificOffset = -8 * 60; // Pacific Time offset in minutes
  const localOffset = utcDate.getTimezoneOffset(); // Local time offset in minutes
  const offsetDifference = localOffset - pacificOffset;
  return new Date(utcDate.getTime() - offsetDifference * 60 * 1000);
}

function getDateRange(userStartDate, userEndDate) {
  const startDate = userStartDate || formatDate(getPacificDate());

  let endDate = userEndDate || formatDate(new Date(getPacificDate().setDate(getPacificDate().getDate() + 7))); // 7 days from today as default

  const startDateObj = new Date(startDate.substring(0, 4), parseInt(startDate.substring(4, 6)) - 1, startDate.substring(6, 8));
  const endDateObj = new Date(endDate.substring(0, 4), parseInt(endDate.substring(4, 6)) - 1, endDate.substring(6, 8));

  const diffInDays = (endDateObj - startDateObj) / (1000 * 60 * 60 * 24);

  // Limit endDate to be at most 21 days from startDate
  if (diffInDays > 21) {
    const newEndDateObj = new Date(startDateObj);
    newEndDateObj.setDate(newEndDateObj.getDate() + 21);
    endDate = formatDate(newEndDateObj);
  }

  return {
    startDate,
    endDate
  };
}

function getYesterdayDate() {
  const currentDate = getPacificDate();
  const yesterday = new Date(currentDate.setDate(currentDate.getDate() - 1));
  return formatDate(yesterday);
}

function formatDate(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

module.exports = {
  getDateRange,
  getYesterdayDate
};
