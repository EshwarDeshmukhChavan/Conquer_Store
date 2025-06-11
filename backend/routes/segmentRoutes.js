const express = require('express');
const router = express.Router();
const roleCheck = require('../middleware/roleCheck');
const {
  getAllSegments,
  getSegmentById,
  createSegment,
  updateSegment,
  deleteSegment,
  toggleSegmentStatus,
  addOrganizationToSegment,
  removeOrganizationFromSegment
} = require('../controllers/segmentController');

// All segment routes require admin role

// Get all segments
router.get('/', roleCheck(['admin']), getAllSegments);

// Get segment by ID
router.get('/:id', roleCheck(['admin']), getSegmentById);

// Create new segment
router.post('/', roleCheck(['admin']), createSegment);

// Update segment
router.put('/:id', roleCheck(['admin']), updateSegment);

// Delete segment
router.delete('/:id', roleCheck(['admin']), deleteSegment);

// Toggle segment status
router.patch('/:id/toggle-status', roleCheck(['admin']), toggleSegmentStatus);

// Add organization to segment
router.post('/:id/organizations', roleCheck(['admin']), addOrganizationToSegment);

// Remove organization from segment
router.delete('/:id/organizations', roleCheck(['admin']), removeOrganizationFromSegment);

module.exports = router;