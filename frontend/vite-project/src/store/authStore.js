import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-hot-toast";

// Configure API URL based on environment
const getApiUrl = () => {
	if (import.meta.env.MODE === "development") {
		return "http://localhost:5000";
	}
	// In production, use relative path to avoid CORS issues
	return "";
};

const API_URL = getApiUrl();
console.log('=== Frontend Configuration ===');
console.log('API URL:', API_URL);
console.log('Environment:', import.meta.env.MODE);
console.log('===========================');

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Create axios instance with default config
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	withCredentials: true,
	validateStatus: function (status) {
		return status >= 200 && status < 500;
	},
	timeout: 10000 // Add timeout of 10 seconds
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		// Log request in development only
		if (import.meta.env.MODE === "development") {
			console.log('Request config:', {
				url: config.url,
				method: config.method,
				headers: config.headers
			});
		}
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	}
);

// Add response interceptor to handle errors
api.interceptors.response.use(
	(response) => {
		// Log response in development only
		if (import.meta.env.MODE === "development") {
			console.log('Response:', {
				url: response.config.url,
				status: response.status,
				data: response.data
			});
		}
		return response;
	},
	(error) => {
		console.error('Response error:', {
			url: error.config?.url,
			status: error.response?.status,
			message: error.response?.data?.message,
			error: error.message
		});
		
		// Handle specific error cases
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			const store = useAuthStore.getState();
			store.set({ user: null, isAuthenticated: false });
			toast.error('Session expired. Please login again.');
		} else if (error.message === 'Network Error') {
			toast.error('Unable to connect to the server. Please check your internet connection.');
		} else if (error.response?.status === 403) {
			toast.error('Access denied. Please try logging in again.');
		} else if (error.code === 'ECONNABORTED') {
			toast.error('Request timed out. Please try again.');
		} else {
			toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
		}
		return Promise.reject(error);
	}
);

