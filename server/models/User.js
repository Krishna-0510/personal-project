const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: 'Killa-Pardi' },
    pincode: { type: String, default: '396125' }
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  fcmToken: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);