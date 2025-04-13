import express from 'express';
import {
  getJobSeekers,
  getJobSeekerById,
  createJobSeeker,
  updateJobSeeker,
  deleteJobSeeker,
  toggleVisibility
} from '../controllers/jobSeekerController.js';

const router = express.Router();

router.route('/')
  .get(getJobSeekers)
  .post(createJobSeeker);

router.route('/:id')
  .get(getJobSeekerById)
  .put(updateJobSeeker)
  .delete(deleteJobSeeker);

router.route('/:id/visibility')
  .patch(toggleVisibility);

export default router;