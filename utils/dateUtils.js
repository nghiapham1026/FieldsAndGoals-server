function getDateRange(userEndDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startDate = formatDate(tomorrow);

  if (userEndDate) {
    const userEnd = new Date(
      parseInt(userEndDate.substring(0, 4)),
      parseInt(userEndDate.substring(4, 6)) - 1,
      parseInt(userEndDate.substring(6, 8))
    );
    userEnd.setHours(0, 0, 0, 0);

    if (userEnd < today) {
      throw new Error("endDate should not be set for any time before today");
    }

    // Calculate the difference in days between startDate and userEnd
    const diffInDays = (userEnd - tomorrow) / (1000 * 60 * 60 * 24);

    if (diffInDays > 14) {
      throw new Error("endDate should not be more than 14 days from startDate");
    }
  }

  const endDate = userEndDate || formatDate(new Date(tomorrow.setDate(tomorrow.getDate() + 6)));

  return {
    startDate,
    endDate
  };
}

function getYesterdayDate() {
  const currentDate = new Date(); // Use server's local time
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