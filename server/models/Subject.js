const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  board: {
    type: String,
    default: 'CBSE'
  },
  description: String,
  chapters: [{
    name: String,
    description: String,
    order: Number
  }],
  pricing: {
    monthly: Number,
    hourly: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subject', subjectSchema);

