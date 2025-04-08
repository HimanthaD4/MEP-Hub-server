import Contractor from '../models/contractorModel.js';
import asyncHandler from 'express-async-handler';

// Get all Contractor
const getContractor = asyncHandler(async (req, res) => {
  const { status, search, specialty, contractorType } = req.query;

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

  if (contractorType) {
    query.contractorType = contractorType;
  }

  const contractors = await Contractor.find(query).sort('-createdAt');
  res.json(contractors);
});

// Get a Contractor by ID
const getContractorById = asyncHandler(async (req, res) => {
  const contractor = await Contractor.findById(req.params.id);

  if (!contractor) {
    res.status(404);
    throw new Error('Contractor not found');
  }

  res.json(contractor);
});

// Create a new contractor
const createContractor = asyncHandler(async (req, res) => {
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
    contractorType
  } = req.body;

  const contractor = await Contractor.create({
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
    contractorType
  });

  res.status(201).json(contractor);
});

// Update an existing Contractor
const updateContractor = asyncHandler(async (req, res) => {
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
    contractorType
  } = req.body;

  const contractor = await Contractor.findById(req.params.id);

  if (!contractor) {
    res.status(404);
    throw new Error('contractor not found');
  }

  contractor.name = name || contractor.name;
  contractor.contactNumber = contactNumber || contractor.contactNumber;
  contractor.companyEmail = companyEmail || contractor.companyEmail;
  contractor.companyWebsite = companyWebsite !== undefined ? companyWebsite : contractor.companyWebsite;
  contractor.companyAddress = companyAddress || contractor.companyAddress;
  contractor.yearsOfExperience = yearsOfExperience || contractor.yearsOfExperience;
  contractor.specialties = specialties || contractor.specialties;
  contractor.projects = projects || contractor.projects;
  contractor.registrationMode = registrationMode || contractor.registrationMode;
  contractor.registrationYears = registrationYears !== undefined ? registrationYears : contractor.registrationYears;
  contractor.paymentModeDetails = paymentModeDetails || contractor.paymentModeDetails;
  contractor.status = status || contractor.status;
  contractor.visible = visible !== undefined ? visible : contractor.visible;
  contractor.contractorType = contractorType || contractor.contractorType;

  const updatedContractor = await contractor.save();
  res.json(updatedContractor);
});

// Delete a Contractor
const deleteContractor = asyncHandler(async (req, res) => {
  const contractor = await Contractor.findById(req.params.id);

  if (!contractor) {
    res.status(404);
    throw new Error('Contractor not found');
  }

  await Contractor.deleteOne({ _id: req.params.id });

  res.json({ success: true, message: 'Contractor removed' });
});

// Toggle the visibility of a contractor
const toggleVisibility = asyncHandler(async (req, res) => {
    const contractor = await Contractor.findById(req.params.id);
  if (!contractor) {
    res.status(404);
    throw new Error('contractor not found');
  }

  contractor.visible = !contractor.visible;
  const updatedContractor = await contractor.save();

  res.json(updatedContractor);
});

export {
  getContractor,
  getContractorById,
  createContractor,
  updateContractor,
  deleteContractor,
  toggleVisibility
};
