import { Request, Response, NextFunction } from 'express';

import { logEvents } from './logger';

const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`;
  await logEvents(message, 'reqError.log');

  const status = res.statusCode || 500; //server error

  return res
    .status(status)
    .json({ message: err.message || 'something went wrong' });
};

export default errorHandler;