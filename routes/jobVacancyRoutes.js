import express from 'express';
import {
  getJobVacancies,
  getJobVacancyById,
  createJobVacancy,
  updateJobVacancy,
  deleteJobVacancy,
  toggleVisibility
} from '../controllers/jobVacancyController.js';

const router = express.Router();

router.route('/')
  .get(getJobVacancies)
  .post(createJobVacancy);

router.route('/:id')
  .get(getJobVacancyById)
  .put(updateJobVacancy)
  .delete(deleteJobVacancy);

router.route('/:id/visibility')
  .patch(toggleVisibility);

export default router;