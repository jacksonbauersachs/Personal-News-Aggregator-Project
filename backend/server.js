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

// Define REGION_MAPPING
const REGION_MAPPING = {
  "United State": "US",
  "United Kingdom": "GB",
  "Canada": "CA",
  "Australia": "AU",
  "Germany": "DE",
  "France": "FR",
  "India": "IN",
  "China": "CN",
  "Japan": "JP",
  "South Korea": "KR",
  "Italy": "IT",
  "Spain": "ES",
  "South Africa": "ZA",
  "Hong Kong": "HK",
  "Argentina": "AR",
  "Venezuela": "VE",
  "Brazil": "BR",
  "Finland": "FI",
  "Indonesia": "ID",
  "Vietnam": "VN",
  "Mexico": "MX",
  "Greece": "GR",
  "Netherlands": "NL",
  "Norway": "NO",
  "New Zealand": "NZ",
  "Russia": "RU",
  "Saudi-Arabia": "SA",
  "Switzerland": "CH",
  "Thailand": "TH",
  "United Arab Emirates": "AE",
  "Ireland": "IE",
  "Iran": "IR",
  "Iraq": "IQ",
  "Romania": "RO",
  "Afghanistan": "AF",
  "Zimbabwe": "ZW",
  "Myanmar": "MM",
  "Sweden": "SE",
  "Peru": "PE",
  "Panama": "PA",
  "Egypt": "EG",
  "Turkey": "TR",
  "Israel": "IL",
  "Czech Republic": "CZ",
  "Bangladesh": "BD",
  "Nigeria": "NG",
  "Kenya": "KE",
  "Chile": "CL",
  "Uruguay": "UY",
  "Ecuador": "EC",
  "Serbia": "RS",
  "Hungary": "HU",
  "Slovenia": "SI",
  "Ghana": "GH",
  "Bolivia": "BO",
  "Pakistan": "PK",
  "Colombia": "CO",
  "North Korea": "KP",
  "Paraguay": "PY",
  "Palestine": "PS",
  "Estonia": "EE",
  "Lebanon": "LB",
  "Qatar": "QA",
  "Kuwait": "KW",
  "Cambodia": "KH",
  "Nepal": "NP",
  "Luxembourg": "LU",
  "Bosnia": "BA",
  "Europe": "EU",
  "Asia": "AS",
  "International": "INT"
};

// Define LANGUAGE_MAPPING
const LANGUAGE_MAPPING = {
  'Arabic': 'ar',
  'Chinese': 'zh',
  'Dutch': 'nl',
  'English': 'en',
  'Finnish': 'fi',
  'French': 'fr',
  'German': 'de',
  'Hindi': 'hi',
  'Italian': 'it',
  'Japanese': 'ja',
  'Korean': 'ko',
  'Malay': 'ms',
  'Portuguese': 'pt',
  'Russian': 'ru',
  'Spanish': 'es',
  'Vietnamese': 'vi',
  'Danish': 'da',
  'Czech': 'cs',
  'Greek': 'el',
  'Hungarian': 'hu',
  'Serbian': 'sr',
  'Thai': 'th',
  'Turkish': 'tr'
};

// Define VALID_CATEGORIES if not already defined
const VALID_CATEGORIES = [
  'regional',
  'technology',
  'lifestyle',
  'business',
  'general',
  'programming',
  'science',
  'entertainment',
  'world',
  'sports',
  'finance',
  'academia',
  'politics',
  'health',
  'opinion',
  'food',
  'game',
  'fashion',
  'academic',
  'crap',
  'travel',
  'culture',
  'economy',
  'environment',
  'art',
  'music',
  'notsure',
  'CS',
  'education',
  'redundant',
  'television',
  'commodity',
  'movie',
  'entrepreneur',
  'review',
  'auto',
  'energy',
  'celebrity',
  'medical',
  'gadgets',
  'design',
  'EE',
  'security',
  'mobile',
  'estate',
  'funny'
];

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

  if (isNaN(publishedDate.getTime())) {
    console.error(`Invalid published date: ${publishedAt}`);
    return 'Unknown';
  }

  const diffMs = now - publishedDate;

  if (diffMs < 0) {
    return 'Just now';
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
};

app.get('/api/news', async (req, res) => {
  const { countries = 'United State', categories, language = 'English', userEmail } = req.query;

  try {
    // Map country and language names to API codes
    const countryCode = REGION_MAPPING[countries] || 'US';
    const languageCode = LANGUAGE_MAPPING[language] || 'en';

    // Calculate the date range for the past two days
    const endDate = new Date().toISOString();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2); // 2 days ago
    const startDateString = startDate.toISOString();

    let query = `https://api.currentsapi.services/v1/latest-news?apiKey=${CURRENTS_API_TOKEN}&language=${languageCode}&start_date=${startDateString}&end_date=${endDate}`;

    if (!userEmail) {
      // Default articles: add the specific categories we want
      const defaultCategories = ['sports', 'politics', 'science', 'lifestyle', 'culture', 'academic'];
      query += `&category=${defaultCategories.join(',')}&country=${countryCode}`;
    } else {
      // For logged-in users, use their preferences
      if (categories) {
        const validCategories = categories.split(',').filter(cat => VALID_CATEGORIES.includes(cat.trim()));
        if (validCategories.length > 0) {
          query += `&category=${validCategories.join(',')}`;
        }
      }
      query += `&country=${countryCode}`;
    }

    console.log('Fetching articles with query:', query);

    const response = await axios.get(query);

    console.log('API response:', response.data);

    if (!response.data.news || response.data.news.length === 0) {
      console.error('No articles found in the API response');
      return res.status(500).json({ error: 'No articles found' });
    }

    // Filter and map articles
    const articles = response.data.news
      .filter(article => article.image && article.image !== 'None' && article.language === 'en')
      .map((article) => {
        const publishedTimeAgo = formatTimeAgo(article.published);
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



































