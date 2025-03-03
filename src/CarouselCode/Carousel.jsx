import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiCircle } from "react-icons/fi";

const DEFAULT_ITEMS = [
  { title: "Bike Ride 2K24", description: "Chinmaya Mission Vasai Bike Ride to Trimbakeshwar Temple", id: 1, icon: <FiCircle className="h-[16px] w-[16px] text-white" />, image: "/images/bikeRide1.jpeg" },
  { title: "New Year", description: "Chinmaya Mission Vasai New Year Celebration", id: 2, icon: <FiCircle className="h-[16px] w-[16px] text-white" />, image: "/images/newYear1.jpeg" },
  { title: "Components", description: "Reusable components for your projects.", id: 3, icon: <FiCircle className="h-[16px] w-[16px] text-white" />, image: "/images/bikeRide2.jpeg" },
  { title: "Backgrounds", description: "Beautiful backgrounds and patterns for your projects.", id: 4, icon: <FiCircle className="h-[16px] w-[16px] text-white" />, image: "/images/trekImg.jpeg" },
  { title: "Common UI", description: "Common UI components are coming soon!", id: 5, icon: <FiCircle className="h-[16px] w-[16px] text-white" />, image: "/images/newYear2.jpeg" },
  { title: "Common UI", description: "Common UI components are coming soon!", id: 6, icon: <FiCircle className="h-[16px] w-[16px] text-white" />, image: "/images/bikeRide3.jpeg" },
];

const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel({ autoplay = true, autoplayDelay = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const carouselRef = useRef(null);

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
    if (autoplay) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % DEFAULT_ITEMS.length);
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay]);

  return (
    <div ref={carouselRef} className="relative w-full overflow-hidden">
      <motion.div
        className="flex w-full"
        animate={{ x: -(currentIndex * containerWidth) }} // 🔥 No extra spacing, exact calculation
        transition={SPRING_OPTIONS}
        style={{ width: `${DEFAULT_ITEMS.length * containerWidth}px` }} // 🔥 Ensure correct container width
      >
        {DEFAULT_ITEMS.map((item, index) => (
          <motion.div
            key={index}
            className="relative shrink-0 text-white flex flex-col justify-end p-4"
            style={{
              backgroundImage: `url(${item.image})`,
              width: `${containerWidth}px`,
              height: isMobile ? "50vh" : "85vh", // Adjust height for mobile
              backgroundSize: isMobile ? "contain" : "cover", // Prevent zooming on mobile
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black bg-opacity-50 p-4 rounded">
              <div className="flex items-center gap-2">
                {item.icon}
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
              <p className="text-sm">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
