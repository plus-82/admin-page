// API configuration
// This file allows us to change the API base URL based on environment

// Default to localhost for development
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Axios default configuration can be added here if needed