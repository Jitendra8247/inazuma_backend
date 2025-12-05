// Script to fix tournament ownership issues
require('dotenv').config();
const mongoose = require('mongoose');
const Tournament = require('../models/Tournament');
const User = require('../models/User');

async function fixTournamentOwnership() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin organizer
    const adminOrganizer = await User.findOne({ email: 'admin@inazuma.com' });
    
    if (!adminOrganizer) {
      console.log('❌ Admin organizer not found');
      return;
    }

    console.log('👤 Admin Organizer:', adminOrganizer.username, '(', adminOrganizer._id, ')');

    // Find all tournaments
    const tournaments = await Tournament.find();
    console.log(`\n📊 Found ${tournaments.length} tournaments\n`);

    let fixed = 0;
    let skipped = 0;

    for (const tournament of tournaments) {
      console.log(`\n🏆 Tournament: ${tournament.name}`);
      console.log(`   Current organizerId: ${tournament.organizerId || 'NONE'}`);
      console.log(`   Current organizer: ${tournament.organizer}`);

      // If tournament has no organizerId or wrong organizerId, fix it
      if (!tournament.organizerId) {
        tournament.organizerId = adminOrganizer._id;
        tournament.organizer = adminOrganizer.username;
        await tournament.save();
        console.log(`   ✅ Fixed: Set organizerId to admin`);
        fixed++;
      } else {
        console.log(`   ⏭️  Skipped: Already has organizerId`);
        skipped++;
      }
    }

    console.log(`\n📈 Summary:`);
    console.log(`   Fixed: ${fixed}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${tournaments.length}`);

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
fixTournamentOwnership();
