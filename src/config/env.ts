/**
 * Retrieves an environment variable by its key.
 * Throws an error if the variable is not found.
 *
 * @param {string} key - The key of the environment variable to retrieve.
 * @returns {string} The value of the environment variable.
 * @throws {Error} If the environment variable is not set.
 */
export const getEnvVariable = (key: string): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(
      `Missing environment variable: ${key}. Please check your .env.local file.`
    );
  }

  return value;
};

/**
 * An object containing environment variables.
 * This provides a centralized and type-safe way to access environment variables throughout the application.
 *
 * @property {string} GEMINI_API_KEY - The API key for the Gemini service.
 * @property {boolean} IS_PRODUCTION - A flag that is true if the application is running in production mode.
 * @property {boolean} IS_DEVELOPMENT - A flag that is true if the application is running in development mode.
 */
export const ENV = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

/**
 * Validates critical environment variables at application startup.
 * If a required variable is missing in a development environment, a warning is logged to the console.
 * This helps ensure that the application is configured correctly before it runs.
 */
export const validateEnv = () => {
  if (!ENV.GEMINI_API_KEY && ENV.IS_DEVELOPMENT) {
    console.warn(
      '⚠️  VITE_GEMINI_API_KEY is not set. AI sound generation will not work.\\n' +
      'Please create a .env.local file with:\\n' +
      'VITE_GEMINI_API_KEY=your_api_key_here'
    );
  }
};
