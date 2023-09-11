import express from 'express';

import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} from '../controllers/user';

const router = express.Router();

router
  .route('/')
  .get(getAllUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
