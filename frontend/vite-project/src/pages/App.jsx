import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FloatingShape from "../components/FloatingShape";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import EmailVerificationPage from "./EmailVerification";
import DashboardPage from "./Dashboard";
import ForgotPasswordPage from "./ForgotPasswordPage";
import ResetPasswordPage from "./ResetPasswordPage";
import LoadingSpinner from "../components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import useAuthStore from "../store/authStore";
import Welcome from "./Welcome";
import ImagesNavigate from "./ImagesNavigate";
import AiImageGenerator from "./AiImageGenerator";
import ImageSearchEngine from "./ImageSearchEngine";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) {
		return <LoadingSpinner />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (!user?.isVerified) {
		return <Navigate to="/verify-email" replace />;
	}

	return children;
};

const PublicRoute = ({ children }) => {
	const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) {
		return <LoadingSpinner />;
	}

	// Don't redirect if we're on the reset password page with a token
	if (window.location.pathname.startsWith('/reset-password/')) {
		return children;
	}

	if (isAuthenticated && user?.isVerified && window.location.pathname.match(/^\/(login|signup|verify-email|forgot-password)$/)) {
		return <Navigate to="/welcome" replace />;
	}

	return children;
};

function App() {
	const { checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<Router>
			<div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
				{/* Background shapes */}
				<FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
				<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
				<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

				{/* Main content */}
				<div className="relative z-10 min-h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6">
					<div className="w-full max-w-7xl mx-auto">
					<Routes>
						<Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
						<Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
						<Route path="/verify-email" element={<PublicRoute><EmailVerificationPage /></PublicRoute>} />
						<Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
						<Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
						<Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
						<Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
						<Route path="/images" element={<ProtectedRoute><ImagesNavigate /></ProtectedRoute>} />
						<Route path="/generate" element={<ProtectedRoute><AiImageGenerator /></ProtectedRoute>} />
						<Route path="/search_img" element={<ProtectedRoute><ImageSearchEngine /></ProtectedRoute>} />
						<Route path="/" element={<Navigate to="/login" replace />} />
					</Routes>
				</div>
			</div>
			</div>
			<Toaster 
				position="top-center"
				toastOptions={{
					duration: 3000,
					style: {
						background: '#1F2937',
						color: '#fff',
						border: '1px solid #374151',
					},
				}}
			/>
		</Router>
	);
}

export default App;
