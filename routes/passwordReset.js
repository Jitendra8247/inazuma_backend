// Password Reset Routes
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Store reset tokens temporarily (in production, use Redis or database)
const resetTokens = new Map();

// @route   POST /api/password-reset/verify-user
// @desc    Verify user email and username match
// @access  Public
router.post('/verify-user', [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('username').notEmpty().withMessage('Username is required')
], async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, username } = req.body;

    // Find user with both email and username
    const user = await User.findOne({ email, username });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email and username do not match our records'
      });
    }

    // Generate temporary token for this session
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 600000; // 10 minutes

    // Store token
    resetTokens.set(resetToken, {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      expiry: resetTokenExpiry
    });

    console.log('✅ User Verified for Password Reset:');
    console.log('   Email:', email);
    console.log('   Username:', username);

    res.json({
      success: true,
      message: 'User verified successfully',
      resetToken,
      email: user.email,
      username: user.username
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/password-reset/verify
// @desc    Verify reset token is valid
// @access  Public
router.post('/verify', [
  body('token').notEmpty().withMessage('Token is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { token } = req.body;

    // Check if token exists
    const resetData = resetTokens.get(token);

    if (!resetData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Check if token is expired
    if (Date.now() > resetData.expiry) {
      resetTokens.delete(token);
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired. Please request a new one.'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      email: resetData.email
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/password-reset/reset
// @desc    Reset password with token
// @access  Public
router.post('/reset', [
  body('token').notEmpty().withMessage('Token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    // Check if token exists
    const resetData = resetTokens.get(token);

    if (!resetData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Check if token is expired
    if (Date.now() > resetData.expiry) {
      resetTokens.delete(token);
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired. Please request a new one.'
      });
    }

    // Find user and update password
    const user = await User.findById(resetData.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = password;
    await user.save();

    // Delete used token
    resetTokens.delete(token);

    console.log('✅ Password Reset Successful:');
    console.log('   Email:', user.email);
    console.log('   User ID:', user._id);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/password-reset/cleanup
// @desc    Cleanup expired tokens (call this periodically)
// @access  Private (in production, make this a cron job)
router.get('/cleanup', (req, res) => {
  const now = Date.now();
  let cleaned = 0;

  for (const [token, data] of resetTokens.entries()) {
    if (now > data.expiry) {
      resetTokens.delete(token);
      cleaned++;
    }
  }

  res.json({
    success: true,
    message: `Cleaned up ${cleaned} expired tokens`,
    activeTokens: resetTokens.size
  });
});

module.exports = router;
