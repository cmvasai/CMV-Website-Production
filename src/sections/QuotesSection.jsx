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
    <div className="bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <div className="relative w-full text-center">
        {/* Quote Card */}
        <div className="bg-gradient-to-r from-white to-orange-100 dark:from-gray-800 dark:to-gray-700 shadow-lg dark:shadow-[0_20px_25px_-5px_rgba(245,121,48,0.15),0_10px_10px_-5px_rgba(245,121,48,0.05)] transition-all duration-500 w-full border-l-6 border-[#BC3612] dark:border-[#F47930] hover:scale-[1.01] group relative dark:ring-1 dark:ring-orange-500/20">
          <div
            key={currentQuoteIndex}
            className="transition-opacity duration-500 opacity-0 animate-slide-up"
          >
            <p className="text-[13px] sm:text-lg md:text-xl font-serif italic tracking-wide text-gray-700 dark:text-gray-100 p-1 sm:p-6 relative quote-text">
              {quotes[currentQuoteIndex].text}
            </p>
            <p className="text-[10px] sm:text-base md:text-lg italic font-medium tracking-wide text-[#BC3612] dark:text-[#F47930] px-1 sm:px-6 pb-1 sm:pb-6">
              — {quotes[currentQuoteIndex].author}
            </p>
          </div>
          <hr className="border-t-1 border-gray-300 dark:border-gray-500/50 my-1 sm:hidden" />
          <FiguresSection />
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slideUp 800ms ease-in-out forwards;
          }
          .quote-text::before {
            content: '"';
            position: absolute;
            left: 4px;
            top: 0;
            font-size: 20px;
            color: #BC3612;
          }
          .quote-text::after {
            content: '"';
            position: absolute;
            right: 4px;
            bottom: 0;
            font-size: 20px;
            color: #BC3612;
          }
          @media (min-width: 768px) {
            .quote-text::before {
              left: 24px;
              top: 4px;
              font-size: 30px;
            }
            .quote-text::after {
              right: 24px;
              bottom: 4px;
              font-size: 30px;
            }
          }
          @media (min-width: 1024px) {
            .quote-text::before {
              left: 20px;
              top: -10px;
              font-size: 40px;
              z-index: 20;
            }
            .quote-text::after {
              right: 20px;
              bottom: -10px;
              font-size: 40px;
              z-index: 20;
            }
          }
          @media (min-width: 1280px) {
            .quote-text::before {
              left: 40px;
              top: -10px;
              font-size: 40px;
              z-index: 20;
            }
            .quote-text::after {
              right: 40px;
              bottom: -10px;
              font-size: 40px;
              z-index: 20;
            }
          }
          .dark .quote-text::before,
          .dark .quote-text::after {
            color: #F47930;
          }
        `}
      </style>
    </div>
  );
};

export default QuotesSection;