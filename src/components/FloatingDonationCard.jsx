import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTimes } from 'react-icons/fa';

const FloatingDonationCard = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-36 right-0 z-50 md:right-0 md:top-1/2 md:transform md:-translate-y-1/2">
      <div className="bg-gradient-to-r from-[#BC3612] to-[#F47930] text-white rounded-l-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-1 -left-1 bg-gray-600 hover:bg-gray-700 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs transition-colors"
          aria-label="Close"
        >
          <FaTimes size={8} />
        </button>

        {/* Minimal card content */}
        <div className="p-3 pr-4">
          <div className="flex items-center space-x-2">
            <FaHeart className="text-white" size={12} />
            <span className="text-xs font-medium">Donate</span>
          </div>
          
          <Link
            to="/donate"
            className="block w-full mt-2 bg-white/20 hover:bg-white/30 text-white font-medium py-1 px-2 rounded text-xs transition-all duration-200 text-center"
          >
            Click Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FloatingDonationCard;
