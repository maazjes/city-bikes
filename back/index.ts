import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { PORT } from './util/config.js';
import { connectToDatabase } from './util/db.js';
import login from './controllers/login.js';
import users from './controllers/users.js';
import stations from './controllers/stations.js';
import { errorHandler } from './util/middleware.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.use('/api/login', login);
app.use('/api/users', users);
app.use('/api/stations', stations);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
