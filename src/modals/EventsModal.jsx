import { useState } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';
import ImageLightbox from '../components/ImageLightbox';

const EventsModal = ({ isOpen, onClose, event }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[90%] md:max-w-5xl max-h-[90vh] flex flex-col relative overflow-hidden shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <FaTimes className="text-xl text-gray-600 dark:text-gray-200" />
          </button>

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