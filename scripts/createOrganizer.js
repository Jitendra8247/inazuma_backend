// Create Organizer Account in Production
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

async function createOrganizer() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if organizer already exists
    const existingOrganizer = await User.findOne({ 
      email: 'organizer@inazuma.com' 
    });

    if (existingOrganizer) {
      console.log('⚠️  Organizer account already exists!');
      console.log('   Email:', existingOrganizer.email);
      console.log('   Username:', existingOrganizer.username);
      console.log('\n💡 Use these credentials to login');
      process.exit(0);
    }

    // Create organizer account
    const hashedPassword = await bcrypt.hash('organizer123', 10);
    
    const organizer = await User.create({
      username: 'organizer1',
      email: 'organizer@inazuma.com',
      password: hashedPassword,
      role: 'organizer'
    });

    // Create wallet for organizer
    await Wallet.create({
      userId: organizer._id,
      balance: 10000 // Starting balance
    });

    console.log('✅ Organizer account created successfully!\n');
    console.log('📧 Email:', organizer.email);
    console.log('👤 Username:', organizer.username);
    console.log('🔑 Password: organizer123');
    console.log('💰 Wallet Balance: ₹10,000\n');
    console.log('🎉 You can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createOrganizer();
