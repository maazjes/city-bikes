import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NewUser, Token } from '../types.js';
import User from '../models/user.js';
import { SECRET } from '../util/config.js';
import ApiError from '../classes/ApiError.js';

const router = express.Router();

router.post<{}, Token, NewUser>('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user || !bcrypt.compare(user.password, password)) {
    throw new ApiError('Invalid credentials', { status: 400 });
  }

  const token = jwt.sign({ id: user.id, username }, SECRET, {
    expiresIn: '2h'
  });

  return res.status(200).send({ token });
});

export default router;
