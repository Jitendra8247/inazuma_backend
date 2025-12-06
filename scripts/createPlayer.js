// Create Player Account in Production
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

async function createPlayer() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if player already exists
    const existingPlayer = await User.findOne({ 
      email: 'player@inazuma.com' 
    });

    if (existingPlayer) {
      console.log('⚠️  Player account already exists!');
      console.log('   Email:', existingPlayer.email);
      console.log('   Username:', existingPlayer.username);
      console.log('\n💡 Use these credentials to login');
      process.exit(0);
    }

    // Create player account
    const hashedPassword = await bcrypt.hash('player123', 10);
    
    const player = await User.create({
      username: 'player1',
      email: 'player@inazuma.com',
      password: hashedPassword,
      role: 'player'
    });

    // Create wallet for player
    await Wallet.create({
      userId: player._id,
      balance: 5000 // Starting balance
    });

    console.log('✅ Player account created successfully!\n');
    console.log('📧 Email:', player.email);
    console.log('👤 Username:', player.username);
    console.log('🔑 Password: player123');
    console.log('💰 Wallet Balance: ₹5,000\n');
    console.log('🎉 You can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createPlayer();
