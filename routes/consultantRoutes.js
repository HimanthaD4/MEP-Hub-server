import express from 'express';
import {
  getConsultants,
  createConsultant,
  updateConsultant,
  deleteConsultant,
  toggleVisibility
} from '../controllers/consultantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getConsultants)
  .post(createConsultant);

router.route('/:id')
  .put(updateConsultant)
  .delete(deleteConsultant);

router.route('/:id/visibility')
  .patch(toggleVisibility);

export default router;