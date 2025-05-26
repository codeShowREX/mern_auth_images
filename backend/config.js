import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
    HUGGINGFACE_API_TOKEN: process.env.HUGGINGFACE_API_TOKEN,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
}; 