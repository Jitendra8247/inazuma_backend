// Clear all players and data, keep only organizers
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

const clearPlayers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Get all organizer IDs
    const organizers = await User.find({ role: 'organizer' });
    const organizerIds = organizers.map(org => org._id);
    
    console.log(`📋 Found ${organizers.length} organizers to keep:`);
    organizers.forEach(org => console.log(`   - ${org.email} (${org.username})`));

    // Delete all players
    const deletedPlayers = await User.deleteMany({ role: 'player' });
    console.log(`🗑️  Deleted ${deletedPlayers.deletedCount} players`);

    // Delete all registrations
    const deletedRegistrations = await Registration.deleteMany({});
    console.log(`🗑️  Deleted ${deletedRegistrations.deletedCount} registrations`);

    // Delete all player wallets (keep organizer wallets)
    const deletedWallets = await Wallet.deleteMany({ 
      userId: { $nin: organizerIds } 
    });
    console.log(`🗑️  Deleted ${deletedWallets.deletedCount} player wallets`);

    // Delete all player transactions (keep organizer transactions)
    const deletedTransactions = await Transaction.deleteMany({ 
      userId: { $nin: organizerIds } 
    });
    console.log(`🗑️  Deleted ${deletedTransactions.deletedCount} player transactions`);

    // Reset tournament registered counts
    await Tournament.updateMany({}, { registeredTeams: 0 });
    console.log(`🔄 Reset all tournament registration counts`);

    // Reset organizer wallet balances to 0
    await Wallet.updateMany(
      { userId: { $in: organizerIds } },
      { balance: 0 }
    );
    console.log(`💰 Reset organizer wallet balances to 0`);

    // Delete organizer transactions
    await Transaction.deleteMany({ 
      userId: { $in: organizerIds } 
    });
    console.log(`🗑️  Cleared organizer transaction history`);

    console.log('\n✅ Database cleaned successfully!');
    console.log('\n📝 Remaining Organizers:');
    organizers.forEach(org => {
      console.log(`   Email: ${org.email}`);
      console.log(`   Username: ${org.username}`);
      console.log(`   Password: (use your original password)`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearPlayers();
