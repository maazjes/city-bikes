import express from 'express';
import multer from 'multer';
import fs from 'fs';
import papa from 'papaparse';
import { InferAttributes, Order, WhereOptions, col, fn, Op } from 'sequelize';
import { isString, createWhere, isNumber } from '../util/helpers.js';
import { SingleStation, SingleStationQuery, StationsQuery } from '../types.js';
import ApiError from '../classes/ApiError.js';
import { Journey, Station } from '../models/index.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get<{}, { count: number }>('/count', async (_req, res) => {
  const count = await Station.count();
  res.json({ count });
});

router.get<{}, Station[] | { rows: Station[]; count: number }, {}, StationsQuery>(
  '/',
  async (req, res) => {
    const { operator, value, filterBy, sortBy, sort } = req.query;

    let where: WhereOptions | undefined;
    let order: Order | undefined;

    if (filterBy && value && operator) {
      where = createWhere(
        filterBy,
        typeof parseInt(value) === 'number' ? value : Number(value),
        operator
      );
      where = createWhere(filterBy, Number.isNaN(Number(value)) ? value : Number(value), operator);
    }

    if (sortBy && sort) {
      order = [[sortBy, sort]];
    }

    if (req.query.limit && req.query.offset) {
      const paginated = await Station.findAndCountAll({
        limit: req.query.limit,
        offset: req.query.offset,
        where,
        order
      });
      res.status(200).send(paginated);
    } else {
      const stations = await Station.findAll({ where, order });
      res.status(200).send(stations);
    }
  }
);

router.post<{}, Station, InferAttributes<Station>>('/', async (req, res) => {
  const { id, name, address, city, operator, capacity, latitude, longitude } = req.body;

  const newStation = await Station.create({
    id,
    name,
    address,
    city,
    operator,
    capacity,
    latitude,
    longitude
  });

  res.json(newStation);
});

router.post<{}, string[], Station[]>('/bulk', upload.single('file'), async (req, res) => {
  if (!req.file) {
    throw new ApiError('File missing from request', { status: 400 });
  }
  const faultyRows: string[] = [];
  const newStations: InferAttributes<Station>[] = [];
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

      if (data.length !== 13) {
        faultyRows.push(data.join(','));
        return;
      }

      const id = data[1];
      const name = data[2];
      const address = data[5];
      const city = data[7];
      const operator = data[9];
      const capacity = data[10];
      const longitude = data[11];
      const latitude = data[12];

      if (
        !(
          isNumber(id) &&
          isString(name) &&
          isString(address) &&
          isString(city) &&
          isString(operator) &&
          isNumber(capacity) &&
          isNumber(latitude) &&
          isNumber(longitude)
        )
      ) {
        faultyRows.push(data.join(','));
        return;
      }

      newStations.push({
        id,
        name,
        address,
        city,
        operator,
        capacity,
        latitude,
        longitude
      });

      if (newStations.length === 20000) {
        parser.pause();
        await Station.bulkCreate(newStations, {
          updateOnDuplicate: [
            'id',
            'address',
            'capacity',
            'city',
            'name',
            'operator',
            'latitude',
            'longitude'
          ]
        });
        newStations.length = 0;
        parser.resume();
      }
    },
    complete: async () => {
      await Station.bulkCreate(newStations, {
        updateOnDuplicate: [
          'id',
          'address',
          'capacity',
          'city',
          'name',
          'operator',
          'latitude',
          'longitude'
        ]
      });
      res.status(200).send(faultyRows);
    }
  });
});

router.get<{ id: string }, SingleStation, {}, SingleStationQuery>('/:id', async (req, res) => {
  const { id } = req.params;
  const { after, before } = req.query;

  const station = await Station.findOne({ where: { id } });
  let where;

  if (after && before) {
    where = {
      [Op.and]: [{ returnTime: { [Op.lte]: before } }, { returnTime: { [Op.gte]: after } }]
    };
  }

  if (!station) {
    throw new ApiError('Station not found', { status: 400 });
  }

  const [
    topStationsTo,
    topStationsFrom,
    totalJourneysTo,
    totalJourneysFrom,
    totalDistanceTo,
    totalDistanceFrom
  ] = await Promise.all([
    Journey.findAll({
      where: { ...where, returnStationId: id },
      attributes: [[fn('count', col('journey.id')), 'total']],
      include: { model: Station, as: 'departureStation' },
      group: ['departureStation.id'],
      order: [['total', 'desc']],
      limit: 5
    }),
    Journey.findAll({
      where: { ...where, departureStationId: id },
      attributes: [[fn('count', col('journey.id')), 'total']],
      include: { model: Station, as: 'returnStation' },
      group: ['returnStation.id'],
      order: [['total', 'desc']],
      limit: 5
    }),
    Journey.count({ where: { ...where, returnStationId: id } }),
    Journey.count({ where: { ...where, departureStationId: id } }),
    Journey.sum('distance', { where: { ...where, returnStationId: id } }),
    Journey.sum('distance', { where: { ...where, departureStationId: id } })
  ]);

  res.json({
    ...station.dataValues,
    topStationsTo: topStationsTo.map((journey) => journey.departureStation),
    topStationsFrom: topStationsFrom.map((journey) => journey.returnStation),
    averageDistanceTo: totalDistanceTo / totalJourneysTo,
    averageDistanceFrom: totalDistanceFrom / totalJourneysFrom,
    totalJourneysTo,
    totalJourneysFrom
  });
});

export default router;
