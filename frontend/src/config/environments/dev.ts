export const devConfig = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_DEV_API_URL!,
    timeout: parseInt(process.env.REACT_APP_DEV_API_TIMEOUT!),
  },

  // App Configuration
  app: {
    name: "Survey AI Hub (Dev)",
    version: "1.0.0",
    environment: "dev",
  },

  // Feature Flags
  features: {
    enableDebug: true,
    enableAnalytics: true,
    enableErrorReporting: true,
  },

  // UI Configuration
  ui: {
    theme: "light",
    language: "ko",
    enableAnimations: true,
  },

  // Environment Info
  environment: "dev",
  isDevelopment: true,
  isProduction: false,
};
