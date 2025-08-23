import React from 'react';

// ContactButtons Component
const ContactButtons = ({
  showLabel = true,
  labelText = "For registration:",
  size = "default", // "small", "default", "large"
  layout = "horizontal", // "horizontal", "vertical", "stacked"
  className = "",
  showWhatsApp = true,
  showEmail = true,
  showPhone = true,
  variant = "filled" // "filled", "outline"
}) => {
  // Hardcoded contact information
  const PHONE = "+91 7303717177";
  const EMAIL = "info@chinmayamissionvasai.com";
  const WHATSAPP_URL = "https://wa.me/917303717177";

  // Size configurations
  const sizeConfig = {
    small: {
      button: "px-3 py-1.5 text-sm",
      icon: "w-3 h-3",
      gap: "gap-1.5"
    },
    default: {
      button: "px-4 py-2 text-base",
      icon: "w-4 h-4",
      gap: "gap-2"
    },
    large: {
      button: "px-6 py-3 text-lg",
      icon: "w-5 h-5",
      gap: "gap-3"
    }
  };

  // Layout configurations
  const layoutConfig = {
    horizontal: "flex flex-col sm:flex-row gap-3 items-start sm:items-center",
    vertical: "flex flex-col gap-3 items-start",
    stacked: "flex flex-col gap-3 items-center"
  };

  // Variant configurations
  const variantConfig = {
    filled: {
      whatsapp: "bg-[#25D366] hover:bg-[#20b358] text-white border-[#25D366]",
      email: "bg-[#4285f4] hover:bg-[#3367d6] text-white border-[#4285f4]",
      phone: "bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-[#2563eb]"
    },
    outline: {
      whatsapp: "bg-transparent hover:bg-[#25D366] text-[#25D366] hover:text-white border-2 border-[#25D366]",
      email: "bg-transparent hover:bg-[#4285f4] text-[#4285f4] hover:text-white border-2 border-[#4285f4]",
      phone: "bg-transparent hover:bg-[#2563eb] text-[#2563eb] hover:text-white border-2 border-[#2563eb]"
    }
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];

  // Use hardcoded WhatsApp URL
  const getWhatsAppUrl = () => WHATSAPP_URL;

  // Phone Icon Component
  const PhoneIcon = () => (
    <svg className={currentSize.icon} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );

  // WhatsApp Icon Component
  const WhatsAppIcon = () => (
    <svg className={currentSize.icon} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488" />
    </svg>
  );

  // Email Icon Component
  const EmailIcon = () => (
    <svg className={currentSize.icon} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );

  return (
    <div className={`${layoutConfig[layout]} ${className}`}>
      {showLabel && (
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {labelText}
        </span>
      )}

      <div className={`flex flex-wrap ${currentSize.gap}`}>
        {/* Phone Button */}
        {showPhone && (
          <a
            href={`tel:${PHONE}`}
            className={`
                            inline-flex items-center ${currentSize.gap} ${currentSize.button}
                            ${currentVariant.phone}
                            rounded-lg font-medium transition-all duration-200 
                            transform hover:scale-105 shadow-md hover:shadow-lg
                            focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-opacity-50
                        `}
          >
            <PhoneIcon />
            Call
          </a>
        )}

        {/* WhatsApp Button */}
        {showWhatsApp && (
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                            inline-flex items-center ${currentSize.gap} ${currentSize.button}
                            ${currentVariant.whatsapp}
                            rounded-lg font-medium transition-all duration-200 
                            transform hover:scale-105 shadow-md hover:shadow-lg
                            focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-opacity-50
                        `}
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        )}

        {/* Email Button */}
        {showEmail && (
          <a
            href={`mailto:${EMAIL}`}
            className={`
                            inline-flex items-center ${currentSize.gap} ${currentSize.button}
                            ${currentVariant.email}
                            rounded-lg font-medium transition-all duration-200 
                            transform hover:scale-105 shadow-md hover:shadow-lg
                            focus:outline-none focus:ring-2 focus:ring-[#4285f4] focus:ring-opacity-50
                        `}
          >
            <EmailIcon />
            Email
          </a>
        )}
      </div>
    </div>
  );
};

// Main UpcomingEventsModal Component
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

              {/* Contact Section - Updated to use ContactButtons */}
              {event.contact && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h3 className="font-semibold text-base md:text-lg mb-3 text-gray-900 dark:text-white">
                    Contact
                  </h3>
                  <ContactButtons
                    labelText="For registration:"
                    size="default"
                    layout="horizontal"
                    variant="filled"
                    showLabel={true}
                  />
                </div>
              )}

              {/* Event Gallery */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h3 className="font-semibold text-base md:text-lg mb-3 text-gray-900 dark:text-white">
                    Event Gallery ({event.gallery.length} photos)
                  </h3>
                  <div className={`grid gap-3 ${event.gallery.length === 1
                      ? 'grid-cols-1 justify-center max-w-xs mx-auto'
                      : event.gallery.length === 2
                        ? 'grid-cols-2 justify-center'
                        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    }`}>
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