import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";

const Welcome = () => {
    const { user, isCheckingAuth } = useAuthStore();
    const navigate = useNavigate();

    if (isCheckingAuth) {
        return <LoadingSpinner />;
    }

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className='max-w-4xl w-full mx-auto mt-4 sm:mt-6 md:mt-10 p-4 sm:p-6 md:p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
        >
            <div className="space-y-6 sm:space-y-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
                        Welcome, {user.name}! 👋
                    </h2>
                    <p className="text-lg text-gray-300">
                        We're glad to have you here. Your account is ready to use.
                    </p>
                </div>

                {/* Profile Card */}
                <motion.div
                    className='p-4 sm:p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <img
                            src={user.profile || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2534623311.jpg"}
                            alt="Profile"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-green-500"
                        />
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl sm:text-2xl font-semibold text-green-400">
                                {user.name}
                            </h2>
                            <p className="text-gray-300 text-sm sm:text-base">{user.email}</p>
                            <p className="text-sm text-green-400 mt-1">
                                {user.isVerified ? "✓ Email Verified" : "⚠ Email Not Verified"}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Create Image Section */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className='p-4 sm:p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 cursor-pointer'
                        onClick={() => navigate("/images")}
                    >
                        <h3 className="text-lg sm:text-xl font-semibold text-green-400 mb-2 sm:mb-3">
                            Find Your Image
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
                            Start creating amazing images with our AI-powered tools.
                        </p>
                        <button className="text-green-400 text-sm sm:text-base font-medium hover:text-green-300">
                            Start Creating →
                        </button>
                    </motion.div>

                    {/* Dashboard Section */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className='p-4 sm:p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 cursor-pointer'
                        onClick={() => navigate('/dashboard')}
                    >
                        <h3 className="text-lg sm:text-xl font-semibold text-green-400 mb-2 sm:mb-3">
                            Go to Dashboard
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
                            Access your dashboard to manage your account and view your activity.
                        </p>
                        <button 
                            type="button"
                            className="text-green-400 text-sm sm:text-base font-medium hover:text-green-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/dashboard');
                            }}
                        >
                            View Dashboard →
                        </button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Welcome;
