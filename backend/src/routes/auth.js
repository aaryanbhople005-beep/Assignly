const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const {
    googleId,
    googleName,
    googlePictureUrl,
    googleEmail,
    fullName,
    universityName,
    studentEmail,
    courseBranch,
    graduationYear,
  } = req.body;

  try {
    // Check if user already exists by googleId or googleEmail
    let user = await User.findOne({ $or: [{ googleId }, { googleEmail }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this Google account or email.' });
    }

    // Check for duplicate academic email
    user = await User.findOne({ studentEmail });
    if (user) {
        return res.status(400).json({ message: 'A user with this student email already exists.' });
    }

    // Create new user
    user = new User({
      googleId,
      googleName,
      googlePictureUrl,
      googleEmail,
      fullName,
      universityName,
      studentEmail,
      courseBranch,
      graduationYear,
    });

    await user.save();

    // Respond with the created user data
    // We send back a lean version of the user object, excluding sensitive info if any
    res.status(201).json({
      _id: user._id,
      googleId: user.googleId,
      googleName: user.googleName,
      googlePictureUrl: user.googlePictureUrl,
      googleEmail: user.googleEmail,
      fullName: user.fullName,
      universityName: user.universityName,
      studentEmail: user.studentEmail,
      courseBranch: user.courseBranch,
      graduationYear: user.graduationYear,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
