const UpcomingEventsModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[90%] md:max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="text-2xl text-gray-600 dark:text-gray-200 font-bold">×</span>
        </button>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto">
          {/* Image Container */}
          <div className="w-full bg-gray-100 dark:bg-gray-700 p-4 md:p-6">
            <div className="relative w-full">
              <img
                src={event.image}
                alt={event.name}
                className="w-full max-h-[50vh] object-contain rounded-2xl"
                style={{ backgroundColor: "rgb(241 245 249)" }}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="p-4 md:p-6">
            {/* Name */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {event.name}
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

              {event.highlights && (
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
                  <a
                    href={`https://wa.me/${event.contact.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm md:text-base text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.891 3.426" />
                    </svg>
                    {event.contact}
                  </a>
                </div>
              )}

              {/* Event Gallery */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h3 className="font-semibold text-base md:text-lg mb-3 text-gray-900 dark:text-white">
                    Event Gallery ({event.gallery.length} photos)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {event.gallery.map((photo, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <img
                          src={photo}
                          alt={`Event photo ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
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
  );
};

export default UpcomingEventsModal;