// Test Registration in Production Database
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

async function testRegistration() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI ? 'Set' : 'Not Set');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check current users
    const userCount = await User.countDocuments();
    console.log(`📊 Current users in database: ${userCount}`);

    if (userCount > 0) {
      const users = await User.find().select('username email role');
      console.log('\n👥 Existing users:');
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.email}) - ${user.role}`);
      });
    }

    // Test creating a new user
    console.log('\n🧪 Testing user creation...');
    
    const testEmail = `test${Date.now()}@example.com`;
    const testUsername = `testuser${Date.now()}`;
    
    const newUser = await User.create({
      username: testUsername,
      email: testEmail,
      password: 'password123',
      role: 'player'
    });

    console.log('✅ User created successfully!');
    console.log('   ID:', newUser._id);
    console.log('   Username:', newUser.username);
    console.log('   Email:', newUser.email);

    // Create wallet
    const wallet = await Wallet.create({
      userId: newUser._id,
      balance: 0
    });

    console.log('✅ Wallet created successfully!');
    console.log('   Wallet ID:', wallet._id);
    console.log('   Balance:', wallet.balance);

    // Verify user was saved
    const savedUser = await User.findById(newUser._id);
    console.log('\n✅ User verified in database!');
    console.log('   Found:', savedUser ? 'Yes' : 'No');

    // Check total users now
    const newUserCount = await User.countDocuments();
    console.log(`\n📊 Total users now: ${newUserCount}`);

    console.log('\n🎉 Registration test successful!');
    console.log('   Your production database is working correctly.');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testRegistration();
