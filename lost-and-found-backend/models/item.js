const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  found: { type: Boolean, default: false },
  category: { 
    type: String, 
    enum: ['Electronics', 'Stationery', 'Clothing', 'Books', 'Jewelry', 'Other'], 
    required: true 
  },
  reportedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedByUsername: { type: String },
  reportedByEmail: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);