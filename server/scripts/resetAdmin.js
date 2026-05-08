// Run this ONLY when admin is locked out
// Command: node server/scripts/resetAdmin.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Otp = require('../models/Otp');
const User = require('../models/User');

const reset = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const ADMIN_PHONE = '9999999999'; // ← put father's phone here

  // Clear any stuck OTPs
  await Otp.deleteMany({ phone: ADMIN_PHONE });
  console.log('✅ OTP cleared');

  // Make sure user exists and is admin
  const user = await User.findOneAndUpdate(
    { phone: ADMIN_PHONE },
    { role: 'admin', isActive: true },
    { new: true, upsert: true }
  );
  console.log('✅ Admin user confirmed:', user.name, user.phone, user.role);

  await mongoose.disconnect();
  console.log('✅ Done — admin can now login');
};

reset().catch(console.error);