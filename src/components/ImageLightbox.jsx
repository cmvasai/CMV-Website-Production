import { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaDownload, FaShareAlt } from 'react-icons/fa';

const ImageLightbox = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(images[currentIndex].url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `event-image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Event Image',
          text: images[currentIndex].caption || 'Check out this event image!',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (window.showToast) {
          window.showToast('Link copied to clipboard!', 'success');
        }
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 md:top-4 right-2 md:right-4 text-white hover:text-gray-300 z-10 p-2 md:p-3 bg-black/50 backdrop-blur-sm rounded-full transition-colors"
        aria-label="Close lightbox"
      >
        <FaTimes className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 p-2 md:p-3 bg-black/50 backdrop-blur-sm rounded-full transition-colors"
            aria-label="Previous image"
          >
            <FaChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 p-2 md:p-3 bg-black/50 backdrop-blur-sm rounded-full transition-colors"
            aria-label="Next image"
          >
            <FaChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* Action Buttons */}
      <div className="absolute top-2 md:top-4 left-2 md:left-4 flex space-x-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          disabled={isLoading}
          className="text-white hover:text-gray-300 p-2 bg-black/70 backdrop-blur-sm rounded-full transition-colors disabled:opacity-50"
          aria-label="Download image"
        >
          <FaDownload className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="text-white hover:text-gray-300 p-2 bg-black/70 backdrop-blur-sm rounded-full transition-colors"
          aria-label="Share image"
        >
          <FaShareAlt className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Image Container */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.url}
          alt={currentImage.caption || `Event image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          style={{ 
            maxWidth: 'calc(100vw - 2rem)',
            maxHeight: 'calc(100vh - 8rem)'
          }}
          loading="lazy"
        />
        
        {/* Image Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white p-3 md:p-4 rounded-b-lg">
            <p className="text-center text-sm md:text-base">{currentImage.caption}</p>
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2 max-w-full overflow-x-auto px-2 md:px-4 pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded border-2 overflow-hidden transition-all ${
                index === currentIndex 
                  ? 'border-white shadow-lg scale-110' 
                  : 'border-transparent opacity-60 hover:opacity-80'
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
