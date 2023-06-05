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
  filterBy: Extract<keyof InferAttributes<Station>, 'string'>;
}

export interface SortQuery {
  sortBy: string;
  sort: 'asc' | 'desc';
}

export interface StationSortQuery extends SortQuery {
  sortBy: Extract<keyof InferAttributes<Station>, 'string'>;
}

export type StationsQuery = Partial<PaginationQuery & StationFilterQuery & SortQuery>;

export type SingleStationQuery = StationsQuery & { after?: Date; before?: Date };

export interface JourneyFilterQuery extends FilterQuery {
  filterBy: Extract<keyof InferAttributes<Journey>, 'string'>;
}

export type JourneysQuery = PaginationQuery & Partial<JourneyFilterQuery & SortQuery>;

export interface SingleStation extends InferAttributes<Station> {
  topStationsTo: InferAttributes<Station>[];
  topStationsFrom: InferAttributes<Station>[];
  averageDistanceTo: number | null;
  averageDistanceFrom: number | null;
  totalJourneysTo: number;
  totalJourneysFrom: number;
}
