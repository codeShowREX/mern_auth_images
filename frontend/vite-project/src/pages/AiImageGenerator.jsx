import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const AiImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generationStatus, setGenerationStatus] = useState("");

  // Cleanup URL objects when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGenerationStatus("Starting image generation...");
    
    if (image) {
      URL.revokeObjectURL(image);
      setImage(null);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to generate images');
      }

      if (!prompt.trim()) {
        throw new Error('Please enter a prompt');
      }

      setGenerationStatus("Generating image with Stable Diffusion...");
      
      // Use the backend proxy endpoint
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('[DEBUG] Sending request to backend:', {
        url: `${apiUrl}/api/auth/generate-image`,
        prompt: prompt
      });

      const response = await axios({
        method: 'post',
        url: `${apiUrl}/api/auth/generate-image`,
        data: { prompt },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        responseType: 'arraybuffer',
        timeout: 60000 // 1 minute timeout
      });

      console.log('[DEBUG] Response received:', {
        status: response.status,
        headers: response.headers,
        dataLength: response.data?.length || 0
      });

      // Convert the binary response to a blob
      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
      setGenerationStatus("");

    } catch (err) {
      console.error('[ERROR] Image generation failed:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        headers: err.response?.headers,
        code: err.code
      });

      let errorMessage = "Failed to generate image. ";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage += "Please login again.";
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        } else if (err.response.status === 503) {
          errorMessage += "Model is currently loading. Please try again in a few moments.";
        } else if (err.response.status === 429) {
          errorMessage += "Rate limit exceeded. Please try again later.";
        } else {
          try {
            const errorText = new TextDecoder().decode(err.response.data);
            const errorData = JSON.parse(errorText);
            errorMessage += errorData.error || errorData.details || `Server error (${err.response.status})`;
          } catch (parseError) {
            errorMessage += `Server error (${err.response.status})`;
          }
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage += "Request timed out. The server took too long to respond.";
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage += "Cannot connect to the server. Please check your internet connection.";
      } else {
        errorMessage += err.message || "An unexpected error occurred.";
      }

      setError(errorMessage);
      setGenerationStatus("");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `ai-generated-${new Date().getTime()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('[ERROR] Download failed:', err);
      setError("Failed to download image. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className='max-w-4xl w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
    >
      <div className="text-center mb-8">
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
          AI Image Generator
        </h2>
        <p className="text-gray-300 mb-4">Generate unique images using Stable Diffusion 2</p>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Enter your prompt (e.g., 'a fantasy castle on a hill at sunset')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            className="w-full p-3 bg-gray-800 bg-opacity-50 rounded-lg text-white border border-gray-700 focus:border-green-500 focus:outline-none mb-4"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !prompt.trim()}
            className='w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                {generationStatus || "Generating..."}
              </div>
            ) : (
              "Generate Image"
            )}
          </motion.button>
        </form>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400"
        >
          {error}
        </motion.div>
      )}

      {image && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 overflow-hidden"
        >
          <img
            src={image}
            alt="Generated"
            className="w-full h-auto rounded-lg"
          />
          <div className="p-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownload(image)}
              className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Download Image
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AiImageGenerator; 