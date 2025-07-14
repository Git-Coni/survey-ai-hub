export const localConfig = {
  // Database Configuration
  database: {
    host: process.env.LOCAL_DB_HOST!,
    user: process.env.LOCAL_DB_USER!,
    password: process.env.LOCAL_DB_PASSWORD!,
    database: process.env.LOCAL_DB_NAME!,
    port: parseInt(process.env.LOCAL_DB_PORT!),
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.LOCAL_PORT!),
    frontendUrl: process.env.LOCAL_FRONTEND_URL!,
  },

  // Logging Configuration
  logging: {
    level: process.env.LOCAL_LOG_LEVEL!,
    enableConsole: true,
    enableFile: false,
  },

  // AI Service Configuration
  ai: {
    model: process.env.LOCAL_AI_MODEL!,
    apiKey: process.env.LOCAL_GEMINI_API_KEY!,
    maxTokens: parseInt(process.env.LOCAL_AI_MAX_TOKENS!),
  },

  // Environment Info
  environment: "local",
  isDevelopment: true,
  isProduction: false,
};
