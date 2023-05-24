import { Journey, Paginated, PaginatedSortedFilteredQuery } from 'src/types';
import api from 'src/util/api';

const createJourneysFromCSV = (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.postForm<string[]>('journeys', formData);
};

const getPaginatedJourneys = (
  query: PaginatedSortedFilteredQuery<Journey>
): Promise<Paginated<Journey>> => api.get<Paginated<Journey>>('journeys', query);

export { createJourneysFromCSV, getPaginatedJourneys };
