// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const preferencesRoute = require('./preferences');
const authRoute = require('./routes/auth');

// Import dictionaries from config.js
const { subdomainDictionary, sourceDictionary } = require('./config');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const CURRENTS_API_TOKEN = process.env.CURRENTS_API_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

console.log('Connecting to MongoDB with URI:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Function to extract the domain name and map to the source
const extractDomainName = (url) => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');

    // Check for a subdomain match first
    if (subdomainDictionary[domain]) {
      return subdomainDictionary[domain];
    }

    // Extract base domain if no subdomain match is found
    const baseDomain = domain.split('.')[0];
    return sourceDictionary[baseDomain] || baseDomain;
  } catch (error) {
    console.error('Error extracting domain name:', error);
    return url;
  }
};

// Utility function to calculate time difference and format it
const formatTimeAgo = (publishedAt) => {
  const now = new Date();
  const publishedDate = new Date(publishedAt);

  // Check if publishedDate is a valid date
  if (isNaN(publishedDate.getTime())) {
    console.error(`Invalid published date: ${publishedAt}`);
    return 'Unknown'; // Return a default value for invalid dates
  }

  const diffMs = now - publishedDate; // Calculate difference in milliseconds

  if (diffMs < 0) {
    return 'Just now'; // Handle future dates gracefully
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Convert to minutes
  if (diffMinutes < 60) {
    return `${diffMinutes}m`; // Less than an hour, show in minutes
  }

  const diffHours = Math.floor(diffMinutes / 60); // Convert to hours
  if (diffHours < 24) {
    return `${diffHours}h`; // Less than a day, show in hours
  }

  const diffDays = Math.floor(diffHours / 24); // Convert to days
  return `${diffDays}d`; // 1 or more days, show in days
};

app.get('/api/news', async (req, res) => {
  const { countries, categories } = req.query;
  try {
    let query = `https://api.currentsapi.services/v1/latest-news?apiKey=${CURRENTS_API_TOKEN}&language=en`;
    if (categories) {
      query += `&category=${categories}`;
    }
    if (countries) {
      query += `&country=${countries}`;
    }

    console.log('Fetching articles with query:', query);

    const response = await axios.get(query);

    console.log('API response:', response.data);

    if (!response.data.news || response.data.news.length === 0) {
      console.error('No articles found in the API response');
      return res.status(500).json({ error: 'No articles found' });
    }

    const articles = response.data.news
      .filter(article => article.image && article.image !== 'None' && article.language === 'en')
      .map((article) => {
        const publishedTimeAgo = formatTimeAgo(article.published); // Format the published date
        return {
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image,
          publishedAt: publishedTimeAgo,
          source: extractDomainName(article.url),
        };
      });

    if (articles.length === 0) {
      console.error('No valid articles found after filtering');
      return res.status(500).json({ error: 'No valid articles found' });
    }

    console.log('Fetched articles:', articles);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching news' });
  }
});

app.use('/api', preferencesRoute);
app.use('/api', authRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});































