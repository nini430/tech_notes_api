// @ts-nocheck

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import User from '../models/User';
import Note from '../models/Note';
import { NoteValues, NoteUpdateValues } from '../types/note';

const getAllNotesWithUser = asyncHandler(
  async (req: Request, res: Response) => {
    const notes = await Note.find({});

    if (!notes?.length) {
      return res.status(400).json({ message: 'No Notes found' });
    }

    const notesWithUsers = await Promise.all(
      notes.map(async (note: any) => {
        const user = (await User.findById(note.user)) as any;
        return { ...note, username: user.username };
      })
    );

    return res.status(200).json(notesWithUsers);
  }
);

const createNote = asyncHandler(
  async (req: Request<{}, {}, NoteValues>, res: Response) => {
    const { title, text, user } = req.body;
    if (!title || !text || !user) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicate = await Note.findOne({ title });

    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate exists' });
    }

    const userInfo = await User.findById(user);
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }

    const note = await Note.insertMany([{ title, text, user }]);
   console.log(note);
    return res
      .status(201)
      .json({ message: `Note ${(note as any)[0].title} created` });
  }
);

const updateNote = asyncHandler(
  async (req: Request<{}, {}, NoteUpdateValues>, res: Response) => {
    const { id, title, text, user, isCompleted } = req.body;
    if (!id || !title || !text || !user || typeof isCompleted !== 'boolean') {
      return res.status(400).json({ message: 'all fields are required' });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const userInfo = await User.findById(user);

    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }

    const duplicate = await Note.findOne({ title });

    if (duplicate && duplicate.id !== note.id) {
      return res.status(409).json({ message: 'Duplicate exists!' });
    }

    note.title = title;
    note.text = text;
    note.isCompleted = isCompleted;

    const updatedNote = await note.save();

    return res
      .status(200)
      .json({ message: `Note:${updatedNote.title} updated` });
  }
);

const deleteNote = asyncHandler(
  async (req: Request<{}, {}, { id: string }>, res: Response) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const deletedNote = await note.deleteOne();

    return res
      .status(200)
      .json({ message: `note ${deletedNote.title}-deleted` });
  }
);

export { getAllNotesWithUser, createNote, updateNote, deleteNote };
