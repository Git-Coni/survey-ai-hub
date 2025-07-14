export const devConfig = () => ({
  // Database Configuration
  database: {
    host: process.env.DEV_DB_HOST!,
    user: process.env.DEV_DB_USER!,
    password: process.env.DEV_DB_PASSWORD!,
    database: process.env.DEV_DB_NAME!,
    port: parseInt(process.env.DEV_DB_PORT!),
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.DEV_PORT!),
    frontendUrl: process.env.DEV_FRONTEND_URL!,
  },

  // Logging Configuration
  logging: {
    level: process.env.DEV_LOG_LEVEL!,
    enableConsole: true,
    enableFile: false,
  },

  // AI Service Configuration
  ai: {
    model: process.env.DEV_AI_MODEL!,
    apiKey: process.env.DEV_GEMINI_API_KEY!,
    maxTokens: parseInt(process.env.DEV_AI_MAX_TOKENS!),
  },

  // Environment Info
  environment: "dev",
  isDevelopment: true,
  isProduction: false,
});
