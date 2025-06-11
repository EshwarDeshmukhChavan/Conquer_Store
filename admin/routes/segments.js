const express = require('express');
const router = express.Router();
const Segment = require('../models/Segment');

// Get all segments
router.get('/', async (req, res) => {
  try {
    const segments = await Segment.find()
      .populate('allowedCategories', 'name description')
      .populate('organizations', 'name domain');
    res.json(segments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single segment
router.get('/:id', async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id)
      .populate('allowedCategories', 'name description')
      .populate('organizations', 'name domain');
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    res.json(segment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create segment
router.post('/', async (req, res) => {
  try {
    const segment = new Segment(req.body);
    const newSegment = await segment.save();
    res.status(201).json(newSegment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update segment
router.put('/:id', async (req, res) => {
  try {
    const segment = await Segment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    res.json(segment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete segment
router.delete('/:id', async (req, res) => {
  try {
    const segment = await Segment.findByIdAndDelete(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    res.json({ message: 'Segment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle segment status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    segment.isActive = !segment.isActive;
    await segment.save();
    res.json(segment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;