require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGODB_URI;

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    const admin = await User.findOneAndUpdate(
      { phone: '9825338129' },
      { phone: '9825338129', name: 'Vinod', role: 'admin', isActive: true },
      { upsert: true, new: true }
    );

    console.log('✅ Admin seeded:', admin);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seedAdmin();