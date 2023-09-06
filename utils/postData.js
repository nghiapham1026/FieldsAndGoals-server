const axios = require('axios');

async function postData(allMatchData) {
  try {
    const response = await axios.post('http://localhost:8080/api/todo', { matches: allMatchData });
    console.log('Data sent to /api/todo:', response.data);

    return true;
  } catch (error) {
    console.error('Error sending data to /api/todo:', error);
  }
}

module.exports = {
  postData
}
