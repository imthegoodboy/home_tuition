const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  subjects: [{
    subject: {
      type: String,
      required: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  testMarks: [{
    subject: String,
    testName: String,
    marks: Number,
    totalMarks: Number,
    date: Date,
    remarks: String
  }],
  feeStructure: {
    monthlyFee: Number,
    subjects: [{
      subject: String,
      fee: Number
    }],
    totalMonthlyFee: Number
  },
  pendingFees: [{
    month: String,
    year: Number,
    amount: Number,
    dueDate: Date,
    isPaid: {
      type: Boolean,
      default: false
    }
  }],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  parentDetails: {
    fatherName: String,
    motherName: String,
    fatherPhone: String,
    motherPhone: String,
    fatherOccupation: String,
    motherOccupation: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);

