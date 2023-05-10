interface ApiErrorOptions extends ErrorOptions {
  status?: number;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, options?: ApiErrorOptions) {
    super(message, { cause: options?.cause });
    this.status = options?.status || 500;
  }
}

export default ApiError;
