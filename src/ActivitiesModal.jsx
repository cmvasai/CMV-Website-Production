const ActivitiesModal = ({ isOpen, onClose, activity }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg w-full max-w-[90%] md:max-w-2xl max-h-[90vh] flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <span className="text-2xl text-gray-600">&times;</span>
        </button>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col items-center">
            {/* Square Image */}
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden mb-4 shadow-lg">
              <img
                src={activity.image}
                alt={activity.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              {activity.name}
            </h2>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                {activity.description}
              </p>
            </div>

            {/* Additional Details */}
            <div className="mt-6 space-y-4 w-full">
              {activity.schedule && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Schedule</h3>
                  <p className="text-gray-700">{activity.schedule}</p>
                </div>
              )}
              
              {activity.benefits && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Benefits</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {activity.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activity.contact && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Contact</h3>
                  <p className="text-gray-700">{activity.contact}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesModal;
