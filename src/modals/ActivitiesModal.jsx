const ActivitiesModal = ({ isOpen, onClose, activity }) => {
  if (!isOpen) return null;

  const renderContactWithLinks = (contactText) => {
    // Handle both formats:
    // 1. "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com" 
    // 2. "For registration: WhatsApp us at https://wa.me/917303717177 or email: info@chinmayamissionvasai.com"

    const phonePattern = /(\+91 \d{10})/;
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const whatsappUrlPattern = /(https:\/\/wa\.me\/\d+)/;

    // Replace "email:" with just a space to maintain formatting
    let processedText = contactText.replace(/email:\s*/g, ' ');

    // Split by phone, email, and WhatsApp URL patterns
    let parts = processedText.split(phonePattern);
    parts = parts.flatMap(part => part.split(emailPattern));
    parts = parts.flatMap(part => part.split(whatsappUrlPattern));

    return parts.map((part, index) => {
      if (phonePattern.test(part)) {
        // Remove +91 and spaces for the WhatsApp link, but display the full number
        const cleanNumber = part.replace(/\+91\s/, '91').replace(/\s/g, '');
        return (
          <span key={index} className="inline-flex items-center">
            <a
              href={`https://wa.me/${cleanNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium"
            >
              {/* WhatsApp SVG Icon */}
              <svg
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488" />
              </svg>
              {part}
            </a>
          </span>
        );
      } else if (whatsappUrlPattern.test(part)) {
        // Handle full WhatsApp URLs
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium"
          >
            {/* WhatsApp SVG Icon */}
            <svg
              className="w-4 h-4 mr-1"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488" />
            </svg>
            {part}
          </a>
        );
      } else if (emailPattern.test(part)) {
        return (
          <a
            key={index}
            href={`mailto:${part}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium"
          >
            {/* Email SVG Icon */}
            <svg
              className="w-4 h-4 mr-1"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-[90%] md:max-w-2xl max-h-[90vh] flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="text-2xl text-gray-600 dark:text-gray-200">&times;</span>
        </button>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col items-center">
            {/* Square Image */}
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden mb-4 shadow-lg">
              {activity.darkImage ? (
                <>
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover dark:hidden"
                  />
                  <img
                    src={activity.darkImage}
                    alt={activity.name}
                    className="w-full h-full object-cover hidden dark:block"
                  />
                </>
              ) : (
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Name */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center dark:text-white">
              {activity.name}
            </h2>

            {/* Description */}
            <div className="prose max-w-none dark:prose-dark">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                {activity.description}
              </p>
            </div>

            {/* Additional Information */}
            {activity.additionalInfo && (
              <div className="prose max-w-none dark:prose-dark mt-4">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base text-justify">
                  {activity.additionalInfo}
                </p>
              </div>
            )}

            {/* Additional Details */}
            <div className="mt-6 space-y-4 w-full">
              {activity.schedule && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">Schedule</h3>
                  <p className="text-gray-700 dark:text-gray-300">{activity.schedule}</p>
                </div>
              )}

              {activity.benefits && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">Benefits</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {activity.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activity.contact && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">Contact</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {renderContactWithLinks(activity.contact)}
                  </p>
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