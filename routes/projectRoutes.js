import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  toggleVisibility,
  deleteProject
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createProject)
  .get(protect, admin, getProjects);

router.route('/:id')
  .get(protect, admin, getProjectById)
  .put(protect, admin, updateProject)
  .delete(protect, admin, deleteProject);

router.route('/:id/visibility')
  .patch(protect, admin, toggleVisibility);

export default router;