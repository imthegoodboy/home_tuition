const express = require('express');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const router = express.Router();

// Get pricing for all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true })
      .select('name class pricing')
      .sort({ class: 1, name: 1 });
    
    res.json(subjects);
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Calculate total price based on selected subjects and class
router.post('/calculate', async (req, res) => {
  try {
    const { selectedSubjects, class: studentClass } = req.body;
    
    if (!selectedSubjects || !Array.isArray(selectedSubjects) || selectedSubjects.length === 0) {
      return res.status(400).json({ message: 'Please select at least one subject' });
    }

    const subjects = await Subject.find({
      name: { $in: selectedSubjects },
      class: studentClass,
      isActive: true
    });

    if (subjects.length === 0) {
      return res.status(404).json({ message: 'No subjects found for the selected criteria' });
    }

    const pricing = subjects.map(subject => ({
      subject: subject.name,
      class: subject.class,
      monthlyFee: subject.pricing.monthly,
      hourlyFee: subject.pricing.hourly
    }));

    const totalMonthlyFee = pricing.reduce((sum, subject) => sum + subject.monthlyFee, 0);
    const totalHourlyFee = pricing.reduce((sum, subject) => sum + subject.hourlyFee, 0);

    res.json({
      subjects: pricing,
      totalMonthlyFee,
      totalHourlyFee,
      discount: totalMonthlyFee > 5000 ? 500 : 0, // 500 discount for fees above 5000
      finalAmount: totalMonthlyFee - (totalMonthlyFee > 5000 ? 500 : 0)
    });
  } catch (error) {
    console.error('Calculate pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pricing by class
router.get('/class/:class', async (req, res) => {
  try {
    const subjects = await Subject.find({
      class: req.params.class,
      isActive: true
    }).select('name pricing').sort({ name: 1 });
    
    res.json(subjects);
  } catch (error) {
    console.error('Get pricing by class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

