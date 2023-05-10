import express from 'express';
import { NewUser } from '../types.js';
import ApiError from '../classes/ApiError.js';
import User from '../models/user.js';
import { hashPassword } from '../util/helpers.js';

const router = express.Router();

router.post<{}, User, NewUser>('/', async (req, res) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    throw new ApiError('Email and password are required', { status: 400 });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({ username, password: hashedPassword });

  return res.status(200).send(user);
});

export default router;
