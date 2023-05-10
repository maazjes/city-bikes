import { Error as TypedError } from '../types';

const request = async <TResponse>(url: string, config?: RequestInit): Promise<TResponse> => {
  const response = await fetch(url, config);
  try {
    const json = (await response.json()) as TResponse | Partial<TypedError>;

    if (response.ok) {
      return json as TResponse;
    }

    throw new Error((json as Partial<TypedError>).error || 'internal server error');
  } catch {
    throw new Error('internal server error');
  }
};

const api = {
  get: <TResponse>(url: string, query?: { [key: string]: string | number }): Promise<TResponse> => {
    let finalQuery = `http://localhost:8080/api/${url}`;
    if (query) {
      finalQuery += '?';
      Object.keys(query).forEach((key) => {
        finalQuery += `${key}=${String(query[key])}&`;
      });
      finalQuery = finalQuery.slice(0, -1);
    }
    return request<TResponse>(finalQuery);
  },

  post: <TResponse>(url: string, body: object): Promise<TResponse> =>
    request<TResponse>(`http://localhost:8080/api/${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }),

  postForm: <TResponse>(url: string, body: FormData): Promise<TResponse> =>
    request<TResponse>(`http://localhost:8080/api/${url}`, {
      method: 'POST',
      body
    })
};

export default api;
