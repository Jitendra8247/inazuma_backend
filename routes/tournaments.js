// Tournament Routes
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tournament = require('../models/Tournament');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/tournaments
// @desc    Get all tournaments (excludes archived/completed by default)
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { status, game, mode, includeArchived } = req.query;
    const filter = {};
    
    // By default, exclude completed tournaments from public view
    if (!includeArchived || includeArchived === 'false') {
      filter.status = { $ne: 'completed' };
    }
    
    if (status) filter.status = status;
    if (game) filter.game = game;
    if (mode) filter.mode = mode;

    const tournaments = await Tournament.find(filter).sort({ startDate: -1 });
    
    res.json({
      success: true,
      count: tournaments.length,
      tournaments
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/tournaments/my-tournaments
// @desc    Get tournaments user is registered for (includes archived)
// @access  Private
router.get('/my-tournaments', protect, async (req, res, next) => {
  try {
    const Registration = mongoose.model('Registration');
    
    // Get all registrations for this user
    const registrations = await Registration.find({ 
      playerId: req.user._id 
    }).populate('tournamentId');
    
    // Extract tournaments from registrations
    const tournaments = registrations
      .filter(reg => reg.tournamentId) // Filter out null tournaments
      .map(reg => reg.tournamentId);
    
    res.json({
      success: true,
      count: tournaments.length,
      tournaments
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/tournaments/:id
// @desc    Get tournament by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    res.json({
      success: true,
      tournament
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/tournaments
// @desc    Create tournament
// @access  Private/Organizer
router.post('/', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const tournamentData = {
      ...req.body,
      organizerId: req.user._id,
      organizer: req.user.username
    };

    const tournament = await Tournament.create(tournamentData);
    
    res.status(201).json({
      success: true,
      tournament
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/tournaments/:id
// @desc    Update tournament
// @access  Private/Organizer
router.put('/:id', protect, authorize('organizer'), async (req, res, next) => {
  try {
    let tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if user is the organizer
    if (tournament.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this tournament'
      });
    }

    tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      tournament
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/tournaments/:id/room-credentials
// @desc    Update tournament room credentials
// @access  Private/Organizer
router.put('/:id/room-credentials', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const { roomId, roomPassword } = req.body;

    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if user is the organizer
    if (tournament.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this tournament'
      });
    }

    // Update room credentials
    tournament.roomId = roomId;
    tournament.roomPassword = roomPassword;
    tournament.roomCredentialsAvailable = !!(roomId && roomPassword);
    
    await tournament.save();

    console.log('🎮 Room Credentials Updated:');
    console.log('   Tournament:', tournament.name);
    console.log('   Room ID:', roomId);
    console.log('   Status:', tournament.roomCredentialsAvailable ? 'Available' : 'Not Available');

    res.json({
      success: true,
      tournament
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/tournaments/:id
// @desc    Delete tournament
// @access  Private/Organizer
router.delete('/:id', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if user is the organizer
    if (tournament.organizerId) {
      if (tournament.organizerId.toString() !== req.user._id.toString()) {
        // Get tournament creator info
        const creator = await mongoose.model('User').findById(tournament.organizerId);
        return res.status(403).json({
          success: false,
          message: `Not authorized to delete this tournament. Created by: ${creator?.username || 'Unknown'}`
        });
      }
    }
    // If no organizerId, any organizer can delete (legacy tournaments)

    await tournament.deleteOne();

    res.json({
      success: true,
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
