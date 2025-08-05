import { useState } from 'react';
import { FaDownload, FaTimes, FaShareAlt, FaSpinner } from 'react-icons/fa';
import ImageLightbox from '../components/ImageLightbox';
import { showToast } from '../components/Toast';

const EventsModal = ({ isOpen, onClose, event }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [sharing, setSharing] = useState(false);

  if (!isOpen || !event) return null;

  const handleImageClick = (index) => {
    console.log('Opening lightbox at index:', index, 'Total images:', allImages.length);
    console.log('Image at index:', allImages[index]);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Prepare images for lightbox - use archived events format only
  const allImages = [];
  
  // Add cover image first if it exists (archived events format)
  if (event.coverImage) {
    allImages.push({
      url: event.coverImage,
      caption: `${event.name || event.title} - Cover Image`
    });
  }
  
  // Add gallery images if they exist (archived events format)
  if (event.images && event.images.length > 0) {
    event.images.forEach((img, index) => {
      allImages.push({
        url: typeof img === 'string' ? img : img.url,
        caption: typeof img === 'string' ? `${event.name || event.title} - Photo ${index + 1}` : (img.caption || `${event.name || event.title} - Photo ${index + 1}`)
      });
    });
  }

  // Debug logging
  console.log('AllImages array:', allImages.map((img, i) => ({ index: i, caption: img.caption })));

  const handleShare = async () => {
    console.log('Share button clicked for featured event');
    setSharing(true);
    
    // Create shareable URL with event ID parameter
    const baseUrl = window.location.origin + '/events';
    const shareUrl = `${baseUrl}?event=${event._id}`;
    
    const shareData = {
      title: event.name || event.title || 'Chinmaya Mission Featured Event',
      text: event.description ? event.description.substring(0, 200) + (event.description.length > 200 ? '...' : '') : 'Check out this featured event from Chinmaya Mission Vasai',
      url: shareUrl
    };

    console.log('Share data:', shareData);
    console.log('Navigator.share available:', !!navigator.share);
    console.log('Navigator.canShare available:', !!navigator.canShare);

    // Check if Web Share API is supported (mainly mobile browsers)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      console.log('Using Web Share API');
      try {
        await navigator.share(shareData);
        console.log('Event shared successfully via Web Share API');
      } catch (error) {
        // User cancelled the share or there was an error
        if (error.name !== 'AbortError') {
          console.error('Error sharing via Web Share API:', error);
          // Fallback to clipboard
          await copyToClipboard();
        } else {
          console.log('User cancelled sharing');
        }
      }
    } else {
      console.log('Web Share API not available, using clipboard fallback');
      // Fallback for desktop browsers or when Web Share API is not available
      await copyToClipboard();
    }
    
    setSharing(false);
  };

  const copyToClipboard = async () => {
    console.log('Attempting to copy to clipboard');
    
    // Create the same shareable URL with event ID parameter
    const baseUrl = window.location.origin + '/events';
    const shareUrl = `${baseUrl}?event=${event._id}`;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        console.log('Using modern clipboard API');
        // Modern clipboard API (requires HTTPS)
        await navigator.clipboard.writeText(shareUrl);
        console.log('Successfully copied to clipboard via modern API');
        showToast('Featured event link copied to clipboard!', 'success');
      } else {
        console.log('Using fallback clipboard method');
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const success = document.execCommand('copy');
          console.log('Fallback copy success:', success);
          if (success) {
            showToast('Featured event link copied to clipboard!', 'success');
          } else {
            showToast('Could not copy link. Please copy manually from the address bar.', 'error');
          }
        } catch (err) {
          console.error('Fallback copy failed:', err);
          showToast('Could not copy link. Please copy manually from the address bar.', 'error');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast('Could not copy link. Please copy manually from the address bar.', 'error');
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[90%] md:max-w-5xl max-h-[90vh] flex flex-col relative overflow-hidden shadow-2xl">
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={sharing ? "Sharing event..." : "Share event"}
            >
              {sharing ? (
                <FaSpinner className="text-lg text-gray-600 dark:text-gray-200 animate-spin" />
              ) : (
                <FaShareAlt className="text-lg text-gray-600 dark:text-gray-200" />
              )}
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Close modal"
            >
              <FaTimes className="text-xl text-gray-600 dark:text-gray-200" />
            </button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="overflow-y-auto">
            {/* Cover Image Container */}
            <div className="w-full bg-gray-100 dark:bg-gray-700 p-4 md:p-6">
              <div className="relative w-full flex justify-center">
                <img
                  src={event.coverImage}
                  alt={event.name || event.title}
                  className="max-w-full max-h-[60vh] object-contain rounded-2xl cursor-pointer shadow-lg"
                  style={{ backgroundColor: "rgb(241 245 249)" }}
                  onClick={() => handleImageClick(0)}
                />
                {allImages.length > 1 && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    1 of {allImages.length}
                  </div>
                )}
              </div>
            </div>

            {/* Text Content */}
            <div className="p-4 md:p-6">
              {/* Name */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {event.name || event.title}
              </h2>

              {/* Description */}
              <div className="mb-6">
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                {event.schedule && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-900 dark:text-white">
                      Schedule
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                      {event.schedule}
                    </p>
                  </div>
                )}

                {event.highlights && event.highlights.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-900 dark:text-white">
                      Highlights
                    </h3>
                    <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1">
                      {event.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.contact && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-900 dark:text-white">
                      Contact
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                      {event.contact}
                    </p>
                  </div>
                )}

                {/* Gallery Images */}
                {event.images && event.images.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <h3 className="font-semibold text-base md:text-lg mb-4 text-gray-900 dark:text-white">
                      Event Gallery ({event.images.length} photos)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {event.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
                          onClick={() => {
                            // Calculate the correct index in allImages array
                            // If coverImage exists, gallery images start at index 1, otherwise at index 0
                            const lightboxIndex = event.coverImage ? index + 1 : index;
                            console.log('Gallery image clicked:', {
                              galleryIndex: index,
                              hasCoverImage: !!event.coverImage,
                              calculatedLightboxIndex: lightboxIndex,
                              totalImages: allImages.length,
                              clickedImageUrl: typeof image === 'string' ? image : (image.url || image)
                            });
                            handleImageClick(lightboxIndex);
                          }}
                        >
                          <img
                            src={typeof image === 'string' ? image : (image.url || image)}
                            alt={typeof image === 'string' ? `Event photo ${index + 1}` : (image.caption || `Event photo ${index + 1}`)}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                <FaDownload className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={allImages}
        initialIndex={lightboxIndex}
      />
    </>
  );
}

export default EventsModal;