import api from 'src/util/api';
import { PaginatedStations, PaginatedStationsQuery, Station, StationsQuery } from 'src/types';

const createStationsFromCSV = (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.postForm<string[]>('stations', formData);
};

const getStations = (query?: StationsQuery): Promise<Station[]> => api.get('stations', query);

const getPaginatedStations = (query: PaginatedStationsQuery): Promise<PaginatedStations> =>
  api.get('stations', query);

export { createStationsFromCSV, getStations, getPaginatedStations };
