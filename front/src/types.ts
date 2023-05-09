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
