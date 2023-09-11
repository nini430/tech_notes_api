import express from 'express';
import path from 'path';

import rootRouter from './routes/root';

const app = express();
const PORT = process.env.PORT || 3500;

app.use('/', express.static(path.join(__dirname, '/public')));

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
