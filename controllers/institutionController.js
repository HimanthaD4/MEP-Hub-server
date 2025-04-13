// controllers/institutionController.js
import Institution from '../models/institutionModel.js';
import asyncHandler from 'express-async-handler';

// Get all institutions with filtering
const getInstitutions = asyncHandler(async (req, res) => {
  const { type, status, search } = req.query;
  const query = {};

  if (type) query.type = type;
  if (status && status !== 'all') query.status = status;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } }
    ];
  }

  const institutions = await Institution.find(query).sort('-createdAt');
  res.json(institutions);
});

// Get a single institution by ID
const getInstitutionById = asyncHandler(async (req, res) => {
  const institution = await Institution.findById(req.params.id);
  if (!institution) {
    res.status(404);
    throw new Error('Institution not found');
  }
  res.json(institution);
});

// Create a new institution
const createInstitution = asyncHandler(async (req, res) => {
  const { name, type, email, contactNumber, address, status, visible } = req.body;

  const institution = await Institution.create({
    name,
    type,
    email,
    contactNumber,
    address,
    status,
    visible: visible !== undefined ? visible : true
  });

  res.status(201).json(institution);
});

// Update institution
const updateInstitution = asyncHandler(async (req, res) => {
  const institution = await Institution.findById(req.params.id);
  if (!institution) {
    res.status(404);
    throw new Error('Institution not found');
  }

  const updatableFields = ['name', 'type', 'email', 'contactNumber', 'address', 'status', 'visible'];
  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      institution[field] = req.body[field];
    }
  });

  const updatedInstitution = await institution.save();
  res.json(updatedInstitution);
});

// Toggle visibility
const toggleInstitutionVisibility = asyncHandler(async (req, res) => {
  const institution = await Institution.findById(req.params.id);
  if (!institution) {
    res.status(404);
    throw new Error('Institution not found');
  }

  institution.visible = !institution.visible;
  const updated = await institution.save();
  res.json(updated);
});

// Delete institution
const deleteInstitution = asyncHandler(async (req, res) => {
  const institution = await Institution.findById(req.params.id);
  if (!institution) {
    res.status(404);
    throw new Error('Institution not found');
  }

  await Institution.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Institution removed' });
});

export {
  getInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  toggleInstitutionVisibility
};
