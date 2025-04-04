import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleVisibility
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, createProject);

router.route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/visibility')
  .patch(protect, toggleVisibility);

export default router;