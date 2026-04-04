const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: String,
      price: Number,
      quantity: Number,
      unit: String
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ready', 'collected', 'declined', 'delayed'],
    default: 'pending'
  },
  pickupSlot: {
    type: String,
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['pay_at_shop', 'wallet', 'upi'],
    default: 'pay_at_shop'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);