// Transaction Model
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: [
      'deposit',
      'withdraw',
      'transfer_sent',
      'transfer_received',
      'tournament_fee',
      'tournament_prize',
      'admin_deduction',
      'admin_addition'
    ],
    required: [true, 'Transaction type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  balance: {
    type: Number,
    required: [true, 'Balance is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  relatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedUserName: {
    type: String
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  tournamentName: {
    type: String
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
transactionSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
