import Consultant from '../models/Consultant.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all consultants
// @route   GET /api/consultants
// @access  Public
const getConsultants = asyncHandler(async (req, res) => {
  const { status, search, specialty } = req.query;
  
  const query = {};
  
  if (status && status !== 'all') {
    query.status = status;
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { companyEmail: { $regex: search, $options: 'i' } },
      { companyAddress: { $regex: search, $options: 'i' } }
    ];
  }

  if (specialty) {
    query.specialties = specialty;
  }

  const consultants = await Consultant.find(query).sort('-createdAt');
  res.json(consultants);
});

// @desc    Create new consultant
// @route   POST /api/consultants
// @access  Private
const createConsultant = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    companyEmail,
    companyWebsite,
    companyAddress,
    yearsOfExperience,
    specialties,
    projects,
    registrationMode,
    registrationYears,
    paymentMode,
    status,
    visible
  } = req.body;

  const consultant = await Consultant.create({
    name,
    contactNumber,
    companyEmail,
    companyWebsite,
    companyAddress,
    yearsOfExperience,
    specialties,
    projects,
    registrationMode,
    registrationYears,
    paymentMode,
    status,
    visible
  });

  res.status(201).json(consultant);
});

// @desc    Update consultant
// @route   PUT /api/consultants/:id
// @access  Private
const updateConsultant = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    companyEmail,
    companyWebsite,
    companyAddress,
    yearsOfExperience,
    specialties,
    projects,
    registrationMode,
    registrationYears,
    paymentMode,
    status,
    visible
  } = req.body;

  const consultant = await Consultant.findById(req.params.id);

  if (!consultant) {
    res.status(404);
    throw new Error('Consultant not found');
  }

  consultant.name = name || consultant.name;
  consultant.contactNumber = contactNumber || consultant.contactNumber;
  consultant.companyEmail = companyEmail || consultant.companyEmail;
  consultant.companyWebsite = companyWebsite !== undefined ? companyWebsite : consultant.companyWebsite;
  consultant.companyAddress = companyAddress || consultant.companyAddress;
  consultant.yearsOfExperience = yearsOfExperience || consultant.yearsOfExperience;
  consultant.specialties = specialties || consultant.specialties;
  consultant.projects = projects || consultant.projects;
  consultant.registrationMode = registrationMode || consultant.registrationMode;
  consultant.registrationYears = registrationYears !== undefined ? registrationYears : consultant.registrationYears;
  consultant.paymentMode = paymentMode || consultant.paymentMode;
  consultant.status = status || consultant.status;
  consultant.visible = visible !== undefined ? visible : consultant.visible;

  const updatedConsultant = await consultant.save();
  res.json(updatedConsultant);
});

// @desc    Delete consultant
// @route   DELETE /api/consultants/:id
// @access  Private
const deleteConsultant = asyncHandler(async (req, res) => {
  const consultant = await Consultant.findById(req.params.id);

  if (!consultant) {
    res.status(404);
    throw new Error('Consultant not found');
  }

  // Use deleteOne() instead of remove()
  await Consultant.deleteOne({ _id: req.params.id });
  
  res.json({ success: true, message: 'Consultant removed' });
});

// @desc    Toggle consultant visibility
// @route   PATCH /api/consultants/:id/visibility
// @access  Private
const toggleVisibility = asyncHandler(async (req, res) => {
  const consultant = await Consultant.findById(req.params.id);

  if (!consultant) {
    res.status(404);
    throw new Error('Consultant not found');
  }

  consultant.visible = !consultant.visible;
  const updatedConsultant = await consultant.save();

  res.json(updatedConsultant);
});

export {
  getConsultants,
  createConsultant,
  updateConsultant,
  deleteConsultant,
  toggleVisibility
};