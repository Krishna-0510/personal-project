const Otp = require('../models/Otp');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

    const user = await Admin.findOne({ phone });
    if (!user) {
      return res.status(200).json({ success: true, message: 'OTP sent if number is registered' });
    }

    const existing = await Otp.findOne({ phone });
    if (existing) {
      const secondsAgo = (Date.now() - existing.createdAt) / 1000;
      if (secondsAgo < 60) {
        return res.status(429).json({
          message: 'Please wait ' + Math.ceil(60 - secondsAgo) + ' seconds before requesting again'
        });
      }
    }

    await Otp.deleteMany({ phone });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
   await Otp.create({ phone, otpHash: otpCode });
    console.log('\n?? ADMIN OTP for ' + phone + ': ' + otpCode + '\n');

    return res.status(200).json({ success: true, message: 'OTP sent if number is registered' });

  } catch (err) {
    console.error('sendOtp error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const otpRecord = await Otp.findOne({ phone });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    }

 const isMatch = await otpRecord.isOtpCorrect(otp);
if (!isMatch) {
  return res.status(400).json({ success: false, message: 'Invalid OTP' });
}

    await Otp.deleteMany({ phone });

    const admin = await Admin.findOne({ phone });
    const token = generateAdminToken(admin._id, admin.phone);

    return res.json({
      success: true,
      token,
      user: { id: admin._id, name: admin.name, phone: admin.phone }
    });

  } catch (err) {
    console.error('verifyOtp error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/auth/recover
const recoverAdmin = async (req, res) => {
  try {
    const { recoveryCode } = req.body;

    if (recoveryCode !== process.env.ADMIN_RECOVERY_CODE) {
      return res.status(400).json({ success: false, message: 'Invalid recovery code' });
    }

    return res.json({ success: true, message: 'Recovery successful' });

  } catch (err) {
    console.error('recoverAdmin error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sendOtp, verifyOtp, recoverAdmin };
