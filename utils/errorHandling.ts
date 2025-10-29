export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const createErrorHandler = (context: string) => {
  return (error: unknown): AppError => {
    if (error instanceof AppError) return error;

    if (error instanceof Error) {
      if (error.message.includes('network')) {
        return new AppError('Network connection failed. Please check your internet connection.', 'NETWORK_ERROR');
      }
      if (error.message.includes('API key')) {
        return new AppError('Invalid API key. Please check your configuration.', 'API_KEY_ERROR', false);
      }
    }

    return new AppError(`Unexpected error in ${context}`, 'UNKNOWN_ERROR');
  };
};