const useAuthStore = create(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			error: null,
			isLoading: false,
			message: null,

			clearCookies: async () => {
				try {
					// Call logout endpoint to clear server-side cookies
					await api.post("/api/auth/logout");
					
					// Clear local state
					set({ 
						user: null, 
						isAuthenticated: false,
						error: null,
						isLoading: false,
						message: null
					});
					
					// Clear any local storage
					localStorage.clear();
					
					// Force reload the page to clear any remaining state
					window.location.href = '/login';
				} catch (error) {
					console.error("Error clearing cookies:", error);
					// Even if the server call fails, clear local state
					set({ 
						user: null, 
						isAuthenticated: false,
						error: null,
						isLoading: false,
						message: null
					});
					window.location.href = '/login';
				}
			},

			checkAuth: async () => {
				const token = localStorage.getItem('token');
				if (!token) {
					set({ user: null, isAuthenticated: false });
					return { success: false };
				}

				try {
					const response = await api.get("/api/auth/check-auth");
					if (response.data.success) {
						set({ 
							user: response.data.user, 
							isAuthenticated: true,
							error: null
						});
						return { success: true };
					}
					
					localStorage.removeItem('token');
					set({ user: null, isAuthenticated: false });
					return { success: false };
				} catch (error) {
					console.error("Auth check error:", error);
					localStorage.removeItem('token');
					set({ 
						user: null, 
						isAuthenticated: false,
						error: error.response?.data?.message || "Authentication check failed"
					});
					return { success: false };
				}
			},

			login: async (email, password) => {
				try {
					set({ isLoading: true, error: null });
					console.log('=== Login Attempt ===');
					console.log('Email:', email);
					console.log('API URL:', API_URL);
					
					const response = await api.post("/api/auth/login", { email, password });
					console.log('Login response:', {
						success: response.data.success,
						message: response.data.message,
						hasToken: !!response.data.token,
						hasUser: !!response.data.user,
						status: response.status
					});
					
					if (response.data.success && response.data.token) {
						// Store token in localStorage
						localStorage.setItem('token', response.data.token);
						console.log('Token stored in localStorage');
						
						// Update auth state
						set({ 
							user: response.data.user, 
							isAuthenticated: true,
							error: null 
						});
						console.log('Auth state updated');
						
						toast.success("Logged in successfully");
						return { success: true };
					}
					
					console.log('Login failed:', response.data.message);
					const errorMessage = response.data.message || "Login failed";
					set({ error: errorMessage });
					toast.error(errorMessage);
					return { success: false, message: errorMessage };
				} catch (error) {
					console.error("Login error:", {
						message: error.message,
						response: error.response?.data,
						status: error.response?.status,
						config: {
							url: error.config?.url,
							method: error.config?.method,
							headers: error.config?.headers
						}
					});
					
					let errorMessage = "Login failed";
					if (error.response?.data?.message) {
						errorMessage = error.response.data.message;
					} else if (error.message === "Network Error") {
						errorMessage = "Unable to connect to the server. Please check your internet connection.";
					} else if (error.response?.status === 401) {
						errorMessage = "Invalid credentials";
					} else if (error.response?.status === 403) {
						errorMessage = "Access denied. Please try again.";
					}
					
					set({ error: errorMessage });
					toast.error(errorMessage);
					return { success: false, message: errorMessage };
				} finally {
					set({ isLoading: false });
				}
			},

			signup: async (name, email, password) => {
				try {
					set({ isLoading: true, error: null });
					console.log('Attempting signup...');
					
					const response = await api.post("/api/auth/signup", 
						{ name, email, password },
						{ withCredentials: true }
					);
					console.log('Signup response:', response.data);
					
					if (response.data.success) {
						set({ user: response.data.user, isAuthenticated: true });
						toast.success("Account created successfully");
						return { success: true };
					}
					return { success: false, message: response.data.message };
				} catch (error) {
					console.error("Signup error:", error);
					const errorMessage = error.response?.data?.message || "Signup failed";
					set({ error: errorMessage });
					return { success: false, message: errorMessage };
				} finally {
					set({ isLoading: false });
				}
			},

			logout: async () => {
				try {
					set({ isLoading: true, error: null });
					// Remove token from localStorage
					localStorage.removeItem('token');
					// Clear all state
					set({ 
						user: null, 
						isAuthenticated: false,
						error: null,
						message: null
					});
					toast.success("Logged out successfully");
					return { success: true };
				} catch (error) {
					console.error("Logout error:", error);
					toast.error("Logout failed");
					return { success: false, message: "Logout failed" };
				} finally {
					set({ isLoading: false });
				}
			},

			verifyEmail: async (code) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post("/api/auth/verify-email", 
						{ code },
						{ withCredentials: true }
					);
					set({ user: response.data.user, isAuthenticated: true, isLoading: false });
					return response.data;
				} catch (error) {
					const errorMessage = error.response?.data?.message || "Error verifying email";
					set({ error: errorMessage, isLoading: false });
					throw new Error(errorMessage);
				}
			},

			forgotPassword: async (email) => {
				set({ isLoading: true, error: null, message: null });
				try {
					const response = await api.post("/api/auth/forgot-password", { email });
					set({ message: response.data.message, isLoading: false });
					return response.data;
				} catch (error) {
					const errorMessage = error.response?.data?.message || "Error sending reset password email";
					set({ error: errorMessage, isLoading: false });
					throw new Error(errorMessage);
				}
			},

			resetPassword: async (token, password) => {
				try {
					set({ isLoading: true, error: null, message: null });
					console.log('Resetting password with token:', token);
					
					const response = await api.post(`/api/auth/reset-password/${token}`, { 
						newPassword: password 
					});
					
					console.log('Reset password response:', response.data);
					
					if (response.data.success) {
						set({ message: response.data.message, isLoading: false });
						toast.success("Password reset successfully");
						return { success: true, message: response.data.message };
					}
					
					set({ error: response.data.message, isLoading: false });
					toast.error(response.data.message || "Failed to reset password");
					return { success: false, message: response.data.message };
				} catch (error) {
					console.error('Reset password error:', error);
					const errorMessage = error.response?.data?.message || "Error resetting password";
					set({ error: errorMessage, isLoading: false });
					toast.error(errorMessage);
					return { success: false, message: errorMessage };
				} finally {
					set({ isLoading: false });
				}
			},

			updateUser: async (updateData) => {
				try {
					const response = await api.put("/api/auth/update", updateData);
					if (response.data.success) {
						set({ user: response.data.user });
						toast.success("Profile updated successfully");
						return { success: true };
					}
					return { success: false, message: response.data.message };
				} catch (error) {
					console.error("Update error:", error);
					return { success: false, message: error.response?.data?.message || "Update failed" };
				}
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
		}
	)
);

export default useAuthStore;
