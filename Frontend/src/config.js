
// Config to handle API URL based on environment
const API_HOST = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Frontend public URL — used for shareable links (e.g. model apply form)
// Set VITE_APP_URL in your production .env to your deployed frontend domain
export const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

export default API_HOST;
