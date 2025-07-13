export const prdConfig = {
  // Database Configuration
  database: {
    host: process.env.DB_HOST || "prd-db-host",
    user: process.env.DB_USER || "prd-user",
    password: process.env.DB_PASSWORD || "prd-password",
    database: process.env.DB_NAME || "survey_ai_hub_prd",
    port: parseInt(process.env.DB_PORT || "3306"),
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || "4000"),
    frontendUrl: process.env.FRONTEND_URL || "https://survey-ai-hub.com",
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || "warn",
    enableConsole: false,
    enableFile: true,
    logFilePath: "./logs/prd.log",
  },

  // AI Service Configuration
  ai: {
    model: process.env.AI_MODEL || "gpt-4",
    apiKey: process.env.OPENAI_API_KEY || "",
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || "2000"),
  },

  // Environment Info
  environment: "prd",
  isDevelopment: false,
  isProduction: true,
};
