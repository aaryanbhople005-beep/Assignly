const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  googleName: {
    type: String,
    required: true,
  },
  googlePictureUrl: {
    type: String,
  },
  googleEmail: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  universityName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
    unique: true, // Academic emails should ideally be unique
  },
  courseBranch: {
    type: String,
    required: true,
  },
  graduationYear: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('User', userSchema);
