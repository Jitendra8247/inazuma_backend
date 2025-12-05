// Tournament Scheduler - Auto-archive tournaments after start time
const Tournament = require('../models/Tournament');

/**
 * Combine date and time into a single Date object
 */
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

/**
 * Check and archive tournaments that have passed their start time
 * This should be run periodically (e.g., every 5 minutes)
 */
async function archiveExpiredTournaments() {
  try {
    const now = new Date();
    
    // Find all upcoming tournaments
    const upcomingTournaments = await Tournament.find({
      status: 'upcoming'
    });

    if (upcomingTournaments.length === 0) {
      console.log('⏰ No upcoming tournaments to check');
      return { archived: 0 };
    }

    // Filter tournaments that have actually expired (date + time)
    const expiredTournaments = upcomingTournaments.filter(tournament => {
      const tournamentStartDateTime = combineDateAndTime(
        tournament.startDate,
        tournament.startTime
      );
      return tournamentStartDateTime < now;
    });

    if (expiredTournaments.length === 0) {
      console.log('⏰ No tournaments to archive');
      return { archived: 0 };
    }

    // Update each expired tournament
    const updatePromises = expiredTournaments.map(tournament => 
      Tournament.findByIdAndUpdate(
        tournament._id,
        {
          $set: { 
            status: 'completed',
            archivedAt: now
          }
        }
      )
    );

    await Promise.all(updatePromises);

    console.log(`📦 Archived ${expiredTournaments.length} expired tournaments:`);
    expiredTournaments.forEach(t => {
      const startDateTime = combineDateAndTime(t.startDate, t.startTime);
      console.log(`   - ${t.name} (Started: ${startDateTime.toLocaleString()})`);
    });
    
    return {
      archived: expiredTournaments.length,
      tournaments: expiredTournaments.map(t => ({
        id: t._id,
        name: t.name,
        startDate: t.startDate,
        startTime: t.startTime
      }))
    };
  } catch (error) {
    console.error('❌ Error archiving tournaments:', error);
    throw error;
  }
}

/**
 * Start the tournament scheduler
 * Runs every 5 minutes to check for expired tournaments
 */
function startTournamentScheduler() {
  console.log('🚀 Starting tournament scheduler...');
  
  // Run immediately on startup
  archiveExpiredTournaments();
  
  // Then run every 5 minutes
  const FIVE_MINUTES = 5 * 60 * 1000;
  setInterval(archiveExpiredTournaments, FIVE_MINUTES);
  
  console.log('✅ Tournament scheduler started (runs every 5 minutes)');
}

module.exports = {
  archiveExpiredTournaments,
  startTournamentScheduler
};
