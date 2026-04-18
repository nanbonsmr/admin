// Environment configuration and validation
export const config = {
  convexUrl: import.meta.env.VITE_CONVEX_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  analyticsId: import.meta.env.VITE_ANALYTICS_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
};

// Validate required environment variables
export function validateEnvironment() {
  const requiredVars = {
    VITE_CONVEX_URL: config.convexUrl,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

// Initialize environment validation
if (config.isProduction) {
  validateEnvironment();
}