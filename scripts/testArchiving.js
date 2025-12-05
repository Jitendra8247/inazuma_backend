// Test Script - Manually trigger tournament archiving
require('dotenv').config();
const mongoose = require('mongoose');
const { archiveExpiredTournaments } = require('../utils/tournamentScheduler');

async function testArchiving() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inazuma-battle');
    console.log('✅ Connected to MongoDB\n');

    console.log('🔍 Checking for expired tournaments...\n');
    const result = await archiveExpiredTournaments();

    console.log('\n📊 Results:');
    console.log(`   Archived: ${result.archived} tournaments`);
    
    if (result.tournaments && result.tournaments.length > 0) {
      console.log('\n📦 Archived Tournaments:');
      result.tournaments.forEach(t => {
        console.log(`   - ${t.name} (ID: ${t.id})`);
        console.log(`     Start Date: ${t.startDate}`);
        console.log(`     Start Time: ${t.startTime || 'Not set'}`);
      });
    } else {
      console.log('\n✅ No tournaments needed archiving');
    }

    console.log('\n✅ Test complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testArchiving();
