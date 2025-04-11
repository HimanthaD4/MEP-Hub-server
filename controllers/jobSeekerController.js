import JobSeeker from '../models/jobSeekerModel.js';
import asyncHandler from 'express-async-handler';

// Get all Job Seekers with filtering
const getJobSeekers = asyncHandler(async (req, res) => {
  const { professionalType, minExperience, maxExperience, search, visible } = req.query;

  const query = {};

  // Professional type filter
  if (professionalType) {
    query.professionalType = professionalType;
  }

  // Experience range filter
  if (minExperience || maxExperience) {
    query.yearsOfExperience = {};
    if (minExperience) query.yearsOfExperience.$gte = Number(minExperience);
    if (maxExperience) query.yearsOfExperience.$lte = Number(maxExperience);
  }

  // Search across multiple fields
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { currentCompany: { $regex: search, $options: 'i' } }
    ];
  }

  // Visibility filter
  if (visible !== undefined) {
    query.visible = visible === 'true';
  }

  const jobSeekers = await JobSeeker.find(query).sort('-yearsOfExperience');
  res.json(jobSeekers);
});

// Get single job seeker by ID
const getJobSeekerById = asyncHandler(async (req, res) => {
  const jobSeeker = await JobSeeker.findById(req.params.id);

  if (!jobSeeker) {
    res.status(404);
    throw new Error('Job seeker not found');
  }

  res.json(jobSeeker);
});

// Create new job seeker
const createJobSeeker = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    contactNumber,
    email,
    professionalType,
    yearsOfExperience,
    currentlyEmployed,
    currentCompany,
    highestQualification,
    workHistory,
    visible
  } = req.body;

  const jobSeeker = await JobSeeker.create({
    firstName,
    lastName,
    contactNumber,
    email,
    professionalType,
    yearsOfExperience,
    currentlyEmployed,
    currentCompany,
    highestQualification,
    workHistory: workHistory || [],
    visible: visible !== undefined ? visible : true
  });

  res.status(201).json(jobSeeker);
});

// Update job seeker
const updateJobSeeker = asyncHandler(async (req, res) => {
  const jobSeeker = await JobSeeker.findById(req.params.id);

  if (!jobSeeker) {
    res.status(404);
    throw new Error('Job seeker not found');
  }

  // Update only provided fields
  const updatableFields = [
    'firstName', 'lastName', 'contactNumber', 'email',
    'professionalType', 'yearsOfExperience', 'currentlyEmployed',
    'currentCompany', 'highestQualification', 'workHistory', 'visible'
  ];

  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      jobSeeker[field] = req.body[field];
    }
  });

  const updatedJobSeeker = await jobSeeker.save();
  res.json(updatedJobSeeker);
});

// Delete job seeker
const deleteJobSeeker = asyncHandler(async (req, res) => {
  const jobSeeker = await JobSeeker.findById(req.params.id);

  if (!jobSeeker) {
    res.status(404);
    throw new Error('Job seeker not found');
  }

  await JobSeeker.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Job seeker removed' });
});

// Toggle job seeker visibility
const toggleVisibility = asyncHandler(async (req, res) => {
  const jobSeeker = await JobSeeker.findById(req.params.id);

  if (!jobSeeker) {
    res.status(404);
    throw new Error('Job seeker not found');
  }

  jobSeeker.visible = !jobSeeker.visible;
  const updatedJobSeeker = await jobSeeker.save();

  res.json(updatedJobSeeker);
});

export {
  getJobSeekers,
  getJobSeekerById,
  createJobSeeker,
  updateJobSeeker,
  deleteJobSeeker,
  toggleVisibility
};