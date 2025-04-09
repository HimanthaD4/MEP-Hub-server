import Director from '../models/directorModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all directors
// @route   GET /api/directors
// @access  Public
const getDirectors = asyncHandler(async (req, res) => {
  const { status, search, position, expertise } = req.query;

  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ];
  }

  if (position) {
    query.position = position;
  }

  if (expertise) {
    query.areasOfExpertise = expertise;
  }

  const directors = await Director.find(query).sort('-createdAt');
  res.json(directors);
});

// @desc    Get single director
// @route   GET /api/directors/:id
// @access  Public
const getDirectorById = asyncHandler(async (req, res) => {
  const director = await Director.findById(req.params.id);

  if (!director) {
    res.status(404);
    throw new Error('Director not found');
  }

  res.json(director);
});

// @desc    Create a director
// @route   POST /api/directors
// @access  Private/Admin
const createDirector = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    email,
    company,
    position,
    yearsOfExperience,
    qualifications,
    projectsManaged,
    areasOfExpertise,
    status,
    visible
  } = req.body;

  const director = new Director({
    name,
    contactNumber,
    email,
    company,
    position,
    yearsOfExperience,
    qualifications,
    projectsManaged,
    areasOfExpertise,
    status,
    visible
  });

  const createdDirector = await director.save();
  res.status(201).json(createdDirector);
});

// @desc    Update a director
// @route   PUT /api/directors/:id
// @access  Private/Admin
const updateDirector = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    email,
    company,
    position,
    yearsOfExperience,
    qualifications,
    projectsManaged,
    areasOfExpertise,
    status,
    visible
  } = req.body;

  const director = await Director.findById(req.params.id);

  if (!director) {
    res.status(404);
    throw new Error('Director not found');
  }

  director.name = name || director.name;
  director.contactNumber = contactNumber || director.contactNumber;
  director.email = email || director.email;
  director.company = company || director.company;
  director.position = position || director.position;
  director.yearsOfExperience = yearsOfExperience || director.yearsOfExperience;
  director.qualifications = qualifications || director.qualifications;
  director.projectsManaged = projectsManaged || director.projectsManaged;
  director.areasOfExpertise = areasOfExpertise || director.areasOfExpertise;
  director.status = status || director.status;
  director.visible = visible !== undefined ? visible : director.visible;

  const updatedDirector = await director.save();
  res.json(updatedDirector);
});

// @desc    Delete a director
// @route   DELETE /api/directors/:id
// @access  Private/Admin
const deleteDirector = asyncHandler(async (req, res) => {
  const director = await Director.findById(req.params.id);

  if (!director) {
    res.status(404);
    throw new Error('Director not found');
  }

  await director.remove();
  res.json({ message: 'Director removed' });
});

// @desc    Toggle director visibility
// @route   PATCH /api/directors/:id/visibility
// @access  Private/Admin
const toggleVisibility = asyncHandler(async (req, res) => {
  const director = await Director.findById(req.params.id);

  if (!director) {
    res.status(404);
    throw new Error('Director not found');
  }

  director.visible = !director.visible;
  await director.save();

  res.json({ 
    message: `Director visibility ${director.visible ? 'enabled' : 'disabled'}`,
    visible: director.visible
  });
});

export {
  getDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector,
  toggleVisibility
};