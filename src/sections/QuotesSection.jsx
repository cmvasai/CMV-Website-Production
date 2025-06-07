import { useState, useEffect } from 'react';
import FiguresSection from './FiguresSection';

const QuotesSection = () => {
  const quotes = [
    { text: "Happiness depends on what you can give, not on what you can get.", author: "Swami Chinmayananda" },
    { text: "The real guru is the pure intellect within; and the purified, deeply aspiring mind is the disciple.", author: "Swami Chinmayananda" },
    { text: "To give love is true freedom; to demand love is pure slavery.", author: "Swami Chinmayananda" },
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="relative w-full text-center">
        {/* Quote Card */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md transition-all duration-500 w-full">
          <div
            key={currentQuoteIndex}
            className="transition-opacity duration-500 opacity-0 animate-fade-in"
          >
            <p className="text-xs sm:text-base md:text-lg italic text-gray-700 dark:text-gray-300 p-1 sm:p-4 md:p-6">
              `{quotes[currentQuoteIndex].text}`
            </p>
            <p className="text-[10px] sm:text-sm md:text-base font-medium text-[#BC3612] dark:text-[#F47930] px-1 sm:px-4 md:px-6 pb-1 sm:pb-4 md:pb-6">
              — {quotes[currentQuoteIndex].author}
            </p>
          </div>
          <hr className="border-t-1 border-gray-300 dark:border-gray-600 my-1 sm:hidden" />
          <FiguresSection />
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 500ms ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default QuotesSection;