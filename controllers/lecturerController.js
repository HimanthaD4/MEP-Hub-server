// lecturerController.js
import Lecturer from '../models/lecturerModel.js';
import asyncHandler from 'express-async-handler';

// Get all Lecturers with filtering
const getLecturers = asyncHandler(async (req, res) => {
  const { status, search, lecturerType } = req.query;

  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { personalEmail: { $regex: search, $options: 'i' } },
      { institution: { $regex: search, $options: 'i' } }
    ];
  }

  if (lecturerType) {
    query.lecturerType = lecturerType;
  }

  const lecturers = await Lecturer.find(query).sort('-createdAt');
  res.json(lecturers);
});

// Get single lecturer by ID
const getLecturerById = asyncHandler(async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.id);

  if (!lecturer) {
    res.status(404);
    throw new Error('Lecturer not found');
  }

  res.json(lecturer);
});

const createLecturer = asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      personalEmail,
      contactNumber,
      lecturerType,
      qualifications,
      yearsOfExperience,
      institution,
      institutionalEmail,
      status,
      visible // Add this line
    } = req.body;
  
    const lecturer = await Lecturer.create({
      firstName,
      lastName,
      personalEmail,
      contactNumber,
      lecturerType,
      qualifications,
      yearsOfExperience,
      institution,
      institutionalEmail,
      status,
      visible: visible !== undefined ? visible : true // Add this with default true
    });
  
    res.status(201).json(lecturer);
  });
  
  // Update lecturer - add visible to updatableFields
  const updateLecturer = asyncHandler(async (req, res) => {
    const lecturer = await Lecturer.findById(req.params.id);
  
    if (!lecturer) {
      res.status(404);
      throw new Error('Lecturer not found');
    }
  
    // Update only provided fields
    const updatableFields = [
      'firstName', 'lastName', 'contactNumber', 'lecturerType', 
      'qualifications', 'yearsOfExperience', 'institution', 
      'institutionalEmail', 'status', 'visible' // Add visible here
    ];
  
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        lecturer[field] = req.body[field];
      }
    });
  
    const updatedLecturer = await lecturer.save();
    res.json(updatedLecturer);
  });
  
  // Toggle visibility - this is correct as is
  const toggleVisibility = asyncHandler(async (req, res) => {
    const lecturer = await Lecturer.findById(req.params.id);
    
    if (!lecturer) {
      res.status(404);
      throw new Error('Lecturer not found');
    }
  
    lecturer.visible = !lecturer.visible;
    const updatedLecturer = await lecturer.save();
  
    res.json(updatedLecturer);
  });

  const deleteLecturer = asyncHandler(async (req, res) => {
    const lecturer = await Lecturer.findById(req.params.id);
  
    if (!lecturer) {
      res.status(404);
      throw new Error('Lecturer not found');
    }
  
    await Lecturer.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Lecturer removed' });
  });

export {
  getLecturers,
  getLecturerById,
  createLecturer,
  updateLecturer,
  deleteLecturer,
  toggleVisibility
};