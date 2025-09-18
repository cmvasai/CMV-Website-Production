import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "../scrollUtils";

export default function Carousel({ items, autoplay = true, autoplayDelay = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const navigate = useNavigate();
  const x = useMotionValue(0);

  // Auto-rotate
  useEffect(() => {
    if (autoplay && !isDragging) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % items.length);
      }, autoplayDelay);
      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, items.length, isDragging]);

  // Reset position after index change
  useEffect(() => {
    if (!isDragging) {
      x.set(0);
      setShouldReset(true);
      const timer = setTimeout(() => setShouldReset(false), 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isDragging, x]);

  const handleDragEnd = useCallback((_, info) => {
    const threshold = 50;
    let indexChanged = false;
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
        indexChanged = true;
      } else {
        setCurrentIndex(prev => (prev + 1) % items.length);
        indexChanged = true;
      }
    }
    
    setIsDragging(false);
    
    // Force reset to center with a slight delay
    setTimeout(() => {
      x.set(0);
    }, indexChanged ? 50 : 0);
    
  }, [items.length, x]);

  const handleCardClick = useCallback((index) => {
    if (index === currentIndex && !isDragging) {
      navigate("/events");
      setTimeout(() => scrollToTop(), 100);
    } else if (!isDragging) {
      setCurrentIndex(index);
    }
  }, [currentIndex, isDragging, navigate]);

  const getCardStyle = (index) => {
    const diff = ((index - currentIndex + items.length) % items.length);
    const position = diff > items.length / 2 ? diff - items.length : diff;
    
    let transform = "";
    let zIndex = 10;
    let opacity = 1;
    
    if (position === 0) {
      // Center card - much larger and prominent
      transform = "translateX(-50%) translateZ(100px) rotateY(0deg) scale(1.0)";
      zIndex = 30;
      opacity = 1;
    } else if (position === 1 || position === -1) {
      // Adjacent cards - visible but smaller
      const side = position === 1 ? 1 : -1;
      transform = `translateX(-50%) translateX(${side * 360}px) translateZ(-60px) rotateY(${-side * 25}deg) scale(0.8)`;
      zIndex = 20;
      opacity = 0.85;
    } else if (position === 2 || position === -2) {
      // Far cards - more distant
      const side = position === 2 ? 1 : -1;
      transform = `translateX(-50%) translateX(${side * 540}px) translateZ(-120px) rotateY(${-side * 40}deg) scale(0.65)`;
      zIndex = 15;
      opacity = 0.6;
    } else {
      // Hidden cards
      transform = `translateX(-50%) translateX(${position > 0 ? 720 : -720}px) translateZ(-180px) rotateY(${position > 0 ? -55 : 55}deg) scale(0.5)`;
      zIndex = 5;
      opacity = 0.3;
    }
    
    return { transform, zIndex, opacity };
  };

  return (
    <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] bg-white dark:bg-gray-900 overflow-hidden">
      {/* Subtle background pattern - matches your site */}
      <div className="absolute inset-0">
        {/* Light theme: subtle orange pattern */}
        <div className="absolute inset-0 dark:hidden bg-gradient-to-br from-orange-50 via-white to-orange-50" />
        
        {/* Dark theme: your standard dark background */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        
        {/* Very subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(156,163,175,0.4) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(156,163,175,0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* 3D Card Container - Better vertical centering */}
      <div 
        className="absolute top-0 bottom-6 sm:bottom-8 md:bottom-10 left-0 right-0 flex items-center justify-center px-1 sm:px-2 md:px-4"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: -80, right: 80 }}
          dragElastic={0.3}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x }}
          animate={{ x: isDragging ? undefined : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.5 }}
        >
          <AnimatePresence mode="sync">
            {items.map((item, index) => {
              const { transform, zIndex, opacity } = getCardStyle(index);
              const isCenter = ((index - currentIndex + items.length) % items.length) === 0;
              
              return (
                  <motion.div
                    key={`${item._id || index}-${currentIndex}`}
                    className={`absolute cursor-pointer ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translateY(-50%) ${transform}`,
                      zIndex,
                      opacity,
                      transformStyle: 'preserve-3d'
                    }}
                    animate={{
                      transform: `translateY(-50%) ${transform}`,
                      opacity,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.23, 1, 0.32, 1], // Custom easing for smooth motion
                      scale: { duration: 0.4 }
                    }}
                    onClick={() => handleCardClick(index)}
                    whileHover={isCenter ? { 
                      scale: 1.05,
                      rotateY: 2,
                      transition: { duration: 0.3 }
                    } : { 
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {/* Properly proportioned cards - mobile optimized, no extra space */}
                    <div 
                      className={`relative overflow-hidden transition-all duration-500 flex flex-col ${
                        isCenter 
                          ? 'w-64 sm:w-80 md:w-96 lg:w-[420px] xl:w-[460px] h-[16rem] sm:h-[20rem] md:h-[22rem] lg:h-[24rem] xl:h-[26rem] bg-white dark:bg-gray-900' 
                          : 'w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[420px] h-[12rem] sm:h-[16rem] md:h-[18rem] lg:h-[20rem] xl:h-[22rem] bg-white dark:bg-gray-900'
                      } rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]`}
                    >
                      {/* Subtle border for center card - using your orange theme */}
                      {isCenter && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl sm:rounded-2xl opacity-30 blur-sm" />
                      )}
                      
                      {/* Card content - flex layout to eliminate gaps */}
                      <div className={`relative w-full h-full bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col`}>
                        {/* Image Section - larger for mobile, less text space */}
                        <div className={`relative overflow-hidden flex-shrink-0 ${isCenter ? 'h-28 sm:h-36 md:h-40 lg:h-44 xl:h-48' : 'h-24 sm:h-32 md:h-36 lg:h-40 xl:h-44'}`}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            draggable={false}
                          />
                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          
                          {/* Featured badge for center card - mobile responsive */}
                          {isCenter && (
                            <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4">
                              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg">
                                FEATURED
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Content Section - flex-1 to fill remaining space exactly */}
                        <div className={`flex-1 flex flex-col justify-start ${isCenter ? 'p-2 sm:p-3 md:p-4 lg:p-5' : 'p-1.5 sm:p-2 md:p-3 lg:p-4'} bg-white dark:bg-gray-900`}>
                          <h3 className={`font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1 line-clamp-1 sm:line-clamp-2 ${
                            isCenter ? 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl' : 'text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg'
                          }`}>
                            {item.title}
                          </h3>
                          <p className={`text-gray-600 dark:text-gray-300 leading-tight line-clamp-1 sm:line-clamp-2 ${
                            isCenter ? 'text-xs sm:text-xs md:text-sm lg:text-base' : 'text-xs sm:text-xs md:text-xs lg:text-sm'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation dots - positioned closer to cards */}
      <div className="absolute bottom-0 sm:bottom-1 md:bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40 -translate-y-1/2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'w-6 sm:w-8 md:w-10 h-2 sm:h-3 md:h-4 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full shadow-lg' 
                : 'w-2 sm:w-3 md:w-4 h-2 sm:h-3 md:h-4 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded-full'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Mobile-optimized instructions */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-gray-600 dark:text-gray-300 text-xs sm:text-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 md:p-3 shadow-md">
        <p className="hidden md:block font-medium">
          <span className="text-orange-600 dark:text-orange-400">Drag</span> to rotate • 
          <span className="text-orange-600 dark:text-orange-400">Click center</span> to explore
        </p>
        <p className="md:hidden font-medium">
          <span className="text-orange-600 dark:text-orange-400">Tap</span> to navigate
        </p>
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}