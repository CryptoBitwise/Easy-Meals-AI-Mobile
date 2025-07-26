// API Configuration
export const API_CONFIG = {
    // Backend proxy for beta testing (your server)
    BACKEND_URL: process.env.BACKEND_URL || 'https://your-backend-proxy.herokuapp.com',

    // Direct OpenAI API (for production)
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',

    // Development flag
    IS_DEVELOPMENT: __DEV__,

    // Beta testing mode
    BETA_MODE: true, // Set to false for production
}; 