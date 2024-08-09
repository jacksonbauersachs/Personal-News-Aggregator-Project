const express = require('express');
const router = express.Router();
const { getArticles } = require('./news'); // Assuming you have a function to get articles

router.get('/recommendations', async (req, res) => {
  const articles = await getArticles(); // Fetch articles
  res.status(200).json(articles);
});

module.exports = router;



