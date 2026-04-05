const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyFirebaseToken,
  getProfile,
  updateProfile,
  updateFcmToken
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');

// Firebase token verification (Phone OTP + Google)
router.post('/verify-firebase', verifyFirebaseToken);

// Register + Login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/fcm-token', verifyToken, updateFcmToken);

module.exports = router;