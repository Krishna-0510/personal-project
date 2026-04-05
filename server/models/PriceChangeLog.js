const mongoose = require('mongoose');

const priceChangeLogSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  oldPrice: {
    type: Number,
    required: true
  },
  newPrice: {
    type: Number,
    required: true
  },
  changedBy: {
    type: String,
    default: 'Father'
  },
  changeMethod: {
    type: String,
    enum: ['whatsapp', 'dashboard'],
    default: 'whatsapp'
  },
  whatsappCommand: {
    type: String,
    default: ''
  },
  note: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('PriceChangeLog', priceChangeLogSchema);