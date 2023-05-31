const request = async <T>(url: string, config?: RequestInit): Promise<T> => {
  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().catch(() => ({})) as Promise<T>;
};

const api = {
  get: <TResponse>(
    uri: string,
    query?: { [key: string]: string | number | string[] | number[] | Date }
  ): Promise<TResponse> => {
    let finalQuery = `http://localhost:8080/api/${uri}`;
    if (query) {
      finalQuery += '?';
      Object.keys(query).forEach((key) => {
        if (query[key]) {
          finalQuery += `${key}=${String(query[key])}&`;
        }
      });
      finalQuery = finalQuery.slice(0, -1);
    }
    return request<TResponse>(finalQuery);
  },

  post: <TResponse>(uri: string, body: object): Promise<TResponse> =>
    request<TResponse>(`http://localhost:8080/api/${uri}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }),

  postForm: <TResponse>(uri: string, body: FormData): Promise<TResponse> =>
    request<TResponse>(`http://localhost:8080/api/${uri}`, {
      method: 'POST',
      body
    }),

  delete: <TResponse>(uri: string, body: number[]): Promise<TResponse> =>
    request<TResponse>(`http://localhost:8080/api/${uri}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
};

export default api;
