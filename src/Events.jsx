import { useState } from 'react';
import EventsModal from './EventsModal';

const events = [
  {
    id: 1,
    name: "Winter Camps",
    image: "/images/winter-camp.jpeg",
    description: "Our annual winter camps provide an immersive spiritual experience for youth. Through a blend of meditation, yoga, outdoor activities, and interactive Vedanta sessions, participants discover their inner potential while forming lasting friendships. ",
    schedule: "December (During Winter Break)",
    highlights: [
      "Spiritual discourses and interactive sessions",
      "Team building activities and games",
      "Yoga and meditation workshops",
      "Cultural performances and talent shows"
    ],
    contact: "For registration: camp.coordinator@chinmayavasai.org"
  },
  {
    id: 2,
    name: "Shivaratri Celebrations",
    image: "/images/shivaratri.jpeg",
    description: "Experience the divine night of Lord Shiva with continuous pujas, bhajans, and spiritual discourses. This night-long celebration includes special arrangements for devotees to participate in various sevas and spiritual activities.",
    schedule: "As per Hindu Calendar",
    highlights: [
      "Continuous Shiva Puja throughout the night",
      "Devotional music and bhajans",
      "Special spiritual discourses",
      "Prasad distribution"
    ],
    contact: "For more details: temple@chinmayavasai.org"
  },
  {
    id: 3,
    name: "Monsoon Trekking",
    image: "/images/trekking.jpeg",
    description: "Our spiritual treks combine the thrill of adventure with the wisdom of Vedanta. Experience the beauty of nature while engaging in meaningful discussions and meditation sessions amidst scenic locations.",
    schedule: "July - September (During Monsoon)",
    highlights: [
      "Guided treks with spiritual discussions",
      "Meditation in nature",
      "Team bonding activities",
      "Photography sessions"
    ],
    contact: "For trek details: youth.coordinator@chinmayavasai.org"
  },
  {
    id: 4,
    name: "New Year Celebrations",
    image: "/images/new-year.jpeg",
    description: "Start your new year with spiritual consciousness. Join us for a unique celebration that includes meditation, special pujas, cultural programs, and inspiring talks to begin the year with positive energy and spiritual resolve.",
    schedule: "December 31st - January 1st",
    highlights: [
      "Special New Year puja",
      "Meditation and chanting sessions",
      "Cultural performances",
      "Community dinner"
    ],
    contact: "For participation: events@chinmayavasai.org"
  }
];

const Events = () => {
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
          {events.map((event) => (
            <div 
              key={event.id}
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
