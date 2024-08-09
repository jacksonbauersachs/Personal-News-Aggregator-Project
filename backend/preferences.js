const express = require('express');
const User = require('./models/User');
const router = express.Router();

// Save user preferences
router.post('/preferences', async (req, res) => {
  const { email, preferences } = req.body;
  console.log('Saving preferences for:', email, preferences);
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { preferences },
      { new: true, upsert: true }
    );
    res.json(user.preferences);
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ error: 'Error saving preferences' });
  }
});

// Get user preferences
router.get('/preferences/:email', async (req, res) => {
  const { email } = req.params;
  console.log('Fetching preferences for:', email);
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json(user.preferences);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Error fetching preferences' });
  }
});

module.exports = router;















