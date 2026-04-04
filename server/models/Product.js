const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastPriceUpdate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);code models/Order.js