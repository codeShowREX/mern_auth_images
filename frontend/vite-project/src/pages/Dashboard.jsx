import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import { formatDate } from "../utils/date";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import { toast, Toaster } from "react-hot-toast";
import { updateUser } from "../helper/helper";
import { profileValidation } from "../helper/validate";
import { convertToBase64 } from "../helper/convert";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
	const { user, logout } = useAuthStore();
	const [file, setFile] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	// Check authentication on mount
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/login');
			return;
		}
		setIsLoading(false);
	}, [navigate]);

	// Update file state when user profile changes
	useEffect(() => {
		if (user?.profile) {
			setFile(user.profile);
		}
	}, [user?.profile]);

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/login');
		} catch (error) {
			console.error('Logout failed:', error);
			toast.error('Failed to logout');
		}
	};

	const onUpload = async e => {
		try {
			const base64 = await convertToBase64(e.target.files[0]);
			setFile(base64);
		} catch (error) {
			console.error('Error converting image:', error);
			toast.error('Failed to process image');
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<h1 className="text-xl text-red-500">Please log in to view this page</h1>
			</div>
		);
	}

	// Default avatar SVG
	const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`
		<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="64" cy="64" r="64" fill="#374151"/>
			<circle cx="64" cy="52" r="24" fill="#9CA3AF"/>
			<path d="M64 84C42.4 84 24 102.4 24 124V128H104V124C104 102.4 85.6 84 64 84Z" fill="#9CA3AF"/>
		</svg>
	`)}`;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className='max-w-4xl w-full mx-auto mt-4 sm:mt-6 md:mt-10 p-4 sm:p-6 md:p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
		>
			<Toaster position='top-center' reverseOrder={false}></Toaster>

			<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
				Dashboard
			</h2>

			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
				{/* Profile Information Section */}
				<motion.div
					className='p-4 sm:p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h3 className='text-lg sm:text-xl font-semibold text-green-400 mb-3'>Profile Information</h3>
					<div className="space-y-2">
						<p className='text-base sm:text-lg text-gray-300'>Name: {user.name}</p>
						<p className='text-base sm:text-lg text-gray-300'>Email: {user.email}</p>
					</div>
				</motion.div>

				{/* Account Activity Section */}
				<motion.div
					className='p-4 sm:p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className='text-lg sm:text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
					<div className="space-y-2">
						<p className='text-base sm:text-lg text-gray-300'>
							<span className='font-medium'>Joined: </span>
							{new Date(user.createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
						<p className='text-base sm:text-lg text-gray-300'>
							<span className='font-medium'>Last Login: </span>
							{formatDate(user.lastLogin)}
						</p>
					</div>
				</motion.div>
			</div>

			{/* Profile Update Form */}
			<motion.div
				className='mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
			>
				<h3 className='text-xl sm:text-2xl font-semibold text-green-400 mb-4 sm:mb-6 text-center'>Update Profile</h3>
				
				<Formik
					initialValues={{
						name: user?.name || "",
						email: user?.email || "",
						originalEmail: user?.email || "",
						currentPassword: "",
						newPassword: "",
						confirmPassword: "",
						profile: user?.profile || "",
					}}
					enableReinitialize={true}
					validate={profileValidation}
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						try {
							// Only include fields that are being updated
							const updateData = {};
							if (values.name !== user.name) updateData.name = values.name;
							if (values.email !== user.email) updateData.email = values.email;
							if (values.currentPassword) updateData.currentPassword = values.currentPassword;
							if (values.newPassword) updateData.newPassword = values.newPassword;
							if (file) updateData.profile = file;

							const response = await updateUser(updateData);

							if (response.success) {
								toast.success("Profile updated successfully");
								// Reset form but keep the updated values
								resetForm({
									values: {
										...response.user,
										currentPassword: '',
										newPassword: '',
										confirmPassword: '',
										originalEmail: response.user.email
									}
								});
							} else {
								toast.error(response.message || "Failed to update profile");
							}
						} catch (error) {
							console.error('Update error:', error);
							toast.error(error.message || "An error occurred");
						} finally {
							setSubmitting(false);
						}
					}}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
					}) => (
						<form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
							<div className='flex justify-center'>
								<label htmlFor="profile" className="cursor-pointer group">
									<div className="relative">
										<img 
											src={file || user?.profile || defaultAvatar} 
											className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-green-500 transition-transform duration-200 group-hover:scale-105" 
											alt="avatar" 
										/>
										<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
											<span className="text-white text-sm sm:text-base">Change Photo</span>
										</div>
									</div>
								</label>
								<input 
									onChange={onUpload} 
									type="file" 
									id='profile' 
									name='profile' 
									className="hidden"
									accept="image/*"
								/>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<div>
									<input 
										name="name"
										value={values.name}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`w-full p-3 sm:p-4 text-base bg-gray-700 rounded-lg text-white border ${touched.name && errors.name ? 'border-red-500' : 'border-gray-600'} focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
										type="text" 
										placeholder='Name' 
									/>
									{touched.name && errors.name && (
										<div className="text-red-500 text-sm mt-1">{errors.name}</div>
									)}
								</div>
								<div>
									<input 
										name="email"
										value={values.email}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`w-full p-3 sm:p-4 text-base bg-gray-700 rounded-lg text-white border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-600'} focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
										type="email" 
										placeholder='Email*' 
									/>
									{touched.email && errors.email && (
										<div className="text-red-500 text-sm mt-1">{errors.email}</div>
									)}
								</div>
							</div>

							<div className='space-y-4'>
								<h4 className='text-lg sm:text-xl font-semibold text-green-400'>Change Password</h4>
								<div className="space-y-4">
									<input 
										name="currentPassword"
										value={values.currentPassword}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`w-full p-3 sm:p-4 text-base bg-gray-700 rounded-lg text-white border ${touched.currentPassword && errors.currentPassword ? 'border-red-500' : 'border-gray-600'} focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
										type="password" 
										placeholder='Current Password' 
									/>
									{touched.currentPassword && errors.currentPassword && (
										<div className="text-red-500 text-sm mt-1">{errors.currentPassword}</div>
									)}
									<input 
										name="newPassword"
										value={values.newPassword}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`w-full p-3 sm:p-4 text-base bg-gray-700 rounded-lg text-white border ${touched.newPassword && errors.newPassword ? 'border-red-500' : 'border-gray-600'} focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
										type="password" 
										placeholder='New Password' 
									/>
									{touched.newPassword && errors.newPassword && (
										<div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>
									)}
									<input 
										name="confirmPassword"
										value={values.confirmPassword}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`w-full p-3 sm:p-4 text-base bg-gray-700 rounded-lg text-white border ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
										type="password" 
										placeholder='Confirm New Password' 
									/>
									{touched.confirmPassword && errors.confirmPassword && (
										<div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
									)}
								</div>
							</div>

							<div className='flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8'>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									type='submit'
									disabled={isSubmitting}
									className='flex-1 py-3 px-4 text-base sm:text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white 
									font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
									focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
									disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
								>
									{isSubmitting ? 'Updating...' : 'Update Profile'}
								</motion.button>

								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={handleLogout}
									type="button"
									className='flex-1 py-3 px-4 text-base sm:text-lg bg-gradient-to-r from-red-500 to-red-600 text-white 
									font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700
									focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900
									transition-all duration-200'
								>
									Logout
								</motion.button>
							</div>
						</form>
					)}
				</Formik>
			</motion.div>
		</motion.div>
	);
};

export default DashboardPage;
