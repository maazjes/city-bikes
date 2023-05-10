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
