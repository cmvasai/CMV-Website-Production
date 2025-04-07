import { useState, useEffect } from 'react';
import axios from 'axios';

const EditUpcomingEvents = ({ upcomingEvents, setUpcomingEvents }) => {
  const [newImageFile, setNewImageFile] = useState(null);
  const [newEventName, setNewEventName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newHighlights, setNewHighlights] = useState('');
  const [newContact, setNewContact] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get('https://cmv-backend.onrender.com/api/upcoming-events');
        setUpcomingEvents(response.data || []); // Ensure the data is an array
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        setUpcomingEvents([]); // Fallback to an empty array on error
      }
    };

    fetchUpcomingEvents();
  }, [setUpcomingEvents]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  
  const handleAddEvent = async () => {
    if (newImageFile) {
      setUploading(true);
  
      try {
        // Step 1: Convert file to Base64
        const base64Image = await toBase64(newImageFile);
  
        // Step 2: Upload image to backend (which handles Cloudinary)
        const uploadResponse = await axios.post(
          'https://cmv-backend.onrender.com/api/upload-image',
          {
            imageBase64: base64Image,
          }
        );
  
        const imageUrl = uploadResponse.data.imageUrl;
  
        // Step 3: Add event to backend
        const newEvent = {
          eventName: newEventName,
          description: newDescription,
          schedule: newSchedule,
          highlights: newHighlights.split(','),
          contact: newContact,
          image: imageUrl,
        };
  
        const apiResponse = await axios.post(
          'https://cmv-backend.onrender.com/api/upcoming-events',
          newEvent
        );
  
        setUpcomingEvents([...upcomingEvents, apiResponse.data]);
  
        // Step 4: Reset fields
        setNewImageFile(null);
        setNewEventName('');
        setNewDescription('');
        setNewSchedule('');
        setNewHighlights('');
        setNewContact('');
      } catch (error) {
        console.error('Error uploading image or adding event:', error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please select an image file to upload.');
    }
  };
  

  const handleRemoveEvent = async (id) => {
    try {
      await axios.delete(`https://cmv-backend.onrender.com/api/upcoming-events/${id}`);
      setUpcomingEvents(upcomingEvents.filter(event => event._id !== id));
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Edit Upcoming Events</h2>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event._id} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <p className="text-lg font-bold dark:text-white">{event.eventName}</p>
                <p className="text-sm dark:text-gray-300">{event.description}</p>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg mt-2">
                  <img
                    src={event.image}
                    alt={event.eventName}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <button
                onClick={() => handleRemoveEvent(event._id)}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImageFile(e.target.files[0])}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Event Name"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Schedule"
            value={newSchedule}
            onChange={(e) => setNewSchedule(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Highlights (comma separated)"
            value={newHighlights}
            onChange={(e) => setNewHighlights(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Contact"
            value={newContact}
            onChange={(e) => setNewContact(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleAddEvent}
            className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUpcomingEvents;