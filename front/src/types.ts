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
  city: string;
  address: string;
  operator: string;
  capacity: number;
  x: number;
  y: number;
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

export type PaginationQuery = {
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
