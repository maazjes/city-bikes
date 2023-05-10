import api from 'src/util/api';
import { PaginatedStations, PaginationQuery, Station } from 'src/types';

const createStationsFromCSV = (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.postForm<string[]>('stations', formData);
};

const getStations = (): Promise<Station[]> => api.get('stations');

const getPaginatedStations = (query: PaginationQuery): Promise<PaginatedStations> =>
  api.get('stations', query);

export { createStationsFromCSV, getStations, getPaginatedStations };
