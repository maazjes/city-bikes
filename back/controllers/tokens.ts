import express from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../classes/ApiError.js';
import { SECRET } from '../util/config.js';

const router = express.Router();

router.post<{}, { valid: boolean }, { token: string }>('/verifytoken', async (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, SECRET);
  } catch {
    res.json({ valid: false });
  }
  return res.json({ valid: true });
});

router.post<{}, { token: string }, { token: string }>('/refreshtoken', async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = jwt.verify(token, SECRET);
    const newToken = jwt.sign(decodedToken, SECRET, {
      expiresIn: '2h'
    });
    return res.json({ token: newToken });
  } catch {
    throw new ApiError('Invalid token');
  }
});

export default router;
