import api from 'src/util/api';
import {
  SingleStation,
  SingleStationQuery,
  Station
} from 'src/types';

const createStationsFromCSV = (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.postForm<string[]>('stations/bulk', formData);
};

const createStation = (body: Station): Promise<Station> => api.post<Station>('stations', body);

const getStations = (query?: StationsQuery): Promise<Station[]> =>
  api.get<Station[]>('stations', query);

const getPaginatedStations = (query: PaginatedStationsQuery): Promise<PaginatedStations> =>
  api.get<PaginatedStations>('stations', query);

const getSingleStation = (id: string, query?: SingleStationQuery): Promise<SingleStation> =>
  api.get<SingleStation>(`stations/${id}`, query);

const countStations = (): Promise<{ count: number }> =>
  api.get<{ count: number }>('stations/count');

const deleteStations = (body: number[]): Promise<void> => api.delete('stations', body);

export {
  createStationsFromCSV,
  getStations,
  getPaginatedStations,
  getSingleStation,
  createStation,
  countStations,
  deleteStations
};
