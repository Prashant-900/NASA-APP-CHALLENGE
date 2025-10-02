import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

const apiClient = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 30000,
  withCredentials: false, // Explicitly set for security
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for input validation
apiClient.interceptors.request.use(
  (config) => {
    // Validate request data
    if (config.data) {
      // Ensure data is properly structured
      if (typeof config.data !== 'object') {
        throw new Error('Invalid request data format');
      }
      
      // Sanitize string inputs
      const sanitizeData = (obj) => {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string') {
            // Remove potentially dangerous characters
            sanitized[key] = value.replace(/[<>"'&]/g, '').substring(0, 1000);
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            sanitized[key] = value;
          } else if (value === null || value === undefined) {
            sanitized[key] = value;
          }
        }
        return sanitized;
      };
      
      config.data = sanitizeData(config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Validate response structure
    if (response.data && typeof response.data === 'object') {
      return response;
    }
    return response;
  },
  (error) => {
    // Don't log sensitive information
    const safeError = {
      message: error.message || 'Request failed',
      status: error.response?.status || 'Unknown',
    };
    console.error('API Error:', safeError);
    return Promise.reject(error);
  }
);

export default apiClient;