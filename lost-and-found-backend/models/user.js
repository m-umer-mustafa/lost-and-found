const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  reportedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

// Hash password before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  // Use crypto to hash the password
  const hash = crypto.pbkdf2Sync(this.password, 'salt', 1000, 64, 'sha512').toString('hex');
  this.password = hash;
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function(candidatePassword) {
  const hash = crypto.pbkdf2Sync(candidatePassword, 'salt', 1000, 64, 'sha512').toString('hex');
  return hash === this.password;
};

module.exports = mongoose.model('User', userSchema);