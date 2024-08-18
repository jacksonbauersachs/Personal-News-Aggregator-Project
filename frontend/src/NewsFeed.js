import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NewsFeed.css';

const NewsFeed = ({ userEmail }) => {
  const [articles, setArticles] = useState([]);
  const [expandedArticles, setExpandedArticles] = useState([]); // Track which articles are expanded

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let response;
        if (userEmail) {
          const prefsResponse = await axios.get(`http://localhost:5000/api/preferences/${userEmail}`);
          const preferences = prefsResponse.data;
          console.log('Fetched preferences:', preferences);

          const countries = preferences.countries.join(',');
          const categories = preferences.categories.join(',');

          let query = `http://localhost:5000/api/news?`;
          if (countries) query += `countries=${countries}&`;
          if (categories) query += `categories=${categories}&`;

          response = await axios.get(query);
        } else {
          response = await axios.get('http://localhost:5000/api/news?country=us'); // Default articles for non-logged-in users
        }

        setArticles(response.data); // Simply set the articles without additional filtering
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, [userEmail]);

  // Toggle description visibility
  const toggleDescription = (index, e) => {
    e.stopPropagation(); // Prevent the click from triggering the link
    if (expandedArticles.includes(index)) {
      setExpandedArticles(expandedArticles.filter((i) => i !== index));
    } else {
      setExpandedArticles([...expandedArticles, index]);
    }
  };

  // Handle click on article card
  const handleCardClick = (articleUrl, e) => {
    if (e.target.closest('.description-toggle')) {
      return;
    }
    window.open(articleUrl, '_blank');
  };

  return (
    <div className="news-feed">
      <h2>Top News Stories</h2>
      <div className="articles-grid">
        {articles.length === 0 ? (
          <p>Loading articles...</p>
        ) : (
          articles.map((article, index) => (
            <div
              key={index}
              className={`article-card ${expandedArticles.includes(index) ? 'expanded' : ''}`}
              onClick={(e) => handleCardClick(article.url, e)}
            >
              {article.urlToImage ? (
                <img src={article.urlToImage} alt={article.title} className="article-image" onError={(e) => e.target.style.display = 'none'} />
              ) : (
                <div className="placeholder-image">No Image Available</div>
              )}
              <div className="article-info">
                <span className="article-meta">
                  {article.source} &bull; {article.publishedAt}
                </span>
              </div>
              <h3>{article.title}</h3>

              {/* Description Dropdown */}
              <div className="description-toggle" onClick={(e) => toggleDescription(index, e)}>
                <span className="description-text">Description</span>
                <span className="toggle-arrow">{expandedArticles.includes(index) ? '▲' : '▼'}</span>
              </div>
              {expandedArticles.includes(index) && (
                <div className="article-description">
                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="visit-site">
                    Visit site
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeed;


































