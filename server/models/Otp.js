const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true
  },
  otpHash: {
    type: String,
    required: true  // ← storing HASH not plain OTP
  },
  attempts: {
    type: Number,
    default: 0     // ← track wrong attempts
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300   // ← auto deleted after 5 minutes
  }
});

// Hash OTP before saving
otpSchema.pre('save', async function () {
  if (!this.isModified('otpHash')) return;
  this.otpHash = await bcrypt.hash(this.otpHash, 10);
});

// Method to check OTP
otpSchema.methods.isOtpCorrect = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otpHash);
};

module.exports = mongoose.model('Otp', otpSchema);