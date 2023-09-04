function getDateRange(userStartDate, userEndDate) {
  // If userStartDate is provided, use it; otherwise, use today's date
  const startDate = userStartDate || formatDate(new Date());

  // If userEndDate is provided, use it; otherwise, use a default value
  const endDate = userEndDate || formatDate(new Date(new Date().setDate(new Date().getDate() + 7))); // 7 days from today as default

  return {
    startDate,
    endDate
  };
}

function getYesterdayDate() {
  const currentDate = new Date();
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
