import express from 'express'
import {
  getContractor,
  getContractorById,
  createContractor,
  updateContractor,
  deleteContractor,
  toggleVisibility
} from '../controllers/contractorController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .get(getContractor)
  .post(createContractor)

router.route('/:id')
  .get(getContractorById)
  .put(updateContractor)
  .delete(deleteContractor)

router.route('/:id/visibility')
  .patch(toggleVisibility)

export default router
