// controllers/projectController.js
import Project from '../models/upcommingModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all projects with all details
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const { status, search, type } = req.query;
  
  const query = {};
  
  if (status && status !== 'all') {
    query.status = status;
  }
  
  if (type && type !== 'all') {
    query.type = type;
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { contractor: { $regex: search, $options: 'i' } }
    ];
  }

  const projects = await Project.find(query)
    .select('-__v')
    .sort('-createdAt');
  
  res.json(projects);
});

// @desc    Get single project with all details
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .select('-__v');
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  res.json(project);
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    type,
    amount, 
    startDate, 
    endDate, 
    status, 
    visible, 
    contractor 
  } = req.body;

  const project = await Project.create({
    title,
    description,
    type,
    amount,
    startDate,
    endDate,
    status,
    visible,
    contractor
  });

  const projectResponse = project.toObject();
  delete projectResponse.__v;

  res.status(201).json(projectResponse);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    type,
    amount, 
    startDate, 
    endDate, 
    status, 
    visible, 
    contractor 
  } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  project.title = title || project.title;
  project.description = description || project.description;
  project.type = type || project.type;
  project.amount = amount || project.amount;
  project.startDate = startDate || project.startDate;
  project.endDate = endDate !== undefined ? endDate : project.endDate;
  project.status = status || project.status;
  project.visible = visible !== undefined ? visible : project.visible;
  project.contractor = contractor || project.contractor;

  const updatedProject = await project.save();
  
  const updatedProjectResponse = updatedProject.toObject();
  delete updatedProjectResponse.__v;

  res.json(updatedProjectResponse);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await Project.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Project removed' });
});

// @desc    Toggle project visibility
// @route   PATCH /api/projects/:id/visibility
// @access  Private
const toggleVisibility = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  project.visible = !project.visible;
  const updatedProject = await project.save();
  
  const updatedProjectResponse = updatedProject.toObject();
  delete updatedProjectResponse.__v;

  res.json(updatedProjectResponse);
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleVisibility
};