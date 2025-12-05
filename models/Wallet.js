// Wallet Model
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to add funds
walletSchema.methods.addFunds = async function(amount) {
  this.balance += amount;
  await this.save();
  return this;
};

// Method to deduct funds
walletSchema.methods.deductFunds = async function(amount) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  this.balance -= amount;
  await this.save();
  return this;
};

module.exports = mongoose.model('Wallet', walletSchema);
