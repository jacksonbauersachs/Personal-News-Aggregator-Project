import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Preferences.css';

const Preferences = ({ userEmail }) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleCountryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCountries([...countries, value]);
    } else {
      setCountries(countries.filter(country => country !== value));
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategories([...categories, value]);
    } else {
      setCategories(categories.filter(category => category !== value));
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    const preferences = {
      city,
      state,
      countries,
      categories,
    };
    try {
      console.log('Saving preferences for user:', userEmail, preferences); // Log preferences
      await axios.post('http://localhost:5000/api/preferences', { email: userEmail, preferences });
      navigate('/');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="preferences">
      <h2>Select Your Preferences</h2>
      <form onSubmit={handleSavePreferences}>
        <div className="form-group">
          <label>City:</label>
          <input 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>State:</label>
          <input 
            type="text" 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Countries:</label>
          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                value="us" 
                checked={countries.includes('us')} 
                onChange={handleCountryChange} 
              />
              United States
            </label>
            <label>
              <input 
                type="checkbox" 
                value="ca" 
                checked={countries.includes('ca')} 
                onChange={handleCountryChange} 
              />
              Canada
            </label>
            <label>
              <input 
                type="checkbox" 
                value="uk" 
                checked={countries.includes('uk')} 
                onChange={handleCountryChange} 
              />
              United Kingdom
            </label>
            {/* Add more countries as needed */}
          </div>
        </div>
        <div className="form-group">
          <label>Categories:</label>
          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                value="sports" 
                checked={categories.includes('sports')} 
                onChange={handleCategoryChange} 
              />
              Sports
            </label>
            <label>
              <input 
                type="checkbox" 
                value="world" 
                checked={categories.includes('world')} 
                onChange={handleCategoryChange} 
              />
              World News
            </label>
            <label>
              <input 
                type="checkbox" 
                value="local" 
                checked={categories.includes('local')} 
                onChange={handleCategoryChange} 
              />
              Local News
            </label>
            <label>
              <input 
                type="checkbox" 
                value="arts" 
                checked={categories.includes('arts')} 
                onChange={handleCategoryChange} 
              />
              Arts
            </label>
            <label>
              <input 
                type="checkbox" 
                value="business" 
                checked={categories.includes('business')} 
                onChange={handleCategoryChange} 
              />
              Business
            </label>
            <label>
              <input 
                type="checkbox" 
                value="entertainment" 
                checked={categories.includes('entertainment')} 
                onChange={handleCategoryChange} 
              />
              Entertainment
            </label>
            <label>
              <input 
                type="checkbox" 
                value="politics" 
                checked={categories.includes('politics')} 
                onChange={handleCategoryChange} 
              />
              Politics
            </label>
            <label>
              <input 
                type="checkbox" 
                value="science" 
                checked={categories.includes('science')} 
                onChange={handleCategoryChange} 
              />
              Science
            </label>
            {/* Add more categories as needed */}
          </div>
        </div>
        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default Preferences;


