/**
 * @class AppError
 * @extends Error
 * @description A custom error class for handling application-specific errors.
 * It includes an error code and a flag to indicate if the error is recoverable.
 *
 * @param {string} message - The error message.
 * @param {string} code - A unique code for the error.
 * @param {boolean} [recoverable=true] - A flag indicating if the application can recover from the error.
 */
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

/**
 * Creates a new error handler function for a specific context.
 * The returned function takes an unknown error and returns a standardized `AppError` object.
 *
 * @param {string} context - The context in which the error occurred (e.g., 'sound generation').
 * @returns {(error: unknown) => AppError} A function that handles errors for the specified context.
 */
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
