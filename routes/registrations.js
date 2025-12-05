// Registration Routes
const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Tournament = require('../models/Tournament');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// @route   POST /api/registrations
// @desc    Register for tournament
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { tournamentId, teamName, email, phone, inGameId } = req.body;

    // Check if tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if tournament is full
    if (tournament.registeredTeams >= tournament.maxTeams) {
      return res.status(400).json({
        success: false,
        message: 'Tournament is full'
      });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({
      tournamentId,
      playerId: req.user._id
    });

    if (existingReg) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this tournament'
      });
    }

    // Check wallet balance if entry fee exists
    if (tournament.entryFee > 0) {
      const playerWallet = await Wallet.findOne({ userId: req.user._id });
      
      if (!playerWallet || playerWallet.balance < tournament.entryFee) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance'
        });
      }

      // Get or create organizer wallet
      let organizerWallet = await Wallet.findOne({ userId: tournament.organizerId });
      if (!organizerWallet) {
        organizerWallet = await Wallet.create({ userId: tournament.organizerId });
      }

      // Deduct from player
      await playerWallet.deductFunds(tournament.entryFee);

      // Add to organizer
      await organizerWallet.addFunds(tournament.entryFee);

      // Create transactions
      await Transaction.create([
        {
          userId: req.user._id,
          type: 'tournament_fee',
          amount: tournament.entryFee,
          balance: playerWallet.balance,
          description: `Registration fee for ${tournament.name}`,
          tournamentId: tournament._id,
          tournamentName: tournament.name
        },
        {
          userId: tournament.organizerId,
          type: 'tournament_fee',
          amount: tournament.entryFee,
          balance: organizerWallet.balance,
          description: `Registration fee from ${req.user.username} for ${tournament.name}`,
          tournamentId: tournament._id,
          tournamentName: tournament.name,
          relatedUserId: req.user._id,
          relatedUserName: req.user.username
        }
      ]);
    }

    // Create registration
    const registration = await Registration.create({
      tournamentId,
      playerId: req.user._id,
      playerName: req.user.username,
      teamName,
      email,
      phone,
      inGameId
    });

    // Update tournament registered count
    await tournament.updateRegisteredCount();

    res.status(201).json({
      success: true,
      registration
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/registrations/my
// @desc    Get current user's registrations
// @access  Private
router.get('/my', protect, async (req, res, next) => {
  try {
    const registrations = await Registration.find({ playerId: req.user._id })
      .populate('tournamentId')
      .sort({ registeredAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/registrations/tournament/:tournamentId
// @desc    Get registrations for a tournament
// @access  Private
router.get('/tournament/:tournamentId', protect, async (req, res, next) => {
  try {
    const registrations = await Registration.find({ 
      tournamentId: req.params.tournamentId 
    }).populate('playerId', 'username email avatar');

    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
