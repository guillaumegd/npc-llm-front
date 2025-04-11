/**
 * Environment variables configuration
 */

// Get variables from Vite environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const config = {
  API_URL,
};

export default config;