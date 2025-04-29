import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import UpcomingEventsModal from "./UpcomingEventsModal";

const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export const UpcomingEvents = ({ upcomingEvents }) => {
  const [selectedUpcomingEvent, setSelectedUpcomingEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const carouselRef = useRef(null);
  const autoplayRef = useRef(null);

  // Update container width dynamically
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
      setIsMobile(window.innerWidth < 768);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Autoplay effect
  useEffect(() => {
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
      }, 3000);
    };
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [upcomingEvents.length]);

  const handleMouseEnter = () => clearInterval(autoplayRef.current);
  const handleMouseLeave = () => {
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 3000);
  };

  const handleEventClick = (event) => {
    setSelectedUpcomingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUpcomingEvent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-6">
      {/* <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 dark:text-white">
        Upcoming Events
      </h1> */}
      <div
        ref={carouselRef}
        className="relative w-full max-w-6xl mx-auto overflow-hidden bg-white dark:bg-gray-900"
      >
        <motion.div
          className="flex w-full bg-white dark:bg-gray-900"
          animate={{ x: -(currentIndex * containerWidth) }}
          transition={SPRING_OPTIONS}
          style={{ width: `${upcomingEvents.length * containerWidth}px` }}
        >
          {upcomingEvents.map((event) => (
            <motion.div
              key={event._id}
              className="relative shrink-0 flex flex-col items-center cursor-pointer p-4 md:p-6 bg-white dark:bg-gray-900"
              style={{ width: `${containerWidth}px` }}
              onClick={() => handleEventClick(event)}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div
                className="relative w-full rounded-lg overflow-hidden mb-4 group bg-white dark:bg-gray-900"
                onMouseEnter={!isMobile ? handleMouseEnter : undefined}
                onMouseLeave={!isMobile ? handleMouseLeave : undefined}
              >
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-64 sm:h-72 md:h-80 object-contain bg-white dark:bg-gray-900"
                />
                <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-0 transition-opacity" />
                {/* Clickable Cue */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center text-white text-sm sm:text-base font-semibold bg-opacity-0 md:bg-opacity-0 md:group-hover:bg-opacity-30 transition-all duration-300"
                  initial={{ opacity: isMobile ? 1 : 0 }}
                  whileHover={{ opacity: 1 }}
                  animate={{ opacity: isMobile ? 1 : 0 }}
                >
                  <span>Click for Details</span>
                </motion.div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                {event.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 text-center">
                {event.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
        {/* Navigation Dots */}
        {/* // In UpcomingEvents.jsx // Reduce the margin for the navigation dots */}
        <div className="flex justify-center mt-3 space-x-2 bg-white dark:bg-gray-900">
          {upcomingEvents.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                currentIndex === index
                  ? "bg-gray-900 dark:bg-white"
                  : "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <UpcomingEventsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedUpcomingEvent}
      />
    </div>
  );
};
