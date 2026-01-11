const mongoose = require('mongoose');

/**
 * User Schema
 * Represents users of CareerCraft (regular users + admins)
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // full name of the user
  },
  email: {
    type: String,
    required: true,
    unique: true // ensures no duplicate emails
  },
  password: {
    type: String,
    required: true // hashed password stored here
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // restrict values
    default: 'user' // default role for new registrations
  }
}, { 
  timestamps: true // automatically adds createdAt & updatedAt
});

/**
 * Export Mongoose Model
 * - Creates a collection named 'users' in MongoDB
 */
module.exports = mongoose.model('User', userSchema);
