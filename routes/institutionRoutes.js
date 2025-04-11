// routes/institutionRoutes.js
import express from 'express';
import {
  getInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  toggleInstitutionVisibility
} from '../controllers/institutionController.js';

const router = express.Router();

router.route('/')
  .get(getInstitutions)
  .post(createInstitution);

router.route('/:id')
  .get(getInstitutionById)
  .put(updateInstitution)
  .delete(deleteInstitution);

router.route('/:id/visibility')
  .patch(toggleInstitutionVisibility);

export default router;
