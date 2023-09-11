import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser'
import cors from 'cors';

import rootRouter from './routes/root';
import { logger } from './middleware/logger';
import errorHandler from './middleware/errorHandler';
import corsOptions from './config/corsOptions';

const app = express();
const PORT = process.env.PORT || 3500;


app.use(logger);
app.use(cookieParser());
app.use(cors(corsOptions as any));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', rootRouter);

app.all('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.status(404).json({ message: 'Page not found' });
  } else {
    res.type('text').send('Page not found');
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
