const axios = require('axios');

const getArticles = async () => {
  const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
  return response.data.articles;
};

module.exports = { getArticles };
