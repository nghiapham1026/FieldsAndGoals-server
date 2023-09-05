const express = require("express");
require("dotenv").config();
const scrapeController = require("./controllers/webscrapeController");
const { getDateRange, getYesterdayDate } = require("./models/dates");
const cors = require('cors');
const cron = require('node-cron');
const { postData, logToFile } = require('./routes/postData');
const mongoose = require("mongoose");

const { startDate, endDate } = getDateRange();
const yesterdayDate = getYesterdayDate();

async function main() {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected to the database");
    
    const app = express();
    app.use(cors());

    app.use(express.json({ limit: '25mb' }));
    app.use(express.urlencoded({ limit: '25mb' }));

    app.use("/api/todo", require("./routes/todo.js"));

    app.get("/", (req, res) => {
      scrapeController.scrapeEspn(startDate, endDate, req, res);
    });

    app.get("/yesterday", (req, res) => {
      scrapeController.scrapeEspn(yesterdayDate, yesterdayDate, req, res);
    });

    cron.schedule('0 14 * * *', async () => {
      const logMessage = 'Running cron job to fetch data';
      console.log(logMessage);
      logToFile(logMessage);

      const yesterdayDate = getYesterdayDate();
      const { req, res } = {};
      const allMatchData = await scrapeController.scrapeEspn(yesterdayDate, yesterdayDate, req, res);

      const postSuccess = await postData(allMatchData);
      if (postSuccess) {
        const successMessage = 'Successfully posted data';
        console.log(successMessage);
        logToFile(successMessage);
      }
      
    });

    app.listen(8080, () => {
      console.log("Server listening on port 8080");
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

main();
