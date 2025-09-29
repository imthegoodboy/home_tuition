const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const router = express.Router();

// Get student profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.userId })
      .populate('userId', 'name email phone address')
      .populate('subjects.teacherId', 'userId subjects location')
      .populate('subjects.teacherId.userId', 'name phone');

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add test marks
router.post('/test-marks/:userId', async (req, res) => {
  try {
    const { subject, testName, marks, totalMarks, remarks } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $push: {
          testMarks: {
            subject,
            testName,
            marks,
            totalMarks,
            date: new Date(),
            remarks
          }
        }
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Test marks added successfully', student });
  } catch (error) {
    console.error('Add test marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get test marks
router.get('/test-marks/:userId', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.userId })
      .select('testMarks');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student.testMarks);
  } catch (error) {
    console.error('Get test marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update fee structure
router.put('/fee-structure/:userId', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.params.userId },
      { 
        $set: { 
          feeStructure: req.body,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Fee structure updated successfully', student });
  } catch (error) {
    console.error('Update fee structure error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending fees
router.get('/pending-fees/:userId', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.userId })
      .select('pendingFees feeStructure');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      pendingFees: student.pendingFees,
      feeStructure: student.feeStructure
    });
  } catch (error) {
    console.error('Get pending fees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark fee as paid
router.put('/pay-fee/:userId', async (req, res) => {
  try {
    const { month, year } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { 
        userId: req.params.userId,
        'pendingFees.month': month,
        'pendingFees.year': year
      },
      {
        $set: {
          'pendingFees.$.isPaid': true
        }
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student or fee record not found' });
    }

    res.json({ message: 'Fee marked as paid successfully' });
  } catch (error) {
    console.error('Pay fee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

