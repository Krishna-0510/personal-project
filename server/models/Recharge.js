const mongoose = require('mongoose');

const rechargeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  upiReference: {
    type: String,
    default: ''
  },
  paymentScreenshot: {
    type: String,
    default: ''
  },
  note: {
    type: String,
    default: ''
  },
  processedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Recharge', rechargeSchema);