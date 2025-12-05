// Script to delete a specific tournament
require('dotenv').config();
const mongoose = require('mongoose');
const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');

async function deleteTournament() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the tournament by name
    const tournament = await Tournament.findOne({ name: 'Inazuma Pro League Season 5' });
    
    if (!tournament) {
      console.log('❌ Tournament not found');
      process.exit(1);
    }

    console.log('\n🏆 Found Tournament:');
    console.log('   Name:', tournament.name);
    console.log('   ID:', tournament._id);
    console.log('   Organizer:', tournament.organizer);
    console.log('   OrganizerId:', tournament.organizerId);

    // Delete associated registrations
    const registrations = await Registration.deleteMany({ tournamentId: tournament._id });
    console.log(`\n🗑️  Deleted ${registrations.deletedCount} registrations`);

    // Delete tournament
    await tournament.deleteOne();
    console.log('✅ Tournament deleted successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteTournament();
