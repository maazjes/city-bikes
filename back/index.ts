import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import http from 'http';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { NODE_ENV, PORT } from './util/config.js';
import { connectToDatabase } from './util/db.js';
import login from './controllers/login.js';
import users from './controllers/users.js';
import stations from './controllers/stations.js';
import journeys from './controllers/journeys.js';
import tokens from './controllers/tokens.js';
import tests from './controllers/tests.js';
import { errorHandler } from './util/middleware.js';

const dirName = dirname(fileURLToPath(import.meta.url));

const app = express();

if (NODE_ENV !== 'production') {
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.use('/api/login', login);
app.use('/api/users', users);
app.use('/api/stations', stations);
app.use('/api/journeys', journeys);
app.use('/api/tokens', tokens);

if (NODE_ENV === 'test') {
  app.use('/api/tests', tests);
}

if (NODE_ENV === 'production') {
  app.use('/', express.static(path.join(dirName, './build')));
  app.get('*', (_req, res) => {
    res.sendFile('index.html', { root: path.join(dirName, './build') });
  });
}

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
