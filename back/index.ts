import "express-async-errors";
import express from "express";
import cors from "cors";
import http from "http";
import { PORT } from "./util/config.js";
import { connectToDatabase } from "./util/db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const start = async () => {
  await connectToDatabase();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
