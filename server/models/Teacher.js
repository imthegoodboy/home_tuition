const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  qualification: {
    degree: String,
    university: String,
    yearOfPassing: Number,
    additionalCertifications: [String]
  },
  experience: {
    years: Number,
    previousInstitutions: [String],
    specializations: [String]
  },
  subjects: [{
    subject: String,
    classes: [String], // Classes they can teach
    hourlyRate: Number,
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  availability: {
    days: [String], // ['Monday', 'Tuesday', etc.]
    timeSlots: [{
      day: String,
      startTime: String,
      endTime: String
    }]
  },
  location: {
    pincode: String,
    area: String,
    city: String,
    state: String,
    travelRadius: Number // in km
  },
  students: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    subject: String,
    startDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  salary: {
    monthlySalary: Number,
    subjects: [{
      subject: String,
      salary: Number
    }],
    totalMonthlySalary: Number
  },
  pendingPayments: [{
    month: String,
    year: Number,
    amount: Number,
    dueDate: Date,
    isPaid: {
      type: Boolean,
      default: false
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  bio: String,
  profileImage: String,
  documents: [{
    type: String, // 'degree', 'certificate', 'id_proof'
    url: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Teacher', teacherSchema);

