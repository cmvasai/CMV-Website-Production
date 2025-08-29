import { useState } from 'react';
import RollingGallery from '../components/RollingGallery';

// Demo images - you can replace these with your actual event images
const DEMO_EVENTS = [
  {
    _id: '1',
    name: 'Bala Vihar',
    image: '/bala_vihar.png',
  },
  {
    _id: '2',
    name: 'CHYK',
    image: '/chyk.png',
  },
  {
    _id: '3',
    name: 'Jnana Yajnas',
    image: '/jnana_yajnas.png',
  },
  {
    _id: '4',
    name: 'Study Groups',
    image: '/Study_Groups.png',
  },
  {
    _id: '5',
    name: 'Satsang',
    image: '/satsang.png',
  },
  {
    _id: '6',
    name: 'Spiritual Camps',
    image: '/spiritual-camps.png',
  },
  {
    _id: '7',
    name: 'Swaranjali',
    image: '/swaranjali.png',
  },
  {
    _id: '8',
    name: 'Yuva Kendra',
    image: '/yuva-kendra.png',
  },
];

const RollingGalleryDemo = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = (event, index) => {
    setSelectedEvent(event);
    setShowModal(true);
    console.log('Clicked event:', event, 'at index:', index);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            3D Rolling Gallery Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Interactive 3D carousel with drag controls, autoplay, and hover pause
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-orange-500 text-2xl mb-3">🎪</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">3D Cylinder</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Images arranged in a 3D cylindrical formation
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-blue-500 text-2xl mb-3">👆</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Drag Control</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag horizontally to manually rotate the gallery
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-green-500 text-2xl mb-3">⏸️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Pause</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hover to pause autoplay, resume on mouse leave
              </p>
            </div>
          </div>
        </div>

        {/* 3D Gallery */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Chinmaya Mission Activities
          </h2>
          
          <RollingGallery
            images={DEMO_EVENTS}
            autoplay={true}
            pauseOnHover={true}
            onImageClick={handleImageClick}
            height="500px"
            imageHeight="180px"
            imageWidth="320px"
            borderColor="#f97316"
            gradientColor="rgba(15, 23, 42, 0.8)"
            speed={30}
          />
        </div>

        {/* Usage Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How to Use
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Interaction Methods
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <strong>Drag:</strong> Click and drag horizontally to rotate manually</li>
                <li>• <strong>Hover:</strong> Pause autoplay by hovering over the gallery</li>
                <li>• <strong>Click:</strong> Click any image to trigger the event handler</li>
                <li>• <strong>Auto:</strong> Enjoys continuous rotation when enabled</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Customization Options
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <strong>Speed:</strong> Adjustable rotation speed</li>
                <li>• <strong>Size:</strong> Configurable image dimensions</li>
                <li>• <strong>Colors:</strong> Custom border and gradient colors</li>
                <li>• <strong>Events:</strong> Click handlers for interactions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.name}
                className="w-32 h-32 object-contain mx-auto mb-4 rounded-lg"
              />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedEvent.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You clicked on this activity! In a real implementation, this would open a detailed modal.
              </p>
              <button
                onClick={closeModal}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RollingGalleryDemo;
