import { useState, useEffect } from 'react';
import axios from 'axios';

const EditCarousel = ({ carouselItems, setCarouselItems }) => {
  const [newImageFile, setNewImageFile] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCarouselItems = async () => {
      try {
        const response = await axios.get('https://cmv-backend.onrender.com/api/carousel-items');
        setCarouselItems(response.data || []); // Ensure the data is an array
      } catch (error) {
        console.error('Error fetching carousel items:', error);
        setCarouselItems([]); // Fallback to an empty array on error
      }
    };

    fetchCarouselItems();
  }, [setCarouselItems]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  
  const handleAddImage = async () => {
    if (newImageFile) {
      setUploading(true);
  
      try {
        // Step 1: Convert image to base64
        const base64Image = await toBase64(newImageFile);
  
        // Step 2: Upload image to backend
        const uploadResponse = await axios.post(
          'https://cmv-backend.onrender.com/api/upload-image',
          { imageBase64: base64Image }
        );
  
        const imageUrl = uploadResponse.data.imageUrl;
  
        // Step 3: Send new carousel item with uploaded image URL
        const newItem = {
          title: newTitle,
          description: newDescription,
          image: imageUrl,
        };
  
        const apiResponse = await axios.post(
          'https://cmv-backend.onrender.com/api/carousel-items',
          newItem
        );
  
        setCarouselItems([...carouselItems, apiResponse.data]);
  
        // Step 4: Reset fields
        setNewImageFile(null);
        setNewTitle('');
        setNewDescription('');
      } catch (error) {
        console.error('Error uploading image or adding carousel item:', error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please select an image file to upload.');
    }
  };
  

  const handleRemoveImage = async (id) => {
    try {
      await axios.delete(`https://cmv-backend.onrender.com/api/carousel-items/${id}`);
      setCarouselItems(carouselItems.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Edit Carousel Images</h2>
        <div className="space-y-4">
          {carouselItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <p className="text-lg font-bold dark:text-white">{item.title}</p>
                <p className="text-sm dark:text-gray-300">{item.description}</p>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg mt-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <button
                onClick={() => handleRemoveImage(item._id)}
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
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleAddImage}
            className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCarousel;