import express from 'express';
import { NODE_ENV } from '../util/config.js';
import { NewUser } from '../types.js';
import ApiError from '../classes/ApiError.js';
import User from '../models/user.js';
import { hashPassword } from '../util/helpers.js';

const router = express.Router();

router.post<{}, User, NewUser>('/', async (req, res) => {
  if (NODE_ENV === 'production') {
    throw new ApiError('Registration is currently closed!', { status: 400 });
  }

  const { username, password } = req.body;

  if (!(username && password)) {
    throw new ApiError('Email and password are required.', { status: 400 });
  }

  if (password.length < 8) {
    throw new ApiError('Password must be at least 8 characters long.', { status: 400 });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({ username, password: hashedPassword });

  return res.status(200).send(user);
});

export default router;
