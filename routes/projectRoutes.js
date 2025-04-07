import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleVisibility
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById) // This handles GET /api/projects/:id
  .put(updateProject)
  .delete(deleteProject);

router.route('/:id/visibility')
  .patch(toggleVisibility);

export default router;