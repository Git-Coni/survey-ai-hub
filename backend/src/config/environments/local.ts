export const localConfig = {
  // Database Configuration
  database: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "survey_ai_hub",
    port: parseInt(process.env.DB_PORT || "3306"),
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || "4000"),
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    enableConsole: true,
    enableFile: false,
  },

  // AI Service Configuration
  ai: {
    model: process.env.AI_MODEL || "gpt-3.5-turbo",
    apiKey: process.env.OPENAI_API_KEY || "",
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || "1000"),
  },

  // Environment Info
  environment: "local",
  isDevelopment: true,
  isProduction: false,
};
