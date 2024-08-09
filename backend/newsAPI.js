const axios = require('axios');

const getArticleContent = async (url) => {
  try {
    const response = await axios.get(url);
    return {
      title: response.data.title,
      description: response.data.description,
      content: response.data.content || response.data.body,
    };
  } catch (error) {
    console.error('Error fetching article content:', error);
    throw error;
  }
};

module.exports = { getArticleContent };




