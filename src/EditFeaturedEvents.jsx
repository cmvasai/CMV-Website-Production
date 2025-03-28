import { useState, useEffect } from 'react';
import axios from 'axios';

const EditFeaturedEvents = ({ featuredEvents, setFeaturedEvents }) => {
  const [newImageFile, setNewImageFile] = useState(null);
  const [newEventName, setNewEventName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newHighlights, setNewHighlights] = useState('');
  const [newContact, setNewContact] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const response = await axios.get('https://cmv-backend.onrender.com/api/featured-events');
        setFeaturedEvents(response.data || []); // Ensure the data is an array
      } catch (error) {
        console.error('Error fetching featured events:', error);
        setFeaturedEvents([]); // Fallback to an empty array on error
      }
    };

    fetchFeaturedEvents();
  }, [setFeaturedEvents]);

  const handleAddEvent = async () => {
    if (newImageFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', newImageFile);
      formData.append('upload_preset', 'ml_default'); // Using the default upload preset

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        const imageUrl = response.data.secure_url;

        const newEvent = {
          name: newEventName,
          description: newDescription,
          schedule: newSchedule,
          highlights: newHighlights.split(','),
          contact: newContact,
          image: imageUrl,
        };

        const apiResponse = await axios.post('https://cmv-backend.onrender.com/api/featured-events', newEvent);
        setFeaturedEvents([...featuredEvents, apiResponse.data]);
        setNewImageFile(null);
        setNewEventName('');
        setNewDescription('');
        setNewSchedule('');
        setNewHighlights('');
        setNewContact('');
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please select an image file to upload.');
    }
  };

  const handleRemoveEvent = async (id) => {
    try {
      await axios.delete(`https://cmv-backend.onrender.com/api/featured-events/${id}`);
      setFeaturedEvents(featuredEvents.filter(event => event._id !== id));
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Edit Featured Events</h2>
        <div className="space-y-4">
          {featuredEvents.map((event) => (
            <div key={event._id} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <p className="text-lg font-bold dark:text-white">{event.name}</p>
                <p className="text-sm dark:text-gray-300">{event.description}</p>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg mt-2">
                  <img
                    src={event.image}
                    alt={event.name}
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

export default EditFeaturedEvents;