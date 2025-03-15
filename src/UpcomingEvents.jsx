import { useState } from "react";
import UpcomingEventsModal from "./UpcomingEventsModal";

const events = [
  {
    id: 1,
    eventName: "Chinmaya Mission Vasai Bike Ride",
    image: "images/bikeRide25.jpeg",
    description: "Learning on Wheels - 6th Group Ride Series",
    schedule: "8-9th February, 2025",
    highlights: [
      "Bike Ride to Statue of Unity",
      "Discover the secret of: THE IRON MAN OF BHARAT",
      "Explore, Connect, Re-ignite",
    ],
    contact: "For detailed plan and registration, contact: +91 XXXXXXXXXX",
  },
];
export const UpcomingEvents = () => {
  const [selectedUpcomingEvent, setSelectedUpcomingEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEventClick = (event) => {
    setSelectedUpcomingEvent(event);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedUpcomingEvent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">Upcoming Events</h1>
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
      <UpcomingEventsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedUpcomingEvent}
      />
    </div>
  );
};
