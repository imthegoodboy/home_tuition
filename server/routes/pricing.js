const express = require('express');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const PricingConfig = require('../models/PricingConfig');
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
    const { selectedSubjects, class: studentClass, allSubjects, daysPerWeek } = req.body;
    
    // daysPerWeek: how many days per week the student wants tuition (1-7)
    const days = Math.max(1, Math.min(parseInt(daysPerWeek) || 3, 7));

    // Load pricing configuration
    const cfg = await PricingConfig.findOne();
    const classBase = cfg?.classBase?.get(String(studentClass)) || null;

    // If allSubjects flag, fetch all active subjects for class
    let subjectsList = [];
    if (allSubjects) {
      subjectsList = await Subject.find({ class: studentClass, isActive: true });
    } else {
      if (!selectedSubjects || !Array.isArray(selectedSubjects) || selectedSubjects.length === 0) {
        return res.status(400).json({ message: 'Please select at least one subject' });
      }
      subjectsList = await Subject.find({ name: { $in: selectedSubjects }, class: studentClass, isActive: true });
    }

    if (subjectsList.length === 0) {
      return res.status(404).json({ message: 'No subjects found for the selected criteria' });
    }

    // If classBase configured, distribute base price across subjects; else use per-subject monthly
    let pricing = [];
    if (classBase) {
      const perSubject = Math.round(classBase / subjectsList.length);
      pricing = subjectsList.map(sub => ({
        subject: sub.name,
        class: sub.class,
        monthlyFee: perSubject,
        hourlyFee: sub.pricing?.hourly || Math.round(perSubject / 10)
      }));
    } else {
      pricing = subjectsList.map(sub => ({
        subject: sub.name,
        class: sub.class,
        monthlyFee: sub.pricing?.monthly || 3000,
        hourlyFee: sub.pricing?.hourly || 300
      }));
    }

    // Adjust price by daysPerWeek: more days -> higher multiplier
    // base multiplier: 1 day = 0.6, 2=0.75, 3=1, 4=1.2, 5=1.4, 6=1.6, 7=1.8
    const multipliers = [0, 0.6, 0.75, 1, 1.2, 1.4, 1.6, 1.8];
    const multiplier = multipliers[days] || 1;

    pricing = pricing.map(p => ({ ...p, monthlyFee: Math.round(p.monthlyFee * multiplier) }));

    const subtotal = pricing.reduce((sum, s) => sum + s.monthlyFee, 0);

    // Apply admin-configured percentage discount if present
    let discount = 0;
    if (cfg && cfg.discountPercent) {
      discount = Math.round((subtotal * cfg.discountPercent) / 100);
    }

    const finalAmount = subtotal - discount;

    res.json({
      subjects: pricing,
      subtotal,
      discount,
      finalAmount,
      daysPerWeek: days,
      classBase: classBase || null
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

