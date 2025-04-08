import Consultant from '../models/consultantModel.js';
import asyncHandler from 'express-async-handler';

// Get all consultants
const getConsultants = asyncHandler(async (req, res) => {
  const { status, search, specialty, consultantType } = req.query;

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

  if (consultantType) {
    query.consultantType = consultantType;
  }

  const consultants = await Consultant.find(query).sort('-createdAt');
  res.json(consultants);
});

// Get a consultant by ID
const getConsultantById = asyncHandler(async (req, res) => {
  const consultant = await Consultant.findById(req.params.id);

  if (!consultant) {
    res.status(404);
    throw new Error('Consultant not found');
  }

  res.json(consultant);
});

// Create a new consultant
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
    paymentModeDetails,
    status,
    visible,
    consultantType
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
    paymentModeDetails,
    status,
    visible,
    consultantType
  });

  res.status(201).json(consultant);
});

// Update an existing consultant
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
    paymentModeDetails,
    status,
    visible,
    consultantType
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
  consultant.paymentModeDetails = paymentModeDetails || consultant.paymentModeDetails;
  consultant.status = status || consultant.status;
  consultant.visible = visible !== undefined ? visible : consultant.visible;
  consultant.consultantType = consultantType || consultant.consultantType;

  const updatedConsultant = await consultant.save();
  res.json(updatedConsultant);
});

// Delete a consultant
const deleteConsultant = asyncHandler(async (req, res) => {
  const consultant = await Consultant.findById(req.params.id);

  if (!consultant) {
    res.status(404);
    throw new Error('Consultant not found');
  }

  await Consultant.deleteOne({ _id: req.params.id });

  res.json({ success: true, message: 'Consultant removed' });
});

// Toggle the visibility of a consultant
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
  getConsultantById,
  createConsultant,
  updateConsultant,
  deleteConsultant,
  toggleVisibility
};
