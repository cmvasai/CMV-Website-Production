import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import UpcomingEventsModal from "../modals/UpcomingEventsModal";

const SPRING_OPTIONS = { type: "spring", stiffness: 200, damping: 20 };

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
    <div className="bg-white dark:bg-gray-900 py-2 sm:py-8 md:py-6">
      <div
        ref={carouselRef}
        className="relative w-full max-w-6xl mx-auto sm:mx-auto overflow-hidden bg-white dark:bg-gray-900"
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
              className="relative shrink-0 flex flex-col items-center cursor-pointer py-1 px-0 sm:p-6 md:p-8 bg-white dark:bg-gray-900 shadow-xl rounded-xl"
              style={{ width: `${containerWidth}px` }}
              onClick={() => handleEventClick(event)}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div
                className="relative w-full rounded-lg overflow-hidden mb-1 sm:mb-4 group bg-white dark:bg-gray-900"
                onMouseEnter={!isMobile ? handleMouseEnter : undefined}
                onMouseLeave={!isMobile ? handleMouseLeave : undefined}
              >
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-88 sm:h-96 md:h-80 object-contain bg-white dark:bg-gray-900"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 group-hover:bg-orange-500 transition-opacity duration-300" />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center text-white text-xs sm:text-sm md:text-base font-semibold bg-opacity-0 transition-all duration-300"
                  initial={{ opacity: isMobile ? 1 : 0 }}
                  whileHover={{ opacity: 1 }}
                  animate={{ opacity: isMobile ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>Click for Details</span>
                </motion.div>
              </div>
              <h3 className="text-sm sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-center">
                {event.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <UpcomingEventsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedUpcomingEvent}
      />
    </div>
  );
};