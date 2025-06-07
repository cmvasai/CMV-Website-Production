import { useState, useEffect } from 'react';

const QuotesSection = () => {
  const quotes = [
    { text: "Happiness depends on what you can give, not on what you can get.", author: "Swami Chinmayananda" },
    { text: "The real guru is the pure intellect within; and the purified, deeply aspiring mind is the disciple.", author: "Swami Chinmayananda" },
    { text: "To give love is true freedom; to demand love is pure slavery.", author: "Swami Chinmayananda" },
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  // Handle dot click for manual navigation
  const handleDotClick = (index) => {
    setCurrentQuoteIndex(index);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-6 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          {/* Quote Card */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-3 sm:p-4 md:p-6 shadow-md transition-all duration-500">
            <p className="text-sm sm:text-base md:text-lg italic text-gray-700 dark:text-gray-300">
              `{quotes[currentQuoteIndex].text}`
            </p>
            <p className="mt-2 text-xs sm:text-sm md:text-base font-medium text-[#BC3612] dark:text-[#F47930]">
              — {quotes[currentQuoteIndex].author}
            </p>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentQuoteIndex === index
                    ? 'bg-[#BC3612] dark:bg-[#F47930]'
                    : 'bg-gray-400 dark:bg-gray-600'
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotesSection;