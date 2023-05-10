import api from 'src/util/api';
import { Station } from 'src/types';

const createStationsFromCSV = (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.postForm<string[]>('stations', formData);
};

const getStations = (): Promise<Station[]> => api.get('stations');

export { createStationsFromCSV, getStations };
