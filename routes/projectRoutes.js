import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleVisibility,
  toggleStatus
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.patch('/toggle-visibility/:id', toggleVisibility);
router.patch('/toggle-status/:id', toggleStatus);

export default router;
