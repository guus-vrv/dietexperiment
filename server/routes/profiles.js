const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // for user authentication and generating tokens
const bcrypt = require('bcryptjs'); // hashing passwords
const User = require('../models/User'); // Import User model
const authMiddleware = require('../middleware/auth'); // Import your middleware
const { check, validationResult } = require('express-validator');


router.get('/email', authMiddleware, async (req, res) => {
  const id = req.userId;
  try
  {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ email: user.email, name: user.name, role: user.role });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
})

router.put('/update-email', authMiddleware,
    [
      check('email', 'Please include a valid email').isEmail(),
    ],
    async (req, res) => {
      const { email } = req.body;
      const userId = req.userId; // Assuming authMiddleware sets req.userId
  
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid email', errors: errors.array() });
      } 
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.email = email;
      await user.save();
  
      return res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
      console.error('Error updating email:', error);
      res.status(500).json({ message: 'Failed to update email' });
    }
  });

// Update password route
router.put('/update-password', authMiddleware,
    [
      check('oldPassword', 'Current password is required').not().isEmpty(),
      check('newPassword', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    ],
    async (req, res) => {
      const { oldPassword, newPassword } = req.body;
      const userId = req.userId; // Assuming authMiddleware sets req.userId
  
      // Validate input fields
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long', errors: errors.array() });
    }
    
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the old password is correct
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
  
      await user.save();
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Failed to update password' });
    }
  });


module.exports = router;
