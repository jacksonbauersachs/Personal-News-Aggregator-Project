import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewsFeed from './NewsFeed';
import SignUp from './SignUp';
import Login from './Login';
import './App.css';

const App = () => {
  const [userEmail, setUserEmail] = useState(null);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Personalized News Aggregator</h1>
          <nav>
            <a href="/login">Login</a>
            <a href="/signup">Sign Up</a>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<NewsFeed userEmail={userEmail} />} />
          <Route path="/signup" element={<SignUp setUserEmail={setUserEmail} />} />
          <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

















