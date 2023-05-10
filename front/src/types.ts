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
  x: number;
  y: number;
}

export type PaginationQuery = {
  limit: number;
  offset: number;
};

export interface PaginatedStations {
  rows: Station[];
  count: number;
}
