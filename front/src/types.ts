export interface Error {
  error: string;
}

export interface Token {
  token: string;
}

export interface NewUser {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
}

export interface TokenContext {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface Station {
  id: number;
  name: string;
  city: string | null;
  address: string | null;
  operator: string | null;
  capacity: number | null;
  latitude: number | null;
  longitude: number | null;
}

export interface SingleStation extends Station {
  topStationsTo: Station[];
  topStationsFrom: Station[];
  averageDistanceTo: number | null;
  averageDistanceFrom: number | null;
  totalJourneysTo: number;
  totalJourneysFrom: number;
}

export interface Journey {
  id: number;
  departureTime: Date;
  returnTime: Date;
  departureStationId: number;
  returnStationId: number;
  distance: number;
  duration: number;
}

  limit: number;
  offset: number;
};

export interface Paginated<T = never> {
  rows: T[];
  count: number;
}

export type Operator =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'isAnyOf'
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<=';

export interface FilteredQuery<T = never> {
  operator: Operator;
  value: string | string[];
  filterBy: Extract<keyof T, string>;
}

export interface SortedQuery<T = never> {
  sort: 'asc' | 'desc';
  sortBy: Extract<keyof T, string>;
}

export type GetPaginatedSortedFilteredData<T = never> = (
  query: PaginatedSortedFilteredQuery<T>
) => Promise<Paginated<T>>;

export type PaginatedSortedFilteredQuery<T = never> = PaginationQuery &
  Partial<SortedQuery<T> & FilteredQuery<T>>;

export type SortedFilteredQuery<T = never> = Partial<SortedQuery<T> & FilteredQuery<T>>;

export type StationsQuery = Partial<FilteredQuery<Station> & SortedQuery<Station>>;

export type SingleStationQuery = { after?: string; before?: string };
