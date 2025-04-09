import express from 'express';
import {
  getDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector,
  toggleVisibility
} from '../controllers/directorController.js';


const router = express.Router();

router.route('/')
  .get(getDirectors)
  .post(createDirector);

router.route('/:id')
  .get(getDirectorById)
  .put(updateDirector)
  .delete(deleteDirector);

router.route('/:id/visibility')
  .patch(toggleVisibility);

export default router;