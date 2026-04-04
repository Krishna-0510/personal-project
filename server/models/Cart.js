const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
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
      quantity: {
        type: Number,
        default: 1,
        min: 1
      },
      unit: String,
      image: String
    }
  ],
  totalAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);