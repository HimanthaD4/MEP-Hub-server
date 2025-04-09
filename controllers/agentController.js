// controllers/agentController.js
import Agent from '../models/agentModel.js';
import asyncHandler from 'express-async-handler';

// Get all agents
const getAgents = asyncHandler(async (req, res) => {
  const { role, equipmentType, search } = req.query;

  const query = {};

  if (role) {
    query.role = role;
  }

  if (equipmentType) {
    query.equipmentType = { $in: equipmentType.split(',') }; // Allow multiple equipment types
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { companyEmail: { $regex: search, $options: 'i' } },
      { contactNumber: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  const agents = await Agent.find(query).sort('-createdAt');
  res.json(agents);
});

// Get an agent by ID
const getAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    res.status(404);
    throw new Error('Agent not found');
  }

  res.json(agent);
});

// Create a new agent
const createAgent = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    companyEmail,
    role,
    equipmentType,
    description,
    location
  } = req.body;

  const agent = await Agent.create({
    name,
    contactNumber,
    companyEmail,
    role,
    equipmentType,
    description,
    location
  });

  res.status(201).json(agent);
});

// Update an existing agent
const updateAgent = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    companyEmail,
    role,
    equipmentType,
    description,
    location
  } = req.body;

  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    res.status(404);
    throw new Error('Agent not found');
  }

  agent.name = name || agent.name;
  agent.contactNumber = contactNumber || agent.contactNumber;
  agent.companyEmail = companyEmail || agent.companyEmail;
  agent.role = role || agent.role;
  agent.equipmentType = equipmentType || agent.equipmentType;
  agent.description = description || agent.description;
  agent.location = location || agent.location;

  const updatedAgent = await agent.save();
  res.json(updatedAgent);
});

// Delete an agent
const deleteAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    res.status(404);
    throw new Error('Agent not found');
  }

  await Agent.deleteOne({ _id: req.params.id });

  res.json({ success: true, message: 'Agent removed' });
});

// Toggle the visibility of an agent (if needed)
const toggleVisibility = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    res.status(404);
    throw new Error('Agent not found');
  }

  agent.visible = !agent.visible; // Assuming you have a 'visible' field
  const updatedAgent = await agent.save();

  res.json(updatedAgent);
});



export {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  toggleVisibility
};