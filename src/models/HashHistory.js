const mongoose = require('mongoose');

const hashHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['generate', 'verify'],
    required: true
  },
  algorithm: {
    type: String,
    enum: ['MD5', 'SHA1', 'SHA256', 'SHA512', 'bcrypt'],
    required: true
  },
  input: {
    type: String,
    required: true
  },
  result: {
    type: String
  },
  verified: {
    type: Boolean
  },
  fileName: {
    type: String
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

hashHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('HashHistory', hashHistorySchema);
