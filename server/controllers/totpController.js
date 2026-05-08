const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const Admin = require('../models/Admin');

// @route  GET /api/admin/totp/setup
// @desc   Generate TOTP secret + QR code for admin
const setupTOTP = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `Krishna Kirana (${req.admin.phone})`,
      length: 20
    });

    // Save secret to admin in DB (not yet verified)
    await Admin.findByIdAndUpdate(req.admin.id, {
      totpSecret: secret.base32,
      totpEnabled: false
    });

    // Generate QR code as data URL
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
// @desc   Verify OTP and enable TOTP for admin
const verifyTOTP = async (req, res) => {
  try {
    const { token } = req.body;

    const admin = await Admin.findById(req.admin.id);
    if (!admin || !admin.totpSecret) {
      return res.status(400).json({ success: false, message: 'TOTP not set up yet' });
    }

    const verified = speakeasy.totp.verify({
      secret: admin.totpSecret,
      encoding: 'base32',
      token,
      window: 1 // allow 30 sec clock drift
    });

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Mark TOTP as enabled
    await Admin.findByIdAndUpdate(req.admin.id, { totpEnabled: true });

    res.json({ success: true, message: 'TOTP enabled successfully' });

  } catch (error) {
    console.error('TOTP verify error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

module.exports = { setupTOTP, verifyTOTP };