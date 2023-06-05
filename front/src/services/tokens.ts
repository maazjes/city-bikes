import api from 'src/util/api';

const verifyToken = (body: { token: string }): Promise<{ valid: boolean }> =>
  api.post<{ valid: boolean }>('tokens/verifytoken', body);

const refreshToken = (body: { token: string }): Promise<{ token: string }> =>
  api.post<{ token: string }>('tokens/refreshtoken', body);

export { verifyToken, refreshToken };
