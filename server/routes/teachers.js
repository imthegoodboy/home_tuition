const express = require('express');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const User = require('../models/User');
const router = express.Router();

// Get teacher profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.params.userId })
      .populate('userId', 'name email phone address')
      .populate('students.studentId', 'userId subjects testMarks')
      .populate('students.studentId.userId', 'name phone');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update teacher profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error('Update teacher profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get teacher's students
router.get('/students/:userId', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.params.userId })
      .populate({
        path: 'students.studentId',
        populate: {
          path: 'userId',
          select: 'name email phone address'
        }
      });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher.students);
  } catch (error) {
    console.error('Get teacher students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add student to teacher
router.post('/add-student/:userId', async (req, res) => {
  try {
    const { studentId, subject } = req.body;
    
    const teacher = await Teacher.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $push: {
          students: {
            studentId,
            subject,
            startDate: new Date()
          }
        }
      },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Also update student's teacher assignment
    await Student.findOneAndUpdate(
      { userId: studentId },
      {
        $push: {
          subjects: {
            subject,
            teacherId: teacher._id,
            isActive: true
          }
        }
      }
    );

    res.json({ message: 'Student added successfully', teacher });
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get teacher's salary details
router.get('/salary/:userId', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.params.userId })
      .select('salary pendingPayments');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({
      salary: teacher.salary,
      pendingPayments: teacher.pendingPayments
    });
  } catch (error) {
    console.error('Get salary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update salary structure
router.put('/salary/:userId', async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { userId: req.params.userId },
      { 
        $set: { 
          salary: req.body,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Salary structure updated successfully', teacher });
  } catch (error) {
    console.error('Update salary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark payment as received
router.put('/receive-payment/:userId', async (req, res) => {
  try {
    const { month, year } = req.body;
    
    const teacher = await Teacher.findOneAndUpdate(
      { 
        userId: req.params.userId,
        'pendingPayments.month': month,
        'pendingPayments.year': year
      },
      {
        $set: {
          'pendingPayments.$.isPaid': true
        }
      },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher or payment record not found' });
    }

    res.json({ message: 'Payment marked as received successfully' });
  } catch (error) {
    console.error('Receive payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

