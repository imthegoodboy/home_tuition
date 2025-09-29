const express = require('express');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const router = express.Router();

// Find tutors by location
router.get('/search', async (req, res) => {
  try {
    const { pincode, area, subject, class: studentClass } = req.query;
    
    let query = {
      isVerified: true,
      'subjects.isAvailable': true
    };

    // Filter by location
    if (pincode) {
      query['location.pincode'] = pincode;
    }
    if (area) {
      query['location.area'] = new RegExp(area, 'i');
    }

    // Filter by subject and class
    if (subject) {
      query['subjects.subject'] = subject;
    }
    if (studentClass) {
      query['subjects.classes'] = studentClass;
    }

    const teachers = await Teacher.find(query)
      .populate('userId', 'name phone address')
      .select('userId subjects location experience rating bio')
      .limit(20);

    // Format response
    const tutors = teachers.map(teacher => ({
      id: teacher._id,
      name: teacher.userId.name,
      phone: teacher.userId.phone,
      subjects: teacher.subjects.filter(sub => 
        !subject || sub.subject === subject
      ),
      location: teacher.location,
      experience: teacher.experience,
      rating: teacher.rating,
      bio: teacher.bio
    }));

    res.json(tutors);
  } catch (error) {
    console.error('Search tutors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tutor details
router.get('/:tutorId', async (req, res) => {
  try {
    const tutor = await Teacher.findById(req.params.tutorId)
      .populate('userId', 'name email phone address')
      .populate('students.studentId', 'userId subjects')
      .populate('students.studentId.userId', 'name');

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.json(tutor);
  } catch (error) {
    console.error('Get tutor details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all available subjects for search
router.get('/subjects/available', async (req, res) => {
  try {
    const subjects = await Teacher.aggregate([
      { $match: { isVerified: true, 'subjects.isAvailable': true } },
      { $unwind: '$subjects' },
      { $group: { _id: '$subjects.subject' } },
      { $sort: { _id: 1 } }
    ]);

    res.json(subjects.map(s => s._id));
  } catch (error) {
    console.error('Get available subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get areas by pincode
router.get('/areas/:pincode', async (req, res) => {
  try {
    const areas = await Teacher.distinct('location.area', {
      'location.pincode': req.params.pincode,
      isVerified: true
    });

    res.json(areas);
  } catch (error) {
    console.error('Get areas error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

