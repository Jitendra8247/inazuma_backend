// Seed database with initial data
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Wallet = require('../models/Wallet');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inazuma-battle');
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Tournament.deleteMany({});
    await Wallet.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create organizers
    const organizer1 = await User.create({
      username: 'AdminOrganizer',
      email: 'admin@inazuma.com',
      password: 'Admin@2024',
      role: 'organizer'
    });

    const organizer2 = await User.create({
      username: 'DemoOrganizer',
      email: 'organizer@demo.com',
      password: 'Organizer@123',
      role: 'organizer'
    });

    // Create demo player
    const player = await User.create({
      username: 'DemoPlayer',
      email: 'player@demo.com',
      password: 'demo123',
      role: 'player',
      stats: {
        tournamentsPlayed: 25,
        tournamentsWon: 5,
        totalEarnings: 75000,
        rank: 'Ace'
      }
    });

    console.log('✅ Created users');

    // Create wallets
    await Wallet.create([
      { userId: organizer1._id, balance: 0 },
      { userId: organizer2._id, balance: 0 },
      { userId: player._id, balance: 5000 }
    ]);

    console.log('✅ Created wallets');

    // Create tournaments
    const tournaments = [
      {
        name: 'Inazuma Pro League Season 5',
        game: 'BGMI',
        mode: 'Squad',
        prizePool: 500000,
        entryFee: 0,
        maxTeams: 64,
        registeredTeams: 0,
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-02-20'),
        status: 'upcoming',
        image: '/placeholder.svg',
        description: 'The premier BGMI tournament featuring top teams from across India.',
        rules: [
          'Teams must have 4 players',
          'All players must be 18+',
          'No emulators allowed',
          'Anti-cheat must be enabled'
        ],
        organizer: organizer1.username,
        organizerId: organizer1._id,
        region: 'India',
        platform: 'Mobile'
      },
      {
        name: 'Neon Nights Championship',
        game: 'BGMI',
        mode: 'Duo',
        prizePool: 200000,
        entryFee: 500,
        maxTeams: 50,
        registeredTeams: 0,
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-02-12'),
        status: 'ongoing',
        image: '/placeholder.svg',
        description: 'Fast-paced duo battles under the neon lights.',
        rules: [
          'Teams of 2 players',
          'Entry fee required',
          'Double elimination format'
        ],
        organizer: organizer2.username,
        organizerId: organizer2._id,
        region: 'Asia Pacific',
        platform: 'Mobile'
      },
      {
        name: 'Rising Stars Cup',
        game: 'BGMI',
        mode: 'Squad',
        prizePool: 100000,
        entryFee: 200,
        maxTeams: 100,
        registeredTeams: 0,
        startDate: new Date('2024-02-25'),
        endDate: new Date('2024-02-27'),
        status: 'upcoming',
        image: '/placeholder.svg',
        description: 'Platform for upcoming talents to showcase their skills.',
        rules: [
          'Open registration',
          'Amateur teams only',
          'Age 16+'
        ],
        organizer: organizer2.username,
        organizerId: organizer2._id,
        region: 'India',
        platform: 'Mobile'
      }
    ];

    await Tournament.insertMany(tournaments);
    console.log('✅ Created tournaments');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Player: player@demo.com / demo123');
    console.log('Organizer 1: admin@inazuma.com / Admin@2024');
    console.log('Organizer 2: organizer@demo.com / Organizer@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
