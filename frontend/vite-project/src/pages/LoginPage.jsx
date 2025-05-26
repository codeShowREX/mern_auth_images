import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import useAuthStore from "../store/authStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { login, isLoading, error, clearCookies } = useAuthStore();

	// Clear error when component mounts or when email/password changes
	useEffect(() => {
		useAuthStore.setState({ error: null });
	}, [email, password]);

	const handleLogin = async (e) => {
		e.preventDefault();
		const result = await login(email, password);
		if (!result.success) {
			useAuthStore.setState({ error: result.message });
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
						Welcome to Mern-Auth
					</motion.h2>

					<form onSubmit={handleLogin} className="space-y-4">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
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

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 }}
							className="relative"
						>
							<Input
								icon={Lock}
								type={showPassword ? 'text' : 'password'}
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</motion.div>

						<motion.div 
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5 }}
							className='flex items-center mb-6'
						>
							<Link 
								to='/forgot-password' 
								className='text-sm text-green-400 hover:underline'
							>
								Forgot password?
							</Link>
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
									<span>Logging in...</span>
								</div>
							) : (
								"Login"
							)}
						</motion.button>
					</form>
				</div>
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'
				>
					<p className='text-sm text-gray-400'>
						Don't have an account?{" "}
						<Link 
							to='/signup' 
							className='text-green-400 hover:underline'
						>
							Sign up
						</Link>
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default LoginPage;
