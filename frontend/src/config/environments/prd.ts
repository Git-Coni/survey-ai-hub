export const prdConfig = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_PRD_API_URL!,
    timeout: parseInt(process.env.REACT_APP_PRD_API_TIMEOUT!),
  },

  // App Configuration
  app: {
    name: "Survey AI Hub",
    version: "1.0.0",
    environment: "prd",
  },

  // Feature Flags
  features: {
    enableDebug: false,
    enableAnalytics: true,
    enableErrorReporting: true,
  },

  // UI Configuration
  ui: {
    theme: "light",
    language: "ko",
    enableAnimations: false,
  },

  // Environment Info
  environment: "prd",
  isDevelopment: false,
  isProduction: true,
};
