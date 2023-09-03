const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const scrapeController = require("./controllers/webscrapeController");
const { getDateRange, getYesterdayDate } = require("./models/dates");

const { startDate, endDate } = getDateRange();
const yesterdayDate = getYesterdayDate();
const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected to the database");
    
    const app = express();

    app.use(express.json({ limit: '25mb' }));
    app.use(express.urlencoded({ limit: '25mb' }));

    app.use("/api/todo", require("./routes/todo.js"));

    app.get("/", (req, res) => {
      scrapeController.scrapeEspn(startDate, endDate, req, res);
    });

    app.get("/yesterday", (req, res) => {
      scrapeController.scrapeEspn(yesterdayDate, yesterdayDate, req, res);
    });

    app.listen(8080, () => {
      console.log("Server listening on port 8080");
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

main();
