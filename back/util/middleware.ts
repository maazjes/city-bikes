import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../classes/ApiError.js';
import { Error } from '../types.js';
import { SECRET } from './config.js';

const requireAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const authorization = req.get('authorization');
  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    throw new ApiError('Authentication required', { status: 400 });
  }
  const token = authorization.substring(7);
  try {
    jwt.verify(token, SECRET);
  } catch {
    throw new ApiError('Authentication required', { status: 400 });
  }
  return next();
};

const errorHandler = async (
  error: ApiError | Error,
  _req: Request,
  res: Response<Error>,
  next: NextFunction
): Promise<void> => {
  if (error instanceof ApiError) {
    res.status(error.status).json({ error: error.message });
  }
  next();
};

export { errorHandler, requireAuth };
