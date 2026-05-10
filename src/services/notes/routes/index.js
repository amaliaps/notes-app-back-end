// digunakan untuk mendaftarkan route milik notes yang ada di services/notes/routes

import express from 'express';
import {
  createNote, getAllNotes, getNoteById, editNoteById, deleteNoteById
} from '../controller/note-controller.js';
import { validate, validateQuery } from '../../../middlewares/validate.js';
import { notePayloadSchema, noteQuerySchema } from '../../../services/notes/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/notes', authenticateToken, validate(notePayloadSchema), createNote);
// router.get('/notes', validateQuery(noteQuerySchema), getAllNotes);
router.get('/notes', authenticateToken, getAllNotes);
router.get('/notes/:id', authenticateToken, getNoteById);
router.put('/notes/:id', authenticateToken, validate(notePayloadSchema), editNoteById);
router.delete('/notes/:id', authenticateToken, deleteNoteById);

export default router;