const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  cutoffTime: {
    type: String,
    default: '21:15'
  },
  ordersOpenForToday: {
    type: Boolean,
    default: true
  },
  upiId: {
    type: String,
    default: ''
  },
  upiQrImage: {
    type: String,
    default: ''
  },
  pickupSlots: {
    type: [String],
    default: ['morning', 'evening']
  },
  shopMessage: {
    type: String,
    default: ''
  },
  isShopOpen: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);