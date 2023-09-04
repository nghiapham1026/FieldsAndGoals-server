const puppeteer = require("puppeteer");
const { scoresURL } = require("./constants");
const axios = require('axios'); // Add this at the top of your file

async function scrapeEspn(startDate, endDate, req, res) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 7_4_0; like Mac OS X) AppleWebKit/534.49 (KHTML, like Gecko)  Chrome/53.0.1780.199 Mobile Safari/533.3');

    const allMatchData = [];

    for (let currentDate = startDate; currentDate <= endDate; currentDate++) {
      const url = `${scoresURL}/_/date/${currentDate}`;
      
      await page.goto(url);
      await page.waitForSelector(".Scoreboard__RowContainer", { timeout: 120000 });

      const matchData = await page.evaluate((date) => {
        const matchData = [];
      
        const matchElements = document.querySelectorAll(".Scoreboard__RowContainer");
      
        matchElements.forEach((container) => {
          const matchInfo = {};
      
          const dateString = date.toString();
          const matchDateObj = new Date(
            parseInt(dateString.substring(0, 4)),
            parseInt(dateString.substring(4, 6)) - 1,
            parseInt(dateString.substring(6, 8))
          );
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          matchInfo.matchDate = matchDateObj.toLocaleDateString('en-US', options);
          
          const leagueElement = container.closest(".Card")?.querySelector(".Card__Header__Title");
          matchInfo.league = leagueElement ? leagueElement.textContent.trim() : '';
    
          const homeTeamElement = container.querySelector(".ScoreboardScoreCell__Item--home .ScoreCell__TeamName");
          matchInfo.homeTeam = homeTeamElement ? homeTeamElement.textContent.trim() : '';
    
          const awayTeamElement = container.querySelector(".ScoreboardScoreCell__Item--away .ScoreCell__TeamName");
          matchInfo.awayTeam = awayTeamElement ? awayTeamElement.textContent.trim() : '';
    
          const homeScoreElement = container.querySelector(".ScoreboardScoreCell__Item--home .ScoreCell__Score");
          matchInfo.homeScore = homeScoreElement ? homeScoreElement.textContent.trim() : '';
    
          const awayScoreElement = container.querySelector(".ScoreboardScoreCell__Item--away .ScoreCell__Score");
          matchInfo.awayScore = awayScoreElement ? awayScoreElement.textContent.trim() : '';
    
          const matchStatusElement = container.querySelector(".ScoreCell__Time");
          matchInfo.matchStatus = matchStatusElement ? matchStatusElement.textContent.trim() : '';
    
          const homeLogoElement = container.querySelector(".ScoreboardScoreCell__Item--home .ScoreboardScoreCell__Logo");
          matchInfo.homeLogo = homeLogoElement ? homeLogoElement.getAttribute("src") : '';
    
          const awayLogoElement = container.querySelector(".ScoreboardScoreCell__Item--away .ScoreboardScoreCell__Logo");
          matchInfo.awayLogo = awayLogoElement ? awayLogoElement.getAttribute("src") : '';

          if (matchInfo.homeScore === '') {
            matchInfo.homeScore = ' ';
          }
        
          if (matchInfo.awayScore === '') {
            matchInfo.awayScore = ' ';
          }

          if (!matchInfo.homeLogo) {
            matchInfo.homeLogo = 'https://www.seekpng.com/png/full/28-289657_espn-soccer-team-logo-default.png';
          }
        
          if (!matchInfo.awayLogo) {
            matchInfo.awayLogo = 'https://www.seekpng.com/png/full/28-28957_espn-soccer-team-logo-default.png';
          }
          
          matchData.push(matchInfo);
        });

        return matchData;
      }, currentDate);

      allMatchData.push(...matchData);
    }

    await browser.close();

    axios.post('http://localhost:8080/api/todo', { matches: allMatchData })
      .then(response => {
        console.log('Data sent to /api/todo:', response.data);
      })
      .catch(error => {
        console.error('Error sending data to /api/todo:', error);
      });
    
    res.json({ matches: allMatchData });
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).json({ error: "Error scraping data" });
  }
}

module.exports = {
  scrapeEspn
};
