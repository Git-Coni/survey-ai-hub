export const prdConfig = () => ({
  // Database Configuration
  database: {
    host: process.env.PRD_DB_HOST!,
    user: process.env.PRD_DB_USER!,
    password: process.env.PRD_DB_PASSWORD!,
    database: process.env.PRD_DB_NAME!,
    port: parseInt(process.env.PRD_DB_PORT!),
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PRD_PORT!),
    frontendUrl: process.env.PRD_FRONTEND_URL!,
  },

  // Logging Configuration
  logging: {
    level: process.env.PRD_LOG_LEVEL!,
    enableConsole: true,
    enableFile: true,
    logFilePath: "./logs/production.log",
  },

  // AI Service Configuration
  ai: {
    model: process.env.PRD_AI_MODEL!,
    apiKey: process.env.PRD_GEMINI_API_KEY!,
    maxTokens: parseInt(process.env.PRD_AI_MAX_TOKENS!),
  },

  // Environment Info
  environment: "prd",
  isDevelopment: false,
  isProduction: true,
});
