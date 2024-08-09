import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({ setUserEmail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferences, setPreferences] = useState({
    countries: [],
    categories: [],
    city: '',
    state: '',
  });
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/signup', { email, password });
      setUserEmail(email);
      await axios.post('http://localhost:5000/api/preferences', { email, preferences });
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setPreferences((prevPreferences) => {
        const updatedArray = checked
          ? [...prevPreferences[name], value]
          : prevPreferences[name].filter((item) => item !== value);
        return { ...prevPreferences, [name]: updatedArray };
      });
    } else {
      setPreferences((prevPreferences) => ({ ...prevPreferences, [name]: value }));
    }
  };

  return (
    <div className="sign-up-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <h3>Preferences</h3>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={preferences.city}
            onChange={handleChange}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            name="state"
            value={preferences.state}
            onChange={handleChange}
          />
        </label>
        <h4>Countries:</h4>
        <label>
          <input
            type="checkbox"
            name="countries"
            value="us"
            onChange={handleChange}
          />
          USA
        </label>
        <label>
          <input
            type="checkbox"
            name="countries"
            value="uk"
            onChange={handleChange}
          />
          UK
        </label>
        <h4>Categories:</h4>
        <label>
          <input
            type="checkbox"
            name="categories"
            value="sports"
            onChange={handleChange}
          />
          Sports
        </label>
        <label>
          <input
            type="checkbox"
            name="categories"
            value="world"
            onChange={handleChange}
          />
          World News
        </label>
        <label>
          <input
            type="checkbox"
            name="categories"
            value="local"
            onChange={handleChange}
          />
          Local News
        </label>
        <label>
          <input
            type="checkbox"
            name="categories"
            value="arts"
            onChange={handleChange}
          />
          Arts
        </label>
        <label>
          <input
            type="checkbox"
            name="categories"
            value="business"
            onChange={handleChange}
          />
          Business
        </label>
        <label>
          <input
            type="checkbox"
            name="categories"
            value="entertainment"
            onChange={handleChange}
          />
          Entertainment
        </label>
        <label>
          <input
            type="checkbox"
            name="categories"
            value="politics"
            onChange={handleChange}
          />
          Politics
        </label>
        <label>
          <input
            type="checkbox"
            name="categories"
            value="science"
            onChange={handleChange}
          />
          Science
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;

       












