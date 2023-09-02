const Todo = require("../models/todo");

exports.createTodo = (req, res, next) => {
  const matchesData = req.body.matches;

  const todo = new Todo({
    matches: matchesData.map((matchData) => ({
      matchDate: matchData.matchDate,
      league: matchData.league,
      homeTeam: matchData.homeTeam,
      awayTeam: matchData.awayTeam,
      homeScore: matchData.homeScore,
      awayScore: matchData.awayScore,
      matchStatus: matchData.matchStatus,
      homeLogo: matchData.homeLogo,
      awayLogo: matchData.awayLogo,
    })),
  });

  todo
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