const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, recoverAdmin } = require('../controllers/otpController');

// POST /api/admin/auth/send-otp
router.post('/send-otp', sendOtp);

// POST /api/admin/auth/verify-otp
router.post('/verify-otp', verifyOtp);

// POST /api/admin/auth/recover
router.post('/recover', recoverAdmin);

module.exports = router;