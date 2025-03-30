import { useState } from 'react';
import EventsModal from './EventsModal';

const Events = ({ featuredEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-3xl font-bold text-center mb-8">Events</h1>
          
          <div className="prose max-w-none text-gray-800 dark:text-gray-300">
            <p className="text-lg leading-relaxed mb-6">
              Chinmaya Mission Vasai hosts a diverse array of spiritual and cultural events throughout the year, each designed to blend spiritual wisdom with engaging experiences. From adventurous treks in nature's lap to profound celebrations of sacred festivals, our events create meaningful connections and lasting memories.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Our signature events include transformative winter camps that immerse youth in spiritual learning through interactive activities, the divine celebration of Maha Shivaratri with night-long pujas and bhajans, spiritual monsoon treks that combine the serenity of nature with Vedantic discussions, and mindful New Year celebrations that begin the year with spiritual consciousness.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              These events serve as powerful mediums to understand and experience spiritual truths while fostering a sense of community. Whether you're seeking adventure, knowledge, devotion, or celebration, our events provide unique opportunities for spiritual growth and personal transformation. We welcome everyone to be part of these enriching experiences and discover the joy of spiritual living through active participation.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-12">Our Featured Events</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {featuredEvents.map((event) => (
            <div 
              key={event._id}
              className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleEventClick(event)}
            >
              <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
                {event.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-center">
                {event.description}
              </p>
            </div>
          ))}
        </div>

        {/* Modal */}
        <EventsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
        />
      </div>
    </div>
  );
};

export default Events;