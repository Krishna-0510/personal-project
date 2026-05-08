const Otp = require('../models/Otp');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateAdminToken = (id, phone) => {
  return jwt.sign(
    { id, phone, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/admin/auth/send-otp
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Valid 10-digit phone number required' });
    }

    // Check if admin exists
    const user = await User.findOne({ phone, role: 'admin' });
    if (!user) {
      // Don't reveal whether phone exists or not
      return res.status(200).json({ success: true, message: 'OTP sent if number is registered' });
    }

    // Rate limit — block if OTP requested less than 60 seconds ago
    const existing = await Otp.findOne({ phone });
    if (existing) {
      const secondsAgo = (Date.now() - existing.createdAt) / 1000;
      if (secondsAgo < 60) {
        return res.status(429).json({
          message: `Please wait ${Math.ceil(60 - secondsAgo)} seconds before requesting again`
        });
      }
    }

    // Delete any old OTP
    await Otp.deleteMany({ phone });

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save hashed OTP
    await Otp.create({ phone, otpHash: otpCode });

    // TODO: Replace with Fast2SMS when ready
    console.log(`\n🔐 ADMIN OTP for ${phone}: ${otpCode}\n`);

    res.status(200).json({ success: true, message: 'OTP sent if number is registered' });

  } catch (error) {
    console.error('sendOtp error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    const record = await Otp.findOne({ phone });

    if (!record) {
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }

    // Increment attempts first
    record.attempts += 1;
    await record.save();

    // Block after 3 wrong attempts
    if (record.attempts > 3) {
      await Otp.deleteMany({ phone });
      return res.status(429).json({ message: 'Too many attempts. Request a new OTP.' });
    }

    // Check OTP
    const isCorrect = await record.isOtpCorrect(otp);
    if (!isCorrect) {
      return res.status(400).json({
        message: `Incorrect OTP. ${3 - record.attempts + 1} attempts remaining.`
      });
    }

    // OTP correct — delete immediately
    await Otp.deleteMany({ phone });

    const user = await User.findOne({ phone, role: 'admin' });
    if (!user) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const token = generateAdminToken(user._id, user.phone);
    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, phone: user.phone }
    });

  } catch (error) {
    console.error('verifyOtp error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/auth/recover
// Used when admin is locked out — no auth required
const recoverAdmin = async (req, res) => {
  try {
    const { phone, recoveryCode } = req.body;

    if (!phone || !recoveryCode) {
      return res.status(400).json({ message: 'Phone and recovery code required' });
    }

    // Check recovery code from .env
    if (recoveryCode !== process.env.ADMIN_RECOVERY_CODE) {
      // Add delay to slow down brute force
      await new Promise(resolve => setTimeout(resolve, 2000));
      return res.status(403).json({ message: 'Invalid recovery code' });
    }

    // Check phone is a known admin or backup admin
    const isBackup = phone === process.env.BACKUP_ADMIN_PHONE;
    const user = await User.findOne({ phone, role: 'admin' });

    if (!user && !isBackup) {
      return res.status(403).json({ message: 'Phone not recognized as admin' });
    }

    // If backup admin phone — ensure user exists in DB
    let adminUser = user;
    if (!adminUser) {
      adminUser = await User.findOneAndUpdate(
        { phone },
        { phone, role: 'admin', name: 'Backup Admin', isActive: true },
        { upsert: true, new: true }
      );
    }

    // Clear any stuck OTPs for this phone
    await Otp.deleteMany({ phone });

    // Make sure role is admin (in case it was changed)
    await User.findByIdAndUpdate(adminUser._id, { role: 'admin', isActive: true });

    // Generate fresh token directly — no OTP needed for recovery
    const token = generateAdminToken(adminUser._id, adminUser.phone);

    res.status(200).json({
      success: true,
      message: 'Account recovered successfully',
      token,
      user: { id: adminUser._id, name: adminUser.name, phone: adminUser.phone }
    });

  } catch (error) {
    console.error('recoverAdmin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sendOtp, verifyOtp, recoverAdmin };