import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../store/authStore";
import { AlertCircle, Loader } from "lucide-react";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [isLoading, setIsLoading] = useState(false);
	const [isValidCode, setIsValidCode] = useState(true);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { error, verifyEmail } = useAuthStore();

	const handleChange = (index, value) => {
		if (!/^\d*$/.test(value)) return;

		const newCode = [...code];

		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		
		if (verificationCode.length !== 6) {
			toast.error("Please enter a valid 6-digit code");
			return;
		}

		try {
			setIsLoading(true);
			console.log('Attempting to verify email with code:', verificationCode);
			
			await verifyEmail(verificationCode);
			toast.success("Email verified successfully");
			setTimeout(() => {
				navigate("/");
			}, 2000);
		} catch (error) {
			console.error('Verification error:', error);
			toast.error(error.message || "Failed to verify email");
			setIsValidCode(false);
			setCode(["", "", "", "", "", ""]);
			inputRefs.current[0].focus();
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

	if (!isValidCode) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
				>
					<div className='p-8'>
						<div className='flex items-center justify-center mb-4'>
							<AlertCircle className='h-12 w-12 text-red-500' />
						</div>
						<h2 className='text-2xl font-bold mb-4 text-center text-red-500'>
							Invalid Verification Code
						</h2>
						<p className='text-gray-300 text-center mb-6'>
							The verification code is invalid or has expired. Please try again.
						</p>
						<button
							onClick={() => setIsValidCode(true)}
							className='w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						>
							Try Again
						</button>
					</div>
				</motion.div>
			</div>
		);
	}

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
						Verify Your Email
					</motion.h2>
					<motion.p 
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="text-center text-gray-300 mb-6"
					>
						Enter the 6-digit code sent to your email address.
					</motion.p>

					<form onSubmit={handleSubmit} className="space-y-6">
						<motion.div 
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 }}
							className="flex justify-between gap-2"
						>
							{code.map((digit, index) => (
								<input
									key={index}
									ref={(el) => (inputRefs.current[index] = el)}
									type="text"
									inputMode="numeric"
									pattern="[0-9]*"
									maxLength="1"
									value={digit}
									onChange={(e) => handleChange(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
									aria-label={`Verification code digit ${index + 1}`}
								/>
							))}
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
							type="submit"
							disabled={isLoading || code.some((digit) => !digit)}
							className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{isLoading ? (
								<div className="flex items-center justify-center gap-2">
									<Loader className='w-5 h-5 animate-spin' />
									<span>Verifying...</span>
								</div>
							) : (
								'Verify Email'
							)}
						</motion.button>
					</form>
				</div>
			</motion.div>
		</div>
	);
};

export default EmailVerificationPage;
