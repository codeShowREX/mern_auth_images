import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const API_KEY = "Q007wGuh7B17JWXvw9JSKZJB7Efyn341Zy6JbR62IU8GnVPiqtUTRQRO";
const PER_PAGE = 15;

const ImageSearchEngine = () => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState({ show: false, img: "", photographer: "" });
  const searchInputRef = useRef(null);

  const fetchImages = async (page = 1, term = "") => {
    setLoading(true);
    const url = term
      ? `https://api.pexels.com/v1/search?query=${term}&page=${page}&per_page=${PER_PAGE}`
      : `https://api.pexels.com/v1/curated?page=${page}&per_page=${PER_PAGE}`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: API_KEY },
      });
      const data = await res.json();
      if (data.photos) {
        setImages((prev) => (page === 1 ? data.photos : [...prev, ...data.photos]));
      } else {
        toast.error("No images found");
      }
    } catch (error) {
      toast.error("Failed to load images. Please try again.");
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchImages();
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      setCurrentPage(1);
      fetchImages(1, searchTerm.trim());
    }
  };

  const handleLoadMore = () => {
    if (!loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchImages(nextPage, searchTerm);
    }
  };

  const handleDownload = async (imgUrl) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${new Date().getTime()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image. Please try again.");
      console.error("Error downloading image:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className='max-w-7xl w-full mx-auto mt-4 sm:mt-6 md:mt-10 p-4 sm:p-6 md:p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
    >
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm"
            onClick={() => setLightbox({ show: false })}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 bg-opacity-90 rounded-lg p-2 sm:p-4 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mb-4">
                <div className="text-green-400 text-sm sm:text-base">
                  <span>Photo by {lightbox.photographer}</span>
                </div>
                <div className="flex gap-2 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(lightbox.img)}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
                  >
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLightbox({ show: false })}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
                  >
                    Close
                  </motion.button>
                </div>
              </header>
              <div className="relative">
                <motion.img 
                  src={lightbox.img} 
                  alt="preview" 
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Input */}
      <div className="mb-6 sm:mb-8">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full p-3 sm:p-4 bg-gray-800 bg-opacity-50 rounded-lg text-white border border-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-sm sm:text-base"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => searchInputRef.current?.focus()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {images.map((img) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <div className="relative group">
              <img
                src={img.src.large2x}
                alt={img.alt || "Image"}
                className="w-full h-40 sm:h-48 object-cover cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
                onClick={() =>
                  setLightbox({
                    show: true,
                    img: img.src.large2x,
                    photographer: img.photographer,
                  })
                }
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(img.src.large2x);
                  }}
                  className="opacity-0 group-hover:opacity-100 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-green-600"
                >
                  Download
                </motion.button>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="text-green-400 text-sm sm:text-base mb-2">
                Photo by {img.photographer}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center mt-6 sm:mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Load More Button */}
      {!loading && images.length > 0 && (
        <div className="mt-6 sm:mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoadMore}
            disabled={loading}
            className='py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base bg-gradient-to-r from-green-500 to-emerald-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
          >
            Load More
          </motion.button>
        </div>
      )}

      {/* No Results Message */}
      {!loading && images.length === 0 && (
        <div className="text-center mt-6 sm:mt-8 text-gray-400">
          No images found. Try a different search term.
        </div>
      )}
    </motion.div>
  );
};

export default ImageSearchEngine;
