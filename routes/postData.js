const axios = require('axios');
const fs = require('fs');

async function postData(allMatchData) {
  try {
    const response = await axios.post('http://localhost:8080/api/todo', { matches: allMatchData });
    console.log('Data sent to /api/todo:', response.data);

    return true;
  } catch (error) {
    console.error('Error sending data to /api/todo:', error);
  }
}

function logToFile(message) {
  const formattedMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync('./postLogs.txt', formattedMessage, 'utf8');
}

module.exports = {
  postData,
  logToFile
}
