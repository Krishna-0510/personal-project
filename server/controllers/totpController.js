const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const Admin = require('../models/Admin');

// @route  GET /api/admin/totp/setup
const setupTOTP = async (req, res) => {
  try {
    console.log('🔍 req.user:', req.user);

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const secret = speakeasy.generateSecret({
      name: `Krishna Kirana (${req.user.phone})`,
      length: 20
    });

    admin.totpSecret = secret.base32;
    admin.totpEnabled = false;
    await admin.save();

    console.log('✅ Secret saved:', admin.totpSecret);

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl
    });

  } catch (error) {
    console.error('TOTP setup error:', error);
    res.status(500).json({ success: false, message: 'Failed to setup TOTP' });
  }
};

// @route  POST /api/admin/totp/verify
const verifyTOTP = async (req, res) => {
  try {
    const { token } = req.body;

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.totpSecret) {
      return res.status(400).json({ success: false, message: 'TOTP not set up yet' });
    }

    const verified = speakeasy.totp.verify({
      secret: admin.totpSecret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    await Admin.findByIdAndUpdate(req.user.id, { totpEnabled: true });

    res.json({ success: true, message: 'TOTP enabled successfully' });

  } catch (error) {
    console.error('TOTP verify error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

module.exports = { setupTOTP, verifyTOTP };