// Check Tournament Status - See which tournaments would be archived
require('dotenv').config();
const mongoose = require('mongoose');
const Tournament = require('../models/Tournament');

function combineDateAndTime(dateStr, timeStr) {
  const date = new Date(dateStr);
  if (!timeStr) return date;
  
  const [hours, minutes] = timeStr.split(':');
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(0);
  date.setMilliseconds(0);
  
  return date;
}

async function checkTournamentStatus() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inazuma-battle');
    console.log('✅ Connected to MongoDB\n');

    const now = new Date();
    console.log(`⏰ Current Time: ${now.toLocaleString()}\n`);

    // Get all upcoming tournaments
    const upcomingTournaments = await Tournament.find({ status: 'upcoming' });

    if (upcomingTournaments.length === 0) {
      console.log('📋 No upcoming tournaments found');
      process.exit(0);
    }

    console.log(`📋 Found ${upcomingTournaments.length} upcoming tournaments:\n`);

    upcomingTournaments.forEach((tournament, index) => {
      const startDateTime = combineDateAndTime(tournament.startDate, tournament.startTime);
      const isPast = startDateTime < now;
      const timeDiff = startDateTime - now;
      const hoursUntilStart = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesUntilStart = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      console.log(`${index + 1}. ${tournament.name}`);
      console.log(`   ID: ${tournament._id}`);
      console.log(`   Start Date: ${tournament.startDate.toLocaleDateString()}`);
      console.log(`   Start Time: ${tournament.startTime || 'Not set'}`);
      console.log(`   Combined: ${startDateTime.toLocaleString()}`);
      console.log(`   Status: ${tournament.status}`);
      
      if (isPast) {
        console.log(`   ⚠️  EXPIRED - Would be archived!`);
      } else {
        if (hoursUntilStart > 0) {
          console.log(`   ✅ Active - Starts in ${hoursUntilStart}h ${minutesUntilStart}m`);
        } else if (minutesUntilStart > 0) {
          console.log(`   ✅ Active - Starts in ${minutesUntilStart} minutes`);
        } else {
          console.log(`   ✅ Active - Starts very soon!`);
        }
      }
      console.log('');
    });

    const expiredCount = upcomingTournaments.filter(t => {
      const startDateTime = combineDateAndTime(t.startDate, t.startTime);
      return startDateTime < now;
    }).length;

    console.log('─────────────────────────────────────');
    console.log(`📊 Summary:`);
    console.log(`   Total Upcoming: ${upcomingTournaments.length}`);
    console.log(`   Would Archive: ${expiredCount}`);
    console.log(`   Still Active: ${upcomingTournaments.length - expiredCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkTournamentStatus();
