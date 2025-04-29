import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiCircle } from "react-icons/fi";

const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel({ items, autoplay = true, autoplayDelay = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const carouselRef = useRef(null);

  // Update container width and mobile status dynamically
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
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, items.length]);

  return (
    <div ref={carouselRef} className="relative w-full overflow-hidden">
      <motion.div
        className="flex w-full"
        animate={{ x: -(currentIndex * containerWidth) }}
        transition={SPRING_OPTIONS}
        style={{ width: `${items.length * containerWidth}px` }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="relative shrink-0 text-white flex flex-col justify-end p-4"
            style={{
              backgroundImage: `url(${item.image})`,
              width: `${containerWidth}px`,
              height: isMobile ? "50vh" : "80vh", // Slightly reduced from 85vh for flexibility
              backgroundSize: isMobile ? "contain" : "cover", // Contain for mobile, cover for larger screens
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black bg-opacity-50 p-4 rounded">
              <div className="flex items-center gap-2">
                <FiCircle className="h-[16px] w-[16px] text-white" />
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