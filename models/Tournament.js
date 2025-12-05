// Tournament Model
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tournament name is required'],
    trim: true
  },
  game: {
    type: String,
    required: [true, 'Game name is required'],
    default: 'BGMI'
  },
  mode: {
    type: String,
    required: [true, 'Game mode is required'],
    enum: ['Solo', 'Duo', 'Squad']
  },
  prizePool: {
    type: Number,
    required: [true, 'Prize pool is required'],
    min: 0
  },
  entryFee: {
    type: Number,
    required: [true, 'Entry fee is required'],
    min: 0,
    default: 0
  },
  maxTeams: {
    type: Number,
    required: [true, 'Maximum teams is required'],
    min: 1
  },
  registeredTeams: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    default: '00:00'
  },
  endDate: {
    type: Date,
    required: false,
    default: null
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  roomId: {
    type: String,
    default: null
  },
  roomPassword: {
    type: String,
    default: null
  },
  roomCredentialsAvailable: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: '/placeholder.svg'
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  rules: [{
    type: String
  }],
  organizer: {
    type: String,
    required: [true, 'Organizer name is required']
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer ID is required']
  },
  region: {
    type: String,
    default: 'India'
  },
  platform: {
    type: String,
    default: 'Mobile'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  archivedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Update registeredTeams count
tournamentSchema.methods.updateRegisteredCount = async function() {
  const Registration = mongoose.model('Registration');
  const count = await Registration.countDocuments({ 
    tournamentId: this._id,
    status: 'confirmed'
  });
  this.registeredTeams = count;
  await this.save();
};

module.exports = mongoose.model('Tournament', tournamentSchema);
