function getDateRange() {
  const startYear = "2023";
  const endYear = "2023";
  const startMonth = "8";
  const endMonth = "8";
  const startDay = "27";
  const endDay = "31";

  // Combine the date components into formatted strings
  const startDate = `${startYear}${startMonth.padStart(2, "0")}${startDay.padStart(2, "0")}`;
  const endDate = `${endYear}${endMonth.padStart(2, "0")}${endDay.padStart(2, "0")}`;

  return {
    startDate,
    endDate
  };
}

module.exports = {
  getDateRange
};
