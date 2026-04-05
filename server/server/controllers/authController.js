node -e "
const fs = require('fs');
const content = \`const User = require('../models/User');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseAdmin');

const generateToken = (id, phone) => {
  return jwt.sign(
    { id, phone, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const verifyFirebaseToken = async (req, res) => {
  try {
    const { firebaseToken, name, address } = req.body;
    if (!firebaseToken) {
      return res.status(400).json({ message: 'Firebase token is required' });
    }
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const { phone_number, email, uid } = decodedToken;
    const identifier = phone_number || email;
    if (!identifier) {
      return res.status(400).json({ message: 'No phone or email found in token' });
    }
    let user = await User.findOne({ \$or: [{ phone: phone_number }, { email }] });
    if (user) {
      const token = generateToken(user._id, user.phone);
      return res.status(200).json({ success: true, isNewUser: false, token, user: { id: user._id, name: user.name, phone: user.phone, email: user.email, address: user.address, walletBalance: user.walletBalance } });
    } else {
      if (!name) {
        return res.status(400).json({ message: 'New user! Please provide name.', isNewUser: true, uid, phone: phone_number, email });
      }
      user = await User.create({ name, phone: phone_number || '', email: email || '', address: address || {} });
      const token = generateToken(user._id, user.phone);
      return res.status(201).json({ success: true, isNewUser: true, token, user: { id: user._id, name: user.name, phone: user.phone, email: user.email, address: user.address, walletBalance: user.walletBalance } });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid Firebase token', error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const existingUser = await User.findOne({ \$or: [{ phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, phone, email, address });
    const token = generateToken(user._id, user.phone);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, phone: user.phone, address: user.address, walletBalance: user.walletBalance } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }
    const token = generateToken(user._id, user.phone);
    res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, phone: user.phone, address: user.address, walletBalance: user.walletBalance } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, address }, { new: true }).select('-__v');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    await User.findByIdAndUpdate(req.user.id, { fcmToken });
    res.status(200).json({ success: true, message: 'FCM token updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { verifyFirebaseToken, registerUser, loginUser, getProfile, updateProfile, updateFcmToken };
\`;
fs.writeFileSync('E:/PERSONAL_PROJECT/server/controllers/authController.js', content, 'utf8');
console.log('Done!');
"