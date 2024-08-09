import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Article.css';

const Article = () => {
  const [content, setContent] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const articleUrl = queryParams.get('url');

  useEffect(() => {
    const fetchArticleContent = async () => {
      try {
        console.log('Fetching article content from URL:', articleUrl);
        const response = await axios.get(`http://localhost:5000/api/article?url=${encodeURIComponent(articleUrl)}`);
        console.log('Fetched article content:', response.data);
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching article content:', error);
      }
    };

    if (articleUrl) {
      fetchArticleContent();
    }
  }, [articleUrl]);

  return (
    <div className="article-content">
      {content ? (
        <div>
          <h2>Article</h2>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      ) : (
        <p>Loading article...</p>
      )}
    </div>
  );
};

export default Article;








