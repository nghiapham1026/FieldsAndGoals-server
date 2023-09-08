const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match");

router.post("", matchController.createMatch);
router.get('/getPastResults', matchController.getPastResults);
router.get('/getGamesByDates', matchController.getResultsByDates);
router.get('/getMatchesByDate', matchController.getMatchesByDate);

module.exports = router;