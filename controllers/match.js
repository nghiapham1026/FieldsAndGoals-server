const MatchData = require("../models/match");
const { getDateRange, getYesterdayDate } = require("../utils/dateUtils");
const scrapeController = require("./webscrapeController");
const mongoose = require("mongoose");

const yesterdayDate = getYesterdayDate();

exports.createMatch = (req, res) => {
  const matchesData = req.body.matches;

  const matchData = new MatchData({
    matches: matchesData.map((match) => ({
      matchDate: match.matchDate,
      league: match.league,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      matchStatus: match.matchStatus,
      homeLogo: match.homeLogo,
      awayLogo: match.awayLogo,
    })),
  });

  matchData
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Match data added successfully",
        matches: result.matches,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to add match data",
        error: err,
      });
    });
};

exports.getPastResults = async (_, res) => {
  try {
    const allMatchData = await scrapeController.scrapeEspn(yesterdayDate, yesterdayDate);

    const newMatch = new MatchData({
      matches: allMatchData
    });

    const savedMatch = await newMatch.save();

    if (savedMatch) {
      const successMessage = 'Successfully posted data';
      console.log(successMessage, savedMatch);
      res.status(200).json({ message: successMessage });
    } else {
      res.status(500).json({ error: 'Failed to post data' });
    }
  } catch (error) {
    console.error('Error saving data to database:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
   * User can specify endDate by appending it as a query parameter:
   * http://localhost:8080/espn/getGamesByDates?endDate=20230912
   */
exports.getResultsByDates = async (req, res) => {
  const userEndDate = req.query.endDate;

  try {
    const { startDate, endDate } = getDateRange(userEndDate);
    const scrapedData = await scrapeController.scrapeEspn(startDate, endDate);
    res.status(200).json(scrapedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sample query: http://localhost:8080/espn/getMatchesByDate?date=September%209,%202023
exports.getMatchesByDate = async (req, res) => {
  const queryDate = req.query.date || getYesterdayDate();

  try {
    const matches = await MatchData.find({ "matches.matchDate": queryDate });
    if (matches.length > 0) {
      res.status(200).json(matches);
    } else {
      res.status(404).json({ message: "No matches found for the given date" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};