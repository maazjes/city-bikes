import express from 'express';
import { Journey, Station } from '../models/index.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  await Journey.destroy({ where: { departureStationId: 9999 } });
  await Station.destroy({ where: { id: 9999 } });
  return res.json({});
});

export default router;
