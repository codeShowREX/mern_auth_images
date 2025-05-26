import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";

const ImagesNavigate = () => {
    const navigate = useNavigate();
    const { user, isCheckingAuth } = useAuthStore();

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
            className='max-w-4xl w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
        >
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
                        Image Tools
                    </h2>
                    <p className="text-lg text-gray-300">
                        Choose what you'd like to do with images
                    </p>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* AI Image Generator Option */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 cursor-pointer'
                        onClick={() => navigate("/generate")}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-16 h-16 bg-gray-700 bg-opacity-50 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-green-400 text-center mb-2">
                                AI Image Generator
                            </h3>
                            <p className="text-gray-300 text-center">
                                Create new images using AI technology
                            </p>
                        </div>
                    </motion.div>

                    {/* Image Search Engine Option */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 cursor-pointer'
                        onClick={() => navigate("/search_img")}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-16 h-16 bg-gray-700 bg-opacity-50 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-green-400 text-center mb-2">
                                Image Search Engine
                            </h3>
                            <p className="text-gray-300 text-center">
                                Search and browse images from the library
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ImagesNavigate;
