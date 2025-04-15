import express from 'express';
import { createContact, getContacts, deleteContact } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', createContact);
router.get('/', getContacts);
router.delete('/:id', deleteContact);

export default router;