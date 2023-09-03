function getDateRange() {
  const startYear = "2023";
  const endYear = "2023";
  const startMonth = "8";
  const endMonth = "8";
  const startDay = "27";
  const endDay = "31";

  const startDate = `${startYear}${startMonth.padStart(2, "0")}${startDay.padStart(2, "0")}`;
  const endDate = `${endYear}${endMonth.padStart(2, "0")}${endDay.padStart(2, "0")}`;

  return {
    startDate,
    endDate
  };
}

function getYesterdayDate() {
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

module.exports = {
  getDateRange,
  getYesterdayDate
};
