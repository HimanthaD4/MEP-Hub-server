import express from 'express';
import { getUserProfile, updateUser } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/profile').get(protect, getUserProfile);
router.route('/:id').patch(protect, updateUser);

export default router;