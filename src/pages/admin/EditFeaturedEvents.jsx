import { useState, useEffect } from 'react';
import { FaUpload, FaTimes, FaPlus, FaSave, FaArrowLeft, FaSpinner, FaImage } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { validateImage, compressImage, createImagePreview, revokeImagePreview, fileToBase64 } from '../../utils/imageUtils';
import { showToast } from '../../components/Toast';

const EditFeaturedEvents = ({ featuredEvents = [], setFeaturedEvents }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    highlights: [''],
    contact: ''
  });
  
  // Image states
  const [heroImage, setHeroImage] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/featured-events`);
        
        if (Array.isArray(response.data)) {
          setFeaturedEvents(response.data);
        } else {
          console.error('Expected array but got:', response.data);
          setFeaturedEvents([]);
        }
      } catch (error) {
        console.error('Error fetching featured events:', error);
        setError('Failed to load featured events');
        setFeaturedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, [setFeaturedEvents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData(prev => ({
      ...prev,
      highlights: newHighlights
    }));
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const removeHighlight = (index) => {
    if (formData.highlights.length > 1) {
      setFormData(prev => ({
        ...prev,
        highlights: prev.highlights.filter((_, i) => i !== index)
      }));
    }
  };

  const handleHeroImageChange = async (file) => {
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.isValid) {
      showToast(validation.error, 'error');
      return;
    }

    try {
      const compressedFile = await compressImage(file);
      setHeroImage(compressedFile);
      
      // Clean up previous preview
      if (heroImagePreview) {
        revokeImagePreview(heroImagePreview);
      }
      
      const preview = createImagePreview(compressedFile);
      setHeroImagePreview(preview);
    } catch (error) {
      console.error('Error processing hero image:', error);
      showToast('Error processing image', 'error');
    }
  };

  const handleGalleryImagesChange = async (files) => {
    const validFiles = [];
    const previews = [];

    for (const file of Array.from(files)) {
      const validation = validateImage(file);
      if (!validation.isValid) {
        showToast(`${file.name}: ${validation.error}`, 'error');
        continue;
      }

      try {
        const compressedFile = await compressImage(file);
        validFiles.push(compressedFile);
        previews.push(createImagePreview(compressedFile));
      } catch (error) {
        console.error('Error processing gallery image:', error);
        showToast(`Error processing ${file.name}`, 'error');
      }
    }

    setGalleryImages(prev => [...prev, ...validFiles]);
    setGalleryPreviews(prev => [...prev, ...previews]);
  };

  const removeGalleryImage = (index) => {
    // Clean up preview
    revokeImagePreview(galleryPreviews[index]);
    
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleGalleryImagesChange(files);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!heroImage) {
      newErrors.heroImage = 'Hero image is required';
    }

    // Make gallery images optional for now to test the hero image first
    // if (galleryImages.length === 0) {
    //   newErrors.galleryImages = 'At least one gallery image is required';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEvent = async () => {
    if (!validateForm()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    setUploading(true);

    try {
      // Convert hero image to base64
      const heroImageBase64 = heroImage ? await fileToBase64(heroImage) : null;
      
      // Convert gallery images to base64
      let galleryImagesBase64 = [];
      if (galleryImages.length > 0) {
        galleryImagesBase64 = await Promise.all(
          galleryImages.map(img => fileToBase64(img))
        );
      }

      // Prepare new event data - use archived events format only
      const newEvent = {
        name: formData.name,
        description: formData.description,
        schedule: formData.schedule,
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        contact: formData.contact,
        // Use archived events format for images
        coverImageBase64: heroImageBase64,    // Main image (archived events format)
        imagesBase64: galleryImagesBase64     // Gallery images (archived events format)
      };

      console.log('Sending event data (archived events format only):', {
        ...newEvent,
        coverImageBase64: heroImageBase64 ? '[Base64 Cover Image]' : null,
        imagesBase64: galleryImagesBase64.length > 0 ? `[${galleryImagesBase64.length} Gallery Images]` : []
      });

      // Save the event data in MongoDB
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/featured-events`,
        newEvent
      );

      console.log('Backend response:', response.data);

      // Update local state
      setFeaturedEvents([...featuredEvents, response.data]);

      // Reset form
      resetForm();
      showToast('Featured event added successfully!', 'success');
    } catch (error) {
      console.error('Error adding featured event:', error);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = 'Failed to add featured event. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      schedule: '',
      highlights: [''],
      contact: ''
    });
    
    // Clean up images and previews
    if (heroImagePreview) {
      revokeImagePreview(heroImagePreview);
    }
    galleryPreviews.forEach(preview => revokeImagePreview(preview));
    
    setHeroImage(null);
    setHeroImagePreview(null);
    setGalleryImages([]);
    setGalleryPreviews([]);
    setErrors({});
  };
  const handleRemoveEvent = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/featured-events/${id}`);
      setFeaturedEvents(featuredEvents.filter(event => event._id !== id));
      showToast('Featured event removed successfully!', 'success');
    } catch (error) {
      console.error('Error removing event:', error);
      showToast('Failed to remove featured event.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Helmet>
        <title>Edit Featured Events | Admin | Chinmaya Mission Vasai</title>
        <meta name="description" content="Manage featured events for Chinmaya Mission Vasai" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Featured Events
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add, edit, and manage featured events with multiple images
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-gray-400 mr-4" />
            <span className="text-gray-600 dark:text-gray-300">Loading featured events...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Existing Events */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Current Featured Events
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Array.isArray(featuredEvents) && featuredEvents.length > 0 ? (
                  featuredEvents.map((event, index) => (
                    <div key={event._id || index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{event.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>
                          {event.coverImage && (
                            <div className="mt-3">
                              <img
                                src={event.coverImage}
                                alt={event.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              {event.images && event.images.length > 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  +{event.images.length} more images
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveEvent(event._id)}
                          className="ml-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                          title="Remove Event"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No featured events found. Add your first event!
                  </p>
                )}
              </div>
            </div>

            {/* Add New Event Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Add New Featured Event
              </h2>

              <form className="space-y-6">
                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter event name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter event description"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                  )}
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Schedule
                  </label>
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    placeholder="Enter event schedule"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Information
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Enter contact information"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Highlights */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Highlights
                  </label>
                  <div className="space-y-2">
                    {formData.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => handleHighlightChange(index, e.target.value)}
                          placeholder={`Highlight ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        {formData.highlights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeHighlight(index)}
                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaPlus />
                      Add Highlight
                    </button>
                  </div>
                </div>

                {/* Hero Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hero Image <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHeroImageChange(e.target.files[0])}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {heroImagePreview && (
                      <div className="relative">
                        <img
                          src={heroImagePreview}
                          alt="Hero preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            revokeImagePreview(heroImagePreview);
                            setHeroImage(null);
                            setHeroImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  {errors.heroImage && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.heroImage}</p>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gallery Images (Optional)
                  </label>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-orange-500'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <FaUpload className="mx-auto text-3xl text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Drag and drop images here, or click to select
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleGalleryImagesChange(e.target.files)}
                        className="hidden"
                        id="gallery-upload"
                      />
                      <label
                        htmlFor="gallery-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg cursor-pointer transition-colors"
                      >
                        <FaImage />
                        Select Images
                      </label>
                    </div>

                    {/* Image Previews */}
                    {galleryPreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.galleryImages && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.galleryImages}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleAddEvent}
                  disabled={uploading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Adding Event...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Add Featured Event
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditFeaturedEvents;