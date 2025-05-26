import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import { fileURLToPath } from "url";

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Log environment variables (without sensitive data)
console.log("Environment:", {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	MONGODB_URI: process.env.MONGODB_URI ? "Present" : "Missing",
	JWT_SECRET: process.env.JWT_SECRET ? "Present" : "Missing",
	HUGGINGFACE_API_TOKEN: process.env.HUGGINGFACE_API_TOKEN ? "Present" : "Missing"
});

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
	origin: true, // Allow all origins
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
	exposedHeaders: ['Content-Type', 'Authorization']
}));

// Add a test route to verify CORS
app.get('/api/test-cors', (req, res) => {
	console.log('=== CORS Test Route ===');
	console.log('Request Origin:', req.headers.origin);
	console.log('Request Headers:', req.headers);
	console.log('Environment:', process.env.NODE_ENV);
	
	res.json({ 
		message: 'CORS is working!',
		origin: req.headers.origin,
		environment: process.env.NODE_ENV,
		headers: req.headers
	});
});

// Log all requests with cookie information
app.use((req, _, next) => {
	console.log('=== Request Details ===');
	console.log(`${req.method} ${req.path}`);
	console.log('Environment:', process.env.NODE_ENV);
	console.log('Origin:', req.headers.origin);
	console.log('User-Agent:', req.headers['user-agent']);
	console.log('Headers:', req.headers);
	console.log('=====================');
	next();
});

// Routes
app.use("/api/auth", authRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/vite-project/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../frontend/vite-project/dist/index.html"));
	});
}

// Error handling middleware
app.use((err, req, res, next) => {
	console.error('=== Error Details ===');
	console.error('Error:', err.message);
	console.error('Stack:', err.stack);
	console.error('Request:', {
		method: req.method,
		path: req.path,
		headers: req.headers,
		body: req.body
	});
	console.error('=====================');

	// Handle CORS errors
	if (err.message.includes('CORS')) {
		return res.status(403).json({
			success: false,
			message: "CORS error: " + err.message
		});
	}

	// Handle JWT errors
	if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			success: false,
			message: "Invalid token"
		});
	}

	if (err.name === 'TokenExpiredError') {
		return res.status(401).json({
			success: false,
			message: "Token expired"
		});
	}

	// Handle MongoDB errors
	if (err.name === 'MongoError' || err.name === 'MongoServerError') {
		return res.status(500).json({
			success: false,
			message: "Database error occurred"
		});
	}

	// Default error response
	res.status(err.status || 500).json({
		success: false,
		message: err.message || "Something went wrong!"
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV}`);
	console.log('CORS is configured to allow all origins');
});
