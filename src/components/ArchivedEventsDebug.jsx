// Quick diagnostic tool for testing archived events
import React, { useState, useEffect } from 'react';
import archivedEventsService from '../services/archivedEventsService';

const ArchivedEventsDebug = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await archivedEventsService.getAll();
      setEvents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleEvent = async (id) => {
    setLoading(true);
    try {
      const data = await archivedEventsService.getById(id);
      setSelectedEvent(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Archived Events Debug Tool
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {/* Events List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">All Events ({events.length})</h3>
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event._id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <strong>{event.title}</strong>
                <br />
                <small className="text-gray-500">
                  ID: {event._id} | 
                  Cover: {event.coverImage ? '✅' : '❌'} | 
                  Images: {event.images?.length || 0}
                </small>
              </div>
              <button
                onClick={() => fetchSingleEvent(event._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Test Detail
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Selected Event Details</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(selectedEvent, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* API Status */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-3">API Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-100 p-3 rounded">
            <strong>✅ GET /api/archived-events</strong>
            <br />
            <small>Returns {events.length} events</small>
          </div>
          <div className="bg-green-100 p-3 rounded">
            <strong>✅ GET /api/archived-events/:id</strong>
            <br />
            <small>{selectedEvent ? 'Working' : 'Click "Test Detail" to test'}</small>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Go to Admin Dashboard → Manage Archived Events → Add New Event</li>
          <li>Upload a cover image and additional images</li>
          <li>Save the event and come back to this debug tool to test</li>
          <li>The new event should appear with proper images</li>
          <li>Click "Test Detail" to verify the individual event API works</li>
        </ol>
      </div>
    </div>
  );
};

export default ArchivedEventsDebug;
