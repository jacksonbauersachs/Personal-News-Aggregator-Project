// backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    countries: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;



