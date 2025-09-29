const express = require('express');
const Subject = require('../models/Subject');
const router = express.Router();

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true }).sort({ class: 1, name: 1 });
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subjects by class
router.get('/class/:class', async (req, res) => {
  try {
    const subjects = await Subject.find({ 
      class: req.params.class, 
      isActive: true 
    }).sort({ name: 1 });
    
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects by class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await Subject.distinct('class');
    res.json(classes.sort((a, b) => parseInt(a) - parseInt(b)));
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create subject (Admin only)
router.post('/', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subject (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

