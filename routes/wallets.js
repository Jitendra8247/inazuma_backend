// Wallet Routes
const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/wallets/my
// @desc    Get current user's wallet
// @access  Private
router.get('/my', protect, async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });
    
    // Create wallet if doesn't exist
    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user._id });
    }

    res.json({
      success: true,
      wallet
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/wallets/all
// @desc    Get all wallets (organizer only)
// @access  Private/Organizer
router.get('/all', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const wallets = await Wallet.find().populate('userId', 'username email role');

    res.json({
      success: true,
      count: wallets.length,
      wallets
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/wallets/deposit
// @desc    Deposit money
// @access  Private
router.post('/deposit', protect, async (req, res, next) => {
  try {
    const { amount, bankDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user._id });
    }

    await wallet.addFunds(amount);

    // Create transaction
    await Transaction.create({
      userId: req.user._id,
      type: 'deposit',
      amount,
      balance: wallet.balance,
      description: `Deposited from ${bankDetails.bankName}`,
      bankDetails
    });

    res.json({
      success: true,
      wallet
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/wallets/withdraw
// @desc    Withdraw money
// @access  Private
router.post('/withdraw', protect, async (req, res, next) => {
  try {
    const { amount, bankDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    await wallet.deductFunds(amount);

    // Create transaction
    await Transaction.create({
      userId: req.user._id,
      type: 'withdraw',
      amount,
      balance: wallet.balance,
      description: `Withdrawn to ${bankDetails.bankName}`,
      bankDetails
    });

    res.json({
      success: true,
      wallet
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/wallets/transfer
// @desc    Transfer money to another user
// @access  Private
router.post('/transfer', protect, async (req, res, next) => {
  try {
    const { toUserId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    if (toUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer to yourself'
      });
    }

    const senderWallet = await Wallet.findOne({ userId: req.user._id });
    
    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    let receiverWallet = await Wallet.findOne({ userId: toUserId });
    if (!receiverWallet) {
      receiverWallet = await Wallet.create({ userId: toUserId });
    }

    // Transfer funds
    await senderWallet.deductFunds(amount);
    await receiverWallet.addFunds(amount);

    // Get receiver info
    const User = require('../models/User');
    const receiver = await User.findById(toUserId);

    // Create transactions
    await Transaction.create([
      {
        userId: req.user._id,
        type: 'transfer_sent',
        amount,
        balance: senderWallet.balance,
        description: `Transferred to ${receiver.username}`,
        relatedUserId: toUserId,
        relatedUserName: receiver.username
      },
      {
        userId: toUserId,
        type: 'transfer_received',
        amount,
        balance: receiverWallet.balance,
        description: `Received from ${req.user.username}`,
        relatedUserId: req.user._id,
        relatedUserName: req.user.username
      }
    ]);

    res.json({
      success: true,
      wallet: senderWallet
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/wallets/admin/add
// @desc    Admin add funds to user wallet (deducts from admin wallet)
// @access  Private/Organizer
router.post('/admin/add', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const { userId, amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Get admin wallet
    let adminWallet = await Wallet.findOne({ userId: req.user._id });
    if (!adminWallet) {
      adminWallet = await Wallet.create({ userId: req.user._id });
    }

    // Check if admin has sufficient balance
    if (adminWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance in your wallet. You have ₹${adminWallet.balance}, but need ₹${amount}`
      });
    }

    // Get or create player wallet
    let playerWallet = await Wallet.findOne({ userId });
    if (!playerWallet) {
      playerWallet = await Wallet.create({ userId });
    }

    // Get player info
    const User = require('../models/User');
    const player = await User.findById(userId);

    // Transfer funds: deduct from admin, add to player
    await adminWallet.deductFunds(amount);
    await playerWallet.addFunds(amount);

    // Create transactions for both parties
    await Transaction.create([
      {
        userId: req.user._id,
        type: 'transfer_sent',
        amount,
        balance: adminWallet.balance,
        description: `Added ₹${amount} to ${player.username}'s wallet: ${reason}`,
        relatedUserId: userId,
        relatedUserName: player.username
      },
      {
        userId,
        type: 'admin_addition',
        amount,
        balance: playerWallet.balance,
        description: `Admin addition from ${req.user.username}: ${reason}`,
        relatedUserId: req.user._id,
        relatedUserName: req.user.username
      }
    ]);

    res.json({
      success: true,
      wallet: playerWallet,
      adminWallet: {
        balance: adminWallet.balance
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/wallets/admin/deduct
// @desc    Admin deduct funds from user wallet (adds to admin wallet)
// @access  Private/Organizer
router.post('/admin/deduct', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const { userId, amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Get player wallet
    const playerWallet = await Wallet.findOne({ userId });
    
    if (!playerWallet || playerWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: `Player has insufficient balance. Available: ₹${playerWallet?.balance || 0}`
      });
    }

    // Get or create admin wallet
    let adminWallet = await Wallet.findOne({ userId: req.user._id });
    if (!adminWallet) {
      adminWallet = await Wallet.create({ userId: req.user._id });
    }

    // Get player info
    const User = require('../models/User');
    const player = await User.findById(userId);

    // Transfer funds: deduct from player, add to admin
    await playerWallet.deductFunds(amount);
    await adminWallet.addFunds(amount);

    // Create transactions for both parties
    await Transaction.create([
      {
        userId,
        type: 'admin_deduction',
        amount,
        balance: playerWallet.balance,
        description: `Admin deduction by ${req.user.username}: ${reason}`,
        relatedUserId: req.user._id,
        relatedUserName: req.user.username
      },
      {
        userId: req.user._id,
        type: 'transfer_received',
        amount,
        balance: adminWallet.balance,
        description: `Deducted ₹${amount} from ${player.username}'s wallet: ${reason}`,
        relatedUserId: userId,
        relatedUserName: player.username
      }
    ]);

    res.json({
      success: true,
      wallet: playerWallet,
      adminWallet: {
        balance: adminWallet.balance
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
