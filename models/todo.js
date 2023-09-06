const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    matches: [
      {
        matchDate: {
          type: String,
          required: true,
        },
        league: {
          type: String,
          required: true,
        },
        homeTeam: {
          type: String,
          required: true,
        },
        awayTeam: {
          type: String,
          required: true,
        },
        homeScore: {
          type: String,
          required: true,
        },
        awayScore: {
          type: String,
          required: true,
        },
        matchStatus: {
          type: String,
          required: true,
        },
        homeLogo: {
          type: String,
          required: true,
        },
        awayLogo: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { collection: "sampleMatchData"}
);

module.exports = mongoose.model("Todo", todoSchema);
