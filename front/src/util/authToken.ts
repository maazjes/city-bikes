// eslint-disable-next-line import/no-mutable-exports
let AUTH_TOKEN = '';

const setAuthToken = (token: string): void => {
  AUTH_TOKEN = token;
};

export { AUTH_TOKEN, setAuthToken };
