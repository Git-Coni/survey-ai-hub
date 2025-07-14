export const localConfig = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_LOCAL_API_URL!,
    timeout: parseInt(process.env.REACT_APP_LOCAL_API_TIMEOUT!),
  },

  // App Configuration
  app: {
    name: "Survey AI Hub",
    version: "1.0.0",
    environment: "local",
  },

  // Feature Flags
  features: {
    enableDebug: true,
    enableAnalytics: false,
    enableErrorReporting: false,
  },

  // UI Configuration
  ui: {
    theme: "light",
    language: "ko",
    enableAnimations: true,
  },

  // Environment Info
  environment: "local",
  isDevelopment: true,
  isProduction: false,
};
