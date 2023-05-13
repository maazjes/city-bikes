import Journey from 'models/journey.js';
import Station from 'models/station.js';
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
  filterBy: keyof InferAttributes<Station>;
}

export interface SortQuery {
  sortBy: string;
  sort: 'asc' | 'desc';
}

export interface StationSortQuery extends SortQuery {
  sortBy: keyof InferAttributes<Station>;
}

export type StationsQuery = Partial<PaginationQuery & StationFilterQuery & SortQuery>;

export interface JourneyFilterQuery extends FilterQuery {
  filterBy: keyof InferAttributes<Journey>;
}

export type JourneysQuery = PaginationQuery & Partial<JourneyFilterQuery & SortQuery>;

export interface SingleStation extends InferAttributes<Station> {
  journeysFrom: number;
  journeysTo: number;
}
