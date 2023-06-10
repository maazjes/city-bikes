import express from 'express';
import { Op } from 'sequelize';
import { Journey, Station, User } from '../models/index.js';

const router = express.Router();

router.get('/start', async (_req, res) => {
  await User.create({ username: 'testtest', password: 'testtest' });
  await Station.create({ id: -1, name: 'test' });
  return res.json({});
});

router.get('/end', async (_req, res) => {
  await Journey.destroy({
    where: {
      [Op.or]: [{ departureStationId: { [Op.lt]: 0 } }, { returnStationId: { [Op.lt]: 0 } }]
    }
  });
  await Station.destroy({ where: { id: { [Op.lt]: 0 } } });
  await User.destroy({ where: { username: 'testtest' } });
  return res.json({});
});

export default router;
