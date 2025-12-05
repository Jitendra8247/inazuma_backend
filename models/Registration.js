// Registration Model
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: [true, 'Tournament ID is required']
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Player ID is required']
  },
  playerName: {
    type: String,
    required: [true, 'Player name is required']
  },
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  inGameId: {
    type: String,
    required: [true, 'In-game ID is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
    default: 'confirmed'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ tournamentId: 1, playerId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
