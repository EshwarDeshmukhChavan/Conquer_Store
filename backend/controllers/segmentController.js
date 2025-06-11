const Segment = require('../models/Segment');
const Organization = require('../models/Organization');
const Category = require('../models/Category');

// Get all segments
exports.getAllSegments = async (req, res) => {
  try {
    const segments = await Segment.find()
      .populate('allowedCategories', 'name description')
      .populate('organizations', 'name domain');
    
    res.status(200).json(segments);
  } catch (error) {
    console.error('Error fetching segments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get segment by ID
exports.getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id)
      .populate('allowedCategories', 'name description')
      .populate('organizations', 'name domain');
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    
    res.status(200).json(segment);
  } catch (error) {
    console.error('Error fetching segment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new segment
exports.createSegment = async (req, res) => {
  try {
    const { name, description, allowedRoles, allowedCategories, organizations, discountPercentage } = req.body;
    
    // Check if segment with same name already exists
    const existingSegment = await Segment.findOne({ name });
    if (existingSegment) {
      return res.status(400).json({ message: 'Segment with this name already exists' });
    }
    
    // Create new segment
    const segment = new Segment({
      name,
      description,
      allowedRoles,
      allowedCategories,
      organizations,
      discountPercentage: discountPercentage || 0,
      isActive: true
    });
    
    await segment.save();
    
    res.status(201).json(segment);
  } catch (error) {
    console.error('Error creating segment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update segment
exports.updateSegment = async (req, res) => {
  try {
    const { name, description, allowedRoles, allowedCategories, organizations, discountPercentage, isActive } = req.body;
    
    // Check if segment exists
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    
    // Check if name is being changed and if new name already exists
    if (name && name !== segment.name) {
      const existingSegment = await Segment.findOne({ name });
      if (existingSegment) {
        return res.status(400).json({ message: 'Segment with this name already exists' });
      }
    }
    
    // Update segment
    const updatedSegment = await Segment.findByIdAndUpdate(
      req.params.id,
      {
        name: name || segment.name,
        description: description || segment.description,
        allowedRoles: allowedRoles || segment.allowedRoles,
        allowedCategories: allowedCategories || segment.allowedCategories,
        organizations: organizations || segment.organizations,
        discountPercentage: discountPercentage !== undefined ? discountPercentage : segment.discountPercentage,
        isActive: isActive !== undefined ? isActive : segment.isActive
      },
      { new: true }
    );
    
    res.status(200).json(updatedSegment);
  } catch (error) {
    console.error('Error updating segment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete segment
exports.deleteSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    
    await Segment.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Segment deleted successfully' });
  } catch (error) {
    console.error('Error deleting segment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle segment status
exports.toggleSegmentStatus = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    
    segment.isActive = !segment.isActive;
    await segment.save();
    
    res.status(200).json(segment);
  } catch (error) {
    console.error('Error toggling segment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add organization to segment
exports.addOrganizationToSegment = async (req, res) => {
  try {
    const { organizationId } = req.body;
    
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Check if organization is already in segment
    if (segment.organizations.includes(organizationId)) {
      return res.status(400).json({ message: 'Organization already in segment' });
    }
    
    segment.organizations.push(organizationId);
    await segment.save();
    
    res.status(200).json(segment);
  } catch (error) {
    console.error('Error adding organization to segment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove organization from segment
exports.removeOrganizationFromSegment = async (req, res) => {
  try {
    const { organizationId } = req.body;
    
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    
    // Check if organization is in segment
    if (!segment.organizations.includes(organizationId)) {
      return res.status(400).json({ message: 'Organization not in segment' });
    }
    
    segment.organizations = segment.organizations.filter(
      org => org.toString() !== organizationId
    );
    await segment.save();
    
    res.status(200).json(segment);
  } catch (error) {
    console.error('Error removing organization from segment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};