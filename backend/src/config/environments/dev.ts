export const devConfig = {
  // Database Configuration
  database: {
    host: process.env.DB_HOST || "dev-db-host",
    user: process.env.DB_USER || "dev-user",
    password: process.env.DB_PASSWORD || "dev-password",
    database: process.env.DB_NAME || "survey_ai_hub_dev",
    port: parseInt(process.env.DB_PORT || "3306"),
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || "4000"),
    frontendUrl: process.env.FRONTEND_URL || "https://dev.survey-ai-hub.com",
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || "debug",
    enableConsole: true,
    enableFile: true,
    logFilePath: "./logs/dev.log",
  },

  // AI Service Configuration
  ai: {
    model: process.env.AI_MODEL || "gpt-3.5-turbo",
    apiKey: process.env.OPENAI_API_KEY || "",
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || "1500"),
  },

  // Environment Info
  environment: "dev",
  isDevelopment: true,
  isProduction: false,
};
