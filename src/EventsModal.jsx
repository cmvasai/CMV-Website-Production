const EventsModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-[90%] max-w-[90%] md:max-w-6xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors shadow-md"
        >
          <span className="text-2xl text-gray-600">&times;</span>
        </button>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto">
          {/* Image Container with Background */}
          <div className="w-full bg-gray-100 p-4 md:p-6 lg:p-8">
            {/* Image Wrapper with Aspect Ratio */}
            <div className="relative w-full h-[200px] md:h-[350px] lg:h-[400px] overflow-hidden">
              <img
                src={event.image}
                alt={event.name}
                className="absolute inset-0 w-full h-full object-contain md:object-cover rounded-[2rem]"
                style={{ backgroundColor: 'rgb(241 245 249)' }}
              />
            </div>
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            {/* Name */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
              {event.name}
            </h2>

            {/* Description */}
            <div className="prose max-w-none mb-6">
              <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Additional Details */}
            <div className="space-y-4 md:space-y-6">
              {event.schedule && (
                <div className="bg-gray-50 p-3 md:p-4 rounded-xl">
                  <h3 className="font-semibold text-base md:text-lg mb-2">Schedule</h3>
                  <p className="text-sm md:text-base text-gray-700">{event.schedule}</p>
                </div>
              )}
              
              {event.highlights && (
                <div className="bg-gray-50 p-3 md:p-4 rounded-xl">
                  <h3 className="font-semibold text-base md:text-lg mb-2">Highlights</h3>
                  <ul className="list-disc list-inside text-sm md:text-base text-gray-700 space-y-1">
                    {event.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {event.contact && (
                <div className="bg-gray-50 p-3 md:p-4 rounded-xl">
                  <h3 className="font-semibold text-base md:text-lg mb-2">Contact</h3>
                  <p className="text-sm md:text-base text-gray-700">{event.contact}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsModal;
