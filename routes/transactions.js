// Transaction Routes
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/transactions/my
// @desc    Get current user's transactions
// @access  Private
router.get('/my', protect, async (req, res, next) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Transaction.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      transactions
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/transactions/user/:userId
// @desc    Get user's transactions (organizer only)
// @access  Private/Organizer
router.get('/user/:userId', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/transactions/all
// @desc    Get all transactions (organizer only)
// @access  Private/Organizer
router.get('/all', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const { limit = 100, page = 1 } = req.query;
    
    const transactions = await Transaction.find()
      .populate('userId', 'username email')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Transaction.countDocuments();

    res.json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      transactions
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
