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
    // Skip sanitization for FormData (file uploads)
    if (config.data instanceof FormData) {
      return config;
    }
    
    // Validate request data
    if (config.data) {
      // Ensure data is properly structured
      if (typeof config.data !== 'object') {
        throw new Error('Invalid request data format');
      }
      
      // Sanitize string inputs but preserve nested objects
      const sanitizeData = (obj) => {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string') {
            sanitized[key] = value.substring(0, 1000);
          } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = value; // Preserve nested objects like features
          } else {
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
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;