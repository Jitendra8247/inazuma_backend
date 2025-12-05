require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({ role: 'organizer' });
  console.log('Organizers:');
  users.forEach(u => console.log(`  ${u.email} - ID: ${u._id}`));
  process.exit(0);
}

checkUsers();
