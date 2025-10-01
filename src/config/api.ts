// API Configuration with automatic environment detection
interface ApiConfig {
  baseUrl: string;
  playgroundUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

// Get environment variables with fallbacks
const getApiConfig = (): ApiConfig => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';
  const isProduction = import.meta.env.PROD || import.meta.env.VITE_PRODUCTION_MODE === 'true';
  
  // Get API base URL from environment or use intelligent defaults
  let baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (!baseUrl) {
    // Auto-detect based on environment
    if (isDevelopment) {
      baseUrl = 'http://localhost:5050';
    } else {
      // Production fallback
      baseUrl = 'https://debtai-fefaf5dtbgd8aqg6.canadacentral-01.azurewebsites.net';
    }
  }
  
  // Get playground URL from environment or use intelligent defaults
  let playgroundUrl = import.meta.env.VITE_PLAYGROUND_URL;
  
  if (!playgroundUrl) {
    if (isDevelopment) {
      playgroundUrl = 'http://localhost:5004';
    } else {
      // Production fallback
      playgroundUrl = 'https://debtai-fefaf5dtbgd8aqg6.canadacentral-01.azurewebsites.net:5004';
    }
  }
  
  return {
    baseUrl,
    playgroundUrl,
    isDevelopment,
    isProduction
  };
};

export const apiConfig = getApiConfig();

// Log configuration for debugging
console.log('🔧 API Configuration:', {
  baseUrl: apiConfig.baseUrl,
  playgroundUrl: apiConfig.playgroundUrl,
  isDevelopment: apiConfig.isDevelopment,
  isProduction: apiConfig.isProduction,
  environment: import.meta.env.MODE,
  viteEnv: {
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_PLAYGROUND_URL: import.meta.env.VITE_PLAYGROUND_URL
  }
});

export default apiConfig;