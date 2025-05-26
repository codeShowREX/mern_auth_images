import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useAuthStore from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const navigate = useNavigate();

	const { isLoading, forgotPassword, error } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await forgotPassword(email);
			setIsSubmitted(true);
			toast.success("If an account exists, you will receive a password reset link shortly.");
		} catch (error) {
			toast.error(error.message || "Error sending reset password email");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
			>
				<div className='p-8'>
					<motion.h2 
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'
					>
						Forgot Password
					</motion.h2>

					{!isSubmitted ? (
						<form onSubmit={handleSubmit} className="space-y-4">
							<motion.p 
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className='text-gray-300 text-center'
							>
								Enter your email address and we'll send you a link to reset your password.
							</motion.p>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4 }}
							>
								<Input
									icon={Mail}
									type='email'
									placeholder='Email Address'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</motion.div>

							<AnimatePresence>
								{error && (
									<motion.div 
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className='text-red-500 font-semibold mb-2'
									>
										{error}
									</motion.div>
								)}
							</AnimatePresence>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
								type='submit'
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center justify-center gap-2">
										<Loader className='w-5 h-5 animate-spin' />
										<span>Sending reset link...</span>
									</div>
								) : (
									"Send Reset Link"
								)}
							</motion.button>
						</form>
					) : (
						<motion.div 
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
							className='text-center space-y-6'
						>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: "spring", stiffness: 500, damping: 30 }}
								className='w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto'
							>
								<Mail className='h-8 w-8 text-white' />
							</motion.div>
							<p className='text-gray-300'>
								If an account exists for {email}, you will receive a password reset link shortly.
							</p>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => navigate("/login")}
								className='text-green-400 hover:text-green-300 transition-colors'
							>
								Return to Login
							</motion.button>
						</motion.div>
					)}
				</div>

				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'
				>
					<button
						onClick={() => navigate("/login")}
						className='text-sm text-green-400 hover:underline flex items-center'
					>
						<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
					</button>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default ForgotPasswordPage;
