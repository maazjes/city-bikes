import station from 'models/station.js';
import { InferAttributes } from 'sequelize';

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

export type NewStationArray = [
  number,
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
  number,
  number
];

export interface PaginationQuery {
  limit: number;
  offset: number;
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

export interface FilterQuery {
  operator: Operator;
  value: string;
  filterBy: string;
}

export interface StationFilterQuery extends FilterQuery {
  filterBy: keyof InferAttributes<station>;
}

export interface SortQuery {
  sortBy: string;
  sort: 'asc' | 'desc';
}

export interface StationSortQuery extends SortQuery {
  sortBy: keyof InferAttributes<station>;
}

export type StationsQuery = Partial<PaginationQuery & StationFilterQuery & SortQuery>;
