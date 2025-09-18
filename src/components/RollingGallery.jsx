import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
  useTransform,
} from "framer-motion";

const RollingGallery = ({
  autoplay = false,
  pauseOnHover = false,
  images = [],
  onImageClick = null,
  height = "500px",
  imageHeight = "120px",
  imageWidth = "300px",
  borderColor = "white",
  gradientColor = "#060010",
  speed = 20, // seconds for one full rotation
}) => {
  const [isScreenSizeSm, setIsScreenSizeSm] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 640 : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => setIsScreenSizeSm(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Early return if no images
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] text-gray-500 dark:text-gray-400">
        <p>No images to display</p>
      </div>
    );
  }

  const cylinderWidth = isScreenSizeSm ? 1100 : 1800;
  const faceCount = images.length;
  const faceWidth = (cylinderWidth / faceCount) * 1.5;
  const radius = cylinderWidth / (2 * Math.PI);

  const dragFactor = 0.05;
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  const transform = useTransform(
    rotation,
    (val) => `rotate3d(0,1,0,${val}deg)`
  );

  const startInfiniteSpin = (startAngle) => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: speed,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    if (autoplay && images.length > 0) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    } else {
      controls.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, images.length]);

  const handleUpdate = (latest) => {
    if (typeof latest.rotateY === "number") {
      rotation.set(latest.rotateY);
    }
  };

  const handleDrag = (_, info) => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_, info) => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor;
    rotation.set(finalAngle);

    if (autoplay) {
      startInfiniteSpin(finalAngle);
    }
  };

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      controls.stop();
    }
  };

  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    }
  };

  const handleImageClick = (image, index) => {
    if (onImageClick) {
      onImageClick(image, index);
    }
  };

  // Helper: gently increase the image dimensions so images appear larger in the faces
  const parsePx = (val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const m = val.match(/^(\d+)(?:px)?$/);
      if (m) return parseInt(m[1], 10);
    }
    return 0;
  };

  const adjustedImageHeight = `${parsePx(imageHeight) + 40}px`; // make images a bit taller
  const adjustedImageWidth = `${parsePx(imageWidth) + 60}px`; // make images a bit wider

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {/* Left gradient fade */}
      <div
        className="absolute top-0 left-0 h-full w-[48px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to left, rgba(0,0,0,0) 0%, ${gradientColor} 100%)`,
        }}
      />
      
      {/* Right gradient fade */}
      <div
        className="absolute top-0 right-0 h-full w-[48px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to right, rgba(0,0,0,0) 0%, ${gradientColor} 100%)`,
        }}
      />

      <div className="flex h-full items-center justify-center [perspective:1000px] [transform-style:preserve-3d]">
        <motion.div
          drag="x"
          dragElastic={0}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={controls}
          onUpdate={handleUpdate}
          style={{
            transform: transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          className="flex min-h-[200px] cursor-grab items-center justify-center [transform-style:preserve-3d] active:cursor-grabbing"
        >
          {images.map((image, i) => {
            // Handle both string URLs and objects with src property
            const imageUrl = typeof image === 'string' ? image : image.image || image.src;
            const imageName = typeof image === 'string' ? `Image ${i + 1}` : image.name || image.alt || `Image ${i + 1}`;
            
            return (
              <div
                key={i}
                className="group absolute flex h-fit items-center justify-center p-2 md:p-3 [backface-visibility:hidden]"
                style={{
                  width: `${faceWidth}px`,
                  transform: `rotateY(${(360 / faceCount) * i}deg) translateZ(${radius}px)`,
                }}
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleImageClick(image, i)}
                >
                  <img
                    src={imageUrl}
                    alt={imageName}
                    className="pointer-events-none rounded-[12px] border-[3px] object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    style={{
                      height: isScreenSizeSm ? `${Math.max(parsePx(imageHeight), 120)}px` : adjustedImageHeight,
                      width: isScreenSizeSm ? `${Math.max(parsePx(imageWidth), 220)}px` : adjustedImageWidth,
                      borderColor: borderColor,
                    }}
                    loading="lazy"
                  />
                  
                  {/* Optional overlay with image name */}
                  {typeof image === 'object' && image.name && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 rounded-b-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-white text-xs text-center font-medium truncate">
                        {image.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default RollingGallery;
