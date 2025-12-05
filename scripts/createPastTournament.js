// Create a tournament with past start date for testing auto-archiving
require('dotenv').config();
const mongoose = require('mongoose');
const Tournament = require('../models/Tournament');
const User = require('../models/User');

async function createPastTournament() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inazuma-battle');
    console.log('✅ Connected to MongoDB\n');

    // Find an organizer
    const organizer = await User.findOne({ role: 'organizer' });
    if (!organizer) {
      console.log('❌ No organizer found. Please create an organizer account first.');
      process.exit(1);
    }

    // Create tournament with past date (2 hours ago)
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 2);

    const tournament = await Tournament.create({
      name: 'Test Past Tournament (Auto-Archive)',
      game: 'BGMI',
      mode: 'Squad',
      prizePool: 50000,
      entryFee: 0,
      maxTeams: 50,
      registeredTeams: 0,
      startDate: pastDate,
      startTime: pastDate.toTimeString().slice(0, 5),
      status: 'upcoming',
      description: 'This tournament is in the past and should be auto-archived by the scheduler.',
      rules: ['Test tournament for auto-archiving feature'],
      organizer: organizer.username,
      organizerId: organizer._id,
      region: 'India',
      platform: 'Mobile'
    });

    console.log('✅ Created test tournament:');
    console.log(`   Name: ${tournament.name}`);
    console.log(`   ID: ${tournament._id}`);
    console.log(`   Start Date: ${tournament.startDate}`);
    console.log(`   Status: ${tournament.status}`);
    console.log('\n⏰ This tournament should be archived within 5 minutes by the scheduler.');
    console.log('   Or run: node backend/scripts/testArchiving.js to archive immediately\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createPastTournament();
