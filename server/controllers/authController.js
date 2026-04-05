const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, phone) => {
  return jwt.sign(
    { id, phone, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @route  POST /api/auth/register
// @desc   Register new user after Firebase OTP verification
const registerUser = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ name, phone, address });

    // Generate token
    const token = generateToken(user._id, user.phone);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        walletBalance: user.walletBalance
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/auth/login
// @desc   Login existing user after Firebase OTP verification
const loginUser = async (req, res) => {
  try {
    const { phone } = req.body;

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    // Generate token
    const token = generateToken(user._id, user.phone);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        walletBalance: user.walletBalance
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/auth/profile
// @desc   Get logged in user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/auth/profile
// @desc   Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, address },
      { new: true }
    ).select('-__v');

    res.status(200).json({ success: true, user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };