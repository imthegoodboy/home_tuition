const express = require('express');
const PricingConfig = require('../models/PricingConfig');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const router = express.Router();

// Get pricing config
router.get('/pricing-config', async (req, res) => {
  try {
    const cfg = await PricingConfig.findOne();
    res.json(cfg || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update pricing config (Admin)
router.post('/pricing-config', async (req, res) => {
  try {
    const data = req.body;
    let cfg = await PricingConfig.findOne();
    if (!cfg) cfg = new PricingConfig();
    if (data.classBase) cfg.classBase = data.classBase;
    if (typeof data.discountPercent === 'number') cfg.discountPercent = data.discountPercent;
    cfg.updatedAt = new Date();
    await cfg.save();
    res.json(cfg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list users / students / teachers
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().populate('userId', '-password');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('userId', '-password');
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
