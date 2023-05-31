import { Journey, Paginated, PaginatedSortedFilteredQuery } from 'src/types';
import api from 'src/util/api';

const createJourneysFromCSV = (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.postForm<string[]>('journeys/bulk', formData);
};

const createJourney = (body: Omit<Journey, 'id'>): Promise<Journey> =>
  api.post<Journey>('journeys', body);

const getPaginatedJourneys = (
  query: PaginatedSortedFilteredQuery<Journey>
): Promise<Paginated<Journey>> => api.get<Paginated<Journey>>('journeys', query);

const countJourneys = (): Promise<{ count: number }> =>
  api.get<{ count: number }>('journeys/count');

const deleteJourneys = (body: number[]): Promise<void> => api.delete('journeys', body);

export {
  createJourneysFromCSV,
  getPaginatedJourneys,
  countJourneys,
  createJourney,
  deleteJourneys
};
