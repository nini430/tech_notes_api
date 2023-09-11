import { format } from 'date-fns';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

const logEvents = async (message: string, logFileName: string) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = async (req: Request, res: Response, next: NextFunction) => {
  const message = `${req.method}-${req.url}-${req.headers.origin}`;
  console.log(message);
  await logEvents(message, 'reqLog.log');
  next();
};

export { logger, logEvents };
