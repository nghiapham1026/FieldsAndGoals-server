const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const scrapeController = require("./controllers/webscrapeController");
const { getDateRange, getYesterdayDate } = require("./utils/dateUtils");
const { postData } = require('./utils/postData');

const yesterdayDate = getYesterdayDate();

async function main() {
  await mongoose.connect(process.env.DB);
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const app = express();

app.use("/api/todo", require("./routes/todo.js"));

app.get("/espn/getGamesByDates", (req, res) => {
  /**
   * User can specify endDate by appending it as a query parameter:
   * http://localhost:8080/espn/getGamesByDates?endDate=20230908
   */
  const userEndDate = req.query.endDate;

  try {
    const { startDate, endDate } = getDateRange(userEndDate);
    scrapeController.scrapeEspn(startDate, endDate, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/yesterday", async (req, res) => {
  try {
    const allMatchData = await scrapeController.scrapeEspn(yesterdayDate, yesterdayDate, res);

    const postSuccess = await postData(allMatchData);
    if (postSuccess) {
      const successMessage = 'Successfully posted data';
      console.log(successMessage);
      res.status(200).json({ message: successMessage });
    } else {
      res.status(500).json({ error: 'Failed to post data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
