import JobVacancy from '../models/jobVacancyModel.js';
import asyncHandler from 'express-async-handler';

// Get all Job Vacancies with filtering
const getJobVacancies = asyncHandler(async (req, res) => {
  const { jobType, experienceLevel, employmentType, status, search } = req.query;

  const query = {};

  if (jobType) {
    query.jobType = jobType;
  }

  if (experienceLevel) {
    query.experienceLevel = experienceLevel;
  }

  if (employmentType) {
    query.employmentType = employmentType;
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { positionTitle: { $regex: search, $options: 'i' } },
      { jobDescription: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { country: { $regex: search, $options: 'i' } }
    ];
  }

  const jobVacancies = await JobVacancy.find(query)
    .populate('company', 'name logo')
    .sort('-createdAt');
  
  res.json(jobVacancies);
});

// Get single job vacancy by ID
const getJobVacancyById = asyncHandler(async (req, res) => {
  const jobVacancy = await JobVacancy.findById(req.params.id).populate('company', 'name logo');

  if (!jobVacancy) {
    res.status(404);
    throw new Error('Job vacancy not found');
  }

  res.json(jobVacancy);
});

// Create new job vacancy
const createJobVacancy = asyncHandler(async (req, res) => {
  const {
    positionTitle,
    jobType,
    jobDescription,
    qualifications,
    experienceLevel,
    yearsOfExperience,
    employmentType,
    city,
    country,
    company,
    contactEmail,
    status,
    visible
  } = req.body;

  const jobVacancy = await JobVacancy.create({
    positionTitle,
    jobType,
    jobDescription,
    qualifications: qualifications || [],
    experienceLevel,
    yearsOfExperience,
    employmentType,
    city,
    country,
    company,
    contactEmail,
    status: status || 'Draft',
    visible: visible !== undefined ? visible : true
  });

  res.status(201).json(jobVacancy);
});

// Update job vacancy
const updateJobVacancy = asyncHandler(async (req, res) => {
  const jobVacancy = await JobVacancy.findById(req.params.id);

  if (!jobVacancy) {
    res.status(404);
    throw new Error('Job vacancy not found');
  }

  // Update only provided fields
  const updatableFields = [
    'positionTitle', 'jobType', 'jobDescription', 'qualifications',
    'experienceLevel', 'yearsOfExperience', 'employmentType', 'city',
    'country', 'company', 'contactEmail', 'status', 'visible'
  ];

  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      jobVacancy[field] = req.body[field];
    }
  });

  const updatedJobVacancy = await jobVacancy.save();
  res.json(updatedJobVacancy);
});

// Delete job vacancy
const deleteJobVacancy = asyncHandler(async (req, res) => {
  const jobVacancy = await JobVacancy.findById(req.params.id);

  if (!jobVacancy) {
    res.status(404);
    throw new Error('Job vacancy not found');
  }

  await JobVacancy.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Job vacancy removed' });
});

// Toggle job vacancy visibility
const toggleVisibility = asyncHandler(async (req, res) => {
  const jobVacancy = await JobVacancy.findById(req.params.id);

  if (!jobVacancy) {
    res.status(404);
    throw new Error('Job vacancy not found');
  }

  jobVacancy.visible = !jobVacancy.visible;
  const updatedJobVacancy = await jobVacancy.save();

  res.json(updatedJobVacancy);
});

export {
  getJobVacancies,
  getJobVacancyById,
  createJobVacancy,
  updateJobVacancy,
  deleteJobVacancy,
  toggleVisibility
};