// lecturerRoutes.js
import express from 'express';
import {
  getLecturers,
  getLecturerById,
  createLecturer,
  updateLecturer,
  deleteLecturer,
  toggleVisibility
} from '../controllers/lecturerController.js';

const router = express.Router();

router.route('/')
  .get(getLecturers)
  .post(createLecturer);

router.route('/:id')
  .get(getLecturerById)
  .put(updateLecturer)
  .delete(deleteLecturer);

router.route('/:id/visibility')
  .patch(toggleVisibility);

export default router;