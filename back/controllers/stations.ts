import express from 'express';
import multer from 'multer';
import fs from 'fs';
import papa from 'papaparse';
import { InferAttributes, Order, WhereOptions } from 'sequelize';
import { isString, createWhere, isNumber } from '../util/helpers.js';
import { StationsQuery } from '../types.js';
import ApiError from '../classes/ApiError.js';
import { Station } from '../models/index.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

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

router.post<{}, string[], Station[]>('/', upload.single('file'), async (req, res) => {
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
      const x = data[11];
      const y = data[12];

      if (
        !(
          isNumber(id) &&
          isString(name) &&
          isString(address) &&
          isString(city) &&
          isString(operator) &&
          isNumber(capacity) &&
          isNumber(x) &&
          isNumber(y)
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
        x,
        y
      });

      if (newStations.length === 20000) {
        parser.pause();
        await Station.bulkCreate(newStations, {
          updateOnDuplicate: ['id', 'address', 'capacity', 'city', 'name', 'operator', 'x', 'y']
        });
        newStations.length = 0;
        parser.resume();
      }
    },
    complete: async () => {
      await Station.bulkCreate(newStations, {
        updateOnDuplicate: ['id', 'address', 'capacity', 'city', 'name', 'operator', 'x', 'y']
      });
      res.status(200).send(faultyRows);
    }
  });
});

export default router;
