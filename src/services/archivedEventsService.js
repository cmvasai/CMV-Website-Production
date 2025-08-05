import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Archived Events API Service
export const archivedEventsService = {
  // Get all archived events with enhanced filtering and sorting
  getAll: async (params = {}) => {
    try {
      const queryParams = {};
      
      // Add sortBy parameter (default: date_desc)
      if (params.sortBy) {
        queryParams.sortBy = params.sortBy;
      }
      
      // Add year filter
      if (params.year) {
        queryParams.year = params.year;
      }
      
      // Add search query
      if (params.search && params.search.trim()) {
        queryParams.search = params.search.trim();
      }

      const response = await axios.get(`${API_BASE_URL}/api/archived-events`, {
        params: queryParams
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching archived events:', error);
      throw error;
    }
  },

  // Get available years with event counts
  getAvailableYears: async () => {
    try {
      const url = `${API_BASE_URL}/api/archived-events/years`;
      console.log('Making years API call to:', url);
      
      const response = await axios.get(url);
      console.log('Years API raw response:', response);
      console.log('Years API response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching available years:', error);
      throw error;
    }
  },

  // Get single archived event by ID with sharing metadata
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/archived-events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching archived event:', error);
      throw error;
    }
  },

  // Create new archived event (admin only)
  create: async (eventData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/archived-events`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating archived event:', error);
      throw error;
    }
  },

  // Update existing archived event (admin only)
  update: async (id, eventData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/archived-events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating archived event:', error);
      throw error;
    }
  },

  // Delete archived event (admin only)
  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/archived-events/${id}`);
    } catch (error) {
      console.error('Error deleting archived event:', error);
      throw error;
    }
  }
};

export default archivedEventsService;