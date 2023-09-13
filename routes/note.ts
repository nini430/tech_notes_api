import express from 'express';
import {
  createNote,
  deleteNote,
  getAllNotesWithUser,
  updateNote,
} from '../controllers/note';

const router = express.Router();

router
  .route('/')
  .get(getAllNotesWithUser)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote);

export default router;
