import { AUTH_TOKEN } from './authToken';
import { API_URL } from './config';

const setAuthHeaders = (headers?: HeadersInit): HeadersInit | undefined => {
  if (!AUTH_TOKEN) {
    return headers;
  }

  return {
    ...headers,
    authorization: `bearer ${AUTH_TOKEN}`
  };
};

const request = async <T>(url: string, config?: RequestInit): Promise<T> => {
  const response = await fetch(url, config);

  if (!response.ok) {
    return response.json().then((res: { error: string }) => {
      throw new Error(res.error);
    });
  }

  return response.json().catch(() => ({})) as Promise<T>;
};

const api = {
  get: <TResponse>(
    uri: string,
    query?: { [key: string]: string | number | string[] | number[] | Date }
  ): Promise<TResponse> => {
    let finalQuery = `${API_URL}${uri}`;
    if (query) {
      finalQuery += '?';
      Object.keys(query).forEach((key) => {
        if (query[key]) {
          finalQuery += `${key}=${String(query[key])}&`;
        }
      });
      finalQuery = finalQuery.slice(0, -1);
    }
    return request<TResponse>(finalQuery, { headers: setAuthHeaders() });
  },

  post: <TResponse>(uri: string, body: object): Promise<TResponse> =>
    request<TResponse>(`${API_URL}${uri}`, {
      method: 'POST',
      headers: setAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    }),

  postForm: <TResponse>(uri: string, body: FormData): Promise<TResponse> =>
    request<TResponse>(`${API_URL}${uri}`, {
      method: 'POST',
      headers: setAuthHeaders(),
      body
    }),

  delete: <TResponse>(uri: string, body: number[]): Promise<TResponse> =>
    request<TResponse>(`${API_URL}${uri}`, {
      method: 'DELETE',
      headers: setAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    })
};

export default api;
