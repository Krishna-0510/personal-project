require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const MONGO_URI = process.env.MONGODB_URI;

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    const admin = await Admin.findOneAndUpdate(
      { phone: '9825338129' },
      {
        phone: '9825338129',
        name: 'Vinod',
        password: 'admin123',
        whatsappNumber: '9825338129',
        totpSecret: '',
        totpEnabled: false,
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin seeded:', admin);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seedAdmin();