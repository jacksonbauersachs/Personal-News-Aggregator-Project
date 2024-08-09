const express = require('express');
const axios = require('axios');
const router = express.Router();
const sanitizeHtml = require('sanitize-html'); // Add this

router.get('/article', async (req, res) => {
  const { url } = req.query;
  try {
    console.log('Fetching article content from URL:', url);
    const response = await axios.get(url);
    console.log('Fetched article content:', response.data);

    // Clean up the HTML response
    const cleanContent = sanitizeHtml(response.data, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        '*': ['href', 'align', 'alt', 'center', 'bgcolor', 'cite', 'height', 'target', 'title', 'width', 'src']
      }
    });

    res.send(cleanContent);
  } catch (error) {
    console.error('Error fetching article content:', error);
    res.status(500).json({ error: 'Error fetching article content' });
  }
});

module.exports = router;















