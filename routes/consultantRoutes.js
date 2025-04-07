import express from 'express'
import {
  getConsultants,
  getConsultantById,
  createConsultant,
  updateConsultant,
  deleteConsultant,
  toggleVisibility
} from '../controllers/consultantController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .get(getConsultants)
  .post(createConsultant)

router.route('/:id')
  .get(getConsultantById)
  .put(updateConsultant)
  .delete(deleteConsultant)

router.route('/:id/visibility')
  .patch(toggleVisibility)

export default router
