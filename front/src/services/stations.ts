import api from 'src/util/api';
import { PaginatedStations, PaginatedStationsQuery, Station, StationsQuery } from 'src/types';
import {
  SingleStation,
  SingleStationQuery,
} from 'src/types';

const createStationsFromCSV = (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.postForm<string[]>('stations', formData);
};

const getStations = (query?: StationsQuery): Promise<Station[]> =>
  api.get<Station[]>('stations', query);

const getPaginatedStations = (query: PaginatedStationsQuery): Promise<PaginatedStations> =>
  api.get<PaginatedStations>('stations', query);

const getSingleStation = (id: string, query?: SingleStationQuery): Promise<SingleStation> =>
  api.get<SingleStation>(`stations/${id}`, query);

export { createStationsFromCSV, getStations, getPaginatedStations, getSingleStation };
