import { Response, NextFunction, Request } from 'express';
import ApiError from '../classes/ApiError.js';
import { Error } from '../types.js';

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

export { errorHandler };
