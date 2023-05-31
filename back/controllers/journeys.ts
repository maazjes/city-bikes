import express from 'express';
import multer from 'multer';
import fs from 'fs';
import papa from 'papaparse';
import { InferAttributes, Order, WhereOptions } from 'sequelize';
import { JourneysQuery } from '../types.js';
import ApiError from '../classes/ApiError.js';
import { Journey, Station } from '../models/index.js';
import { createWhere, isNumber, isDate } from '../util/helpers.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get<{}, { count: number }>('/count', async (_req, res) => {
  const count = await Journey.count();
  res.json({ count });
});

router.get<{}, { rows: Journey[]; count: number }, {}, JourneysQuery>('/', async (req, res) => {
  const { operator, value, filterBy, sortBy, sort } = req.query;

  let where: WhereOptions | undefined;
  let order: Order | undefined;

  if (filterBy && value && operator) {
    where = createWhere(
      filterBy,
      typeof parseInt(value) === 'number' ? value : Number(value),
      operator
    );
  }

  if (sortBy && sort) {
    order = [[sortBy, sort]];
  }

  const paginated = await Journey.findAndCountAll({
    limit: req.query.limit,
    offset: req.query.offset,
    where,
    order
  });

  res.status(200).send(paginated);
});

router.post<{}, Journey, InferAttributes<Journey>>('/', async (req, res) => {
  const { departureTime, returnTime, departureStationId, returnStationId, distance, duration } =
    req.body;

  const newJourney = await Journey.create({
    departureTime,
    returnTime,
    departureStationId,
    returnStationId,
    distance,
    duration
  });

  res.json(newJourney);
});

router.post<{}, string[]>('/bulk', upload.single('file'), async (req, res) => {
  if (!req.file) {
    throw new ApiError('File missing from request', { status: 400 });
  }

  const faultyRows: string[] = [];
  const newJourneys: Omit<InferAttributes<Journey>, 'id'>[] = [];
  const newStations: InferAttributes<Station>[] = [];
  const existingStations = new Set();
  const stream = fs.createReadStream(req.file.path);

  let firstLine = true;

  papa.parse<string[]>(stream, {
    delimiter: ',',
    newline: '\n',
    header: false,
    step: async ({ data }, parser) => {
      if (firstLine) {
        firstLine = false;
        return;
      }

      if (data.length !== 8) {
        faultyRows.push(data.join(','));
        return;
      }

      const departureTime = data[0];
      const returnTime = data[1];
      const departureStationId = data[2];
      const returnStationId = data[4];
      const distance = data[6];
      const duration = data[7];

      if (
        !(
          isDate(departureTime) &&
          isDate(returnTime) &&
          isNumber(departureStationId) &&
          isNumber(returnStationId) &&
          isNumber(distance) &&
          isNumber(duration)
        )
      ) {
        faultyRows.push(data.join(','));
        return;
      }

      newJourneys.push({
        departureTime,
        returnTime,
        departureStationId,
        returnStationId,
        distance,
        duration
      });

      if (!existingStations.has(departureStationId)) {
        newStations.push({ id: departureStationId, name: data[3] });
        existingStations.add(departureStationId);
      }

      if (!existingStations.has(returnStationId)) {
        newStations.push({ id: returnStationId, name: data[5] });
        existingStations.add(returnStationId);
      }

      if (newJourneys.length === 20000) {
        parser.pause();
        await Station.bulkCreate(newStations, { ignoreDuplicates: true });
        await Journey.bulkCreate(newJourneys, { ignoreDuplicates: true });
        newJourneys.length = 0;
        newStations.length = 0;
        parser.resume();
      }
    },
    complete: async () => {
      await Station.bulkCreate(newStations, { ignoreDuplicates: true });
      await Journey.bulkCreate(newJourneys, { ignoreDuplicates: true });
      res.status(200).send(faultyRows);
    }
  });
});

export default router;
