// @ts-nocheck

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import User from '../models/User';
import Note from '../models/Note';
import { UserUpdateValues, UserValues } from '../types/user';

//@desc Get All Users
//@route GET /users
//@access private

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password').lean();
  if (!users?.length) {
    return res.status(400).json({ message: 'no users found' });
  }

  return res.status(200).json(users);
});

//@desc Create new user
//@route POST /users
//@access private

const createUser = asyncHandler(
  async (req: Request<{}, {}, UserValues>, res: Response) => {
    const { username, roles, password } = req.body;

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
      return res.status(400).json({ message: 'All fields required!' });
    }

    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.insertMany([
      { username, roles, password: hashedPassword },
    ]);

    if (user.length) {
      return res
        .status(201)
        .json({ message: `User created with uername- ${user[0].username}` });
    } else {
      return res.status(400).json({ message: 'invalid user data received' });
    }
  }
);

//@desc update user
//@route PATCH /users/:id
//@access private

const updateUser = asyncHandler(
  async (req: Request<{}, {}, UserUpdateValues>, res: Response) => {
    const { id, active, password, roles, username } = req.body;

    if (
      !username ||
      !Array.isArray(roles) ||
      !roles.length ||
      !id ||
      typeof active !== 'boolean'
    ) {
      return res
        .status(400)
        .json({ message: 'All missing fields are required' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const duplicate = await User.findOne({ username });
    if (duplicate && duplicate.id !== user.id) {
      return res.status(409).json({ message: 'Duplicate exists' });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
      const hashedPass = await bcrypt.hash(password, 10);
      user.password = hashedPass;
    }

    const updatedUser = await user.save();
    return res
      .status(200)
      .json({ message: `User updated - ${updatedUser?.username}` });
  }
);

//@desc Delete user
//@route DELETE /users/:id
//@access private

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'id is required' });
  }
  const note = await Note.findOne({ user: id });
  if (note) {
    return res.status(400).json({ message: 'Notes are assigned to that user' });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const deletedUser = await user.deleteOne();
  return res
    .status(200)
    .json({ message: `User with id ${deletedUser?.id} is deleted` });
});

export { getAllUsers, createUser, deleteUser, updateUser };
