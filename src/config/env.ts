export const getEnvVariable = (key: string): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(
      `Missing environment variable: ${key}. Please check your .env.local file.`
    );
  }

  return value;
};

export const ENV = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

// Validate critical environment variables at startup
export const validateEnv = () => {
  if (!ENV.GEMINI_API_KEY && ENV.IS_DEVELOPMENT) {
    console.warn(
      '⚠️  VITE_GEMINI_API_KEY is not set. AI sound generation will not work.\\n' +
      'Please create a .env.local file with:\\n' +
      'VITE_GEMINI_API_KEY=your_api_key_here'
    );
  }
};
